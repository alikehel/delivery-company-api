import { PrismaClient } from "@prisma/client";
import { BannerCreateType, BannerUpdateType } from "./banners.zod";

const prisma = new PrismaClient();

export class BannerModel {
    async createBanner(data: BannerCreateType) {
        const createdBanner = await prisma.banner.create({
            data: {
                title: data.title,
                content: data.content,
                image: data.image,
                url: data.url
            }
        });
        return createdBanner;
    }

    async getBannersCount() {
        const bannersCount = await prisma.banner.count();
        return bannersCount;
    }

    async getAllBanners(skip: number, take: number) {
        const banners = await prisma.banner.findMany({
            skip: skip,
            take: take,
            orderBy: {
                createdAt: "desc"
            }
        });
        return banners;
    }

    async getBanner(data: { bannerID: string }) {
        const banner = await prisma.banner.findUnique({
            where: {
                id: data.bannerID
            }
        });
        return banner;
    }

    async updateBanner(data: {
        bannerID: string;
        bannerData: BannerUpdateType;
    }) {
        const banner = await prisma.banner.update({
            where: {
                id: data.bannerID
            },
            data: {
                title: data.bannerData.title,
                content: data.bannerData.content,
                image: data.bannerData.image,
                url: data.bannerData.url
            }
        });
        return banner;
    }

    async deleteBanner(data: { bannerID: string }) {
        const deletedBanner = await prisma.banner.delete({
            where: {
                id: data.bannerID
            }
        });
        return deletedBanner;
    }
}
