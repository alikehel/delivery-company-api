import { generateMock } from "@anatine/zod-mock";
import { generateSchema } from "@anatine/zod-openapi";
import {
    AdminRole,
    ClientRole,
    DeliveryType,
    EmployeeRole,
    Governorate,
    OrderStatus,
    Prisma,
    ReportType
} from "@prisma/client";
import { z } from "zod";

export const OrderCreateBaseSchema = z.object({
    receiptNumber: z.number().optional(),
    recipientName: z.string(),
    recipientPhones: z.array(z.string().regex(/^07[3-9][0-9]{8}$/)).optional(),
    recipientPhone: z
        .string()
        .regex(/^07[3-9][0-9]{8}$/)
        .optional(),
    recipientAddress: z.string(),
    notes: z.string().optional(),
    details: z.string().optional(),
    deliveryType: z.nativeEnum(DeliveryType).default(DeliveryType.NORMAL),
    governorate: z.nativeEnum(Governorate),
    locationID: z.coerce.number().optional(),
    storeID: z.coerce.number(),
    repositoryID: z.coerce.number().optional(),
    branchID: z.coerce.number().optional(),
    clientID: z.coerce.number().optional()
});

export const OrderCreateSchema = z
    .discriminatedUnion("withProducts", [
        z.object({
            withProducts: z.literal(true),
            products: z.array(
                z.object({
                    productID: z.coerce.number(),
                    quantity: z.number().min(1).default(1),
                    colorID: z.coerce.number().optional(),
                    sizeID: z.coerce.number().optional()
                })
            )
        }),
        z.object({
            withProducts: z.literal(false),
            totalCost: z.number(),
            quantity: z.number().default(1),
            weight: z.number().optional()
        })
    ])
    .and(OrderCreateBaseSchema);

export type OrderCreateType = z.infer<typeof OrderCreateSchema>;

export const OrderCreateOpenAPISchema = generateSchema(OrderCreateSchema);

export const OrderCreateMock = generateMock(OrderCreateSchema);

/* --------------------------------------------------------------- */

// export const OrderUpdateSchema = OrderCreateSchema.partial();

export const OrderUpdateSchema = z
    .object({
        paidAmount: z.number(),
        receiptNumber: z.number().optional(),
        discount: z.number(),
        status: z.nativeEnum(OrderStatus),
        deliveryAgentID: z.coerce.number(),
        deliveryDate: z.coerce.date().optional(),
        recipientName: z.string(),
        recipientPhones: z.array(z.string().regex(/^07[3-9][0-9]{8}$/)).optional(),
        recipientPhone: z
            .string()
            .regex(/^07[3-9][0-9]{8}$/)
            .optional(),
        recipientAddress: z.string(),
        notes: z.string().optional(),
        details: z.string().optional(),
        repositoryID: z.coerce.number().optional(),
        branchID: z.coerce.number().optional(),
        currentLocation: z.string().optional(),
        clientID: z.coerce.number().optional()
    })
    .partial();

export type OrderUpdateType = z.infer<typeof OrderUpdateSchema>;

export const OrderUpdateOpenAPISchema = generateSchema(OrderUpdateSchema);

export const OrderUpdateMock = generateMock(OrderUpdateSchema);

/* --------------------------------------------------------------- */

export const OrdersReceiptsCreateSchema = z.object({
    ordersIDs: z.array(z.coerce.number()).min(1)
});

export type OrdersReceiptsCreateType = z.infer<typeof OrdersReceiptsCreateSchema>;

export const OrdersReceiptsCreateOpenAPISchema = generateSchema(OrdersReceiptsCreateSchema);

export const OrdersReceiptsCreateMock = generateMock(OrdersReceiptsCreateSchema);

/* --------------------------------------------------------------- */

export const OrderTimelinePieceBaseSchema = z.object({
    date: z.date(),
    by: z.object({
        id: z.coerce.number(),
        name: z.string(),
        role: z.nativeEnum(EmployeeRole || AdminRole || ClientRole)
    })
});

