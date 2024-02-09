import { AdminRole, Governorate } from "@prisma/client";
import { loggedInUserType } from "../../types/user";
import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
import { BranchModel } from "./branch.model";
import { BranchCreateSchema, BranchUpdateSchema } from "./branches.zod";

const branchModel = new BranchModel();

export const createBranch = catchAsync(async (req, res) => {
    const branchData = BranchCreateSchema.parse(req.body);
    const companyID = +res.locals.user.companyID;

    const createdBranch = await branchModel.createBranch(companyID, branchData);

    res.status(200).json({
        status: "success",
        data: createdBranch
    });
});

export const getAllBranches = catchAsync(async (req, res) => {
    // Filters
    const loggedInUser = res.locals.user as loggedInUserType;
    let companyID: number | undefined;
    if (Object.keys(AdminRole).includes(loggedInUser.role)) {
        companyID = req.query.company_id ? +req.query.company_id : undefined;
    } else if (loggedInUser.companyID) {
        companyID = loggedInUser.companyID;
    }

    const governorate = req.query.governorate?.toString().toUpperCase() as Governorate | undefined;

    const locationID = req.query.location_id ? +req.query.location_id : undefined;

    // Pagination
    const branchesCount = await branchModel.getBranchesCount({
        companyID: companyID
    });
    const size = req.query.size ? +req.query.size : 10;
    const pagesCount = Math.ceil(branchesCount / size);
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

    // Query
    const branches = await branchModel.getAllBranches(skip, take, {
        companyID: companyID,
        governorate: governorate,
        locationID: locationID
    });

    // Response
    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: branches
    });
});

export const getBranch = catchAsync(async (req, res) => {
    const branchID = +req.params.branchID;

    const branch = await branchModel.getBranch({
        branchID: branchID
    });

    res.status(200).json({
        status: "success",
        data: branch
    });
});

export const updateBranch = catchAsync(async (req, res) => {
    const branchID = +req.params.branchID;

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
    const branchID = +req.params.branchID;

    await branchModel.deleteBranch({
        branchID: branchID
    });

    res.status(200).json({
        status: "success"
    });
});
