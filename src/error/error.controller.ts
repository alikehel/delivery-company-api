import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import Logger from "../lib/logger";
import AppError from "../utils/AppError.util";

const handlePrismaConstraintError = (err: Prisma.PrismaClientKnownRequestError) => {
    // The .code property can be accessed in a type-safe manner
    const errMeta = err.meta as unknown as { target: string };
    const errTarget = errMeta.target[0] as string;
    // return new AppError(
    //     `Unique constraint failed on the (${errTarget}) field (already exists)`,
    //     400
    // );
    return new AppError(`القيمة في حقل (${errTarget}) موجودة مسبقاً`, 400);
};

const handlePrismaDependencyError = (err: Prisma.PrismaClientKnownRequestError) => {
    const errMeta = err.meta as unknown as { cause: string };
    const errCause = errMeta.cause as string;
    // Arabic
    const message = `الرجاء التأكد من عدم وجود عناصر مرتبطة بهذا العنصر (${errCause})`;
    return new AppError(message, 400);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleJWTError = (err: Error) => {
    // const message = err.message;
    const message = "الرجاء تسجيل الدخول مرة أخرى";
    return new AppError(message, 401);
};

const handleZODError = (err: ZodError) => {
    // const message = `${err.issues[0].path[0]}: ${err.issues[0].message}`;
    const message = `الرجاء التأكد من صحة البيانات المدخلة في حقل (${err.issues[0].path[0]})`;
    return new AppError(message, 400);
};

const handleMulterError = (err: Error) => {
    if (err.message === "File too large") {
        return new AppError("حجم الملف اكبر من 5 ميجابايت", 400);
    }
    if (err.message === "Unexpected field") {
        return new AppError("حدث خطأ ما", 400);
    }
    if (err.message === "File too small") {
        return new AppError("حجم الملف صغير جداً", 400);
    }
    if (err.message === "Too many files") {
        return new AppError("عدد الملفات كبير جداً", 400);
    }
    if (err.message === "Unexpected file") {
        return new AppError("حدث خطأ ما", 400);
    }
    if (err.message === "Wrong file type") {
        return new AppError("نوع الملف غير مدعوم", 400);
    }

    return new AppError(err.message, 400);
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
        // console.error("ERROR 💥", err);

        // 2) Send generic message
        res.status(500).json({
            status: "error",
            message: "حدث خطأ ما!"
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
    // console.log(err);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "dev") {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === "prod") {
        let error = { ...err };
        // console.log(error);

        if (error.name === "JsonWebTokenError") {
            error = handleJWTError(error);
        }

        if (error.name === "ZodError") {
            error = handleZODError(error as unknown as ZodError);
        }

        if (error.code === "P2002") {
            error = handlePrismaConstraintError(error as unknown as Prisma.PrismaClientKnownRequestError);
        } else if (error.code === "P2025") {
            error = handlePrismaDependencyError(error as unknown as Prisma.PrismaClientKnownRequestError);
        } else if (error.code?.startsWith("P")) {
            // console.log(error);
            // error = new AppError(
            //     `حدث خطأ ما في قاعدة البيانات [رمز الخطأ: ${error.code}]`,
            //     500
            // );
            error = new AppError(`حدث خطأ ما بقاعدة البيانات [رمز الخطأ: ${error.code}]`, 500);
        } else if (error.name === "MulterError") {
            error = handleMulterError(error);
        }

        sendErrorProd(error, res);
    }

    Logger.error(err.message);
    console.log(err);
};
