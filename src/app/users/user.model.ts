import { Prisma, PrismaClient } from "@prisma/client";
// import { UserCreateType, UserUpdateType } from "./users.zod";

const prisma = new PrismaClient();

const userSelect: Prisma.UserSelect = {
    id: true,
    avatar: true,
    name: true,
    username: true,
    phone: true
};

// const userSelectReform = (user: any) => {
//     return {
//         id: user.id,
//         avatar: user.avatar,
//         name: user.name,
//         username: user.username,
//         phone: user.phone
//     };
// };

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
            select: {
                id: true,
                avatar: true,
                name: true,
                username: true,
                phone: true
            }
        });
        return user;
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
        return user;
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
