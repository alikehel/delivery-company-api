import { generateMock } from "@anatine/zod-mock";
import { generateSchema } from "@anatine/zod-openapi";
import { ClientRole } from "@prisma/client";
import { z } from "zod";

export const ClientCreateSchema = z.object({
    name: z.string().min(3),
    username: z.string().min(3),
    phone: z.string().regex(/^07[3-9][0-9]{8}$/),
    role: z.nativeEnum(ClientRole),
    token: z.string().optional(),
    password: z.string().min(6),
    fcm: z.string().optional(),
    // branchID: z.coerce.number(),
    avatar: z.string().optional(),
    companyID: z.coerce.number().optional()
});

export type ClientCreateType = z.infer<typeof ClientCreateSchema>;

export const ClientCreateOpenAPISchema = generateSchema(ClientCreateSchema);

export const ClientCreateMock = generateMock(ClientCreateSchema);

export const ClientCreateSchemaWithUserID = ClientCreateSchema.extend({
    userID: z.number()
});

export type ClientCreateTypeWithUserID = z.infer<
    typeof ClientCreateSchemaWithUserID
>;

export const ClientUpdateSchema = ClientCreateSchema.partial();

export type ClientUpdateType = z.infer<typeof ClientUpdateSchema>;

export const ClientUpdateOpenAPISchema = generateSchema(ClientUpdateSchema);

export const ClientUpdateMock = generateMock(ClientUpdateSchema);
