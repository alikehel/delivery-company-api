import { generateMock } from "@anatine/zod-mock";
import { generateSchema } from "@anatine/zod-openapi";
import { z } from "zod";

export const ProductCreateSchema = z.object({
    title: z.string(),
    price: z.coerce.number().min(0),
    image: z.string().optional(),
    // stock: z.number().default(0),
    stock: z.coerce.number().min(0),
    category: z.string().optional(),
    colors: z
        .array(
            z.object({
                colorID: z.string().uuid().optional(),
                title: z.string(),
                quantity: z.coerce.number().min(0)
            })
        )
        .optional(),
    sizes: z
        .array(
            z.object({
                sizeID: z.string().uuid().optional(),
                title: z.string(),
                quantity: z.coerce.number().min(0)
            })
        )
        .optional()
});

export type ProductCreateType = z.infer<typeof ProductCreateSchema>;

export const ProductCreateOpenAPISchema = generateSchema(ProductCreateSchema);

export const ProductCreateMock = generateMock(ProductCreateSchema);

export const ProductUpdateSchema = ProductCreateSchema.partial();

export type ProductUpdateType = z.infer<typeof ProductUpdateSchema>;

export const ProductUpdateOpenAPISchema = generateSchema(ProductUpdateSchema);

export const ProductUpdateMock = generateMock(ProductUpdateSchema);
