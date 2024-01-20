import { AdminRole } from "@prisma/client";
import { loggedInUserType } from "../../types/user";
import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
import { AutomaticUpdateModel } from "./automaticUpdate.model";
import { AutomaticUpdateCreateSchema, AutomaticUpdateUpdateSchema } from "./automaticUpdates.zod";

const automaticUpdateModel = new AutomaticUpdateModel();

export const createAutomaticUpdate = catchAsync(async (req, res) => {
    const automaticUpdateData = AutomaticUpdateCreateSchema.parse(req.body);
    const companyID = +res.locals.user.companyID;

    const createdAutomaticUpdate = await automaticUpdateModel.createAutomaticUpdate(
        companyID,
        automaticUpdateData
    );

    res.status(200).json({
        status: "success",
        data: createdAutomaticUpdate
    });
});

export const getAllAutomaticUpdates = catchAsync(async (req, res) => {
    // Filters
    const loggedInUser = res.locals.user as loggedInUserType;
    let companyID: number | undefined;
    if (Object.keys(AdminRole).includes(loggedInUser.role)) {
        companyID = req.query.company_id ? +req.query.company_id : undefined;
    } else if (loggedInUser.companyID) {
        companyID = loggedInUser.companyID;
    }

    const automaticUpdatesCount = await automaticUpdateModel.getAutomaticUpdatesCount({
        companyID: companyID
    });
    const size = req.query.size ? +req.query.size : 10;
    const pagesCount = Math.ceil(automaticUpdatesCount / size);

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

    const automaticUpdates = await automaticUpdateModel.getAllAutomaticUpdates(skip, take, {
        companyID: companyID
    });

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: automaticUpdates
    });
});

export const getAutomaticUpdate = catchAsync(async (req, res) => {
    const automaticUpdateID = +req.params.automaticUpdateID;

    const automaticUpdate = await automaticUpdateModel.getAutomaticUpdate({
        automaticUpdateID: automaticUpdateID
    });

    res.status(200).json({
        status: "success",
        data: automaticUpdate
    });
});

export const updateAutomaticUpdate = catchAsync(async (req, res) => {
    const automaticUpdateID = +req.params.automaticUpdateID;

    const automaticUpdateData = AutomaticUpdateUpdateSchema.parse(req.body);

    const automaticUpdate = await automaticUpdateModel.updateAutomaticUpdate({
        automaticUpdateID: automaticUpdateID,
        automaticUpdateData: automaticUpdateData
    });

    res.status(200).json({
        status: "success",
        data: automaticUpdate
    });
});

export const deleteAutomaticUpdate = catchAsync(async (req, res) => {
    const automaticUpdateID = +req.params.automaticUpdateID;

    await automaticUpdateModel.deleteAutomaticUpdate({
        automaticUpdateID: automaticUpdateID
    });

    res.status(200).json({
        status: "success"
    });
});
