import { generateMock } from "@anatine/zod-mock";
import { generateSchema } from "@anatine/zod-openapi";
import { Governorate, Prisma, ReportStatus, ReportType } from "@prisma/client";
import { z } from "zod";

export const ReportCreateBaseSchema = z.object({
    ordersIDs: z.array(z.coerce.number()).min(1)
});

export const ReportCreateSchema = z
    .discriminatedUnion("type", [
        z.object({
            type: z.literal(ReportType.COMPANY),
            companyID: z.coerce.number()
        }),
        z.object({
            type: z.literal(ReportType.DELIVERY_AGENT),
            deliveryAgentID: z.coerce.number()
        }),
        z.object({
            type: z.literal(ReportType.GOVERNORATE),
            governorate: z.nativeEnum(Governorate)
        }),
        z.object({
            type: z.literal(ReportType.BRANCH),
            branchID: z.coerce.number()
        }),
        z.object({
            type: z.literal(ReportType.CLIENT),
            clientID: z.coerce.number(),
            storeID: z.coerce.number()
        }),
        z.object({
            type: z.literal(ReportType.REPOSITORY),
            repositoryID: z.coerce.number()
        })
    ])
    .and(ReportCreateBaseSchema);

export type ReportCreateType = z.infer<typeof ReportCreateSchema>;

export const ReportCreateOpenAPISchema = generateSchema(ReportCreateSchema);

export const ReportCreateMock = generateMock(ReportCreateSchema);

/* --------------------------------------------------------------- */

export const ReportUpdateSchema = z.object({
    status: z.nativeEnum(ReportStatus),
    confirmed: z.boolean().optional()
});

export type ReportUpdateType = z.infer<typeof ReportUpdateSchema>;

export const ReportUpdateOpenAPISchema = generateSchema(ReportUpdateSchema);

export const ReportUpdateMock = generateMock(ReportUpdateSchema);

/* --------------------------------------------------------------- */

export const ReportsFiltersSchema = z.object({
    page: z.coerce.number().optional().default(1),
    size: z.coerce.number().optional().default(10),
    company: z.coerce.number().optional(),
    branch: z.coerce.number().optional(),
    // TODO: Maybe change default sort
    sort: z.string().optional().default("id:desc"),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    governorate: z.nativeEnum(Governorate).optional(),
    status: z.nativeEnum(ReportStatus).optional(),
    type: z.nativeEnum(ReportType).optional(),
    storeID: z.coerce.number().optional(),
    repositoryID: z.coerce.number().optional(),
    branchID: z.coerce.number().optional(),
    deliveryAgentID: z.coerce.number().optional(),
    companyID: z.coerce.number().optional(),
    clientID: z.coerce.number().optional(),
    createdByID: z.coerce.number().optional(),
    deleted: z.preprocess((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return val;
    }, z.boolean().default(false).optional()),
    minified: z.preprocess((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return val;
    }, z.boolean().optional())
});

export type ReportsFiltersType = z.infer<typeof ReportsFiltersSchema>;

export const ReportsFiltersOpenAPISchema = generateSchema(ReportsFiltersSchema);

export const ReportsFiltersMock = generateMock(ReportsFiltersSchema);

/* --------------------------------------------------------------- */

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
                    clientReportId: true,
                    timeline: true
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
                    repositoryReportId: true,
                    timeline: true
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
                    branchReportId: true,
                    timeline: true
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
                    governorateReportId: true,
                    timeline: true
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
                    deliveryAgentReportId: true,
                    timeline: true
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
                    companyReportId: true,
                    timeline: true
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

/* --------------------------------------------------------------- */
