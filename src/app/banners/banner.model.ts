import { Prisma, PrismaClient } from "@prisma/client";
import { BannerCreateType, BannerUpdateType } from "./banners.zod";

const prisma = new PrismaClient();

const bannerSelect: Prisma.BannerSelect = {
    id: true,
    title: true,
    content: true,
    image: true,
    url: true,
    createdAt: true,
    company: {
        select: {
            id: true,
            name: true
        }
    }
};

// const bannerReform = (banner: any) => {
//     return {
//         id: banner.id,
//         title: banner.title,
//         content: banner.content,
//         image: banner.image,
//         url: banner.url,
//         createdAt: banner.createdAt,
//         company: banner.company
//     };
// };

export class BannerModel {
    async createBanner(companyID: number, data: BannerCreateType) {
        const createdBanner = await prisma.banner.create({
            data: {
                title: data.title,
                content: data.content,
                image: data.image,
                url: data.url,
                company: {
                    connect: {
                        id: companyID
                    }
                }
            },
            select: bannerSelect
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
            },
            select: bannerSelect
        });
        return banners;
    }

    async getBanner(data: { bannerID: number }) {
        const banner = await prisma.banner.findUnique({
            where: {
                id: data.bannerID
            },
            select: bannerSelect
        });
        return banner;
    }

    async updateBanner(data: {
        bannerID: number;
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
            },
            select: bannerSelect
        });
        return banner;
    }

    async deleteBanner(data: { bannerID: number }) {
        await prisma.banner.delete({
            where: {
                id: data.bannerID
            }
        });
        return true;
    }
}
