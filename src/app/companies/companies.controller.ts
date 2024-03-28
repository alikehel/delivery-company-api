import * as bcrypt from "bcrypt";
import { env } from "../../config";
import { catchAsync } from "../../lib/catchAsync";
import { loggedInUserType } from "../../types/user";
import { CompanyCreateSchema, CompanyUpdateSchema } from "./companies.zod";
import { CompanyModel } from "./company.model";

const companyModel = new CompanyModel();

export const createCompany = catchAsync(async (req, res) => {
    const loggedInUser = res.locals.user as loggedInUserType;
    const companyData = CompanyCreateSchema.parse(req.body);
    const logo = req.file
        ? `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`
        : undefined;

    const hashedPassword = bcrypt.hashSync(companyData.companyManager.password + (env.SECRET as string), 12);

    const createdCompany = await companyModel.createCompany({
        loggedInUser: loggedInUser,
        companyData: {
            companyData: { ...companyData.companyData, logo },
            companyManager: {
                ...companyData.companyManager,
                password: hashedPassword,
                avatar: logo
            }
        }
    });

    res.status(200).json({
        status: "success",
        data: createdCompany
    });
});

export const getAllCompanies = catchAsync(async (req, res) => {
    const minified = req.query.minified ? req.query.minified === "true" : undefined;

    let size = req.query.size ? +req.query.size : 10;
    if (size > 50 && minified !== true) {
        size = 10;
    }

    let page = 1;
    if (req.query.page && !Number.isNaN(+req.query.page) && +req.query.page > 0) {
        page = +req.query.page;
    }

    const { companies, pagesCount } = await companyModel.getAllCompaniesPaginated({
        page: page,
        size: size,
        minified: minified
    });

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: companies
    });
});

export const getCompany = catchAsync(async (req, res) => {
    const companyID = +req.params.companyID;

    const company = await companyModel.getCompany({
        companyID: +companyID
    });

    res.status(200).json({
        status: "success",
        data: company
    });
});

export const updateCompany = catchAsync(async (req, res) => {
    const companyID = +req.params.companyID;
    const logo = req.file
        ? `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`
        : undefined;

    const companyData = CompanyUpdateSchema.parse(req.body);

    const company = await companyModel.updateCompany({
        companyID: +companyID,
        companyData: { ...companyData, logo }
    });

    res.status(200).json({
        status: "success",
        data: company
    });
});

export const deleteCompany = catchAsync(async (req, res) => {
    const companyID = +req.params.companyID;

    await companyModel.deleteCompany({
        companyID: +companyID
    });

    res.status(200).json({
        status: "success"
    });
});
