import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
import { CategoryCreateSchema, CategoryUpdateSchema } from "./categories.zod";
import { CategoryModel } from "./category.model";

const categoryModel = new CategoryModel();

export const createCategory = catchAsync(async (req, res) => {
    const categoryData = CategoryCreateSchema.parse(req.body);

    const createdCategory = await categoryModel.createCategory(categoryData);

    res.status(200).json({
        status: "success",
        data: createdCategory
    });
});

export const getAllCategories = catchAsync(async (req, res) => {
    const categoriesCount = await categoryModel.getCategoriesCount();
    const pagesCount = Math.ceil(categoriesCount / 10);

    if (pagesCount === 0) {
        res.status(200).json({
            status: "success",
            page: 1,
            pagesCount: 1,
            data: []
        });
        return;
    }

    let page = 1;
    if (
        req.query.page &&
        !Number.isNaN(+req.query.page) &&
        +req.query.page > 0
    ) {
        page = +req.query.page;
    }
    if (page > pagesCount) {
        throw new AppError("Page number out of range", 400);
    }
    const take = page * 10;
    const skip = (page - 1) * 10;
    // if (Number.isNaN(offset)) {
    //     skip = 0;
    // }

    const categories = await categoryModel.getAllCategories(skip, take);

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: categories
    });
});

export const getCategory = catchAsync(async (req, res) => {
    const categoryID = req.params["categoryID"];

    const category = await categoryModel.getCategory({
        categoryID: categoryID
    });

    res.status(200).json({
        status: "success",
        data: category
    });
});

export const updateCategory = catchAsync(async (req, res) => {
    const categoryID = req.params["categoryID"];

    const categoryData = CategoryUpdateSchema.parse(req.body);

    const category = await categoryModel.updateCategory({
        categoryID: categoryID,
        categoryData: categoryData
    });

    res.status(200).json({
        status: "success",
        data: category
    });
});

export const deleteCategory = catchAsync(async (req, res) => {
    const categoryID = req.params["categoryID"];

    await categoryModel.deleteCategory({
        categoryID: categoryID
    });

    res.status(200).json({
        status: "success"
    });
});
