import { generateMock } from "@anatine/zod-mock";
import { generateSchema } from "@anatine/zod-openapi";
import { Permission, Role } from "@prisma/client";
import { z } from "zod";

export const UserCreateSchema = z.object({
    username: z.string({ required_error: "Username is required" }),
    name: z.string({ required_error: "Name is required" }),
    password: z
        .string({ required_error: "Password is required" })
        .min(8, { message: "Password length is less than 6 characters" })
        .max(12, { message: "Password length is more than 12 characters" }),
    phone: z.string({ required_error: "Phone is required" }),
    salary: z.number({ required_error: "Salary is required" }),
    repositoryID: z.string({ required_error: "Repository is required" }),
    branchID: z.string({ required_error: "Branch is required" }),
    role: z.nativeEnum(Role),
    permissions: z.array(z.nativeEnum(Permission))
});

export type UserCreateType = z.infer<typeof UserCreateSchema>;

export const UserCreateOpenApiSchema = generateSchema(UserCreateSchema);

export const UserCreateMock = generateMock(UserCreateSchema);

export const UserUpdateSchema = UserCreateSchema.partial();

export type UserUpdateType = z.infer<typeof UserUpdateSchema>;

export const UserUpdateOpenApiSchema = generateSchema(UserUpdateSchema);

export const UserUpdateMock = generateMock(UserUpdateSchema);
