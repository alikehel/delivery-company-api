import { generateMock } from "@anatine/zod-mock";
import { generateSchema } from "@anatine/zod-openapi";
import {
    AutomaticUpdateReturnCondition,
    Governorate,
    OrderStatus
} from "@prisma/client";
import { z } from "zod";

/* --------------------------------------------------------------- */

export const AutomaticUpdateCreateSchema = z.object({
    orderStatus: z.nativeEnum(OrderStatus),
    governorate: z.nativeEnum(Governorate),
    returnCondition: z.nativeEnum(AutomaticUpdateReturnCondition),
    updateAt: z.number().min(0).max(24),
    checkAfter: z.number().min(0).max(480)
});

export type AutomaticUpdateCreateType = z.infer<
    typeof AutomaticUpdateCreateSchema
>;

export const AutomaticUpdateCreateOpenAPISchema = generateSchema(
    AutomaticUpdateCreateSchema
);

export const AutomaticUpdateCreateMock = generateMock(
    AutomaticUpdateCreateSchema
);

/* --------------------------------------------------------------- */

export const AutomaticUpdateUpdateSchema =
    AutomaticUpdateCreateSchema.partial();

export type AutomaticUpdateUpdateType = z.infer<
    typeof AutomaticUpdateUpdateSchema
>;

export const AutomaticUpdateUpdateOpenAPISchema = generateSchema(
    AutomaticUpdateUpdateSchema
);

export const AutomaticUpdateUpdateMock = generateMock(
    AutomaticUpdateUpdateSchema
);

/* --------------------------------------------------------------- */
