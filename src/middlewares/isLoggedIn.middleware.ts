import { Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";
import AppError from "../utils/AppError.util";

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    try {
        let token;
        // IS USER LOGGED IN
        if (
            req.headers.authorization &&
            req.headers.authorization?.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        } else {
            return next(new AppError("Please Log In!", 401));
        }

        // IS TOKEN VALID
        const { id, name, username, role } = jwt.verify(
            token,
            JWT_SECRET as string
        ) as { id: string; name: string; username: string; role: Role[] };

        // TODO: Check if user still exists

        // TODO: Check if user changed password after the token was issued

        // req.user = { id, email, subdomain, role };
        res.locals.user = { id, name, username, role };

        // GRANT ACCESS
        return next();
    } catch (err) {
        res.status(401).json({
            status: "invalid token"
        });
    }
};
