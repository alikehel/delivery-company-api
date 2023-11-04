import { generateMock } from "@anatine/zod-mock";
import { generateSchema } from "@anatine/zod-openapi";
import { DeliveryType, Governorate, OrderStatus } from "@prisma/client";
import { z } from "zod";

export const OrderCreateBaseSchema = z.object({
    recipientName: z.string(),
    recipientPhone: z.string(),
    recipientAddress: z.string(),
    notes: z.string().optional(),
    deliveryType: z.nativeEnum(DeliveryType),
    governorate: z.nativeEnum(Governorate),
    locationID: z.string().uuid().optional(),
    storeID: z.string().uuid()
    // paidAmount: z.number(),
    // totalCostInUSD: z.number(),
    // paidAmountInUSD: z.number(),
    // discount: z.number(),
    // receiptNumber: z.number(),
    // status: z.nativeEnum(OrderStatus),
    // clientID: z.string().uuid(),
    // deliveryAgentID: z.string().uuid(),
    // deliveryDate: z.date().optional(),
    // // repositoryID: z.string().uuid().optional(),
    // // branchID: z.string().uuid().optional(),
});

export const OrderCreateSchema = z
    .discriminatedUnion("withProducts", [
        z.object({
            withProducts: z.literal(true),
            products: z.array(
                z.object({
                    productID: z.string().uuid(),
                    quantity: z.number().min(1),
                    color: z.string().optional(),
                    size: z.string().optional()
                })
            )
        }),
        z.object({
            withProducts: z.literal(false),
            totalCost: z.number(),
            quantity: z.number(),
            weight: z.number()
        })
    ])
    .and(OrderCreateBaseSchema);

export type OrderCreateType = z.infer<typeof OrderCreateSchema>;

export const OrderCreateOpenAPISchema = generateSchema(OrderCreateSchema);

export const OrderCreateMock = generateMock(OrderCreateSchema);

// export const OrderUpdateSchema = OrderCreateSchema.partial();

export const OrderUpdateSchema = z
    .object({
        paidAmount: z.number(),
        // totalCostInUSD: z.number(),
        // paidAmountInUSD: z.number(),
        discount: z.number(),
        status: z.nativeEnum(OrderStatus),
        deliveryAgentID: z.string().uuid(),
        deliveryDate: z.date().optional(),
        recipientName: z.string(),
        recipientPhone: z.string(),
        recipientAddress: z.string(),
        notes: z.string().optional()
        // repositoryID: z.string().uuid().optional(),
        // branchID: z.string().uuid().optional(),
    })
    .partial();

export type OrderUpdateType = z.infer<typeof OrderUpdateSchema>;

export const OrderUpdateOpenAPISchema = generateSchema(OrderUpdateSchema);

export const OrderUpdateMock = generateMock(OrderUpdateSchema);
