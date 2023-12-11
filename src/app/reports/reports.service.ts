import { Order, ReportStatus, ReportType } from "@prisma/client";
import AppError from "../../utils/AppError.util";
import { OrderModel } from "../orders/order.model";
import { generateReport } from "./helpers/generateReportTemp";
import { ReportModel } from "./report.model";
import { ReportCreateType } from "./reports.zod";

const reportModel = new ReportModel();
const orderModel = new OrderModel();

export class ReportService {
    async createReport(
        companyID: number,
        data: {
            loggedInUserID: number;
            reportData: ReportCreateType;
        }
    ) {
        const orders = await orderModel.getOrdersByIDs(data.reportData);

        const reportMetaData = {
            baghdadOrdersCount: 0,
            governoratesOrdersCount: 0,
            totalCost: 0,
            paidAmount: 0,
            deliveryCost: 0,
            clientNet: 0,
            deliveryAgentNet: 0,
            companyNet: 0
        };

        orders.forEach((order) => {
            reportMetaData.totalCost += +order.totalCost;
            reportMetaData.paidAmount += +order.paidAmount;
            reportMetaData.deliveryCost += +order.deliveryCost;
            reportMetaData.clientNet += +order.clientNet;
            reportMetaData.deliveryAgentNet += order.deliveryAgent
                ? +order.deliveryAgent.deliveryCost
                : 0;
            reportMetaData.companyNet += +order.companyNet;
            if (order.governorate === "BAGHDAD") {
                reportMetaData.baghdadOrdersCount++;
            } else {
                reportMetaData.governoratesOrdersCount++;
            }
        });

        if (data.reportData.type === ReportType.CLIENT) {
            orders.forEach((order) => {
                if (order?.clientReportReportNumber) {
                    throw new AppError(
                        `الطلب ${order.receiptNumber} يوجد في كشف عملاء اخر رقمه ${order.clientReportReportNumber}`,
                        400
                    );
                }
                // TODO
                // if (
                //     data.reportData.type === ReportType.CLIENT &&
                //     order.clientId !== data.reportData.clientID
                // ) {
                //     throw new AppError(
                //         `الطلب ${order.receiptNumber} ليس مرتبط بالعميل ${data.reportData.clientID}`,
                //         400
                //     );
                // }
            });
        } else if (data.reportData.type === ReportType.REPOSITORY) {
            orders.forEach((order) => {
                if (order?.repositoryReportReportNumber) {
                    throw new AppError(
                        `الطلب ${order.receiptNumber} يوجد في كشف مخازن اخر رقمه ${order.repositoryReportReportNumber}`,
                        400
                    );
                }
            });
        } else if (data.reportData.type === ReportType.BRANCH) {
            orders.forEach((order) => {
                if (order?.branchReportReportNumber) {
                    throw new AppError(
                        `الطلب ${order.receiptNumber} يوجد في كشف فروع اخر رقمه ${order.branchReportReportNumber}`,
                        400
                    );
                }
            });
        } else if (data.reportData.type === ReportType.GOVERNORATE) {
            orders.forEach((order) => {
                if (order?.governorateReportReportNumber) {
                    throw new AppError(
                        `الطلب ${order.receiptNumber} يوجد في كشف محافظة اخر رقمه ${order.governorateReportReportNumber}`,
                        400
                    );
                }
            });
        } else if (data.reportData.type === ReportType.DELIVERY_AGENT) {
            orders.forEach((order) => {
                if (order?.deliveryAgentReportReportNumber) {
                    throw new AppError(
                        `الطلب ${order.receiptNumber} يوجد في كشف مندوبين اخر رقمه ${order.deliveryAgentReportReportNumber}`,
                        400
                    );
                }
            });
        } else if (data.reportData.type === ReportType.COMPANY) {
            orders.forEach((order) => {
                if (order?.companyReportReportNumber) {
                    throw new AppError(
                        `الطلب ${order.receiptNumber} يوجد في كشف شركة اخر رقمه ${order.companyReportReportNumber}`,
                        400
                    );
                }
            });
        }

        const report = await reportModel.createReport(
            companyID,
            data.loggedInUserID,
            data.reportData,
            reportMetaData
        );

        if (!report) {
            throw new AppError("حدث خطأ اثناء عمل الكشف", 500);
        }

        const reportData = await reportModel.getReport({
            reportID: report.reportId
        });

        // TODO
        const pdf = await generateReport(
            data.reportData.type,
            reportData,
            orders
        );
        // const pdf = await generateReport(
        //     await orderModel.getAllOrders(0, 100, {
        //         sort: "receiptNumber:desc"
        //     })
        // );

        return pdf;
    }

