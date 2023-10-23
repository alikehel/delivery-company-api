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

        #swagger.description = 'Must be a super admin'

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

        #swagger.responses[201-1] = {
            description: 'Store created successfully',
            schema: {
                status: "success",
                data: {
                    id: "1",
                    name: "Store Name",
                    branch: "Branch data object",
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
            description: 'Cant create the store',
            schema: {
                status: "error",
                message: 'Cant create the store'
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

        #swagger.description = 'Must be a super admin'

         #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page Number',
            required: false
        }

        #swagger.responses[200-1] = {
            description: 'Got all stores',
            schema: {
                status: "success",
                data: [
                    {
                        id: "1",
                        name: "Store Name",
                        branch: "Branch data object",
                    }
                ]
            }
        }

        #swagger.responses[500-1] = {
            description: 'Cant get the stores data',
            schema: {
                status: "error",
                message: 'Cant get the stores data'
            }
        }
    */
);

router.route("/stores/:storeID").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getStore
    /*
        #swagger.tags = ['Stores Routes']

        #swagger.description = 'Must be a super admin'

        #swagger.responses[200-1] = {
            description: 'Got the store data',
            schema: {
                status: "success",
                data: {
                    id: "1",
                    name: "Store Name",
                    branch: "Branch data object",
                }
            }
        }
    */
);

router.route("/stores/:storeID").patch(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    updateStore
    /*
        #swagger.tags = ['Stores Routes']

        #swagger.description = 'Must be a super admin'

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

        #swagger.responses[201-1] = {
            description: 'Store updated successfully',
            schema: {
                status: "success",
                data: {
                    id: "1",
                    name: "Store Name",
                    branch: "Branch data object",
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

        #swagger.description = 'Must be a super admin'

         #swagger.responses[200-1] = {
            description: 'Store deleted Successfully',
            schema: {
                status: "success",
                message: "Store deleted successfully"
            }
        }

        #swagger.responses[500-1] = {
            description: 'Cant delete the store',
            schema: {
                status: "error",
                message: 'Cant delete the store'
            }
        }
    */
);

export default router;
