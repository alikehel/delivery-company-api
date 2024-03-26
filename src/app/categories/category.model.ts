import { Prisma } from "@prisma/client";
import { prisma } from "../../database/db";
import { CategoryCreateType, CategoryUpdateType } from "./categories.zod";

const categorySelect = {
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
} satisfies Prisma.CategorySelect;

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

    async getAllCategoriesPaginated(filters: {
        page: number;
        size: number;
        companyID?: number;
        minified?: boolean;
    }) {
        const where = {
            company: {
                id: filters.companyID
            }
        };

        if (filters.minified === true) {
            const paginatedCategories = await prisma.category.findManyPaginated(
                {
                    where: where,
                    select: {
                        id: true,
                        title: true
                    }
                },
                {
                    page: filters.page,
                    size: filters.size
                }
            );
            return { categories: paginatedCategories.data, pagesCount: paginatedCategories.pagesCount };
        }

        const paginatedCategories = await prisma.category.findManyPaginated(
            {
                where: where,
                orderBy: {
                    title: "asc"
                },
                select: categorySelect
            },
            {
                page: filters.page,
                size: filters.size
            }
        );

        return { categories: paginatedCategories.data, pagesCount: paginatedCategories.pagesCount };
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
