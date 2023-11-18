import { Role } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { SECRET } from "../../config/config";
import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
import { UserModel } from "./user.model";
import { UserCreateSchema, UserUpdateSchema } from "./users.zod";

const userModel = new UserModel();

export const createUser = catchAsync(async (req, res) => {
    const userData = UserCreateSchema.parse(req.body);
    const avatar = req.file
        ? "/" + req.file.path.replace(/\\/g, "/")
        : undefined;

    const hashedPassword = bcrypt.hashSync(
        userData.password + (SECRET as string),
        12
    );

    const createdUser = await userModel.createUser({
        ...userData,
        password: hashedPassword,
        avatar: avatar
    });

    res.status(200).json({
        status: "success",
        data: createdUser
    });
});

export const getAllUsers = catchAsync(async (req, res) => {
    const usersCount = await userModel.getUsersCount();
    const size = req.query.size ? +req.query.size : 10;
    const pagesCount = Math.ceil(usersCount / size);

    const roles = req.query.roles
        ?.toString()
        .toUpperCase()
        .split(",") as Role[];

    // console.log(roles);

    if (pagesCount === 0) {
        res.status(200).json({
            status: "success",
            page: 1,
            pagesCount: 1,
            data: []
        });
        return;
    }

    let page = 1;
    if (
        req.query.page &&
        !Number.isNaN(+req.query.page) &&
        +req.query.page > 0
    ) {
        page = +req.query.page;
    }
    if (page > pagesCount) {
        throw new AppError("Page number out of range", 400);
    }
    const take = page * size;
    const skip = (page - 1) * size;
    // if (Number.isNaN(offset)) {
    //     skip = 0;
    // }

    const users = await userModel.getAllUsers(skip, take, {
        roles: roles
    });

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: users
    });
});

export const getUser = catchAsync(async (req, res) => {
    const userID = req.params["userID"];

    const user = await userModel.getUser({
        userID: userID
    });

    res.status(200).json({
        status: "success",
        data: user
    });
});

export const updateUser = catchAsync(async (req, res) => {
    const userData = UserUpdateSchema.parse(req.body);
    const userID = req.params["userID"];

    if (req.file) {
        userData.avatar = "/" + req.file.path.replace(/\\/g, "/");
    }

    if (userData.password) {
        const hashedPassword = bcrypt.hashSync(
            userData.password + (SECRET as string),
            12
        );
        userData.password = hashedPassword;
    }

    const updatedUser = await userModel.updateUser({
        userID: userID,
        userData
    });

    res.status(200).json({
        status: "success",
        data: { ...updatedUser }
    });
});

export const deleteUser = catchAsync(async (req, res) => {
    const userID = req.params["userID"];

    await userModel.deleteUser({
        userID: userID
    });

    res.status(200).json({
        status: "success"
    });
});
