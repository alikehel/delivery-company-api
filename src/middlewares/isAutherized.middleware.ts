import { NextFunction, Request, Response } from "express";

import { Role } from "@prisma/client";
import AppError from "../utils/AppError.util";

export const isAutherized = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Check if the user is logged in and has the appropriate role
        const { roles } = res.locals.user as {
            id: string;
            name: string;
            username: string;
            roles: Role[];
        };

        if (res.locals.user) {
            roles.forEach((role) => {
                if (allowedRoles.includes(role)) {
                    return next(); // If user is authorized, call the next middleware function
                }
            });
        } else {
            return next(new AppError("You are not authorized to do this", 401));
        }
    };
};
