import { generateMock } from "@anatine/zod-mock";
import { generateSchema } from "@anatine/zod-openapi";
import { AccountType } from "@prisma/client";
import { z } from "zod";

export const ClientCreateSchema = z.object({
    name: z.string().min(3),
    phone: z.string().regex(/^07[3-9][0-9]{8}$/),
    accountType: z.nativeEnum(AccountType),
    token: z.string().optional(),
    password: z.string().min(6),
    branchID: z.string().uuid(),
    avatar: z.string().optional()
});

export type ClientCreateType = z.infer<typeof ClientCreateSchema>;

export const ClientCreateOpenAPISchema = generateSchema(ClientCreateSchema);

export const ClientCreateMock = generateMock(ClientCreateSchema);

export const ClientCreateSchemaWithUserID = ClientCreateSchema.extend({
    userID: z.string()
});

export type ClientCreateTypeWithUserID = z.infer<
    typeof ClientCreateSchemaWithUserID
>;

export const ClientUpdateSchema = ClientCreateSchema.partial();

export type ClientUpdateType = z.infer<typeof ClientUpdateSchema>;

export const ClientUpdateOpenAPISchema = generateSchema(ClientUpdateSchema);

export const ClientUpdateMock = generateMock(ClientUpdateSchema);
