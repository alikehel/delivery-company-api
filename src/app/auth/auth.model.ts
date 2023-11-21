import { Prisma, PrismaClient } from "@prisma/client";
import { UserSigninType } from "./auth.zod";

const prisma = new PrismaClient();

const userSelect: Prisma.UserSelect = {
    id: true,
    password: true,
    username: true,
    name: true,
    admin: true,
    employee: true,
    client: true
};

// const userReform = (user: any) => {
//     return {
//         id: user.id,
//         username: user.username,
//         name: user.name,
//         admin: user.admin,
//         employee: user.employee,
//         client: user.client
//     };
// };

export class AuthModel {
    async signin(user: UserSigninType) {
        const returnedUser = await prisma.user.findUnique({
            where: {
                username: user.username
            },
            select: userSelect
        });
        return returnedUser;
    }
}
