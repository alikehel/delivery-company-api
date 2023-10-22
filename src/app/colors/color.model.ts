import { PrismaClient } from "@prisma/client";
import { ColorCreateType, ColorUpdateType } from "./colors.zod";

const prisma = new PrismaClient();

export class ColorModel {
    async createColor(data: ColorCreateType) {
        const createdColor = await prisma.color.create({
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
        return createdColor;
    }

    async getColorsCount() {
        const colorsCount = await prisma.color.count();
        return colorsCount;
    }

    async getAllColors(skip: number, take: number) {
        const colors = await prisma.color.findMany({
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
        return colors;
    }

    async getColor(data: { colorID: string }) {
        const color = await prisma.color.findUnique({
            where: {
                id: data.colorID
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return color;
    }

    async updateColor(data: { colorID: string; colorData: ColorUpdateType }) {
        const color = await prisma.color.update({
            where: {
                id: data.colorID
            },
            data: {
                title: data.colorData.title
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return color;
    }

    async deleteColor(data: { colorID: string }) {
        const deletedColor = await prisma.color.delete({
            where: {
                id: data.colorID
            }
        });
        return deletedColor;
    }
}
