import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET, SECRET } from "../../config/config";
import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
import sendNotification from "../notifications/helpers/sendNotification";
import { AuthModel } from "./auth.model";
import { UserSigninSchema } from "./auth.zod";

const authModel = new AuthModel();

export const signin = catchAsync(async (req, res) => {
    const user = UserSigninSchema.parse(req.body);

    const returnedUser = await authModel.signin(user);

    if (!returnedUser) {
        throw new AppError("User not found", 400);
    }

    const isValidPassword = bcrypt.compareSync(
        user.password + (SECRET as string),
        returnedUser.password
    );

    if (!isValidPassword) {
        throw new AppError("Password is not correct", 400);
    }

    const token = jwt.sign(
        {
            id: returnedUser?.id,
            name: returnedUser.name,
            username: user.username,
            role: returnedUser.role
        },
        JWT_SECRET as string,
        { expiresIn: JWT_EXPIRES_IN }
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

    await sendNotification({
        userID: returnedUser.id,
        title: "Welcome",
        content: "Welcome to our website"
    });
});
