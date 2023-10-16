import { z } from "zod";

export const BranchCreateSchema = z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    locationID: z.string()
});

export type BranchCreateType = z.infer<typeof BranchCreateSchema>;

export const BranchUpdateSchema = BranchCreateSchema.partial();

export type BranchUpdateType = z.infer<typeof BranchUpdateSchema>;
