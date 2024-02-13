import { AdminRole } from "@prisma/client";
import { AppError } from "../../lib/AppError";
import { catchAsync } from "../../lib/catchAsync";
import { loggedInUserType } from "../../types/user";
import { SizeModel } from "./size.model";
import { SizeCreateSchema, SizeUpdateSchema } from "./sizes.zod";

const sizeModel = new SizeModel();

export const createSize = catchAsync(async (req, res) => {
    const sizeData = SizeCreateSchema.parse(req.body);
    const companyID = +res.locals.user.companyID;

    const createdSize = await sizeModel.createSize(companyID, sizeData);

    res.status(200).json({
        status: "success",
        data: createdSize
    });
});

export const getAllSizes = catchAsync(async (req, res) => {
    // Filters
    const loggedInUser = res.locals.user as loggedInUserType;
    let companyID: number | undefined;
    if (Object.keys(AdminRole).includes(loggedInUser.role)) {
        companyID = req.query.company_id ? +req.query.company_id : undefined;
    } else if (loggedInUser.companyID) {
        companyID = loggedInUser.companyID;
    }

    const onlyTitleAndID = req.query.only_title_and_id ? req.query.only_title_and_id === "true" : undefined;

    const sizesCount = await sizeModel.getSizesCount({
        companyID: companyID
    });
    let size = req.query.size ? +req.query.size : 10;
    if (size > 50 && onlyTitleAndID !== true) {
        size = 10;
    }
    const pagesCount = Math.ceil(sizesCount / size);

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
    if (req.query.page && !Number.isNaN(+req.query.page) && +req.query.page > 0) {
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

    const sizes = await sizeModel.getAllSizes(skip, take, {
        companyID: companyID,
        onlyTitleAndID: onlyTitleAndID
    });

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: sizes
    });
});

export const getSize = catchAsync(async (req, res) => {
    const sizeID = +req.params.sizeID;

    const size = await sizeModel.getSize({
        sizeID: sizeID
    });

    res.status(200).json({
        status: "success",
        data: size
    });
});

export const updateSize = catchAsync(async (req, res) => {
    const sizeID = +req.params.sizeID;

    const sizeData = SizeUpdateSchema.parse(req.body);

    const size = await sizeModel.updateSize({
        sizeID: sizeID,
        sizeData: sizeData
    });

    res.status(200).json({
        status: "success",
        data: size
    });
});

export const deleteSize = catchAsync(async (req, res) => {
    const sizeID = +req.params.sizeID;

    await sizeModel.deleteSize({
        sizeID: sizeID
    });

    res.status(200).json({
        status: "success"
    });
});
