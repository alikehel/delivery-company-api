import { PrismaClient } from "@prisma/client";
// import organizations from "../database/seed/data/organizations";
// import AppError from "../utils/AppError.util";
import { UserSigninType } from "./users.zod";

const prisma = new PrismaClient();

export class UserModel {
    // async signup(
    //     user: UserSignUpType,
    //     subdomain: string
    // ): Promise<{
    //     id: string;
    //     email: string;
    //     role: string;
    //     organizationSubdomain: string;
    // } | null> {
    //     const createdUser = await prisma.user.create({
    //         data: {
    //             ...user
    //         },
    //         select: {
    //             id: true,
    //             role: true,
    //             organizationSubdomain: true
    //         }
    //     });
    //     return createdUser;
    // }

    async signin(user: UserSigninType) {
        const returnedUser = await prisma.user.findUnique({
            where: {
                username: user.username
            },
            select: {
                id: true,
                roles: true,
                password: true,
                username: true,
                name: true
            }
        });
        return returnedUser;
    }

    // async getUserID(email: string, subdomain: string): Promise<string | null> {
    //     const data = (await prisma.user.findUnique({
    //         where: {
    //             emailSubdomain: {
    //                 email: email,
    //                 organizationSubdomain: subdomain
    //             }
    //         },
    //         select: { id: true }
    //     })) as unknown as { id: string };
    //     return data.id;
    // }

    async getAllUsers(skip: number, take: number) {
        const users = await prisma.user.findMany({
            skip: skip,
            take: take,
            orderBy: {
                name: "desc"
            },
            select: {
                id: true,
                name: true,
                username: true,
                phone: true,
                roles: true
            }
        });
        return users;
    }

    async getUsersCount() {
        const count = await prisma.user.count({});
        return count;
    }

    // async getUser(subdomain: string, userID: string) {
    //     const user = await prisma.user.findUnique({
    //         where: {
    //             id: userID
    //         },
    //         select: {
    //             id: true,
    //             firstName: true,
    //             lastName: true,
    //             email: true,
    //             phoneNumber: true,
    //             role: true,
    //             profilePicture: true,
    //             courses: {
    //                 select: {
    //                     name: true,
    //                     code: true
    //                 }
    //             }
    //         }
    //     });
    //     return user;
    // }

    // async updateUser(
    //     subdomain: string,
    //     userID: string,
    //     userData: UserUpdateType
    // ) {
    //     const user = await prisma.user.update({
    //         where: {
    //             id: userID
    //         },
    //         data: {
    //             courses: {
    //                 set: [],
    //                 connect: userData.courses?.map((courseCode) => ({
    //                     codeSubdomain: {
    //                         code: courseCode,
    //                         organizationSubdomain: subdomain
    //                     }
    //                 }))
    //             },
    //             firstName: userData.firstName,
    //             lastName: userData.lastName,
    //             phoneNumber: userData.phoneNumber,
    //             role: userData.role
    //         },
    //         select: {
    //             id: true,
    //             firstName: true,
    //             lastName: true,
    //             email: true,
    //             phoneNumber: true,
    //             role: true,
    //             courses: {
    //                 select: {
    //                     name: true,
    //                     code: true
    //                 }
    //             }
    //         }
    //     });
    //     return user;
    // }

    // async deleteUser(subdomain: string, userID: string) {
    //     const user = await prisma.user.delete({
    //         where: {
    //             id: userID
    //         }
    //     });
    //     return user;
    // }

    // async updateProfilePicture(subdomain: string, userID: string, url: string) {
    //     const user = await prisma.user.update({
    //         where: {
    //             id: userID
    //         },
    //         data: {
    //             profilePicture: url
    //         },
    //         select: {
    //             profilePicture: true
    //         }
    //     });
    //     return user;
    // }

    // async getEnrolledCourses(subdomain: string, userID: string) {
    //     const courses = await prisma.user
    //         .findUnique({
    //             where: {
    //                 id: userID
    //             }
    //         })
    //         .courses({
    //             select: {
    //                 name: true,
    //                 code: true
    //             }
    //         });
    //     return courses;
    // }
}
