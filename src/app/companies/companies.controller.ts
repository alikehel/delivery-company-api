import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
import { CompanyCreateSchema, CompanyUpdateSchema } from "./companies.zod";
import { CompanyModel } from "./company.model";

const companyModel = new CompanyModel();

export const createCompany = catchAsync(async (req, res) => {
    const companyData = CompanyCreateSchema.parse(req.body);
    const logo = req.file ? `${req.baseUrl}/${req.file.path.replace(/\\/g, "/")}` : undefined;

    const createdCompany = await companyModel.createCompany({
        ...companyData,
        logo
    });

    res.status(200).json({
        status: "success",
        data: createdCompany
    });
});

export const getAllCompanies = catchAsync(async (req, res) => {
    const companiesCount = await companyModel.getCompaniesCount();
    const size = req.query.size ? +req.query.size : 10;
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

    const companies = await companyModel.getAllCompanies(skip, take);

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
    const logo = req.file ? `${req.baseUrl}/${req.file.path.replace(/\\/g, "/")}` : undefined;

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
