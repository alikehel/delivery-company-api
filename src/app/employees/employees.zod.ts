// // import { generateMock } from "@anatine/zod-mock";
import { generateSchema } from "@anatine/zod-openapi";
import { EmployeeRole, Governorate, OrderStatus, Permission } from "@prisma/client";
import { z } from "zod";

export const EmployeeCreateSchema = z.object({
    username: z.string().min(3),
    name: z.string().min(3),
    password: z.string().min(6),
    phone: z.string().regex(/^07[3-9][0-9]{8}$/),
    salary: z.coerce.number().min(0).optional(),
    storesIDs: z
        .preprocess((val) => {
            if (typeof val === "string") return JSON.parse(val);
            return val;
        }, z.array(z.coerce.number()).optional())
        .optional(),
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
    deliveryCost: z.coerce.number().optional(),
    inquiryBranchesIDs: z
        .preprocess((val) => {
            if (typeof val === "string") return JSON.parse(val);
            return val;
        }, z.array(z.coerce.number()).optional())
        .optional(),
    inquiryLocationsIDs: z
        .preprocess((val) => {
            if (typeof val === "string") return JSON.parse(val);
            return val;
        }, z.array(z.coerce.number()).optional())
        .optional(),
    inquiryStoresIDs: z
        .preprocess((val) => {
            if (typeof val === "string") return JSON.parse(val);
            return val;
        }, z.array(z.coerce.number()).optional())
        .optional(),
    inquiryCompaniesIDs: z
        .preprocess((val) => {
            if (typeof val === "string") return JSON.parse(val);
            return val;
        }, z.array(z.coerce.number()).optional())
        .optional(),
    inquiryDeliveryAgentsIDs: z
        .preprocess((val) => {
            if (typeof val === "string") return JSON.parse(val);
            return val;
        }, z.array(z.coerce.number()).optional())
        .optional(),
    inquiryGovernorates: z
        .preprocess((val) => {
            if (typeof val === "string") return JSON.parse(val);
            return val;
        }, z.array(z.nativeEnum(Governorate)).optional())
        .optional(),
    inquiryStatuses: z
        .preprocess((val) => {
            if (typeof val === "string") return JSON.parse(val);
            return val;
        }, z.array(z.nativeEnum(OrderStatus)).optional())
        .optional()
});

export type EmployeeCreateType = z.infer<typeof EmployeeCreateSchema>;

export const EmployeeCreateOpenAPISchema = generateSchema(EmployeeCreateSchema);

// export const EmployeeCreateMock = generateMock(EmployeeCreateSchema);

export const EmployeeUpdateSchema = EmployeeCreateSchema.partial();

export type EmployeeUpdateType = z.infer<typeof EmployeeUpdateSchema>;

export const EmployeeUpdateOpenAPISchema = generateSchema(EmployeeUpdateSchema);

// export const EmployeeUpdateMock = generateMock(EmployeeUpdateSchema);
