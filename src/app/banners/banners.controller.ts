import { AdminRole } from "@prisma/client";
import { catchAsync } from "../../lib/catchAsync";
import { loggedInUserType } from "../../types/user";
import { BannerModel } from "./banner.model";
import { BannerCreateSchema, BannerUpdateSchema } from "./banners.zod";

const bannerModel = new BannerModel();

export const createBanner = catchAsync(async (req, res) => {
    const bannerData = BannerCreateSchema.parse(req.body);
    const companyID = +res.locals.user.companyID;
    const image = req.file
        ? `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`
        : undefined;

    const createdBanner = await bannerModel.createBanner(companyID, {
        ...bannerData,
        image
    });

    res.status(200).json({
        status: "success",
        data: createdBanner
    });
});

export const getAllBanners = catchAsync(async (req, res) => {
    // Filters
    const loggedInUser = res.locals.user as loggedInUserType;
    let companyID: number | undefined;
    if (Object.keys(AdminRole).includes(loggedInUser.role)) {
        companyID = req.query.company_id ? +req.query.company_id : undefined;
    } else if (loggedInUser.companyID) {
        companyID = loggedInUser.companyID;
    }

    // Pagination
    let size = req.query.size ? +req.query.size : 10;
    if (size > 50) {
        size = 10;
    }
    let page = 1;
    if (req.query.page && !Number.isNaN(+req.query.page) && +req.query.page > 0) {
        page = +req.query.page;
    }

    // Query
    const { banners, pagesCount } = await bannerModel.getAllBannersPaginated({
        page: page,
        size: size,
        companyID: companyID
    });

    // Response
    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: banners
    });
});

export const getBanner = catchAsync(async (req, res) => {
    const bannerID = +req.params.bannerID;

    const banner = await bannerModel.getBanner({
        bannerID: bannerID
    });

    res.status(200).json({
        status: "success",
        data: banner
    });
});

export const updateBanner = catchAsync(async (req, res) => {
    const bannerID = +req.params.bannerID;

    const bannerData = BannerUpdateSchema.parse(req.body);
    const image = req.file
        ? `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`
        : undefined;

    const banner = await bannerModel.updateBanner({
        bannerID: bannerID,
        bannerData: { ...bannerData, image }
    });

    res.status(200).json({
        status: "success",
        data: banner
    });
});

export const deleteBanner = catchAsync(async (req, res) => {
    const bannerID = +req.params.bannerID;

    await bannerModel.deleteBanner({
        bannerID: bannerID
    });

    res.status(200).json({
        status: "success"
    });
});
