import { Router } from "express";

import { Role } from "@prisma/client";
import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import {
    createStore,
    deleteStore,
    getAllStores,
    getStore,
    updateStore
} from "./stores.controller";

const router = Router();

router.route("/stores").post(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    createStore
    /*
        #swagger.tags = ['Stores Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    "schema": { $ref: "#/components/schemas/StoreCreateSchema" },
                    "examples": {
                        "StoreCreateExample": { $ref: "#/components/examples/StoreCreateExample" }
                    }
                }
            }
        }
    */
);

router.route("/stores").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getAllStores
    /*
        #swagger.tags = ['Stores Routes']

        #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page Number',
            required: false
        }
    */
);

router.route("/stores/:storeID").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getStore
    /*
        #swagger.tags = ['Stores Routes']
    */
);

router.route("/stores/:storeID").patch(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    updateStore
    /*
        #swagger.tags = ['Stores Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    "schema": { $ref: "#/components/schemas/StoreUpdateSchema" },
                    "examples": {
                        "StoreUpdateExample": { $ref: "#/components/examples/StoreUpdateExample" }
                    }
                }
            }
        }
    */
);

router.route("/stores/:storeID").delete(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    deleteStore
    /*
        #swagger.tags = ['Stores Routes']
    */
);

export default router;
