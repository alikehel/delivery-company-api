import { generateMock } from "@anatine/zod-mock";
import { generateSchema } from "@anatine/zod-openapi";
import { z } from "zod";

export const TenantCreateSchema = z.object({
    name: z.string().min(3),
    phone: z.string().regex(/^07[3-9][0-9]{8}$/),
    website: z.string().url().optional(),
    logo: z.string().optional(),
    registrationText: z.string().optional(),
    // take string then convert to number
    governoratePrice: z.coerce.number().min(0),
    deliveryAgentFee: z.coerce.number().min(0),
    baghdadPrice: z.coerce.number().min(0),
    additionalPriceForEvery500000IraqiDinar: z.coerce.number().min(0),
    additionalPriceForEveryKilogram: z.coerce.number().min(0),
    additionalPriceForRemoteAreas: z.coerce.number().min(0),
    orderStatusAutomaticUpdate: z.boolean().optional()
});

export type TenantCreateType = z.infer<typeof TenantCreateSchema>;

export const TenantCreateOpenAPISchema = generateSchema(TenantCreateSchema);

export const TenantCreateMock = generateMock(TenantCreateSchema);

export const TenantUpdateSchema = TenantCreateSchema.partial();

export type TenantUpdateType = z.infer<typeof TenantUpdateSchema>;

export const TenantUpdateOpenAPISchema = generateSchema(TenantUpdateSchema);

export const TenantUpdateMock = generateMock(TenantUpdateSchema);
