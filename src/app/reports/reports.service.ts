import { ReportStatus, ReportType } from "@prisma/client";
import AppError from "../../utils/AppError.util";
import { OrderModel } from "../orders/order.model";
import { generateReport } from "./helpers/generateReportTemp";
import { ReportModel } from "./report.model";
import { ReportCreateType } from "./reports.zod";

const reportModel = new ReportModel();
const orderModel = new OrderModel();

export class ReportService {
    async createReport(data: {
        loggedInUserID: string;
        reportData: ReportCreateType;
    }) {
        const orders = await orderModel.getOrdersByIDs(data.reportData);

        if (data.reportData.type === ReportType.CLIENT) {
            orders.forEach((order) => {
                if (order.clientReportReportNumber) {
                    throw new AppError(
                        `الطلب ${order.receiptNumber} يوجد في كشف عملاء اخر رقمه ${order.clientReportReportNumber}`,
                        400
                    );
                }
                // TODO
                // if (order.clientId !== data.reportData.clientID) {
                //     throw new AppError(
                //         `الطلب ${order.receiptNumber} ليس مرتبط بالعميل ${data.reportData.clientID}`,
                //         400
                //     );
                // }
            });
        } else if (data.reportData.type === ReportType.REPOSITORY) {
            // TODO
            // orders.forEach((order) => {
            //     if (order.repositoryReportReportNumber) {
            //         throw new AppError(
            //             `الطلب ${order.receiptNumber} يوجد في كشف مخازن اخر رقمه ${order.repositoryReportReportNumber}`,
            //             400
            //         );
            //     }
            // });
        } else if (data.reportData.type === ReportType.BRANCH) {
            orders.forEach((order) => {
                if (order.branchReportReportNumber) {
                    throw new AppError(
                        `الطلب ${order.receiptNumber} يوجد في كشف فروع اخر رقمه ${order.branchReportReportNumber}`,
                        400
                    );
                }
            });
        } else if (data.reportData.type === ReportType.GOVERNORATE) {
            orders.forEach((order) => {
                if (order.governorateReportReportNumber) {
                    throw new AppError(
                        `الطلب ${order.receiptNumber} يوجد في كشف محافظة اخر رقمه ${order.governorateReportReportNumber}`,
                        400
                    );
                }
            });
        } else if (data.reportData.type === ReportType.DELIVERY_AGENT) {
            orders.forEach((order) => {
                if (order.deliveryAgentReportReportNumber) {
                    throw new AppError(
                        `الطلب ${order.receiptNumber} يوجد في كشف مندوبين اخر رقمه ${order.deliveryAgentReportReportNumber}`,
                        400
                    );
                }
            });
        }
        // TODO
        // else if (data.reportData.type === ReportType.COMPANY) {
        //     orders.forEach((order) => {
        //         if (order.companyReportReportNumber) {
        //             throw new AppError(
        //                 `الطلب ${order.receiptNumber} يوجد في كشف اخر رقمه ${order.companyReportReportNumber}`,
        //                 400
        //             );
        //         }
        //     });
        // }

        await reportModel.createReport(data.loggedInUserID, data.reportData);

        // TODO
        // const pdf = await generateReport(orders);
        const pdf = await generateReport(
            await orderModel.getAllOrders(0, 100, {
                sort: "receiptNumber:desc"
            })
        );

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

        const branchID = data.queryString.branch_id as string;
        const clientID = data.queryString.client_id as string;
        const storeID = data.queryString.store_id as string;
        const repositoryID = data.queryString.repository_id as string;
        const deliveryAgentID = data.queryString.delivery_agent_id as string;
        const governorate = data.queryString.governorate
            ?.toString()
            .toUpperCase();

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
            governorate: governorate
        });

        return { page, pagesCount, reports };
    }

    async getReportPDF(data: { reportID: string }) {
        const reportData = await reportModel.getReport({
            reportID: data.reportID
        });

        const orders = reportData?.RepositoryReport
            ? reportData?.RepositoryReport.orders
            : reportData?.BranchReport
            ? reportData?.BranchReport.orders
            : reportData?.ClientReport
            ? reportData?.ClientReport.orders
            : reportData?.DeliveryAgentReport
            ? reportData?.DeliveryAgentReport.orders
            : reportData?.GovernorateReport
            ? reportData?.GovernorateReport.orders
            : [];

        const ordersIDs = orders.map((order) => order.id);

        const ordersData = await orderModel.getOrdersByIDs({
            ordersIDs: ordersIDs
        });

        const pdf = await generateReport(ordersData);
        return pdf;
    }
}
