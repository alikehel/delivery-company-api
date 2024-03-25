import { Prisma, PrismaClient } from "@prisma/client";
// import { UserCreateType, UserUpdateType } from "./users.zod";

const prisma = new PrismaClient();

const userSelect = {
    id: true,
    avatar: true,
    name: true,
    username: true,
    phone: true,
    employee: {
        select: {
            role: true,
            company: {
                select: {
                    id: true,
                    name: true,
                    logo: true,
                    color: true
                }
            }
        }
    },
    client: {
        select: {
            role: true,
            company: {
                select: {
                    id: true,
                    name: true,
                    logo: true,
                    color: true
                }
            }
        }
    },
    admin: {
        select: {
            // phone: true,
            role: true
        }
    }
} satisfies Prisma.UserSelect;

const userSelectReform = (
    user: Prisma.UserGetPayload<{
        select: typeof userSelect;
    }> | null
) => {
    if (!user) {
        throw new Error("لم يتم العثور على المستخدم");
    }
    return {
        id: user.id,
        avatar: user.avatar || "",
        name: user.name,
        username: user.username,
        phone: user.phone,
        role: user.employee?.role || user.client?.role || user.admin?.role || "",
        company: user.employee?.company || user.client?.company || null
    };
};

export class UserModel {
    // async createUser(data: UserCreateType) {
    //     const createdUser = await prisma.user.create({
    //         data: {
    //             name: data.name,
    //             username: data.username,
    //             password: data.password,
    //             phone: data.phone,
    //             salary: data.salary,
    //             role: data.role,
    //             fcm: data.fcm,
    //             avatar: data.avatar,
    //             permissions: {
    //                 set: data.permissions
    //             },
    //             branch: {
    //                 connect: {
    //                     id: data.branchID
    //                 }
    //             },
    //             repository: {
    //                 connect: {
    //                     id: data.repositoryID
    //                 }
    //             }
    //         },
    //         select: {
    //             id: true,
    //             avatar: true,
    //             name: true,
    //             username: true,
    //             phone: true,
    //             salary: true,
    //             role: true,
    //             permissions: true,
    //             branch: true,
    //             repository: true
    //         }
    //     });
    //     return createdUser;
    // }

    // async getUsersCount() {
    //     const usersCount = await prisma.user.count();
    //     return usersCount;
    // }

    // async getAllUsers(
    //     skip: number,
    //     take: number,
    //     filters: { roles?: UserRole[] }
    // ) {
    //     const users = await prisma.user.findMany({
    //         skip: skip,
    //         take: take,
    //         where: {
    //             AND: [{ role: { in: filters.roles } }]
    //         },
    //         orderBy: {
    //             name: "desc"
    //         },
    //         select: {
    //             id: true,
    //             avatar: true,
    //             name: true,
    //             username: true,
    //             phone: true,
    //             salary: true,
    //             role: true,
    //             permissions: true,
    //             branch: true,
    //             repository: true
    //         }
    //     });
    //     return users;
    // }

    async getUser(data: { userID: number }) {
        const user = await prisma.user.findUnique({
            where: {
                id: data.userID
            },
            select: userSelect
        });
        return userSelectReform(user);
    }

    async updateUser(data: { userID: number; userData: { fcm: string } }) {
        const user = await prisma.user.update({
            where: {
                id: data.userID
            },
            data: {
                fcm: data.userData.fcm
            },
            select: userSelect
        });
        return userSelectReform(user);
    }

    // async deleteUser(data: { userID: number }) {
    //     const deletedUser = await prisma.user.delete({
    //         where: {
    //             id: data.userID
    //         }
    //     });
    //     return deletedUser;
    // }
}
