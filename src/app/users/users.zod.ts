import { z } from "zod";
// import { zu } from "zod_utilz";

//--------------------- Users ---------------------//

export const UserSigninSchema = z.object({
    username: z.string({ required_error: "Username is required" }),
    password: z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Password length is less than 6 characters" })
        .max(12, { message: "Password length is more than 12 characters" })
});

export type UserSigninType = z.infer<typeof UserSigninSchema>;

// export const UserSignUpSchema = z.object({
//     email: z
//         .string({ required_error: "Email is required" })
//         .email({ message: "Invalid email" }),
//     password: z
//         .string({ required_error: "Password is required" })
//         .min(6, { message: "Password length is less than 6 characters" })
//         .max(12, { message: "Password length is more than 12 characters" }),
//     // passwordConfirm: z
//     //     .string({ required_error: "Password confirm is required" })
//     //     .min(6, { message: "Password length is less than 6 characters" })
//     //     .max(12, { message: "Password length is more than 12 characters" })
//     //     .transform((data) => {}),
//     firstName: z
//         .string({ required_error: "First name is required" })
//         .min(2, { message: "First name length is less than 2 characters" })
//         .max(16, {
//             message: "First name length is more than 6 characters"
//         }),
//     lastName: z
//         .string({ required_error: "Last name is required" })
//         .min(2, { message: "Last name length is less than 2 characters" })
//         .max(16, {
//             message: "Last name length is more than 16 characters"
//         }),
//     phoneNumber: z
//         .string({ required_error: "Phone number is required" })
//         .startsWith("+20", {
//             message: "Don't forget to add the country code"
//         })
//         .length(13, { message: "Phone number is invalid" })
// });

// export type UserSignUpType = z.infer<typeof UserSignUpSchema>;

// export const UserUpdateSchema = z.object({
//     firstName: z
//         .string({ required_error: "First name is required" })
//         .min(2, { message: "First name length is less than 2 characters" })
//         .max(16, {
//             message: "First name length is more than 6 characters"
//         })
//         .optional(),
//     lastName: z
//         .string({ required_error: "Last name is required" })
//         .min(2, { message: "Last name length is less than 2 characters" })
//         .max(16, {
//             message: "Last name length is more than 16 characters"
//         })
//         .optional(),
//     phoneNumber: z
//         .string({ required_error: "Phone number is required" })
//         .startsWith("+20", {
//             message: "Don't forget to add the country code"
//         })
//         .length(13, { message: "Phone number is invalid" })
//         .optional(),
//     role: z.enum(["STUDENT", "TEACHER"]).optional(),
//     courses: z.array(z.string()).optional()
// });

// export type UserUpdateType = z.infer<typeof UserUpdateSchema>;
