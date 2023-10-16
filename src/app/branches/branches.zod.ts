import { Governorate } from "@prisma/client";
import { z } from "zod";

export const BranchCreateSchema = z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    governorate: z.nativeEnum(Governorate)
});

export type BranchCreateType = z.infer<typeof BranchCreateSchema>;

export const BranchUpdateSchema = BranchCreateSchema.partial();

export type BranchUpdateType = z.infer<typeof BranchUpdateSchema>;
