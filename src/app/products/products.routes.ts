import { Router } from "express";

// import { Role } from "@prisma/client";
// import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
// import { upload } from "../../middlewares/upload.middleware";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProduct,
    updateProduct
} from "./products.controller";
import { upload } from "../../middlewares/upload.middleware";

const router = Router();

router.route("/products").post(
    isLoggedIn,
    // isAutherized([Role.SUPER_ADMIN]),
    // upload.single("image"),
    upload.none(),
    createProduct
    /*
        #swagger.tags = ['Products Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    "schema": { $ref: "#/components/schemas/ProductCreateSchema" },
                    "examples": {
                        "ProductCreateExample": { $ref: "#/components/examples/ProductCreateExample" }
                    }
                }
            }
        }
    */
);

router.route("/products").get(
    isLoggedIn,
    // isAutherized([Role.SUPER_ADMIN]),
    getAllProducts
    /*
        #swagger.tags = ['Products Routes']

        #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page Number',
            required: false
        }

        #swagger.parameters['size'] = {
            in: 'query',
            description: 'Page Size (Number of Items per Page) (Default: 10)',
            required: false
        }
    */
);

router.route("/products/:productID").get(
    isLoggedIn,
    // isAutherized([Role.SUPER_ADMIN]),
    getProduct
    /*
        #swagger.tags = ['Products Routes']
    */
);

router.route("/products/:productID").patch(
    isLoggedIn,
    // isAutherized([Role.SUPER_ADMIN]),
    // upload.single("image"),
    upload.none(),
    updateProduct
    /*
        #swagger.tags = ['Products Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    "schema": { $ref: "#/components/schemas/ProductUpdateSchema" },
                    "examples": {
                        "ProductUpdateExample": { $ref: "#/components/examples/ProductUpdateExample" }
                    }
                }
            }
        }
    */
);

router.route("/products/:productID").delete(
    isLoggedIn,
    // isAutherized([Role.SUPER_ADMIN]),
    deleteProduct
    /*
        #swagger.tags = ['Products Routes']
    */
);

export default router;
