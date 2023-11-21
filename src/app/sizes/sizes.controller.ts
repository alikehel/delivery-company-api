import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
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
    const sizesCount = await sizeModel.getSizesCount();
    const size = req.query.size ? +req.query.size : 10;
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

    const sizes = await sizeModel.getAllSizes(skip, take);

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: sizes
    });
});

export const getSize = catchAsync(async (req, res) => {
    const sizeID = +req.params["sizeID"];

    const size = await sizeModel.getSize({
        sizeID: sizeID
    });

    res.status(200).json({
        status: "success",
        data: size
    });
});

export const updateSize = catchAsync(async (req, res) => {
    const sizeID = +req.params["sizeID"];

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
    const sizeID = +req.params["sizeID"];

    await sizeModel.deleteSize({
        sizeID: sizeID
    });

    res.status(200).json({
        status: "success"
    });
});
