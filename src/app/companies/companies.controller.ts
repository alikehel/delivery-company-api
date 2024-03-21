import * as bcrypt from "bcrypt";
import { env } from "../../config";
import { AppError } from "../../lib/AppError";
import { catchAsync } from "../../lib/catchAsync";
import { CompanyCreateSchema, CompanyUpdateSchema } from "./companies.zod";
import { CompanyModel } from "./company.model";

const companyModel = new CompanyModel();

export const createCompany = catchAsync(async (req, res) => {
    console.info({
        body: req.body
    });

    console.info({
        stringify: JSON.stringify(req.body)
    });

    console.info({ parse: JSON.parse(req.body) });

    console.info({ parseStringified: JSON.parse(JSON.stringify(req.body)) });

    const companyData = CompanyCreateSchema.parse(req.body);
    const logo = req.file
        ? `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`
        : undefined;

    const hashedPassword = bcrypt.hashSync(companyData.companyManager.password + (env.SECRET as string), 12);

    const createdCompany = await companyModel.createCompany({
        companyData: { ...companyData.companyData, logo },
        companyManager: {
            ...companyData.companyManager,
            password: hashedPassword,
            avatar: logo
        }
    });

    res.status(200).json({
        status: "success",
        data: createdCompany
    });
});

export const getAllCompanies = catchAsync(async (req, res) => {
    const minified = req.query.minified ? req.query.minified === "true" : undefined;

    const companiesCount = await companyModel.getCompaniesCount();
    let size = req.query.size ? +req.query.size : 10;
    if (size > 50 && minified !== true) {
        size = 10;
    }
    const pagesCount = Math.ceil(companiesCount / size);

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

    const companies = await companyModel.getAllCompanies(skip, take, {
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
