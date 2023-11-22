import { Prisma, PrismaClient } from "@prisma/client";
import { SizeCreateType, SizeUpdateType } from "./sizes.zod";

const prisma = new PrismaClient();

const sizeSelect: Prisma.SizeSelect = {
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
};

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

    async getSizesCount() {
        const sizesCount = await prisma.size.count();
        return sizesCount;
    }

    async getAllSizes(skip: number, take: number) {
        const sizes = await prisma.size.findMany({
            skip: skip,
            take: take,
            orderBy: {
                title: "desc"
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
