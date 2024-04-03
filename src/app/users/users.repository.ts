// import { UserCreateType, UserUpdateType } from "./users.zod";
import { prisma } from "../../database/db";
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
}
