import { Governorate } from "@prisma/client";
import { z } from "zod";

export const LocationCreateSchema = z.object({
    name: z.string(),
    governorate: z.nativeEnum(Governorate),
    branchID: z.string(),
    driversIDs: z.array(z.string())
});

export type LocationCreateType = z.infer<typeof LocationCreateSchema>;

export const LocationUpdateSchema = LocationCreateSchema.partial();

export type LocationUpdateType = z.infer<typeof LocationUpdateSchema>;
