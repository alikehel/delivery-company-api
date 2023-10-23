import { Router } from "express";

import { Role } from "@prisma/client";
import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import {
    createCategory,
    deleteCategory,
    getAllCategories,
    getCategory,
    updateCategory
} from "./categories.controller";

const router = Router();

router.route("/categories").post(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    createCategory
    /*
        #swagger.tags = ['Categories Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    "schema": { $ref: "#/components/schemas/CategoryCreateSchema" },
                    "examples": {
                        "CategoryCreateExample": { $ref: "#/components/examples/CategoryCreateExample" }
                    }
                }
            }
        }
    */
);

router.route("/categories").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getAllCategories
    /*
        #swagger.tags = ['Categories Routes']

        #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page Number',
            required: false
        }
    */
);

router.route("/categories/:categoryID").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getCategory
    /*
        #swagger.tags = ['Categories Routes']
    */
);

router.route("/categories/:categoryID").patch(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    updateCategory
    /*
        #swagger.tags = ['Categories Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    "schema": { $ref: "#/components/schemas/CategoryUpdateSchema" },
                    "examples": {
                        "CategoryUpdateExample": { $ref: "#/components/examples/CategoryUpdateExample" }
                    }
                }
            }
        }
    */
);

router.route("/categories/:categoryID").delete(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    deleteCategory
    /*
        #swagger.tags = ['Categories Routes']
    */
);

export default router;
