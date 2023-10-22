import { PrismaClient } from "@prisma/client";
import { CategoryCreateType, CategoryUpdateType } from "./categories.zod";

const prisma = new PrismaClient();

export class CategoryModel {
    async createCategory(data: CategoryCreateType) {
        const createdCategory = await prisma.category.create({
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
        return createdCategory;
    }

    async getCategoriesCount() {
        const categoriesCount = await prisma.category.count();
        return categoriesCount;
    }

    async getAllCategories(skip: number, take: number) {
        const categories = await prisma.category.findMany({
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
        return categories;
    }

    async getCategory(data: { categoryID: string }) {
        const category = await prisma.category.findUnique({
            where: {
                id: data.categoryID
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return category;
    }

    async updateCategory(data: {
        categoryID: string;
        categoryData: CategoryUpdateType;
    }) {
        const category = await prisma.category.update({
            where: {
                id: data.categoryID
            },
            data: {
                title: data.categoryData.title
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return category;
    }

    async deleteCategory(data: { categoryID: string }) {
        const deletedCategory = await prisma.category.delete({
            where: {
                id: data.categoryID
            }
        });
        return deletedCategory;
    }
}
