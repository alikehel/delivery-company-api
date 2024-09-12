import { prisma } from "../../database/db";
import type { UserSigninType } from "../auth/auth.dto";
import { userSelect, userSelectReform } from "./users.responses";

export class UsersRepository {
    async getUser(data: { userID: number }) {
        const user = await prisma.user.findUnique({
            where: {
                id: data.userID
            },
            select: userSelect
        });
        return userSelectReform(user);
    }

    async updateUser(data: {
        userID: number;
        userData: { fcm?: string; refreshToken?: string; refreshTokens?: string[] };
    }) {
        const user = await prisma.user.update({
            where: {
                id: data.userID
            },
            data: {
                fcm: data.userData.fcm,
                // Only one session is allowed
                refreshTokens: data.userData.refreshToken
                    ? { set: [data.userData.refreshToken] }
                    : data.userData.refreshTokens
                      ? { set: data.userData.refreshTokens }
                      : undefined
            },
            select: userSelect
        });
        return userSelectReform(user);
    }

    async getUserRefreshTokens(userID: number) {
        const user = await prisma.user.findUnique({
            where: {
                id: userID
            },
            select: {
                refreshTokens: true
            }
        });
        return user?.refreshTokens;
    }

    async logUserLogin(userID: number, data: Omit<UserSigninType, "username" | "password" | "fcm">) {
        await prisma.usersLoginHistory.create({
            data: {
                user: {
                    connect: {
                        id: userID
                    }
                },
                ip: data.ip,
                device: data.device,
                platform: data.platform,
                browser: data.browser,
                location: data.location
                // type: data.type
            }
        });
    }

    async getUsersLoginHistoryPaginated(data: { userID?: number; filters: { page: number; size: number } }) {
        const loginHistory = await prisma.usersLoginHistory.findManyPaginated(
            {
                where: {
                    userId: data.userID
                },
                orderBy: {
                    createdAt: "desc"
                }
            },
            {
                page: data.filters.page,
                size: data.filters.size
            }
        );
        return {
            loginHistory: loginHistory.data,
            pagesCount: loginHistory.pagesCount
        };
    }
}