export const OrderTimelinePieceSchema = z
    .discriminatedUnion("type", [
        z.object({
            type: z.literal("STATUS_CHANGE"),
            old: z.nativeEnum(OrderStatus),
            new: z.nativeEnum(OrderStatus)
        }),
        z.object({
            type: z.literal("DELIVERY_AGENT_CHANGE"),
            old: z.object({
                id: z.coerce.number(),
                name: z.string()
            }),
            new: z.object({
                id: z.coerce.number(),
                name: z.string()
            })
        }),
        z.object({
            type: z.literal("CURRENT_LOCATION_CHANGE"),
            old: z.string(),
            new: z.string()
        }),
        z.object({
            type: z.literal("ORDER_DELIVERY")
        }),
        z.object({
            type: z.literal("REPORT_CREATE"),
            reportType: z.nativeEnum(ReportType),
            reportID: z.coerce.number()
        }),
        z.object({
            type: z.literal("REPORT_DELETE"),
            reportType: z.nativeEnum(ReportType)
        }),
        z.object({
            type: z.literal("PAID_AMOUNT_CHANGE"),
            old: z.coerce.number(),
            new: z.coerce.number()
        })
    ])
    .and(OrderTimelinePieceBaseSchema);

export const OrderTimelineSchema = z.array(OrderTimelinePieceSchema);

export type OrderTimelineType = z.infer<typeof OrderTimelineSchema>;

/* --------------------------------------------------------------- */

export const OrderChatNotificationCreateSchema = z.object({
    title: z.string().optional().default("رسالة جديدة"),
    content: z.string().optional()
});

export type OrderChatNotificationCreateType = z.infer<typeof OrderChatNotificationCreateSchema>;

// export const OrderChatNotificationCreateOpenAPISchema = generateSchema(
//     OrderChatNotificationCreateSchema
// );

// export const OrderChatNotificationCreateMock = generateMock(ChatNotificationCreateSchema);

/* --------------------------------------------------------------- */

export const OrdersFiltersSchema = z.object({
    clientID: z.coerce.number().optional(),
    deliveryAgentID: z.coerce.number().optional(),
    companyID: z.coerce.number().optional(),
    automaticUpdateID: z.coerce.number().optional(),
    search: z.string().optional(),
    sort: z.string().optional().default("id:desc"),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    deliveryDate: z.coerce.date().optional(),
    governorate: z.nativeEnum(Governorate).optional(),
    statuses: z.preprocess((val) => {
        if (typeof val === "string") {
            return val.split(",");
        }
        return val;
    }, z.array(z.nativeEnum(OrderStatus)).optional()),
    status: z.nativeEnum(OrderStatus).optional(),
    deliveryType: z.nativeEnum(DeliveryType).optional(),
    storeID: z.coerce.number().optional(),
    repositoryID: z.coerce.number().optional(),
    branchID: z.coerce.number().optional(),
    productID: z.coerce.number().optional(),
    locationID: z.coerce.number().optional(),
    receiptNumber: z.coerce.number().optional(),
    recipientName: z.string().optional(),
    recipientPhone: z.string().optional(),
    recipientAddress: z.string().optional(),
    clientReport: z.string().optional(),
    repositoryReport: z.string().optional(),
    branchReport: z.string().optional(),
    deliveryAgentReport: z.string().optional(),
    governorateReport: z.string().optional(),
    companyReport: z.string().optional(),
    notes: z.string().optional(),
    deleted: z.preprocess((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return val;
    }, z.boolean().default(false).optional()),
    orderID: z.coerce.number().optional(),
    minified: z.preprocess((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return val;
    }, z.boolean().optional())
});

export type OrdersFiltersType = z.infer<typeof OrdersFiltersSchema>;

export const OrdersFiltersOpenAPISchema = generateSchema(OrdersFiltersSchema);

export const OrdersFiltersMock = generateMock(OrdersFiltersSchema);

/* --------------------------------------------------------------- */