    async getAllReports(data: { queryString: any }) {
        const reportsCount = await reportModel.getReportsCount();
        const size = data.queryString.size ? +data.queryString.size : 10;
        const pagesCount = Math.ceil(reportsCount / size);

        if (pagesCount === 0) {
            // res.status(200).json({
            //     status: "success",
            //     page: 1,
            //     pagesCount: 1,
            //     data: []
            // });
            return { pagesCount };
        }

        const sort = (data.queryString.sort as string) || "id:asc";

        const startDate = data.queryString.start_date
            ? new Date(data.queryString.start_date as string)
            : undefined;
        const endDate = data.queryString.end_date
            ? new Date(data.queryString.end_date as string)
            : undefined;

        const status = data.queryString.status?.toString().toUpperCase() as
            | ReportStatus
            | undefined;
        const type = data.queryString.type?.toString().toUpperCase() as
            | ReportType
            | undefined;

        const branchID = data.queryString.branch_id
            ? +data.queryString.branch_id
            : undefined;
        const clientID = data.queryString.client_id
            ? +data.queryString.client_id
            : undefined;
        const storeID = data.queryString.store_id
            ? +data.queryString.store_id
            : undefined;
        const repositoryID = data.queryString.repository_id
            ? +data.queryString.repository_id
            : undefined;
        const deliveryAgentID = data.queryString.delivery_agent_id
            ? +data.queryString.delivery_agent_id
            : undefined;
        const companyID = data.queryString.company_id
            ? +data.queryString.company_id
            : undefined;
        const governorate = data.queryString.governorate
            ?.toString()
            .toUpperCase();

        const deleted = data.queryString.deleted || "false";

        let page = 1;
        if (
            data.queryString.page &&
            !Number.isNaN(+data.queryString.page) &&
            +data.queryString.page > 0
        ) {
            page = +data.queryString.page;
        }
        if (page > pagesCount) {
            throw new AppError("Page number out of range", 400);
        }
        const take = page * size;
        const skip = (page - 1) * size;
        // if (Number.isNaN(offset)) {
        //     skip = 0;
        // }

        const reports = await reportModel.getAllReports(skip, take, {
            sort: sort,
            startDate: startDate,
            endDate: endDate,
            status: status,
            type: type,
            branchID: branchID,
            clientID: clientID,
            storeID: storeID,
            repositoryID: repositoryID,
            deliveryAgentID: deliveryAgentID,
            governorate: governorate,
            companyID: companyID,
            deleted: deleted
        });

        return { page, pagesCount, reports };
    }

    async getReportPDF(data: { reportID: number }) {
        const reportData = await reportModel.getReport({
            reportID: data.reportID
        });

        // TODO: fix this
        const orders: Order[] = reportData?.repositoryReport
            ? // @tts-expect-error: Unreachable code error
              reportData?.repositoryReport.repositoryReportOrders
            : reportData?.branchReport
            ? // @tts-expect-error: Unreachable code error
              reportData?.branchReport.branchReportOrders
            : reportData?.clientReport
            ? // @tts-expect-error: Unreachable code error
              reportData?.clientReport.clientReportOrders
            : reportData?.deliveryAgentReport
            ? // @tts-expect-error: Unreachable code error
              reportData?.deliveryAgentReport.deliveryAgentReportOrders
            : reportData?.governorateReport
            ? // @tts-expect-error: Unreachable code error
              reportData?.governorateReport.governorateReportOrders
            : reportData?.companyReport
            ? // @tts-expect-error: Unreachable code error
              reportData?.companyReport.companyReportOrders
            : [];

        const ordersIDs = orders.map((order) => order.id);

        const ordersData = await orderModel.getOrdersByIDs({
            ordersIDs: ordersIDs
        });

        const pdf = await generateReport(
            reportData.type,
            reportData,
            ordersData
        );
        return pdf;
    }
}
