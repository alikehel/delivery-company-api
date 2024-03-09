import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config";
import { AppError } from "../../lib/AppError";
import { catchAsync } from "../../lib/catchAsync";
import { loggedInUserType } from "../../types/user";
import { sendNotification } from "../notifications/helpers/sendNotification";
import { UserModel } from "../users/user.model";
import { AuthModel } from "./auth.model";
import { UserSigninSchema } from "./auth.zod";

const authModel = new AuthModel();
const userModel = new UserModel();

export const signin = catchAsync(async (req, res) => {
    const user = UserSigninSchema.parse(req.body);

    const returnedUser = await authModel.signin(user);

    if (!returnedUser) {
        throw new AppError("User not found", 400);
    }

    const isValidPassword = bcrypt.compareSync(user.password + (env.SECRET as string), returnedUser.password);

    if (!isValidPassword) {
        throw new AppError("كلمة المرور غير صحيحة", 400);
    }

    const token = jwt.sign(
        {
            id: returnedUser?.id,
            name: returnedUser.name,
            username: user.username,
            role: returnedUser.role,
            permissions: returnedUser.permissions,
            companyID: returnedUser.companyID,
            companyName: returnedUser.companyName
        } as loggedInUserType,
        env.JWT_SECRET as string,
        { expiresIn: env.JWT_EXPIRES_IN }
    );
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true
        // expires: JWT_EXPIRES_IN
    });
    res.setHeader("Authorization", `Bearer ${token}`);

    res.status(201).json({
        status: "success",
        // data: { returnedUser },
        token: token
    });

    if (user.fcm) {
        await userModel.updateUser({
            userID: returnedUser.id,
            userData: { fcm: user.fcm }
        });
    }

    await sendNotification({
        userID: returnedUser.id,
        title: "تم تسجيل الدخول",
        content: ""
    });
});
