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
            name: true
        }
    },
    type: true,
    createdAt: true,
    updatedAt: true,
    ClientReport: {
        select: {
            reportNumber: true,
            client: {
                select: {
                    id: true,
                    name: true
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
    RepositoryReport: {
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
    BranchReport: {
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
    GovernorateReport: {
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
    DeliveryAgentReport: {
        select: {
            reportNumber: true,
            deliveryAgent: {
                select: {
                    id: true,
                    name: true
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
    }
    // TODO
    // CompanyReport: {
    //     select: {
    //          reportNumber: true,
    //         company: {
    //             select: {
    //                 id: true,
    //                 name: true
    //             }
    //         },
    //         orders: {
    //             select: {
    //                 id: true,
    //                 receiptNumber: true,
    //                 companyReportReportNumber: true
    //             }
    //         }
    //     }
    // }
};

// const reportInclude: Prisma.ReportInclude = {};

export class ReportModel {
    async createReport(userID: string, data: ReportCreateType) {
        const orders = {
            connect: data.ordersIDs.map((orderID) => {
                return {
                    id: orderID
                };
            })
        };
        const Report = {
            create: {
                type: data.type,
                createdBy: {
                    connect: {
                        id: userID
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
                    orders: orders,
                    Report: Report
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
                    Report: Report
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
                    Report: Report
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
                    Report: Report
                }
            });
            return createdReport;
        } else if (data.type === ReportType.GOVERNORATE) {
            const createdReport = await prisma.governorateReport.create({
                data: {
                    governorate: data.governorate,
                    orders: orders,
                    Report: Report
                }
            });
            return createdReport;
        }
        // else if (data.type === ReportType.COMPANY) {
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
            clientID?: string;
            storeID?: string;
            repositoryID?: string;
            branchID?: string;
            deliveryAgentID?: string;
            governorate?: Governorate;
            status?: ReportStatus;
            type?: ReportType;
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
                        ClientReport: {
                            clientId: filters.clientID
                        }
                    },
                    {
                        ClientReport: {
                            storeId: filters.storeID
                        }
                    },
                    {
                        RepositoryReport: {
                            repositoryId: filters.repositoryID
                        }
                    },
                    {
                        BranchReport: {
                            branchId: filters.branchID
                        }
                    },
                    {
                        DeliveryAgentReport: {
                            deliveryAgentId: filters.deliveryAgentID
                        }
                    },
                    {
                        GovernorateReport: {
                            governorate: filters.governorate
                        }
                    },
                    {
                        status: filters.status
                    },
                    {
                        type: filters.type
                    }
                ]
            },
            orderBy: {
                [filters.sort.split(":")[0]]:
                    filters.sort.split(":")[1] === "desc" ? "desc" : "asc"
            },
            select: reportSelect
        });
        return reports;
    }

    async getReport(data: { reportID: string }) {
        const report = await prisma.report.findUnique({
            where: {
                id: data.reportID
            },
            select: reportSelect
        });
        return report;
    }

    async updateReport(data: {
        reportID: string;
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
        return report;
    }

    async deleteReport(data: { reportID: string }) {
        const deletedReport = prisma.report.delete({
            where: {
                id: data.reportID
            }
        });

        return deletedReport;
    }
}
