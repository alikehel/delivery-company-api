import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
import { BannerModel } from "./banner.model";
import { BannerCreateSchema, BannerUpdateSchema } from "./banners.zod";

const bannerModel = new BannerModel();

export const createBanner = catchAsync(async (req, res) => {
    const bannerData = BannerCreateSchema.parse(req.body);
    const companyID = +res.locals.user.companyID;
    const image = req.file
        ? "/" + req.file.path.replace(/\\/g, "/")
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
    const bannersCount = await bannerModel.getBannersCount();
    const size = req.query.size ? +req.query.size : 10;
    const pagesCount = Math.ceil(bannersCount / size);

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

    const banners = await bannerModel.getAllBanners(skip, take);

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: banners
    });
});

export const getBanner = catchAsync(async (req, res) => {
    const bannerID = +req.params["bannerID"];

    const banner = await bannerModel.getBanner({
        bannerID: bannerID
    });

    res.status(200).json({
        status: "success",
        data: banner
    });
});

export const updateBanner = catchAsync(async (req, res) => {
    const bannerID = +req.params["bannerID"];

    const bannerData = BannerUpdateSchema.parse(req.body);
    const image = req.file
        ? "/" + req.file.path.replace(/\\/g, "/")
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
    const bannerID = +req.params["bannerID"];

    await bannerModel.deleteBanner({
        bannerID: bannerID
    });

    res.status(200).json({
        status: "success"
    });
});
