import { generateMock } from "@anatine/zod-mock";
import { generateSchema } from "@anatine/zod-openapi";
import { z } from "zod";

export const UserSigninSchema = z.object({
    username: z.string(),
    password: z.string()
});

export type UserSigninType = z.infer<typeof UserSigninSchema>;

export const UserSigninOpenApiSchema = generateSchema(UserSigninSchema);

export const UserSigninMock = generateMock(UserSigninSchema);
