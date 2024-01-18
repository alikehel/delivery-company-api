import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
import { ProductModel } from "./product.model";
import { ProductCreateSchema, ProductUpdateSchema } from "./products.zod";

const productModel = new ProductModel();

export const createProduct = catchAsync(async (req, res) => {
    const productData = ProductCreateSchema.parse(req.body);
    const loggedInUserID = +res.locals.user.id;
    const companyID = +res.locals.user.companyID;
    const image = req.file ? `/${req.file.path.replace(/\\/g, "/")}` : undefined;

    const createdProduct = await productModel.createProduct(companyID, loggedInUserID, {
        ...productData,
        image
    });

    res.status(200).json({
        status: "success",
        data: createdProduct
    });
});

export const getAllProducts = catchAsync(async (req, res) => {
    const productsCount = await productModel.getProductsCount();
    const size = req.query.size ? +req.query.size : 10;
    const pagesCount = Math.ceil(productsCount / size);

    const storeID = req.query.store_id ? +req.query.store_id : undefined;

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
    if (req.query.page && !Number.isNaN(+req.query.page) && +req.query.page > 0) {
        page = +req.query.page;
    }
    if (page > pagesCount) {
        throw new AppError("Page number out of range", 400);
    }
    const take = page * size;
    const skip = (page - 1) * size;
    // if (Number.isNaN(offset)) {
    //     skip = 0;
    // }

    const products = await productModel.getAllProducts(skip, take, {
        storeID: storeID
    });

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: products
    });
});

export const getProduct = catchAsync(async (req, res) => {
    const productID = +req.params.productID;

    const product = await productModel.getProduct({
        productID: productID
    });

    res.status(200).json({
        status: "success",
        data: product
    });
});

export const updateProduct = catchAsync(async (req, res) => {
    const productID = +req.params.productID;
    const loggedInUserID = +res.locals.user.id;
    const companyID = +res.locals.user.companyID;

    const productData = ProductUpdateSchema.parse(req.body);
    const image = req.file ? `/${req.file.path.replace(/\\/g, "/")}` : undefined;

    const product = await productModel.updateProduct({
        productID: productID,
        companyID,
        loggedInUserID,
        productData: { ...productData, image }
    });

    res.status(200).json({
        status: "success",
        data: product
    });
});

export const deleteProduct = catchAsync(async (req, res) => {
    const productID = +req.params.productID;

    await productModel.deleteProduct({
        productID: productID
    });

    res.status(200).json({
        status: "success"
    });
});
