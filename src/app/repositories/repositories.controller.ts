import { AdminRole } from "@prisma/client";
import { AppError } from "../../lib/AppError";
import { catchAsync } from "../../lib/catchAsync";
import { loggedInUserType } from "../../types/user";
import { RepositoryCreateSchema, RepositoryUpdateSchema } from "./repositories.zod";
import { RepositoryModel } from "./repository.model";

const repositoryModel = new RepositoryModel();

export const createRepository = catchAsync(async (req, res) => {
    const repositoryData = RepositoryCreateSchema.parse(req.body);
    const companyID = +res.locals.user.companyID;

    const createdRepository = await repositoryModel.createRepository(companyID, repositoryData);

    res.status(200).json({
        status: "success",
        data: createdRepository
    });
});

export const getAllRepositories = catchAsync(async (req, res) => {
    // Filters
    const loggedInUser = res.locals.user as loggedInUserType;
    let companyID: number | undefined;
    if (Object.keys(AdminRole).includes(loggedInUser.role)) {
        companyID = req.query.company_id ? +req.query.company_id : undefined;
    } else if (loggedInUser.companyID) {
        companyID = loggedInUser.companyID;
    }

    const minified = req.query.minified ? req.query.minified === "true" : undefined;

    const repositoriesCount = await repositoryModel.getRepositoriesCount({
        companyID: companyID
    });
    let size = req.query.size ? +req.query.size : 10;
    if (size > 50 && minified !== true) {
        size = 10;
    }
    const pagesCount = Math.ceil(repositoriesCount / size);

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

    const repositories = await repositoryModel.getAllRepositories(skip, take, {
        companyID: companyID,
        minified: minified
    });

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: repositories
    });
});

export const getRepository = catchAsync(async (req, res) => {
    const repositoryID = +req.params.repositoryID;

    const repository = await repositoryModel.getRepository({
        repositoryID: repositoryID
    });

    res.status(200).json({
        status: "success",
        data: repository
    });
});

export const updateRepository = catchAsync(async (req, res) => {
    const repositoryID = +req.params.repositoryID;

    const repositoryData = RepositoryUpdateSchema.parse(req.body);

    const repository = await repositoryModel.updateRepository({
        repositoryID: repositoryID,
        repositoryData: repositoryData
    });

    res.status(200).json({
        status: "success",
        data: repository
    });
});

export const deleteRepository = catchAsync(async (req, res) => {
    const repositoryID = +req.params.repositoryID;

    await repositoryModel.deleteRepository({
        repositoryID: repositoryID
    });

    res.status(200).json({
        status: "success"
    });
});
