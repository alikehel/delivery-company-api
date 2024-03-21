import { Prisma, PrismaClient } from "@prisma/client";
import { ColorCreateType, ColorUpdateType } from "./colors.zod";

const prisma = new PrismaClient();

const colorSelect = {
    id: true,
    title: true,
    code: true,
    createdAt: true,
    updatedAt: true,
    company: {
        select: {
            id: true,
            name: true
        }
    }
} satisfies Prisma.ColorSelect;

// const colorReform = (color: any) => {
//     return {
//         id: color.id,
//         title: color.title,
//         createdAt: color.createdAt,
//         updatedAt: color.updatedAt
//     };
// };

export class ColorModel {
    async createColor(companyID: number, data: ColorCreateType) {
        const createdColor = await prisma.color.create({
            data: {
                title: data.title,
                code: data.code,
                company: {
                    connect: {
                        id: companyID
                    }
                }
            },
            select: colorSelect
        });
        return createdColor;
    }

    async getColorsCount(filters: {
        companyID?: number;
    }) {
        const colorsCount = await prisma.color.count({
            where: {
                company: {
                    id: filters.companyID
                }
            }
        });
        return colorsCount;
    }

    async getAllColors(
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
            const colors = await prisma.color.findMany({
                skip: skip,
                take: take,
                where: where,
                select: {
                    id: true,
                    title: true
                }
            });
            return colors;
        }

        const colors = await prisma.color.findMany({
            skip: skip,
            take: take,
            where: where,
            orderBy: {
                id: "desc"
            },
            select: colorSelect
        });

        return colors;
    }

    async getColor(data: { colorID: number }) {
        const color = await prisma.color.findUnique({
            where: {
                id: data.colorID
            },
            select: colorSelect
        });
        return color;
    }

    async updateColor(data: { colorID: number; colorData: ColorUpdateType }) {
        const color = await prisma.color.update({
            where: {
                id: data.colorID
            },
            data: {
                title: data.colorData.title,
                code: data.colorData.code
            },
            select: colorSelect
        });
        return color;
    }

    async deleteColor(data: { colorID: number }) {
        await prisma.color.delete({
            where: {
                id: data.colorID
            }
        });
        return true;
    }
}
