import { NextFunction, Request, Response } from "express";

import {
    AdminRole,
    ClientRole,
    EmployeeRole,
    Permission
} from "@prisma/client";
import AppError from "../utils/AppError.util";

export const isAutherized = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Check if the user is logged in and has the appropriate role
        const { role } = res.locals.user as {
            id: string;
            name: string;
            username: string;
            role: AdminRole | EmployeeRole | ClientRole;
            permissions: Permission[];
            companyID: number;
        };

        if (res.locals.user) {
            if (allowedRoles.includes(role)) {
                return next(); // If user is authorized, call the next middleware function
            } else {
                return next(new AppError("ليس مصرح لك القيام بهذا الفعل", 401));
            }
        } else {
            return next(new AppError("ليس مصرح لك القيام بهذا الفعل", 401));
        }
    };
};
