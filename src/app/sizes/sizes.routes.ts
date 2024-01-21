import { Router } from "express";

import { AdminRole, ClientRole, EmployeeRole } from "@prisma/client";
import { isAutherized } from "../../middlewares/isAutherized.middleware";
// import { Role } from "@prisma/client";
// import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import { createSize, deleteSize, getAllSizes, getSize, updateSize } from "./sizes.controller";

const router = Router();

router.route("/sizes").post(
    isLoggedIn,
    isAutherized([EmployeeRole.COMPANY_MANAGER]),
    createSize
    /*
        #swagger.tags = ['Sizes Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    "schema": { $ref: "#/components/schemas/SizeCreateSchema" },
                    "examples": {
                        "SizeCreateExample": { $ref: "#/components/examples/SizeCreateExample" }
                    }
                }
            }
        }
    */
);

router.route("/sizes").get(
    isLoggedIn,
    isAutherized([
        EmployeeRole.COMPANY_MANAGER,
        AdminRole.ADMIN,
        AdminRole.ADMIN_ASSISTANT,
        //TODO: Remove later
        ...Object.values(EmployeeRole),
        ...Object.values(ClientRole)
    ]),
    getAllSizes
    /*
        #swagger.tags = ['Sizes Routes']

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

router.route("/sizes/:sizeID").get(
    isLoggedIn,
    isAutherized([EmployeeRole.COMPANY_MANAGER, AdminRole.ADMIN, AdminRole.ADMIN_ASSISTANT]),
    getSize
    /*
        #swagger.tags = ['Sizes Routes']
    */
);

router.route("/sizes/:sizeID").patch(
    isLoggedIn,
    isAutherized([EmployeeRole.COMPANY_MANAGER, AdminRole.ADMIN, AdminRole.ADMIN_ASSISTANT]),
    updateSize
    /*
        #swagger.tags = ['Sizes Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    "schema": { $ref: "#/components/schemas/SizeUpdateSchema" },
                    "examples": {
                        "SizeUpdateExample": { $ref: "#/components/examples/SizeUpdateExample" }
                    }
                }
            }
        }
    */
);

router.route("/sizes/:sizeID").delete(
    isLoggedIn,
    isAutherized([EmployeeRole.COMPANY_MANAGER, AdminRole.ADMIN, AdminRole.ADMIN_ASSISTANT]),
    deleteSize
    /*
        #swagger.tags = ['Sizes Routes']
    */
);

export default router;
