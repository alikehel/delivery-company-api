import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config";
import { AppError } from "../lib/AppError";
import { loggedInUserType } from "../types/user";

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string;
        // IS USER LOGGED IN
        if (req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        } else {
            return next(new AppError("الرجاء تسجيل الدخول", 401));
        }

        // IS TOKEN VALID
        const { id, name, username, role, permissions, companyID, companyName } = jwt.verify(
            token,
            env.JWT_SECRET as string
        ) as loggedInUserType;

        // TODO: Check if user still exists

        // TODO: Check if user changed password after the token was issued

        // req.user = { id, email, subdomain, role };
        res.locals.user = {
            id,
            name,
            username,
            role,
            permissions,
            companyID,
            companyName
        } as loggedInUserType;

        // GRANT ACCESS
        return next();
    } catch (err) {
        res.status(401).json({
            status: "جلسة تسجيل الدخول منتهية"
        });
    }
};