export const OrdersStatisticsFiltersSchema = z.object({
    clientID: z.coerce.number().optional(),
    deliveryAgentID: z.coerce.number().optional(),
    companyID: z.coerce.number().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    governorate: z.nativeEnum(Governorate).optional(),
    statuses: z.preprocess((val) => {
        if (typeof val === "string") {
            return val.split(",");
        }
        return val;
    }, z.array(z.nativeEnum(OrderStatus)).optional()),
    deliveryType: z.nativeEnum(DeliveryType).optional(),
    storeID: z.coerce.number().optional(),
    locationID: z.coerce.number().optional(),
    clientReport: z.preprocess((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return val;
    }, z.boolean().optional()),
    repositoryReport: z.preprocess((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return val;
    }, z.boolean().optional()),
    branchReport: z.preprocess((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return val;
    }, z.boolean().optional()),
    deliveryAgentReport: z.preprocess((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return val;
    }, z.boolean().optional()),
    governorateReport: z.preprocess((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return val;
    }, z.boolean().optional()),
    companyReport: z.preprocess((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return val;
    }, z.boolean().optional())
});

export type OrdersStatisticsFiltersType = z.infer<typeof OrdersStatisticsFiltersSchema>;

export const OrdersStatisticsFiltersOpenAPISchema = generateSchema(OrdersStatisticsFiltersSchema);

export const OrdersStatisticsFiltersMock = generateMock(OrdersStatisticsFiltersSchema);

/* --------------------------------------------------------------- */

