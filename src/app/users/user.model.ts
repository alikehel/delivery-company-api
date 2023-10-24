import { PrismaClient } from "@prisma/client";
import { UserCreateType, UserUpdateType } from "./users.zod";

const prisma = new PrismaClient();

export class UserModel {
    async createUser(data: UserCreateType) {
        const createdUser = await prisma.user.create({
            data: {
                name: data.name,
                username: data.username,
                password: data.password,
                phone: data.phone,
                salary: data.salary,
                role: data.role,
                fcm: data.fcm,
                permissions: {
                    set: data.permissions
                },
                branch: {
                    connect: {
                        id: data.branchID
                    }
                },
                repository: {
                    connect: {
                        id: data.repositoryID
                    }
                }
            },
            select: {
                id: true,
                name: true,
                username: true,
                phone: true,
                salary: true,
                role: true,
                permissions: true,
                branch: true,
                repository: true
            }
        });
        return createdUser;
    }

    async getUsersCount() {
        const usersCount = await prisma.user.count();
        return usersCount;
    }

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
                salary: true,
                role: true,
                permissions: true,
                branch: true,
                repository: true
            }
        });
        return users;
    }

    async getUser(data: { userID: string }) {
        const user = await prisma.user.findUnique({
            where: {
                id: data.userID
            },
            select: {
                id: true,
                name: true,
                username: true,
                phone: true,
                salary: true,
                role: true,
                permissions: true,
                branch: true,
                repository: true
            }
        });
        return user;
    }

    async updateUser(data: { userID: string; userData: UserUpdateType }) {
        const user = await prisma.user.update({
            where: {
                id: data.userID
            },
            data: {
                name: data.userData.name,
                username: data.userData.username,
                password: data.userData.password,
                phone: data.userData.phone,
                salary: data.userData.salary,
                role: data.userData.role,
                permissions: data.userData.permissions,
                fcm: data.userData.fcm,
                branch: data.userData.branchID
                    ? {
                          connect: {
                              id: data.userData.branchID
                          }
                      }
                    : undefined,
                repository: data.userData.repositoryID
                    ? {
                          connect: {
                              id: data.userData.repositoryID
                          }
                      }
                    : undefined
            },
            select: {
                id: true,
                name: true,
                username: true,
                phone: true,
                salary: true,
                role: true,
                permissions: true,
                branch: true,
                repository: true
            }
        });
        return user;
    }

    async deleteUser(data: { userID: string }) {
        const deletedUser = await prisma.user.delete({
            where: {
                id: data.userID
            }
        });
        return deletedUser;
    }
}
