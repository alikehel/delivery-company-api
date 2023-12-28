import { Router } from "express";

// import { Role } from "@prisma/client";
// import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import {
    createAutomaticUpdate,
    deleteAutomaticUpdate,
    getAllAutomaticUpdates,
    getAutomaticUpdate,
    updateAutomaticUpdate
} from "./automaticUpdates.controller";

const router = Router();

router.route("/automatic-updates").post(
    isLoggedIn,
    // isAutherized([Role.SUPER_ADMIN]),
    createAutomaticUpdate
    /*
        #swagger.tags = ['Automatic Updates Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    "schema": { $ref: "#/components/schemas/AutomaticUpdateCreateSchema" },
                    "examples": {
                        "AutomaticUpdateCreateExample": { $ref: "#/components/examples/AutomaticUpdateCreateExample" }
                    }
                }
            }
        }
    */
);

router.route("/automatic-updates").get(
    isLoggedIn,
    // isAutherized([Role.SUPER_ADMIN]),
    getAllAutomaticUpdates
    /*
        #swagger.tags = ['Automatic Updates Routes']

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

router.route("/automatic-updates/:automaticUpdateID").get(
    isLoggedIn,
    // isAutherized([Role.SUPER_ADMIN]),
    getAutomaticUpdate
    /*
        #swagger.tags = ['Automatic Updates Routes']
    */
);

router.route("/automatic-updates/:automaticUpdateID").patch(
    isLoggedIn,
    // isAutherized([Role.SUPER_ADMIN]),
    updateAutomaticUpdate
    /*
        #swagger.tags = ['Automatic Updates Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    "schema": { $ref: "#/components/schemas/AutomaticUpdateUpdateSchema" },
                    "examples": {
                        "AutomaticUpdateUpdateExample": { $ref: "#/components/examples/AutomaticUpdateUpdateExample" }
                    }
                }
            }
        }
    */
);

router.route("/automatic-updates/:automaticUpdateID").delete(
    isLoggedIn,
    // isAutherized([Role.SUPER_ADMIN]),
    deleteAutomaticUpdate
    /*
        #swagger.tags = ['Automatic Updates Routes']
    */
);

export default router;
