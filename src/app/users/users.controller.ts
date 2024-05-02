import { catchAsync } from "../../lib/catchAsync";
import type { loggedInUserType } from "../../types/user";
import { UsersRepository } from "./users.repository";

const usersRepository = new UsersRepository();

export class UsersController {
    getProfile = catchAsync(async (_req, res) => {
        const loggedInUser = res.locals.user as loggedInUserType;

        const profile = await usersRepository.getUser({
            userID: loggedInUser.id
        });

        res.status(200).json({
            status: "success",
            data: profile
        });
    });
}
