import {
    Governorate,
    Prisma,
    PrismaClient,
    ReportStatus,
    ReportType
} from "@prisma/client";
import { ReportCreateType, ReportUpdateType } from "./reports.zod";

const prisma = new PrismaClient();

const reportSelect: Prisma.ReportSelect = {
    id: true,
    status: true,
    createdBy: {
        select: {
            id: true,
            user: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    },
    type: true,
    createdAt: true,
    updatedAt: true,
    clientReport: {
        select: {
            reportNumber: true,
            client: {
                select: {
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            },
            store: {
                select: {
                    id: true,
                    name: true
                }
            },
            orders: {
                select: {
                    id: true,
                    receiptNumber: true,
                    clientReportReportNumber: true
                }
            }
        }
    },
    repositoryReport: {
        select: {
            reportNumber: true,
            repository: {
                select: {
                    id: true,
                    name: true
                }
            },
            orders: {
                select: {
                    id: true,
                    receiptNumber: true,
                    repositoryReportReportNumber: true
                }
            }
        }
    },
    branchReport: {
        select: {
            reportNumber: true,
            branch: {
                select: {
                    id: true,
                    name: true
                }
            },
            orders: {
                select: {
                    id: true,
                    receiptNumber: true,
                    branchReportReportNumber: true
                }
            }
        }
    },
    governorateReport: {
        select: {
            reportNumber: true,
            governorate: true,
            orders: {
                select: {
                    id: true,
                    receiptNumber: true,
                    governorateReportReportNumber: true
                }
            }
        }
    },
    deliveryAgentReport: {
        select: {
            reportNumber: true,
            deliveryAgent: {
                select: {
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            },
            orders: {
                select: {
                    id: true,
                    receiptNumber: true,
                    deliveryAgentReportReportNumber: true
                }
            }
        }
    },
    companyReport: {
        select: {
            reportNumber: true,
            company: {
                select: {
                    id: true,
                    name: true
                }
            },
            orders: {
                select: {
                    id: true,
                    receiptNumber: true,
                    companyReportReportNumber: true
                }
            }
        }
    },
    company: {
        select: {
            id: true,
            name: true
        }
    },
    deleted: true,
    deletedAt: true,
    deletedBy: {
        select: {
            id: true,
            name: true
        }
    }
};

const reportselectReform = (
    report: any
    // Prisma.ReportGetPayload < {
    //     include: Prisma.ReportInclude;
    // }> & {
    //     clientReport: Prisma.ClientReportGetPayload<{
    //         include: Prisma.ClientReportInclude;
    //     }> & {
    //         client: Prisma.ClientGetPayload<{
    //             include: Prisma.ClientInclude;
    //         }> & {
    //             user: Prisma.UserGetPayload<{
    //                 include: Prisma.UserInclude;
    //             }>;
    //         };
    //         store: Prisma.StoreGetPayload<{
    //             include: Prisma.StoreInclude;
    //         }>;
    //         orders: Prisma.OrderGetPayload<{
    //             include: Prisma.OrderInclude;
    //         }>[];
    //     };
    //     repositoryReport: Prisma.RepositoryReportGetPayload<{
    //         include: Prisma.RepositoryReportInclude;
    //     }> & {
    //         repository: Prisma.RepositoryGetPayload<{
    //             include: Prisma.RepositoryInclude;
    //         }>;
    //         orders: Prisma.OrderGetPayload<{
    //             include: Prisma.OrderInclude;
    //         }>[];
    //     };
    //     branchReport: Prisma.BranchReportGetPayload<{
    //         include: Prisma.BranchReportInclude;
    //     }> & {
    //         branch: Prisma.BranchGetPayload<{
    //             include: Prisma.BranchInclude;
    //         }>;
    //         orders: Prisma.OrderGetPayload<{
    //             include: Prisma.OrderInclude;
    //         }>[];
    //     };
    //     governorateReport: Prisma.GovernorateReportGetPayload<{
    //         include: Prisma.GovernorateReportInclude;
    //     }> & {
    //         orders: Prisma.OrderGetPayload<{
    //             include: Prisma.OrderInclude;
    //         }>[];
    //     };
    //     deliveryAgentReport: Prisma.DeliveryAgentReportGetPayload<{
    //         include: Prisma.DeliveryAgentReportInclude;
    //     }> & {
    //         deliveryAgent: Prisma.EmployeeGetPayload<{
    //             include: Prisma.EmployeeInclude;
    //         }> & {
    //             user: Prisma.UserGetPayload<{
    //                 include: Prisma.UserInclude;
    //             }>;
    //         };
    //         orders: Prisma.OrderGetPayload<{
    //             include: Prisma.OrderInclude;
    //         }>[];
    //     };
    //     companyReport: Prisma.CompanyReportGetPayload<{
    //         include: Prisma.CompanyReportInclude;
    //     }> & {
    //         company: Prisma.CompanyGetPayload<{
    //             include: Prisma.CompanyInclude;
    //         }>;
    //         orders: Prisma.OrderGetPayload<{
    //             include: Prisma.OrderInclude;
    //         }>[];
    //     };
    // }
) => {
    if (!report) {
        return null;
    }
    const reportData = {
        ...report,
        createdBy: report.createdBy.user,
        clientReport: report.clientReport && {
            ...report.clientReport,
            client: report.clientReport.client.user
        },
        repositoryReport: report.repositoryReport && {
            ...report.repositoryReport,
            repository: report.repositoryReport.repository
        },
        branchReport: report.branchReport && {
            ...report.branchReport,
            branch: report.branchReport.branch
        },
        governorateReport: report.governorateReport && {
            ...report.governorateReport,
            governorate: report.governorateReport.governorate
        },
        deliveryAgentReport: report.deliveryAgentReport && {
            ...report.deliveryAgentReport,
            deliveryAgent: report.deliveryAgentReport.deliveryAgent.user
        },
        companyReport: report.companyReport && {
            ...report.companyReport,
            company: report.companyReport.company
        },
        company: report.company,
        deletedBy: report.deleted && report.deletedBy,
        deletedAt: report.deleted && report.deletedAt.toISOString()
    };
    return reportData;
};

// const reportInclude: Prisma.ReportInclude = {};

export class ReportModel {
    async createReport(
        companyID: number,
        userID: number,
        data: ReportCreateType
    ) {
        console.log(userID);

        const orders = {
            connect: data.ordersIDs.map((orderID) => {
                return {
                    id: orderID
                };
            })
        };
        const report = {
            create: {
                type: data.type,
                createdBy: {
                    connect: {
                        userId: userID
                    }
                },
                company: {
                    connect: {
                        id: companyID
                    }
                }
            }
        };
        if (data.type === ReportType.CLIENT) {
            const createdReport = await prisma.clientReport.create({
                data: {
                    client: {
                        connect: {
                            id: data.clientID
                        }
                    },
                    // TODO
                    // store: {
                    //     connect: {
                    //         id: data.storeID
                    //     }
                    // },
                    orders: orders,
                    report: report
                }
            });
            return createdReport;
        } else if (data.type === ReportType.REPOSITORY) {
            const createdReport = await prisma.repositoryReport.create({
                data: {
                    repository: {
                        connect: {
                            id: data.repositoryID
                        }
                    },
                    orders: orders,
                    report: report
                }
            });
            return createdReport;
        } else if (data.type === ReportType.BRANCH) {
            const createdReport = await prisma.branchReport.create({
                data: {
                    branch: {
                        connect: {
                            id: data.branchID
                        }
                    },
                    orders: orders,
                    report: report
                }
            });
            return createdReport;
        } else if (data.type === ReportType.DELIVERY_AGENT) {
            const createdReport = await prisma.deliveryAgentReport.create({
                data: {
                    deliveryAgent: {
                        connect: {
                            id: data.deliveryAgentID
                        }
                    },
                    orders: orders,
                    report: report
                }
            });
            return createdReport;
        } else if (data.type === ReportType.GOVERNORATE) {
            const createdReport = await prisma.governorateReport.create({
                data: {
                    governorate: data.governorate,
                    orders: orders,
                    report: report
                }
            });
            return createdReport;
        } else if (data.type === ReportType.COMPANY) {
            const createdReport = await prisma.companyReport.create({
                data: {
                    company: {
                        connect: {
                            id: data.companyID
                        }
                    },
                    orders: orders,
                    report: report
                }
            });
            return createdReport;
        }
    }

    async getReportsCount() {
        const reportsCount = await prisma.report.count();
        return reportsCount;
    }

    async getAllReports(
        skip: number,
        take: number,
        filters: {
            sort: string;
            startDate?: Date;
            endDate?: Date;
            clientID?: number;
            storeID?: number;
            repositoryID?: number;
            branchID?: number;
            deliveryAgentID?: number;
            governorate?: Governorate;
            companyID?: number;
            status?: ReportStatus;
            type?: ReportType;
            deleted?: string;
        }
    ) {
        const reports = await prisma.report.findMany({
            skip: skip,
            take: take,
            where: {
                AND: [
                    {
                        createdAt: {
                            gte: filters.startDate
                        }
                    },
                    {
                        createdAt: {
                            lte: filters.endDate
                        }
                    },
                    {
                        clientReport: {
                            clientId: filters.clientID
                        }
                    },
                    {
                        clientReport: {
                            storeId: filters.storeID
                        }
                    },
                    {
                        repositoryReport: {
                            repositoryId: filters.repositoryID
                        }
                    },
                    {
                        branchReport: {
                            branchId: filters.branchID
                        }
                    },
                    {
                        deliveryAgentReport: {
                            deliveryAgentId: filters.deliveryAgentID
                        }
                    },
                    {
                        governorateReport: {
                            governorate: filters.governorate
                        }
                    },
                    {
                        companyReport: {
                            companyId: filters.companyID
                        }
                    },
                    {
                        status: filters.status
                    },
                    {
                        type: filters.type
                    },
                    {
                        deleted: filters.deleted === "true" ? true : false
                    }
                ]
            },
            orderBy: {
                [filters.sort.split(":")[0]]:
                    filters.sort.split(":")[1] === "desc" ? "desc" : "asc"
            },
            select: reportSelect
        });
        return reports.map((report) => reportselectReform(report));
    }

    async getReport(data: { reportID: number }) {
        const report = await prisma.report.findUnique({
            where: {
                id: data.reportID
            },
            select: reportSelect
        });
        return reportselectReform(report);
    }

    async updateReport(data: {
        reportID: number;
        reportData: ReportUpdateType;
    }) {
        const report = await prisma.report.update({
            where: {
                id: data.reportID
            },
            data: {
                status: data.reportData.status
            },
            select: reportSelect
        });
        return reportselectReform(report);
    }

    async deleteReport(data: { deletedByID: number; reportID: number }) {
        await prisma.report.update({
            where: {
                id: data.reportID
            },
            data: {
                deleted: true,
                deletedAt: new Date(),
                deletedBy: {
                    connect: {
                        id: data.deletedByID
                    }
                }
            }
        });

        return true;
    }
}
