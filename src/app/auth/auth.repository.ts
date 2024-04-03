import { prisma } from "../../database/db";
import { UserSigninType } from "./auth.dto";
import { userReform, userSelect } from "./auth.responses";

export class AuthRepository {
    async signin(user: UserSigninType) {
        const returnedUser = await prisma.user.findUnique({
            where: {
                username: user.username
            },
            select: userSelect
        });
        return userReform(returnedUser);
    }
}
