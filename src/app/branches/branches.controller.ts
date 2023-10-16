import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
import { BranchModel } from "./branch.model";
import { BranchCreateSchema, BranchUpdateSchema } from "./branches.zod";

const branchModel = new BranchModel();

export const createBranch = catchAsync(async (req, res) => {
    const branchData = BranchCreateSchema.parse(req.body);

    const createdBranch = await branchModel.createBranch(branchData);

    res.status(200).json({
        status: "success",
        data: createdBranch
    });
});

export const getAllBranches = catchAsync(async (req, res) => {
    const branchesCount = await branchModel.getBranchesCount();
    const pagesCount = Math.ceil(branchesCount / 10);

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

    const branches = await branchModel.getAllBranches(skip, take);

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: branches
    });
});

export const getBranch = catchAsync(async (req, res) => {
    const branchID = req.params["branchID"];

    const branch = await branchModel.getBranch({
        branchID: branchID
    });

    res.status(200).json({
        status: "success",
        data: branch
    });
});

export const updateBranch = catchAsync(async (req, res) => {
    const branchID = req.params["branchID"];

    const branchData = BranchUpdateSchema.parse(req.body);

    const branch = await branchModel.updateBranch({
        branchID: branchID,
        branchData: branchData
    });

    res.status(200).json({
        status: "success",
        data: branch
    });
});

export const deleteBranch = catchAsync(async (req, res) => {
    const branchID = req.params["branchID"];

    await branchModel.deleteBranch({
        branchID: branchID
    });

    res.status(200).json({
        status: "success"
    });
});
