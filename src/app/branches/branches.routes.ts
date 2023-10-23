import { Router } from "express";

import { Role } from "@prisma/client";
import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import {
    createBranch,
    deleteBranch,
    getAllBranches,
    getBranch,
    updateBranch
} from "./branches.controller";

const router = Router();

router.route("/branches").post(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    createBranch
    /*
        #swagger.tags = ['Branches Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/BranchCreateSchema" },
                    examples: {
                        BranchCreateExample: { $ref: "#/components/examples/BranchCreateExample" }
                    }
                }
            }
        }
    */
);

router.route("/branches").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getAllBranches
    /*
        #swagger.tags = ['Branches Routes']

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

router.route("/branches/:branchID").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getBranch
    /*
        #swagger.tags = ['Branches Routes']
    */
);

router.route("/branches/:branchID").patch(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    updateBranch
    /*
        #swagger.tags = ['Branches Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/BranchUpdateSchema" },
                    examples: {
                        BranchUpdateExample: { $ref: "#/components/examples/BranchUpdateExample" }
                    }
                }
            }
        }
    */
);

router.route("/branches/:branchID").delete(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    deleteBranch
    /*
        #swagger.tags = ['Branches Routes']
    */
);

export default router;
