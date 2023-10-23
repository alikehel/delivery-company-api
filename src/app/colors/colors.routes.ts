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
    */
);

router.route("/colors").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getAllColors
    /*
        #swagger.tags = ['Colors Routes']

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

router.route("/colors/:colorID").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getColor
    /*
        #swagger.tags = ['Colors Routes']
    */
);

router.route("/colors/:colorID").patch(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    updateColor
    /*
        #swagger.tags = ['Colors Routes']

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
    */
);

router.route("/colors/:colorID").delete(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    deleteColor
    /*
        #swagger.tags = ['Colors Routes']
    */
);

export default router;
