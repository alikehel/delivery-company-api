import { generateMock } from "@anatine/zod-mock";
import { generateSchema } from "@anatine/zod-openapi";
import { DeliveryType, OrderStatus } from "@prisma/client";
import { z } from "zod";

export const OrderCreateSchema = z.object({
    totalCost: z.number(),
    paidAmount: z.number(),
    totalCostInUSD: z.number(),
    paidAmountInUSD: z.number(),
    discount: z.number(),
    receiptNumber: z.number(),
    quantity: z.number(),
    weight: z.number(),
    recipientName: z.string(),
    recipientPhone: z.string(),
    recipientAddress: z.string(),
    details: z.string(),
    notes: z.string(),
    status: z.nativeEnum(OrderStatus),
    deliveryType: z.nativeEnum(DeliveryType),
    clientID: z.string().uuid(),
    deliveryAgentID: z.string().uuid(),
    deliveryDate: z.date().optional(),
    products: z.array(
        z.object({
            productID: z.string().uuid(),
            quantity: z.number(),
            color: z.string().optional(),
            size: z.string().optional()
        })
    )
});

export type OrderCreateType = z.infer<typeof OrderCreateSchema>;

export const OrderCreateOpenAPISchema = generateSchema(OrderCreateSchema);

export const OrderCreateMock = generateMock(OrderCreateSchema);

export const OrderUpdateSchema = OrderCreateSchema.partial();

export type OrderUpdateType = z.infer<typeof OrderUpdateSchema>;

export const OrderUpdateOpenAPISchema = generateSchema(OrderUpdateSchema);

export const OrderUpdateMock = generateMock(OrderUpdateSchema);
