import { Router } from "express";

// import { Role } from "@prisma/client";
// import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import { upload } from "../../middlewares/upload.middleware";
// import { upload } from "../../middlewares/upload.middleware";
import {
    createStore,
    deactivateStore,
    deleteStore,
    getAllStores,
    getStore,
    reactivateStore,
    updateStore
} from "./stores.controller";

const router = Router();

router.route("/stores").post(
    isLoggedIn,
    // isAutherized([Role.ADMIN]),
    // upload.single("logo"),
    upload.none(),
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
    // isAutherized([Role.ADMIN]),
    getAllStores
    /*
        #swagger.tags = ['Stores Routes']

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

router.route("/stores/:storeID").get(
    isLoggedIn,
    // isAutherized([Role.ADMIN]),
    getStore
    /*
        #swagger.tags = ['Stores Routes']
    */
);

router.route("/stores/:storeID").patch(
    isLoggedIn,
    // isAutherized([Role.ADMIN]),
    // upload.single("logo"),
    upload.none(),
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
    // isAutherized([Role.ADMIN]),
    deleteStore
    /*
        #swagger.tags = ['Stores Routes']
    */
);

router.route("/stores/:storeID/deactivate").patch(
    isLoggedIn,
    // isAutherized([EmployeeRole.ADMIN]),
    deactivateStore
    /*
        #swagger.tags = ['Stores Routes']
    */
);

router.route("/stores/:storeID/reactivate").patch(
    isLoggedIn,
    // isAutherized([EmployeeRole.ADMIN]),
    reactivateStore
    /*
        #swagger.tags = ['Stores Routes']
    */
);

export default router;
