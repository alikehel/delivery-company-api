import { Router } from "express";

import { Role } from "@prisma/client";
import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import {
    createColor,
    deleteColor,
    getAllColors,
    getColor,
    updateColor
} from "./colors.controller";

const router = Router();

router.route("/colors").post(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    createColor
    /*
        #swagger.tags = ['Colors Routes']

        #swagger.description = 'Must be a super admin'

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    "schema": { $ref: "#/components/schemas/ColorCreateSchema" },
                    "examples": {
                        "ColorCreateExample": { $ref: "#/components/examples/ColorCreateExample" }
                    }
                }
            }
        }

        #swagger.responses[201-1] = {
            description: 'Color created successfully',
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
            description: 'Cant create the color',
            schema: {
                status: "error",
                message: 'Cant create the color'
            }
        }
    */
);

router.route("/colors").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getAllColors
    /*
        #swagger.tags = ['Colors Routes']

        #swagger.description = 'Must be a super admin'

         #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page Number',
            required: false
        }

        #swagger.responses[200-1] = {
            description: 'Got all colors',
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
            description: 'Cant get the colors data',
            schema: {
                status: "error",
                message: 'Cant get the colors data'
            }
        }
    */
);

router.route("/colors/:colorID").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getColor
    /*
        #swagger.tags = ['Colors Routes']

        #swagger.description = 'Must be a super admin'

        #swagger.responses[200-1] = {
            description: 'Got the color data',
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

router.route("/colors/:colorID").patch(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    updateColor
    /*
        #swagger.tags = ['Colors Routes']

        #swagger.description = 'Must be a super admin'

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    "schema": { $ref: "#/components/schemas/ColorUpdateSchema" },
                    "examples": {
                        "ColorUpdateExample": { $ref: "#/components/examples/ColorUpdateExample" }
                    }
                }
            }
        }

        #swagger.responses[201-1] = {
            description: 'Color updated successfully',
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

router.route("/colors/:colorID").delete(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    deleteColor
    /*
        #swagger.tags = ['Colors Routes']

        #swagger.description = 'Must be a super admin'

         #swagger.responses[200-1] = {
            description: 'Color deleted Successfully',
            schema: {
                status: "success",
                message: "Color deleted successfully"
            }
        }

        #swagger.responses[500-1] = {
            description: 'Cant delete the color',
            schema: {
                status: "error",
                message: 'Cant delete the color'
            }
        }
    */
);

export default router;
