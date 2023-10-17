import { z } from "zod";

export const UserSigninSchema = z.object({
    username: z.string({ required_error: "Username is required" }),
    password: z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Password length is less than 6 characters" })
        .max(12, { message: "Password length is more than 12 characters" })
});

export type UserSigninType = z.infer<typeof UserSigninSchema>;
