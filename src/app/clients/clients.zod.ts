import { z } from "zod";

export const ClientCreateSchema = z.object({
    name: z.string(),
    phone: z.string(),
    account_type: z.string(),
    token: z.string().optional(),
    password: z.string(),
    branchID: z.string()
});

export type ClientCreateType = z.infer<typeof ClientCreateSchema>;

export const ClientCreateSchemaWithUserID = ClientCreateSchema.extend({
    userID: z.string()
});

export type ClientCreateTypeWithUserID = z.infer<
    typeof ClientCreateSchemaWithUserID
>;

export const ClientUpdateSchema = ClientCreateSchema.partial();

export type ClientUpdateType = z.infer<typeof ClientUpdateSchema>;
