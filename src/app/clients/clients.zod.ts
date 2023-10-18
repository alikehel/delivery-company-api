import { generateMock } from "@anatine/zod-mock";
import { generateSchema } from "@anatine/zod-openapi";
import { AccountType } from "@prisma/client";
import { z } from "zod";

export const ClientCreateSchema = z.object({
    name: z.string(),
    phone: z.string(),
    accountType: z.nativeEnum(AccountType),
    token: z.string().optional(),
    password: z.string(),
    branchID: z.string()
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
