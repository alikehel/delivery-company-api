import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
import { ColorModel } from "./color.model";
import { ColorCreateSchema, ColorUpdateSchema } from "./colors.zod";

const colorModel = new ColorModel();

export const createColor = catchAsync(async (req, res) => {
    const colorData = ColorCreateSchema.parse(req.body);

    const createdColor = await colorModel.createColor(colorData);

    res.status(200).json({
        status: "success",
        data: createdColor
    });
});

export const getAllColors = catchAsync(async (req, res) => {
    const colorsCount = await colorModel.getColorsCount();
    const pagesCount = Math.ceil(colorsCount / 10);

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
    const take = page * 10;
    const skip = (page - 1) * 10;
    // if (Number.isNaN(offset)) {
    //     skip = 0;
    // }

    const colors = await colorModel.getAllColors(skip, take);

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: colors
    });
});

export const getColor = catchAsync(async (req, res) => {
    const colorID = req.params["colorID"];

    const color = await colorModel.getColor({
        colorID: colorID
    });

    res.status(200).json({
        status: "success",
        data: color
    });
});

export const updateColor = catchAsync(async (req, res) => {
    const colorID = req.params["colorID"];

    const colorData = ColorUpdateSchema.parse(req.body);

    const color = await colorModel.updateColor({
        colorID: colorID,
        colorData: colorData
    });

    res.status(200).json({
        status: "success",
        data: color
    });
});

export const deleteColor = catchAsync(async (req, res) => {
    const colorID = req.params["colorID"];

    await colorModel.deleteColor({
        colorID: colorID
    });

    res.status(200).json({
        status: "success"
    });
});
