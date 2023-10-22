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

        #swagger.description = 'Must be a super admin'

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

        #swagger.responses[201-1] = {
            description: 'Category created successfully',
            schema: {
                status: "success",
                data: {
                    id: 'true',
                    title: 'true',
                    createdAt: 'true',
                    updatedAt: 'true'
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
            description: 'Cant create the category',
            schema: {
                status: "error",
                message: 'Cant create the category'
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

        #swagger.description = 'Must be a super admin'

         #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page Number',
            required: false
        }

        #swagger.responses[200-1] = {
            description: 'Got all categories',
            schema: {
                status: "success",
                data: [
                    {
                        id: 'true',
                        title: 'true',
                        createdAt: 'true',
                        updatedAt: 'true'
                    }
                ]
            }
        }

        #swagger.responses[500-1] = {
            description: 'Cant get the categories data',
            schema: {
                status: "error",
                message: 'Cant get the categories data'
            }
        }
    */
);

router.route("/categories/:categoryID").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getCategory
    /*
        #swagger.tags = ['Categories Routes']

        #swagger.description = 'Must be a super admin'

        #swagger.responses[200-1] = {
            description: 'Got the category data',
            schema: {
                status: "success",
                data: {
                    id: 'true',
                    title: 'true',
                    createdAt: 'true',
                    updatedAt: 'true'
                }
            }
        }
    */
);

router.route("/categories/:categoryID").patch(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    updateCategory
    /*
        #swagger.tags = ['Categories Routes']

        #swagger.description = 'Must be a super admin'

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

        #swagger.responses[201-1] = {
            description: 'Category updated successfully',
            schema: {
                status: "success",
                data: {
                    id: 'true',
                    title: 'true',
                    createdAt: 'true',
                    updatedAt: 'true'
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

        #swagger.description = 'Must be a super admin'

         #swagger.responses[200-1] = {
            description: 'Category deleted Successfully',
            schema: {
                status: "success",
                message: "Category deleted successfully"
            }
        }

        #swagger.responses[500-1] = {
            description: 'Cant delete the category',
            schema: {
                status: "error",
                message: 'Cant delete the category'
            }
        }
    */
);

export default router;
