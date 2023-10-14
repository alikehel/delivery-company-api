import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import AppError from "../utils/AppError.util";

const handlePrismaConstraintError = (
    err: Prisma.PrismaClientKnownRequestError
) => {
    // The .code property can be accessed in a type-safe manner
    const errMeta = err.meta as unknown as { target: string };
    const errTarget = errMeta.target[0] as string;
    return new AppError(
        `Unique constraint failed on the (${errTarget}) field (already exists)`,
        400
    );
};

const handlePrismaDependencyError = (
    err: Prisma.PrismaClientKnownRequestError
) => {
    const errMeta = err.meta as unknown as { cause: string };
    const errCause = errMeta.cause as string;
    return new AppError(`${errCause}`, 400);
};

const handleJWTError = (err: Error) => {
    const message = err.message;
    return new AppError(message, 401);
};

const handleZODError = (err: ZodError) => {
    const message = err.issues[0].message;
    return new AppError(message, 400);
};

const sendErrorDev = (err: AppError & Error, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err: AppError, res: Response) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });

        // Programming or other unknown error: don't leak error details
    } else {
        // 1) Log error
        console.error("ERROR 💥", err);

        // 2) Send generic message
        res.status(500).json({
            status: "error",
            message: "Something went very wrong!"
        });
    }
};

export default (
    err: AppError,
    _req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    _next: NextFunction
) => {
    // console.log(err.stack);
    console.log(err);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "dev") {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === "prod") {
        let error = { ...err };
        console.log(error);

        if (error.name === "JsonWebTokenError") {
            error = handleJWTError(error);
        }

        if (error.name === "ZodError") {
            error = handleZODError(error as unknown as ZodError);
        }

        if (error.code === "P2002") {
            error = handlePrismaConstraintError(
                error as unknown as Prisma.PrismaClientKnownRequestError
            );
        } else if (error.code === "P2025") {
            error = handlePrismaDependencyError(
                error as unknown as Prisma.PrismaClientKnownRequestError
            );
        } else if (error.code && error.code.startsWith("P")) {
            console.log(error);
            error = new AppError(
                `Something probably went wrong with the database [code: ${error.code}]`,
                500
            );
        }

        sendErrorProd(error, res);
    }
};
