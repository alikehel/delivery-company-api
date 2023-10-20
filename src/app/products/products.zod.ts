import { generateMock } from "@anatine/zod-mock";
import { generateSchema } from "@anatine/zod-openapi";
import { z } from "zod";

export const ProductCreateSchema = z.object({
    title: z.string(),
    price: z.number(),
    image: z.string().optional(),
    stock: z.number().default(0)
});

export type ProductCreateType = z.infer<typeof ProductCreateSchema>;

export const ProductCreateOpenAPISchema = generateSchema(ProductCreateSchema);

export const ProductCreateMock = generateMock(ProductCreateSchema);

export const ProductUpdateSchema = ProductCreateSchema.partial();

export type ProductUpdateType = z.infer<typeof ProductUpdateSchema>;

export const ProductUpdateOpenAPISchema = generateSchema(ProductUpdateSchema);

export const ProductUpdateMock = generateMock(ProductUpdateSchema);
