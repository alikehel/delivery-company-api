import { z } from "zod";

export const RepositoryCreateSchema = z.object({
    name: z.string()
});

export type RepositoryCreateType = z.infer<typeof RepositoryCreateSchema>;

export const RepositoryUpdateSchema = RepositoryCreateSchema.partial();

export type RepositoryUpdateType = z.infer<typeof RepositoryUpdateSchema>;
