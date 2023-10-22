import { PrismaClient } from "@prisma/client";
import { SizeCreateType, SizeUpdateType } from "./sizes.zod";

const prisma = new PrismaClient();

export class SizeModel {
    async createSize(data: SizeCreateType) {
        const createdSize = await prisma.size.create({
            data: {
                title: data.title
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true
            }
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
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return sizes;
    }

    async getSize(data: { sizeID: string }) {
        const size = await prisma.size.findUnique({
            where: {
                id: data.sizeID
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return size;
    }

    async updateSize(data: { sizeID: string; sizeData: SizeUpdateType }) {
        const size = await prisma.size.update({
            where: {
                id: data.sizeID
            },
            data: {
                title: data.sizeData.title
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return size;
    }

    async deleteSize(data: { sizeID: string }) {
        const deletedSize = await prisma.size.delete({
            where: {
                id: data.sizeID
            }
        });
        return deletedSize;
    }
}
