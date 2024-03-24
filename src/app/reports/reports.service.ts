import { AdminRole, EmployeeRole, Order, ReportType } from "@prisma/client";
import { AppError } from "../../lib/AppError";
import { loggedInUserType } from "../../types/user";
import { CompanyModel } from "../companies/company.model";
import { EmployeeModel } from "../employees/employee.model";
import { sendNotification } from "../notifications/helpers/sendNotification";
import { OrderTimelineType } from "../orders/orders.dto";
import { OrdersRepository } from "../orders/orders.repository";
import { orderReform } from "../orders/orders.responses";
import { generateReport } from "./helpers/generateReport";
import { generateReportsReport } from "./helpers/generateReportsReport";
import {
    ReportCreateOrdersFiltersType,
    ReportCreateType,
    ReportUpdateType,
    ReportsFiltersType,
    ReportsReportPDFCreateType
} from "./reports.dto";
import { ReportsRepository } from "./reports.repository";
import { reportReform } from "./reports.responses";

const reportsRepository = new ReportsRepository();
const ordersRepository = new OrdersRepository();
const employeeModel = new EmployeeModel();
const companyModel = new CompanyModel();

export class ReportsService {
    async createReport(data: {
        loggedInUser: loggedInUserType;
        reportData: ReportCreateType;
        ordersFilters: ReportCreateOrdersFiltersType;
    }) {
        let orders: ReturnType<typeof orderReform>[];
        let ordersIDs: number[] = [];
        if (data.reportData.ordersIDs === "*") {
            orders = (
                await ordersRepository.getAllOrders({
                    take: 2000,
                    skip: 0,
                    filters: data.ordersFilters
                })
            ).orders as ReturnType<typeof orderReform>[];

            for (const order of orders) {
                if (order) {
                    ordersIDs.push(order.id);
                }
            }
        } else {
            orders = await ordersRepository.getOrdersByIDs({ ordersIDs: data.reportData.ordersIDs });
            ordersIDs = data.reportData.ordersIDs;
        }
        //  orders = await ordersRepository.getOrdersByIDs(data.reportData);

        if (!orders || orders.length === 0) {
            throw new AppError("لا يوجد طلبات لعمل الكشف", 400);
        }

        // Change orders costs reportData contains new costs
        if (data.reportData.type === ReportType.CLIENT || data.reportData.type === ReportType.COMPANY) {
            await ordersRepository.updateOrdersCosts({
                ordersIDs,
                costs: {
                    baghdadDeliveryCost: data.reportData.baghdadDeliveryCost,
                    governoratesDeliveryCost: data.reportData.governoratesDeliveryCost
                }
            });

            orders = await ordersRepository.getOrdersByIDs({ ordersIDs });
        }

        if (
            data.reportData.type === ReportType.DELIVERY_AGENT ||
            data.reportData.type === ReportType.GOVERNORATE ||
            data.reportData.type === ReportType.BRANCH
        ) {
            await ordersRepository.updateOrdersCosts({
                ordersIDs,
                costs: {
                    deliveryAgentDeliveryCost: data.reportData.deliveryAgentDeliveryCost
                }
            });

            orders = await ordersRepository.getOrdersByIDs({ ordersIDs });
        }

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

        for (const order of orders) {
            // @ts-expect-error Fix later
            reportMetaData.totalCost += +order.totalCost;
            // @ts-expect-error Fix later
            reportMetaData.paidAmount += +order.paidAmount;
            // @ts-expect-error Fix later
            reportMetaData.deliveryCost += +order.deliveryCost;
            // @ts-expect-error Fix later
            reportMetaData.clientNet += +order.clientNet;
            // @ts-expect-error Fix later
            reportMetaData.deliveryAgentNet += order.deliveryAgentNet;
            // @ts-expect-error Fix later
            reportMetaData.companyNet += +order.companyNet;
            // @ts-expect-error Fix later
            if (order.governorate === "BAGHDAD") {
                reportMetaData.baghdadOrdersCount++;
            } else {
                reportMetaData.governoratesOrdersCount++;
            }
        }

        if (data.reportData.type === ReportType.CLIENT) {
            for (const order of orders) {
                if (order?.clientReport) {
                    throw new AppError(
                        `الطلب ${order.receiptNumber} يوجد في كشف عملاء اخر رقمه ${order.clientReport.id}`,
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
            }
        } else if (data.reportData.type === ReportType.REPOSITORY) {
            for (const order of orders) {
                if (order?.repositoryReport) {
                    throw new AppError(
                        `الطلب ${order.receiptNumber} يوجد في كشف مخازن اخر رقمه ${order.repositoryReport.id}`,
                        400
                    );
                }
            }
        } else if (data.reportData.type === ReportType.BRANCH) {
            for (const order of orders) {
                if (order?.branchReport) {
                    throw new AppError(
                        `الطلب ${order.receiptNumber} يوجد في كشف فروع اخر رقمه ${order.branchReport.id}`,
                        400
                    );
                }
            }
        } else if (data.reportData.type === ReportType.GOVERNORATE) {
            for (const order of orders) {
                if (order?.governorateReport) {
                    throw new AppError(
                        `الطلب ${order.receiptNumber} يوجد في كشف محافظة اخر رقمه ${order.governorateReport.id}`,
                        400
                    );
                }
            }
        } else if (data.reportData.type === ReportType.DELIVERY_AGENT) {
            for (const order of orders) {
                if (order?.deliveryAgentReport) {
                    throw new AppError(
                        `الطلب ${order.receiptNumber} يوجد في كشف مندوبين اخر رقمه ${order.deliveryAgentReport.id}`,
                        400
                    );
                }
            }
        } else if (data.reportData.type === ReportType.COMPANY) {
            for (const order of orders) {
                if (order?.companyReport) {
                    throw new AppError(
                        `الطلب ${order.receiptNumber} يوجد في كشف شركة اخر رقمه ${order.companyReport.id}`,
                        400
                    );
                }
            }
        }

        const report = await reportsRepository.createReport({
            loggedInUser: data.loggedInUser,
            reportData: { ...data.reportData, ordersIDs },
            reportMetaData: reportMetaData
        });

        if (!report) {
            throw new AppError("حدث خطأ اثناء عمل الكشف", 500);
        }

        // Update company treasury
        if (
            data.reportData.type === ReportType.GOVERNORATE ||
            data.reportData.type === ReportType.BRANCH ||
            data.reportData.type === ReportType.DELIVERY_AGENT ||
            data.reportData.type === ReportType.COMPANY
        ) {
            await companyModel.updateCompanyTreasury({
                companyID: data.loggedInUser.companyID as number,
                treasury: {
                    amount: reportMetaData.companyNet || 0,
                    type: "increment"
                }
            });
        } else if (
            data.reportData.type === ReportType.CLIENT ||
            data.reportData.type === ReportType.REPOSITORY
        ) {
            await companyModel.updateCompanyTreasury({
                companyID: data.loggedInUser.companyID as number,
                treasury: {
                    amount: reportMetaData.clientNet || 0,
                    type: "decrement"
                }
            });
        }

        const reportData = await reportsRepository.getReport({
            reportID: report.id
        });

        // Send notification to client if report type is client report
        if (data.reportData.type === ReportType.CLIENT) {
            await sendNotification({
                title: "تم انشاء كشف جديد",
                content: `تم انشاء كشف جديد برقم ${reportData?.id}`,
                userID: reportData?.clientReport?.client.id as number
            });
        }

        // Send notification to delivery agent if report type is delivery agent report
        if (data.reportData.type === ReportType.DELIVERY_AGENT) {
            await sendNotification({
                title: "تم انشاء كشف جديد",
                content: `تم انشاء كشف جديد برقم ${reportData?.id}`,
                userID: reportData?.deliveryAgentReport?.deliveryAgent.id as number
            });
        }

        // update orders timeline
        for (const order of orders) {
            // @ts-expect-error Fix later
            const oldTimeline: OrderTimelineType = order?.timeline;
            await ordersRepository.updateOrderTimeline({
                // @ts-expect-error Fix later
                orderID: order.id,
                timeline: [
                    // @ts-expect-error Fix later
                    ...oldTimeline,
                    {
                        type: "REPORT_CREATE",
                        reportType: data.reportData.type,
                        reportID: report.id,
                        // @ts-expect-error Fix later
                        date: reportData.createdAt,
                        by: {
                            id: data.loggedInUser.id,
                            name: data.loggedInUser.name,
                            // @ts-expect-error Fix later
                            role: data.loggedInUser.role
                        }
                    }
                ]
            });
        }

        // TODO
        const pdf = await generateReport(data.reportData.type, reportData, orders);
        // const pdf = await generateReport(
        //     await ordersRepository.getAllOrders(0, 100, {
        //         sort: "receiptNumber:desc"
        //     })
        // );

        return pdf;
    }

    async getAllReports(data: {
        loggedInUser: loggedInUserType;
        filters: ReportsFiltersType;
    }) {
        let company: number | undefined;
        if (Object.keys(AdminRole).includes(data.loggedInUser.role)) {
            company = data.filters.company ? +data.filters.company : undefined;
        } else if (data.loggedInUser.companyID) {
            company = data.loggedInUser.companyID;
        }

        let branch: number | undefined;
        if (data.loggedInUser.role === EmployeeRole.BRANCH_MANAGER) {
            const employee = await employeeModel.getEmployee({ employeeID: data.loggedInUser.id });
            branch = employee?.branch?.id;
        } else if (data.filters.branch) {
            branch = +data.filters.branch;
        } else {
            branch = undefined;
        }

        let clientID: number | undefined;
        if (data.loggedInUser.role === "CLIENT" || data.loggedInUser.role === "CLIENT_ASSISTANT") {
            clientID = +data.loggedInUser.id;
        } else if (data.filters.clientID) {
            clientID = +data.filters.clientID;
        } else {
            clientID = undefined;
        }

        let deliveryAgentID: number | undefined;
        if (data.loggedInUser.role === EmployeeRole.DELIVERY_AGENT) {
            deliveryAgentID = +data.loggedInUser.id;
        } else if (data.filters.deliveryAgentID) {
            deliveryAgentID = +data.filters.deliveryAgentID;
        } else {
            deliveryAgentID = undefined;
        }

        const reportsCount = await reportsRepository.getReportsCount({
            filters: { ...data.filters, company, branch, clientID, deliveryAgentID }
        });
        let size = data.filters.size ? +data.filters.size : 10;
        if (size > 50 && data.filters.minified !== true) {
            size = 10;
        }
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

        let page = 1;
        if (data.filters.page && !Number.isNaN(+data.filters.page) && +data.filters.page > 0) {
            page = +data.filters.page;
        }
        if (page > pagesCount) {
            throw new AppError("Page number out of range", 400);
        }
        const take = page * size;
        const skip = (page - 1) * size;

        const { reports, reportsMetaData } = await reportsRepository.getAllReports({
            skip,
            take,
            filters: { ...data.filters, company, branch, clientID, deliveryAgentID }
        });

        return { page, pagesCount, reports, reportsMetaData };
    }

    async getReport(data: { params: { reportID: number } }) {
        const report = await reportsRepository.getReport({
            reportID: data.params.reportID
        });

        return report;
    }

    async getReportPDF(data: { params: { reportID: number } }) {
        const reportData = await reportsRepository.getReport({
            reportID: data.params.reportID
        });

        // TODO: fix this
        // @ts-expect-error Fix later
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

        const ordersData = await ordersRepository.getOrdersByIDs({
            ordersIDs: ordersIDs
        });

        const pdf = await generateReport(
            // @ts-expect-error Fix later
            reportData.type,
            reportData,
            ordersData
        );
        return pdf;
    }

    async getReportsReportPDF(data: {
        reportsData: ReportsReportPDFCreateType;
        reportsFilters: ReportsFiltersType;
    }) {
        let reports: ReturnType<typeof reportReform>[];
        let reportsIDs: number[] = [];
        if (data.reportsData.reportsIDs === "*") {
            reports = (
                await reportsRepository.getAllReports({
                    take: 2000,
                    skip: 0,
                    filters: { ...data.reportsFilters, type: data.reportsData.type }
                })
            ).reports as ReturnType<typeof reportReform>[];

            for (const report of reports) {
                if (report) {
                    reportsIDs.push(report.id);
                }
            }
        } else {
            reports = await reportsRepository.getReportsByIDs({ reportsIDs: data.reportsData.reportsIDs });
            reportsIDs = data.reportsData.reportsIDs;
        }

        if (!reports || reports.length === 0) {
            throw new AppError("لا يوجد كشوفات لعمل التقرير", 400);
        }

        if (data.reportsData.type === "CLIENT") {
            const reportsData = {
                company: reports[0]?.company,
                companyNet: reports.reduce((acc, report) => {
                    if (report) {
                        return acc + report.companyNet;
                    }
                    return acc;
                }, 0),
                clientNet: reports.reduce((acc, report) => {
                    if (report) {
                        return acc + report.clientNet;
                    }
                    return acc;
                }, 0),
                baghdadOrdersCount: reports.reduce((acc, report) => {
                    if (report) {
                        return acc + (report.baghdadOrdersCount || 0);
                    }
                    return acc;
                }, 0),
                governoratesOrdersCount: reports.reduce((acc, report) => {
                    if (report) {
                        return acc + (report.governoratesOrdersCount || 0);
                    }
                    return acc;
                }, 0),
                date: new Date(),
                count: reports.length
            };
            const pdf = await generateReportsReport(data.reportsData.type, reportsData, reports);
            return pdf;
        }

        throw new AppError("لا يمكن عمل تقرير لهذا النوع من التقارير", 400);
    }

    async updateReport(data: {
        params: { reportID: number };
        loggedInUser: loggedInUserType;
        reportData: ReportUpdateType;
    }) {
        if (
            data.reportData.confirmed === false &&
            (data.loggedInUser.role === "CLIENT" || data.loggedInUser.role === "CLIENT_ASSISTANT")
        ) {
            throw new AppError("لا يمكنك إلغاء تأكيد التقرير", 400);
        }

        const report = await reportsRepository.updateReport({
            reportID: data.params.reportID,
            reportData: data.reportData
        });

        return report;
    }

    async deleteReport(data: { params: { reportID: number } }) {
        await reportsRepository.deleteReport({
            reportID: data.params.reportID
        });
    }

    async deactivateReport(data: { params: { reportID: number }; loggedInUser: loggedInUserType }) {
        const report = await reportsRepository.deactivateReport({
            reportID: data.params.reportID,
            deletedByID: data.loggedInUser.id
        });

        const orders =
            report.type === ReportType.CLIENT
                ? report.clientReport?.orders
                : report.type === ReportType.REPOSITORY
                  ? report.repositoryReport?.orders
                  : report.type === ReportType.BRANCH
                      ? report.branchReport?.orders
                      : report.type === ReportType.GOVERNORATE
                          ? report.governorateReport?.orders
                          : report.type === ReportType.DELIVERY_AGENT
                              ? report.deliveryAgentReport?.orders
                              : report.type === ReportType.COMPANY
                                  ? report.companyReport?.orders
                                  : [];

        if (orders) {
            for (const order of orders) {
                // @ts-expect-error Fix later
                const oldTimeline: OrderTimelineType = order?.timeline;
                await ordersRepository.updateOrderTimeline({
                    orderID: order.id,
                    timeline: [
                        // @ts-expect-error Fix later
                        ...oldTimeline,
                        {
                            type: "REPORT_DELETE",
                            reportType: report.type,
                            date: new Date(),
                            by: {
                                id: data.loggedInUser.id,
                                name: data.loggedInUser.name,
                                // @ts-expect-error Fix later
                                role: data.loggedInUser.role
                            }
                        }
                    ]
                });
            }
        }
    }

    async reactivateReport(data: { params: { reportID: number } }) {
        await reportsRepository.reactivateReport({
            reportID: data.params.reportID
        });
    }
}
