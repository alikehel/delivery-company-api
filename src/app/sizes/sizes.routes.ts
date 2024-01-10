import { Router } from "express";

// import { Role } from "@prisma/client";
// import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import { createSize, deleteSize, getAllSizes, getSize, updateSize } from "./sizes.controller";

const router = Router();

router.route("/sizes").post(
    isLoggedIn,
    // isAutherized([Role.SUPER_ADMIN]),
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
    // isAutherized([Role.SUPER_ADMIN]),
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
    // isAutherized([Role.SUPER_ADMIN]),
    getSize
    /*
        #swagger.tags = ['Sizes Routes']
    */
);

router.route("/sizes/:sizeID").patch(
    isLoggedIn,
    // isAutherized([Role.SUPER_ADMIN]),
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
    // isAutherized([Role.SUPER_ADMIN]),
    deleteSize
    /*
        #swagger.tags = ['Sizes Routes']
    */
);

export default router;
