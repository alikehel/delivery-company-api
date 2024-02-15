import { Governorate, Prisma, PrismaClient, ReportStatus, ReportType } from "@prisma/client";
import { ReportCreateType, ReportUpdateType } from "./reports.dto";

const prisma = new PrismaClient();

export const reportSelect = {
    id: true,
    status: true,
    confirmed: true,
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
    baghdadOrdersCount: true,
    governoratesOrdersCount: true,
    totalCost: true,
    paidAmount: true,
    deliveryCost: true,
    clientNet: true,
    deliveryAgentNet: true,
    companyNet: true,
    type: true,
    createdAt: true,
    updatedAt: true,
    clientReport: {
        select: {
            id: true,
            client: {
                select: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            phone: true
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
                    clientReportId: true
                }
            }
        }
    },
    repositoryReport: {
        select: {
            id: true,
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
                    repositoryReportId: true
                }
            }
        }
    },
    branchReport: {
        select: {
            id: true,
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
                    branchReportId: true
                }
            }
        }
    },
    governorateReport: {
        select: {
            id: true,
            governorate: true,
            orders: {
                select: {
                    id: true,
                    receiptNumber: true,
                    governorateReportId: true
                }
            }
        }
    },
    deliveryAgentReport: {
        select: {
            id: true,
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
                    deliveryAgentReportId: true
                }
            }
        }
    },
    companyReport: {
        select: {
            id: true,
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
                    companyReportId: true
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
} satisfies Prisma.ReportSelect;

export const reportReform = (
    report: Prisma.ReportGetPayload<{
        select: typeof reportSelect;
    }> | null
) => {
    if (!report) {
        return null;
    }
    const reportData = {
        ...report,
        createdBy: report.createdBy.user,
        clientReport: report.clientReport && {
            reportNumber: report.clientReport.id,
            clientReportOrders: report.clientReport.orders,
            client: report.clientReport.client.user,
            store: report.clientReport.store
        },
        repositoryReport: report.repositoryReport && {
            reportNumber: report.repositoryReport.id,
            repositoryReportOrders: report.repositoryReport.orders,
            repository: report.repositoryReport.repository
        },
        branchReport: report.branchReport && {
            reportNumber: report.branchReport.id,
            branchReportOrders: report.branchReport.orders,
            branch: report.branchReport.branch
        },
        governorateReport: report.governorateReport && {
            reportNumber: report.governorateReport.id,
            governorateReportOrders: report.governorateReport.orders,
            governorate: report.governorateReport.governorate
        },
        deliveryAgentReport: report.deliveryAgentReport && {
            reportNumber: report.deliveryAgentReport.id,
            deliveryAgentReportOrders: report.deliveryAgentReport.orders,
            deliveryAgent: report.deliveryAgentReport.deliveryAgent.user
        },
        companyReport: report.companyReport && {
            reportNumber: report.companyReport.id,
            companyReportOrders: report.companyReport.orders,
            company: report.companyReport.company
        },
        company: report.company,
        deleted: report.deleted,
        deletedBy: report.deleted && report.deletedBy,
        deletedAt: report.deletedAt?.toISOString()
    };
    return reportData;
};

// const reportInclude: Prisma.ReportInclude = {};

export class ReportsRepository {
    async createReport(
        companyID: number,
        userID: number,
        data: ReportCreateType,
        reportMetaData: {
            totalCost: number;
            paidAmount: number;
            deliveryCost: number;
            baghdadOrdersCount: number;
            governoratesOrdersCount: number;
            clientNet: number;
            deliveryAgentNet: number;
            companyNet: number;
        }
    ) {
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
                        id: userID
                    }
                },
                company: {
                    connect: {
                        id: companyID
                    }
                },
                baghdadOrdersCount: reportMetaData.baghdadOrdersCount,
                governoratesOrdersCount: reportMetaData.governoratesOrdersCount,
                totalCost: reportMetaData.totalCost,
                paidAmount: reportMetaData.paidAmount,
                deliveryCost: reportMetaData.deliveryCost,
                clientNet: reportMetaData.clientNet,
                deliveryAgentNet: reportMetaData.deliveryAgentNet,
                companyNet: reportMetaData.companyNet
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
                    store: {
                        connect: {
                            id: data.storeID
                        }
                    },
                    orders: orders,
                    report: report
                }
            });
            return createdReport;
        }
        if (data.type === ReportType.REPOSITORY) {
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
        }
        if (data.type === ReportType.BRANCH) {
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
        }
        if (data.type === ReportType.DELIVERY_AGENT) {
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
        }
        if (data.type === ReportType.GOVERNORATE) {
            const createdReport = await prisma.governorateReport.create({
                data: {
                    governorate: data.governorate,
                    orders: orders,
                    report: report
                }
            });
            return createdReport;
        }
        if (data.type === ReportType.COMPANY) {
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

    async getReportsCount(filters: {
        sort: string;
        startDate?: Date;
        endDate?: Date;
        clientID?: number;
        storeID?: number;
        repositoryID?: number;
        branchID?: number;
        branch?: number;
        deliveryAgentID?: number;
        governorate?: Governorate;
        companyID?: number;
        company?: number;
        status?: ReportStatus;
        type?: ReportType;
        deleted?: string;
        createdByID?: number;
    }) {
        const reportsCount = await prisma.report.count({
            where: {
                AND: [
                    {
                        OR: [
                            {
                                deliveryAgentReport: filters.branch
                                    ? {
                                          orders: {
                                              some: {
                                                  branch: {
                                                      id: filters.branch
                                                  }
                                              }
                                          }
                                      }
                                    : undefined
                            },
                            {
                                clientReport: filters.branch
                                    ? {
                                          orders: {
                                              some: {
                                                  branch: {
                                                      id: filters.branch
                                                  }
                                              }
                                          }
                                      }
                                    : undefined
                            },
                            {
                                repositoryReport: filters.branch
                                    ? {
                                          orders: {
                                              some: {
                                                  branch: {
                                                      id: filters.branch
                                                  }
                                              }
                                          }
                                      }
                                    : undefined
                            },
                            {
                                branchReport: filters.branch
                                    ? {
                                          orders: {
                                              some: {
                                                  branch: {
                                                      id: filters.branch
                                                  }
                                              }
                                          }
                                      }
                                    : undefined
                            }
                        ]
                    },
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
                        // TODO: fix this: Report type filter vs company filter
                        companyReport: filters.companyID
                            ? {
                                  companyId: filters.companyID
                              }
                            : undefined
                    },
                    {
                        status: filters.status
                    },
                    {
                        type: filters.type
                    },
                    {
                        deleted: filters.deleted === "true"
                    },
                    {
                        company: {
                            id: filters.company
                        }
                    },
                    {
                        createdBy: {
                            id: filters.createdByID
                        }
                    }
                ]
            }
        });
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
            branch?: number;
            deliveryAgentID?: number;
            governorate?: Governorate;
            companyID?: number;
            company?: number;
            status?: ReportStatus;
            type?: ReportType;
            deleted?: string;
            createdByID?: number;
            minified?: boolean;
        }
    ) {
        const where = {
            AND: [
                {
                    OR: [
                        {
                            deliveryAgentReport: filters.branch
                                ? {
                                      orders: {
                                          some: {
                                              branch: {
                                                  id: filters.branch
                                              }
                                          }
                                      }
                                  }
                                : undefined
                        },
                        {
                            clientReport: filters.branch
                                ? {
                                      orders: {
                                          some: {
                                              branch: {
                                                  id: filters.branch
                                              }
                                          }
                                      }
                                  }
                                : undefined
                        },
                        {
                            repositoryReport: filters.branch
                                ? {
                                      orders: {
                                          some: {
                                              branch: {
                                                  id: filters.branch
                                              }
                                          }
                                      }
                                  }
                                : undefined
                        },
                        {
                            branchReport: filters.branch
                                ? {
                                      orders: {
                                          some: {
                                              branch: {
                                                  id: filters.branch
                                              }
                                          }
                                      }
                                  }
                                : undefined
                        }
                    ]
                },
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
                    // TODO: fix this: Report type filter vs company filter
                    companyReport: filters.companyID
                        ? {
                              companyId: filters.companyID
                          }
                        : undefined
                },
                {
                    status: filters.status
                },
                {
                    type: filters.type
                },
                {
                    deleted: filters.deleted === "true"
                },
                {
                    company: {
                        id: filters.company
                    }
                },
                {
                    createdBy: {
                        id: filters.createdByID
                    }
                }
            ]
        };

        if (filters.minified === true) {
            const reports = await prisma.report.findMany({
                skip: skip,
                take: take,
                where: where,
                select: {
                    id: true,
                    
                }
            });
            return {
                reports: reports
            };
        }

        const reports = await prisma.report.findMany({
            skip: skip,
            take: take,
            where: where,
            orderBy: {
                [filters.sort.split(":")[0]]: filters.sort.split(":")[1] === "desc" ? "desc" : "asc"
            },
            select: reportSelect
        });

        const reportsMetaData = await prisma.report.aggregate({
            where: where,
            _count: {
                id: true
            },
            _sum: {
                totalCost: true,
                paidAmount: true,
                deliveryCost: true,
                baghdadOrdersCount: true,
                governoratesOrdersCount: true,
                clientNet: true,
                deliveryAgentNet: true,
                companyNet: true
            }
        });

        const reportsReformed = reports.map((report) => reportReform(report));

        const reportsMetaDataReformed = {
            reportsCount: reportsMetaData._count.id,
            totalCost: reportsMetaData._sum.totalCost,
            paidAmount: reportsMetaData._sum.paidAmount,
            deliveryCost: reportsMetaData._sum.deliveryCost,
            baghdadOrdersCount: reportsMetaData._sum.baghdadOrdersCount,
            governoratesOrdersCount: reportsMetaData._sum.governoratesOrdersCount,
            clientNet: reportsMetaData._sum.clientNet,
            deliveryAgentNet: reportsMetaData._sum.deliveryAgentNet,
            companyNet: reportsMetaData._sum.companyNet
        };

        return {
            reports: reportsReformed,
            reportsMetaData: reportsMetaDataReformed
        };

        // return reports.map((report) => reportReform(report));
    }

    async getReport(data: { reportID: number }) {
        const report = await prisma.report.findUnique({
            where: {
                id: data.reportID
            },
            select: reportSelect
        });
        return reportReform(report);
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
                status: data.reportData.status,
                confirmed: data.reportData.confirmed
            },
            select: reportSelect
        });
        return reportReform(report);
    }

    async deleteReport(data: { reportID: number }) {
        const deletedReport = await prisma.report.delete({
            where: {
                id: data.reportID
            }
        });
        return deletedReport;
    }

    async deactivateReport(data: { reportID: number; deletedByID: number }) {
        const deletedReport = await prisma.report.update({
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
        return deletedReport;
    }

    async reactivateReport(data: { reportID: number }) {
        const deletedReport = await prisma.report.update({
            where: {
                id: data.reportID
            },
            data: {
                deleted: false
            }
        });
        return deletedReport;
    }
}
