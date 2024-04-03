import { AdminRole } from "@prisma/client";
import { catchAsync } from "../../lib/catchAsync";
import { loggedInUserType } from "../../types/user";
import { SizeModel } from "./size.repository";
import { SizeCreateSchema, SizeUpdateSchema } from "./sizes.dto";

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

    const minified = req.query.minified ? req.query.minified === "true" : undefined;

    let size = req.query.size ? +req.query.size : 10;
    if (size > 50 && minified !== true) {
        size = 10;
    }
    let page = 1;
    if (req.query.page && !Number.isNaN(+req.query.page) && +req.query.page > 0) {
        page = +req.query.page;
    }

    const { sizes, pagesCount } = await sizeModel.getAllSizesPaginated({
        page: page,
        size: size,
        companyID: companyID,
        minified: minified
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
