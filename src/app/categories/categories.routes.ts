import { Router } from "express";

import { AdminRole, ClientRole, EmployeeRole } from "@prisma/client";
import { isAutherized } from "../../middlewares/isAutherized.middleware";
// import { Role } from "@prisma/client";
// import { isAutherized } from "../../middlewares/isAutherized.middleware";
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
    isAutherized([EmployeeRole.COMPANY_MANAGER]),
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
    isAutherized([
        EmployeeRole.COMPANY_MANAGER,
        AdminRole.ADMIN,
        AdminRole.ADMIN_ASSISTANT,
        //TODO: Remove later
        ...Object.values(EmployeeRole),
        ...Object.values(ClientRole)
    ]),
    getAllCategories
    /*
        #swagger.tags = ['Categories Routes']

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

router.route("/categories/:categoryID").get(
    isLoggedIn,
    isAutherized([EmployeeRole.COMPANY_MANAGER, AdminRole.ADMIN, AdminRole.ADMIN_ASSISTANT]),
    getCategory
    /*
        #swagger.tags = ['Categories Routes']
    */
);

router.route("/categories/:categoryID").patch(
    isLoggedIn,
    isAutherized([EmployeeRole.COMPANY_MANAGER, AdminRole.ADMIN, AdminRole.ADMIN_ASSISTANT]),
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
    isAutherized([EmployeeRole.COMPANY_MANAGER, AdminRole.ADMIN, AdminRole.ADMIN_ASSISTANT]),
    deleteCategory
    /*
        #swagger.tags = ['Categories Routes']
    */
);

export default router;
