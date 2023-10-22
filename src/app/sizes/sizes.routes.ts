import { Router } from "express";

import { Role } from "@prisma/client";
import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import {
    createSize,
    deleteSize,
    getAllSizes,
    getSize,
    updateSize
} from "./sizes.controller";

const router = Router();

router.route("/sizes").post(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    createSize
    /*
        #swagger.tags = ['Sizes Routes']

        #swagger.description = 'Must be a super admin'

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

        #swagger.responses[201-1] = {
            description: 'Size created successfully',
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
            description: 'Cant create the size',
            schema: {
                status: "error",
                message: 'Cant create the size'
            }
        }
    */
);

router.route("/sizes").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getAllSizes
    /*
        #swagger.tags = ['Sizes Routes']

        #swagger.description = 'Must be a super admin'

         #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page Number',
            required: false
        }

        #swagger.responses[200-1] = {
            description: 'Got all sizes',
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
            description: 'Cant get the sizes data',
            schema: {
                status: "error",
                message: 'Cant get the sizes data'
            }
        }
    */
);

router.route("/sizes/:sizeID").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getSize
    /*
        #swagger.tags = ['Sizes Routes']

        #swagger.description = 'Must be a super admin'

        #swagger.responses[200-1] = {
            description: 'Got the size data',
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

router.route("/sizes/:sizeID").patch(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    updateSize
    /*
        #swagger.tags = ['Sizes Routes']

        #swagger.description = 'Must be a super admin'

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

        #swagger.responses[201-1] = {
            description: 'Size updated successfully',
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

router.route("/sizes/:sizeID").delete(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    deleteSize
    /*
        #swagger.tags = ['Sizes Routes']

        #swagger.description = 'Must be a super admin'

         #swagger.responses[200-1] = {
            description: 'Size deleted Successfully',
            schema: {
                status: "success",
                message: "Size deleted successfully"
            }
        }

        #swagger.responses[500-1] = {
            description: 'Cant delete the size',
            schema: {
                status: "error",
                message: 'Cant delete the size'
            }
        }
    */
);

export default router;
