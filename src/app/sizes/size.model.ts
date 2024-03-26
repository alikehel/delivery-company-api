import { Prisma } from "@prisma/client";
import { prisma } from "../../database/db";
import { SizeCreateType, SizeUpdateType } from "./sizes.zod";

const sizeSelect = {
    id: true,
    title: true,
    createdAt: true,
    updatedAt: true,
    company: {
        select: {
            id: true,
            name: true
        }
    }
} satisfies Prisma.SizeSelect;

// const sizeSelectReform = (size: Prisma.SizeGetPayload<typeof sizeSelect>) => {
//     return {
//         id: size.id,
//         title: size.title,
//         createdAt: size.createdAt,
//         updatedAt: size.updatedAt
//     };
// };

export class SizeModel {
    async createSize(companyID: number, data: SizeCreateType) {
        const createdSize = await prisma.size.create({
            data: {
                title: data.title,
                company: {
                    connect: {
                        id: companyID
                    }
                }
            },
            select: sizeSelect
        });
        return createdSize;
    }

    async getSizesCount(filters: {
        companyID?: number;
    }) {
        const sizesCount = await prisma.size.count({
            where: {
                company: {
                    id: filters.companyID
                }
            }
        });
        return sizesCount;
    }

    async getAllSizes(
        skip: number,
        take: number,
        filters: {
            companyID?: number;
            minified?: boolean;
        }
    ) {
        const where = {
            company: {
                id: filters.companyID
            }
        };

        if (filters.minified === true) {
            const sizes = await prisma.size.findMany({
                skip: skip,
                take: take,
                where: where,
                select: {
                    id: true,
                    title: true
                }
            });
            return sizes;
        }

        const sizes = await prisma.size.findMany({
            skip: skip,
            take: take,
            where: where,
            orderBy: {
                title: "asc"
            },
            select: sizeSelect
        });

        return sizes;
    }

    async getSize(data: { sizeID: number }) {
        const size = await prisma.size.findUnique({
            where: {
                id: data.sizeID
            },
            select: sizeSelect
        });
        return size;
    }

    async updateSize(data: { sizeID: number; sizeData: SizeUpdateType }) {
        const size = await prisma.size.update({
            where: {
                id: data.sizeID
            },
            data: {
                title: data.sizeData.title
            },
            select: sizeSelect
        });
        return size;
    }

    async deleteSize(data: { sizeID: number }) {
        await prisma.size.delete({
            where: {
                id: data.sizeID
            }
        });
        return true;
    }
}
