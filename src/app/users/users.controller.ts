import { catchAsync } from "../../lib/catchAsync";
import { loggedInUserType } from "../../types/user";
import { UserModel } from "./user.model";

const userModel = new UserModel();

export const getProfile = catchAsync(async (_req, res) => {
    const loggedInUser = res.locals.user as loggedInUserType;

    const profile = await userModel.getUser({
        userID: loggedInUser.id
    });

    res.status(200).json({
        status: "success",
        data: profile
    });
});
