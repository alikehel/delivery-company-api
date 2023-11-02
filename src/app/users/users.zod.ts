import { generateMock } from "@anatine/zod-mock";
import { generateSchema } from "@anatine/zod-openapi";
import { Permission, Role } from "@prisma/client";
import { z } from "zod";

export const UserCreateSchema = z.object({
    username: z.string().min(3),
    name: z.string().min(3),
    password: z.string().min(6),
    phone: z.string().regex(/^07[3-9][0-9]{8}$/),
    salary: z.coerce.number().min(0),
    repositoryID: z.string().uuid(),
    branchID: z.string().uuid(),
    role: z.nativeEnum(Role),
    permissions: z.preprocess(
        (data) => {
            if (typeof data === "string") {
                return JSON.parse(data);
            }
            return data;
        },
        z.array(z.nativeEnum(Permission))
    ),
    fcm: z.string().optional(),
    avatar: z.string().optional()
});

export type UserCreateType = z.infer<typeof UserCreateSchema>;

export const UserCreateOpenAPISchema = generateSchema(UserCreateSchema);

export const UserCreateMock = generateMock(UserCreateSchema);

export const UserUpdateSchema = UserCreateSchema.partial();

export type UserUpdateType = z.infer<typeof UserUpdateSchema>;

export const UserUpdateOpenAPISchema = generateSchema(UserUpdateSchema);

export const UserUpdateMock = generateMock(UserUpdateSchema);