export const orderSelect = {
    id: true,
    totalCost: true,
    paidAmount: true,
    deliveryCost: true,
    clientNet: true,
    // deliveryAgentNet: true,
    companyNet: true,
    discount: true,
    receiptNumber: true,
    quantity: true,
    weight: true,
    recipientName: true,
    recipientPhones: true,
    recipientAddress: true,
    notes: true,
    details: true,
    status: true,
    deliveryType: true,
    deliveryDate: true,
    currentLocation: true,
    createdAt: true,
    updatedAt: true,
    timeline: true,
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
    deliveryAgent: {
        select: {
            deliveryCost: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    phone: true
                }
            }
        }
    },
    orderProducts: {
        select: {
            quantity: true,
            product: true,
            color: true,
            size: true
        }
    },
    governorate: true,
    location: {
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
    clientReport: {
        select: {
            id: true,
            clientId: true,
            storeId: true,
            report: {
                select: {
                    deleted: true
                }
            }
        }
    },
    repositoryReport: {
        select: {
            id: true,
            repositoryId: true,
            report: {
                select: {
                    deleted: true
                }
            }
        }
    },
    branchReport: {
        select: {
            id: true,
            branchId: true,
            report: {
                select: {
                    deleted: true
                }
            }
        }
    },
    deliveryAgentReport: {
        select: {
            id: true,
            deliveryAgentId: true,
            report: {
                select: {
                    deleted: true
                }
            }
        }
    },
    governorateReport: {
        select: {
            id: true,
            governorate: true,
            report: {
                select: {
                    deleted: true
                }
            }
        }
    },
    companyReport: {
        select: {
            id: true,
            companyId: true,
            report: {
                select: {
                    deleted: true
                }
            }
        }
    },
    company: {
        select: {
            id: true,
            name: true,
            logo: true,
            registrationText: true
        }
    },
    branch: {
        select: {
            id: true,
            name: true
        }
    },
    repository: {
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
} satisfies Prisma.OrderSelect;

export const orderReform = (
    order: Prisma.OrderGetPayload<{
        select: typeof orderSelect;
    }> | null
) => {
    if (!order) {
        return null;
    }
    return {
        ...order,
        // TODO
        client: {
            id: order.client?.user.id,
            name: order.client?.user.name,
            phone: order.client?.user.phone
        },
        deliveryAgent: order.deliveryAgent
            ? {
                  id: order.deliveryAgent.user.id,
                  name: order.deliveryAgent.user.name,
                  phone: order.deliveryAgent.user.phone,
                  deliveryCost: order.deliveryAgent.deliveryCost
              }
            : undefined,
        deleted: order.deleted,
        deletedBy: order.deleted && order.deletedBy,
        deletedAt: order.deletedAt?.toISOString(),
        clientReport: order.clientReport && {
            id: order.clientReport?.id,
            clientId: order.clientReport?.clientId,
            storeId: order.clientReport?.storeId,
            deleted: order.clientReport?.report.deleted
        },
        repositoryReport: order.repositoryReport && {
            id: order.repositoryReport?.id,
            repositoryId: order.repositoryReport?.repositoryId,
            deleted: order.repositoryReport?.report.deleted
        },
        branchReport: order.branchReport && {
            id: order.branchReport?.id,
            branchId: order.branchReport?.branchId,
            deleted: order.branchReport?.report.deleted
        },
        deliveryAgentReport: order.deliveryAgentReport && {
            id: order.deliveryAgentReport?.id,
            deliveryAgentId: order.deliveryAgentReport?.deliveryAgentId,
            deleted: order.deliveryAgentReport?.report.deleted
        },
        governorateReport: order.governorateReport && {
            id: order.governorateReport?.id,
            governorate: order.governorateReport?.governorate,
            deleted: order.governorateReport?.report.deleted
        },
        companyReport: order.companyReport && {
            id: order.companyReport?.id,
            companyId: order.companyReport?.companyId,
            deleted: order.companyReport?.report.deleted
        }
    };
};

/* --------------------------------------------------------------- */

export const statisticsReformed = (statistics: {
    ordersStatisticsByStatus: (Prisma.PickEnumerable<Prisma.OrderGroupByOutputType, "status"[]> & {
        _count: {
            id: number;
        };
        _sum: {
            totalCost: number | null;
        };
    })[];

    ordersStatisticsByGovernorate: (Prisma.PickEnumerable<Prisma.OrderGroupByOutputType, "governorate"[]> & {
        _count: {
            id: number;
        };
        _sum: {
            totalCost: number | null;
        };
    })[];

    allOrdersStatistics: {
        _count: {
            id: number;
        };
        _sum: {
            totalCost: number | null;
        };
    };

    allOrdersStatisticsWithoutClientReport: {
        _count: {
            id: number;
        };
        _sum: {
            totalCost: number | null;
        };
    };

    todayOrdersStatistics: {
        _count: {
            id: number;
        };
        _sum: {
            totalCost: number | null;
        };
    };
}) => {
    const sortingOrder = [
        "WITH_DELIVERY_AGENT",
        "POSTPONED",
        "RESEND",
        "PROCESSING",
        "DELIVERED",
        "PARTIALLY_RETURNED",
        "REPLACED",
        "CHANGE_ADDRESS",
        "RETURNED",
        "REGISTERED",
        "WITH_RECEIVING_AGENT",
        "READY_TO_SEND"
    ];

    const statisticsReformed = {
        ordersStatisticsByStatus: (Object.keys(OrderStatus) as Array<keyof typeof OrderStatus>)
            .map((status) => {
                const statusCount = statistics.ordersStatisticsByStatus.find(
                    (orderStatus: { status: string }) => {
                        return orderStatus.status === status;
                    }
                );
                return {
                    status: status,
                    totalCost: statusCount?._sum.totalCost || 0,
                    count: statusCount?._count.id || 0
                };
            })
            .sort((a, b) => {
                return sortingOrder.indexOf(a.status) - sortingOrder.indexOf(b.status);
            }),

        ordersStatisticsByGovernorate: (Object.keys(Governorate) as Array<keyof typeof Governorate>).map(
            (governorate) => {
                const governorateCount = statistics.ordersStatisticsByGovernorate.find(
                    (orderStatus: { governorate: string }) => {
                        return orderStatus.governorate === governorate;
                    }
                );
                return {
                    governorate: governorate,
                    totalCost: governorateCount?._sum.totalCost || 0,
                    count: governorateCount?._count.id || 0
                };
            }
        ),

        allOrdersStatistics: {
            totalCost: statistics.allOrdersStatistics._sum.totalCost || 0,
            count: statistics.allOrdersStatistics._count.id
        },

        allOrdersStatisticsWithoutClientReport: {
            totalCost: statistics.allOrdersStatisticsWithoutClientReport._sum.totalCost || 0,
            count: statistics.allOrdersStatisticsWithoutClientReport._count.id
        },

        todayOrdersStatistics: {
            totalCost: statistics.todayOrdersStatistics._sum.totalCost || 0,
            count: statistics.todayOrdersStatistics._count.id
        }
    };

    return statisticsReformed;
};
