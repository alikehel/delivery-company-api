import { generateMock } from "@anatine/zod-mock";
import { generateSchema } from "@anatine/zod-openapi";
import { z } from "zod";

export const CompanyCreateSchema = z.object({
    name: z.string().min(3),
    phone: z.string().regex(/^07[3-9][0-9]{8}$/),
    website: z.string().url().optional(),
    logo: z.string().optional(),
    registrationText: z.string().optional(),
    governoratePrice: z.coerce.number().min(0),
    deliveryAgentFee: z.coerce.number().min(0),
    baghdadPrice: z.coerce.number().min(0),
    additionalPriceForEvery500000IraqiDinar: z.coerce.number().min(0),
    additionalPriceForEveryKilogram: z.coerce.number().min(0),
    additionalPriceForRemoteAreas: z.coerce.number().min(0),
    orderStatusAutomaticUpdate: z.coerce.boolean().optional()
});

export type CompanyCreateType = z.infer<typeof CompanyCreateSchema>;

export const CompanyCreateOpenAPISchema = generateSchema(CompanyCreateSchema);

export const CompanyCreateMock = generateMock(CompanyCreateSchema);

export const CompanyUpdateSchema = CompanyCreateSchema.partial();

export type CompanyUpdateType = z.infer<typeof CompanyUpdateSchema>;

export const CompanyUpdateOpenAPISchema = generateSchema(CompanyUpdateSchema);

export const CompanyUpdateMock = generateMock(CompanyUpdateSchema);
