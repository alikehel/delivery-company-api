// // import { generateMock } from "@anatine/zod-mock";
import { generateSchema } from "@anatine/zod-openapi";
import {
    AdminRole,
    ClientRole,
    DeliveryType,
    EmployeeRole,
    Governorate,
    OrderStatus,
    ReportType,
    SecondaryStatus
} from "@prisma/client";
import { z } from "zod";

export const OrderCreateBaseSchema = z.object({
    receiptNumber: z.number().optional(),
    recipientName: z.string().optional().default("غير معرف"),
    confirmed: z.boolean().optional(),
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
    clientID: z.coerce.number().optional(),
    inquiryEmployeesIDs: z.array(z.coerce.number()).optional(),
    forwardedCompanyID: z.coerce.number().optional()
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

// export const OrderCreateMock = generateMock(OrderCreateSchema);

/* --------------------------------------------------------------- */

// export const OrderUpdateSchema = OrderCreateSchema.partial();

export const OrderUpdateSchema = z
    .object({
        quantity: z.number(),
        paidAmount: z.number(),
        receiptNumber: z.number(),
        confirmed: z.boolean(),
        discount: z.number(),
        status: z.nativeEnum(OrderStatus),
        secondaryStatus: z.nativeEnum(SecondaryStatus),
        deliveryAgentID: z.coerce.number(),
        deliveryDate: z.coerce.date(),
        recipientName: z.string(),
        recipientPhones: z.array(z.string().regex(/^07[3-9][0-9]{8}$/)),
        recipientPhone: z.string().regex(/^07[3-9][0-9]{8}$/),
        recipientAddress: z.string(),
        notes: z.string(),
        details: z.string(),
        repositoryID: z.coerce.number(),
        branchID: z.coerce.number(),
        currentLocation: z.string(),
        clientID: z.coerce.number(),
        inquiryEmployeesIDs: z.array(z.coerce.number()),
        forwardedCompanyID: z.coerce.number().optional()
    })
    .partial();

export type OrderUpdateType = z.infer<typeof OrderUpdateSchema>;

export const OrderUpdateOpenAPISchema = generateSchema(OrderUpdateSchema);

// export const OrderUpdateMock = generateMock(OrderUpdateSchema);

/* --------------------------------------------------------------- */

export const OrdersReceiptsCreateSchema = z.object({
    ordersIDs: z.array(z.coerce.number()).min(1)
});

export type OrdersReceiptsCreateType = z.infer<typeof OrdersReceiptsCreateSchema>;

export const OrdersReceiptsCreateOpenAPISchema = generateSchema(OrdersReceiptsCreateSchema);

// export const OrdersReceiptsCreateMock = generateMock(OrdersReceiptsCreateSchema);

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
            type: z.literal("CLIENT_CHANGE"),
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
            type: z.literal("REPOSITORY_CHANGE"),
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
            type: z.literal("BRANCH_CHANGE"),
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
    confirmed: z.preprocess((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return val;
    }, z.boolean().optional()),
    forwarded: z.preprocess((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return val;
    }, z.boolean().optional()),
    forwardedByID: z.coerce.number().optional(),
    forwardedFromID: z.coerce.number().optional(),
    clientID: z.coerce.number().optional(),
    deliveryAgentID: z.coerce.number().optional(),
    companyID: z.coerce.number().optional(),
    automaticUpdateID: z.coerce.number().optional(),
    search: z.string().optional(),
    sort: z.string().optional().default("id:desc"),
    page: z.coerce.number().optional().default(1),
    size: z.coerce.number().optional().default(10),
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
    // secondaryStatuses: z.preprocess((val) => {
    //     if (typeof val === "string") {
    //         return val.split(",");
    //     }
    //     return val;
    // }, z.array(z.nativeEnum(SecondaryStatus)).optional()),
    // secondaryStatus: z.nativeEnum(SecondaryStatus).optional(),
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
        return false;
    }, z.boolean().default(false).optional()),
    orderID: z.coerce.number().optional(),
    minified: z.preprocess((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return val;
    }, z.boolean().optional()),
    inquiryBranchesIDs: z.array(z.coerce.number()).optional(),
    inquiryLocationsIDs: z.array(z.coerce.number()).optional(),
    inquiryStoresIDs: z.array(z.coerce.number()).optional(),
    inquiryCompaniesIDs: z.array(z.coerce.number()).optional(),
    inquiryDeliveryAgentsIDs: z.array(z.coerce.number()).optional(),
    inquiryGovernorates: z.array(z.nativeEnum(Governorate)).optional(),
    inquiryStatuses: z.array(z.nativeEnum(OrderStatus)).optional()
});

export type OrdersFiltersType = z.infer<typeof OrdersFiltersSchema>;

export const OrdersFiltersOpenAPISchema = generateSchema(OrdersFiltersSchema);

// export const OrdersFiltersMock = generateMock(OrdersFiltersSchema);

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

// export const OrdersStatisticsFiltersMock = generateMock(OrdersStatisticsFiltersSchema);

/* --------------------------------------------------------------- */

export const OrdersReportPDFCreateSchema = z.object({
    ordersIDs: z.array(z.coerce.number()).min(1).or(z.literal("*")),
    type: z.literal("GENERAL").or(z.literal("DELIVERY_AGENT_MANIFEST"))
});

export type OrdersReportPDFCreateType = z.infer<typeof OrdersReportPDFCreateSchema>;
