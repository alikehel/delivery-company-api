import { Prisma, PrismaClient } from "@prisma/client";
import { CategoryCreateType, CategoryUpdateType } from "./categories.zod";

const prisma = new PrismaClient();

const categorySelect: Prisma.CategorySelect = {
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

// const categoryReform = (category: any) => {
//     return {
//         id: category.id,
//         title: category.title,
//         createdAt: category.createdAt,
//         updatedAt: category.updatedAt
//     };
// };

export class CategoryModel {
    async createCategory(companyID: number, data: CategoryCreateType) {
        const createdCategory = await prisma.category.create({
            data: {
                title: data.title,
                company: {
                    connect: {
                        id: companyID
                    }
                }
            },
            select: categorySelect
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
            select: categorySelect
        });
        return categories;
    }

    async getCategory(data: { categoryID: number }) {
        const category = await prisma.category.findUnique({
            where: {
                id: data.categoryID
            },
            select: categorySelect
        });
        return category;
    }

    async updateCategory(data: {
        categoryID: number;
        categoryData: CategoryUpdateType;
    }) {
        const category = await prisma.category.update({
            where: {
                id: data.categoryID
            },
            data: {
                title: data.categoryData.title
            },
            select: categorySelect
        });
        return category;
    }

    async deleteCategory(data: { categoryID: number }) {
        await prisma.category.delete({
            where: {
                id: data.categoryID
            }
        });
        return true;
    }
}
