import { generateMock } from "@anatine/zod-mock";
import { generateSchema } from "@anatine/zod-openapi";
import { z } from "zod";

export const UserSigninSchema = z.object({
    username: z.string(),
    password: z.string(),
    fcm: z.string().optional()
});

export type UserSigninType = z.infer<typeof UserSigninSchema>;

export const UserSigninOpenAPISchema = generateSchema(UserSigninSchema);

export const UserSigninMock = generateMock(UserSigninSchema);
