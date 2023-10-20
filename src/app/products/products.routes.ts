import { Router } from "express";

import { Role } from "@prisma/client";
import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProduct,
    updateProduct
} from "./products.controller";

const router = Router();

router.route("/products").post(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    createProduct
    /*
        #swagger.tags = ['Products Routes']

        #swagger.description = 'Must be a super admin'

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

        #swagger.responses[201-1] = {
            description: 'Product created successfully',
            schema: {
                status: "success",
                data: {
                    id: 'true',
                    title: 'true',
                    price: 'true',
                    image: 'true'
                }
            }
        }

        #swagger.responses[400-1] = {
            schema: {
                status: "fail",
                message: ''
            },
            description: ''
        }

        #swagger.responses[500-1] = {
            description: 'Cant create the product',
            schema: {
                status: "error",
                message: 'Cant create the product'
            }
        }
    */
);

router.route("/products").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getAllProducts
    /*
        #swagger.tags = ['Products Routes']

        #swagger.description = 'Must be a super admin'

         #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page Number',
            required: false
        }

        #swagger.responses[200-1] = {
            description: 'Got all products',
            schema: {
                status: "success",
                data: [
                    {
                        id: 'true',
                        title: 'true',
                        price: 'true',
                        image: 'true'
                    }
                ]
            }
        }

        #swagger.responses[500-1] = {
            description: 'Cant get the products data',
            schema: {
                status: "error",
                message: 'Cant get the products data'
            }
        }
    */
);

router.route("/products/:productID").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getProduct
    /*
        #swagger.tags = ['Products Routes']

        #swagger.description = 'Must be a super admin'

        #swagger.responses[200-1] = {
            description: 'Got the product data',
            schema: {
                status: "success",
                data: {
                    id: 'true',
                    title: 'true',
                    price: 'true',
                    image: 'true'
                }
            }
        }
    */
);

router.route("/products/:productID").patch(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    updateProduct
    /*
        #swagger.tags = ['Products Routes']

        #swagger.description = 'Must be a super admin'

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

        #swagger.responses[201-1] = {
            description: 'Product updated successfully',
            schema: {
                status: "success",
                data: {
                    id: 'true',
                    title: 'true',
                    price: 'true',
                    image: 'true'
                }
            }
        }
    */
);

router.route("/products/:productID").delete(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    deleteProduct
    /*
        #swagger.tags = ['Products Routes']

        #swagger.description = 'Must be a super admin'

         #swagger.responses[200-1] = {
            description: 'Product deleted Successfully',
            schema: {
                status: "success",
                message: "Product deleted successfully"
            }
        }

        #swagger.responses[500-1] = {
            description: 'Cant delete the product',
            schema: {
                status: "error",
                message: 'Cant delete the product'
            }
        }
    */
);

export default router;
