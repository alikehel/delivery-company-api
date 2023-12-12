import { generateMock } from "@anatine/zod-mock";
import { generateSchema } from "@anatine/zod-openapi";
import {
    AdminRole,
    ClientRole,
    DeliveryType,
    EmployeeRole,
    Governorate,
    OrderStatus,
    ReportType
} from "@prisma/client";
import { z } from "zod";

export const OrderCreateBaseSchema = z.object({
    recipientName: z.string(),
    recipientPhone: z.string(),
    recipientAddress: z.string(),
    notes: z.string().optional(),
    details: z.string().optional(),
    deliveryType: z.nativeEnum(DeliveryType),
    governorate: z.nativeEnum(Governorate),
    locationID: z.coerce.number().optional(),
    storeID: z.coerce.number(),
    repositoryID: z.coerce.number().optional(),
    branchID: z.coerce.number().optional()
    // paidAmount: z.number(),
    // totalCostInUSD: z.number(),
    // paidAmountInUSD: z.number(),
    // discount: z.number(),
    // receiptNumber: z.number(),
    // status: z.nativeEnum(OrderStatus),
    // clientID: z.coerce.number(),
    // deliveryAgentID: z.coerce.number(),
    // deliveryDate: z.date().optional(),
    // // repositoryID: z.coerce.number().optional(),
    // // branchID: z.coerce.number().optional(),
});

export const OrderCreateSchema = z
    .discriminatedUnion("withProducts", [
        z.object({
            withProducts: z.literal(true),
            products: z.array(
                z.object({
                    productID: z.coerce.number(),
                    quantity: z.number().min(1),
                    colorID: z.coerce.number().optional(),
                    sizeID: z.coerce.number().optional()
                })
            )
        }),
        z.object({
            withProducts: z.literal(false),
            totalCost: z.number(),
            quantity: z.number(),
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
        // totalCostInUSD: z.number(),
        // paidAmountInUSD: z.number(),
        discount: z.number(),
        status: z.nativeEnum(OrderStatus),
        deliveryAgentID: z.coerce.number(),
        deliveryDate: z.coerce.date().optional(),
        recipientName: z.string(),
        recipientPhone: z.string(),
        recipientAddress: z.string(),
        notes: z.string().optional(),
        details: z.string().optional(),
        repositoryID: z.coerce.number().optional(),
        branchID: z.coerce.number().optional(),
        currentLocation: z.string().optional()
    })
    .partial();

export type OrderUpdateType = z.infer<typeof OrderUpdateSchema>;

export const OrderUpdateOpenAPISchema = generateSchema(OrderUpdateSchema);

export const OrderUpdateMock = generateMock(OrderUpdateSchema);

/* --------------------------------------------------------------- */

export const OrdersReceiptsCreateSchema = z.object({
    ordersIDs: z.array(z.coerce.number()).min(1)
});

export type OrdersReceiptsCreateType = z.infer<
    typeof OrdersReceiptsCreateSchema
>;

export const OrdersReceiptsCreateOpenAPISchema = generateSchema(
    OrdersReceiptsCreateSchema
);

export const OrdersReceiptsCreateMock = generateMock(
    OrdersReceiptsCreateSchema
);

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
            type: z.literal("DELIVERY_DATE_CHANGE")
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
