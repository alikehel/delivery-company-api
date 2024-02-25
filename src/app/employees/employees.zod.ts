// // import { generateMock } from "@anatine/zod-mock";
import { generateSchema } from "@anatine/zod-openapi";
import { EmployeeRole, Permission } from "@prisma/client";
import { z } from "zod";

export const EmployeeCreateSchema = z.object({
    username: z.string().min(3),
    name: z.string().min(3),
    password: z.string().min(6),
    phone: z.string().regex(/^07[3-9][0-9]{8}$/),
    salary: z.coerce.number().min(0),
    repositoryID: z.coerce.number().optional(),
    branchID: z.coerce.number().optional(),
    role: z.nativeEnum(EmployeeRole),
    permissions: z
        .preprocess(
            (data) => {
                if (typeof data === "string") {
                    return JSON.parse(data);
                }
                return data;
            },
            z.array(z.nativeEnum(Permission))
        )
        .optional(),
    fcm: z.string().optional(),
    avatar: z.string().optional(),
    companyID: z.coerce.number().optional(),
    deliveryCost: z.coerce.number().optional()
});

export type EmployeeCreateType = z.infer<typeof EmployeeCreateSchema>;

export const EmployeeCreateOpenAPISchema = generateSchema(EmployeeCreateSchema);

// export const EmployeeCreateMock = generateMock(EmployeeCreateSchema);

export const EmployeeUpdateSchema = EmployeeCreateSchema.partial();

export type EmployeeUpdateType = z.infer<typeof EmployeeUpdateSchema>;

export const EmployeeUpdateOpenAPISchema = generateSchema(EmployeeUpdateSchema);

// export const EmployeeUpdateMock = generateMock(EmployeeUpdateSchema);
