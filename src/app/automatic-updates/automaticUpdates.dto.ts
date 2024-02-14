import { generateMock } from "@anatine/zod-mock";
import { generateSchema } from "@anatine/zod-openapi";
import { AutomaticUpdateReturnCondition, Governorate, OrderStatus, Prisma } from "@prisma/client";
import { z } from "zod";

/* --------------------------------------------------------------- */

export const AutomaticUpdateCreateSchema = z.object({
    orderStatus: z.nativeEnum(OrderStatus),
    governorate: z.nativeEnum(Governorate),
    returnCondition: z.nativeEnum(AutomaticUpdateReturnCondition),
    updateAt: z.number().min(0).max(24),
    checkAfter: z.number().min(0).max(480),
    enabled: z.boolean().default(true)
});

export type AutomaticUpdateCreateType = z.infer<typeof AutomaticUpdateCreateSchema>;

export const AutomaticUpdateCreateOpenAPISchema = generateSchema(AutomaticUpdateCreateSchema);

export const AutomaticUpdateCreateMock = generateMock(AutomaticUpdateCreateSchema);

/* --------------------------------------------------------------- */

export const AutomaticUpdateUpdateSchema = AutomaticUpdateCreateSchema.partial();

export type AutomaticUpdateUpdateType = z.infer<typeof AutomaticUpdateUpdateSchema>;

export const AutomaticUpdateUpdateOpenAPISchema = generateSchema(AutomaticUpdateUpdateSchema);

export const AutomaticUpdateUpdateMock = generateMock(AutomaticUpdateUpdateSchema);

/* --------------------------------------------------------------- */

export const automaticUpdateSelect = {
    id: true,
    createdAt: true,
    updatedAt: true,
    company: {
        select: {
            id: true,
            name: true
        }
    },
    orderStatus: true,
    governorate: true,
    returnCondition: true,
    updateAt: true,
    checkAfter: true,
    enabled: true
} satisfies Prisma.AutomaticUpdateSelect;

// export const automaticUpdateReform = (automaticUpdate: any) => {
//     return {
//         id: automaticUpdate.id,
//         title: automaticUpdate.title,
//         createdAt: automaticUpdate.createdAt,
//         updatedAt: automaticUpdate.updatedAt
//     };
// };

/* --------------------------------------------------------------- */
