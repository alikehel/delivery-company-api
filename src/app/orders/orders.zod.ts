import { generateMock } from "@anatine/zod-mock";
import { generateSchema } from "@anatine/zod-openapi";
import { DeliveryType, Governorate, OrderStatus } from "@prisma/client";
import { z } from "zod";

export const OrderCreateBaseSchema = z.object({
    recipientName: z.string(),
    recipientPhone: z.string(),
    recipientAddress: z.string(),
    notes: z.string().optional(),
    details: z.string().optional(),
    deliveryType: z.nativeEnum(DeliveryType),
    governorate: z.nativeEnum(Governorate),
    locationID: z.number().optional(),
    storeID: z.number()
    // paidAmount: z.number(),
    // totalCostInUSD: z.number(),
    // paidAmountInUSD: z.number(),
    // discount: z.number(),
    // receiptNumber: z.number(),
    // status: z.nativeEnum(OrderStatus),
    // clientID: z.number(),
    // deliveryAgentID: z.number(),
    // deliveryDate: z.date().optional(),
    // // repositoryID: z.number().optional(),
    // // branchID: z.number().optional(),
});

export const OrderCreateSchema = z
    .discriminatedUnion("withProducts", [
        z.object({
            withProducts: z.literal(true),
            products: z.array(
                z.object({
                    productID: z.number(),
                    quantity: z.number().min(1),
                    colorID: z.number().optional(),
                    sizeID: z.number().optional()
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
        deliveryAgentID: z.number(),
        deliveryDate: z.coerce.date().optional(),
        recipientName: z.string(),
        recipientPhone: z.string(),
        recipientAddress: z.string(),
        notes: z.string().optional(),
        details: z.string().optional()
        // repositoryID: z.number().optional(),
        // branchID: z.number().optional(),
    })
    .partial();

export type OrderUpdateType = z.infer<typeof OrderUpdateSchema>;

export const OrderUpdateOpenAPISchema = generateSchema(OrderUpdateSchema);

export const OrderUpdateMock = generateMock(OrderUpdateSchema);

/* --------------------------------------------------------------- */

export const OrdersReceiptsCreateSchema = z.object({
    ordersIDs: z.array(z.number()).min(1)
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
