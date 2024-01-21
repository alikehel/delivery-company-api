import { Router } from "express";

// import { upload } from "../../middlewares/upload.middleware";
import { AdminRole, ClientRole, EmployeeRole, Permission } from "@prisma/client";
import { isAutherized } from "../../middlewares/isAutherized.middleware";
// import { Role } from "@prisma/client";
// import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import { upload } from "../../middlewares/upload.middleware";
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
    isAutherized(
        [
            EmployeeRole.COMPANY_MANAGER,
            EmployeeRole.ACCOUNTANT,
            EmployeeRole.DATA_ENTRY,
            EmployeeRole.BRANCH_MANAGER,
            ClientRole.CLIENT,
            ClientRole.CLIENT_ASSISTANT
        ],
        [Permission.ADD_STORE]
    ), // upload.single("logo"),
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
    isAutherized([
        EmployeeRole.COMPANY_MANAGER,
        AdminRole.ADMIN,
        AdminRole.ADMIN_ASSISTANT,
        EmployeeRole.ACCOUNTANT,
        EmployeeRole.DATA_ENTRY,
        EmployeeRole.BRANCH_MANAGER,
        ClientRole.CLIENT,
        ClientRole.CLIENT_ASSISTANT,
        //TODO: Remove later
        ...Object.values(EmployeeRole),
        ...Object.values(ClientRole)
    ]),
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
    isAutherized([
        AdminRole.ADMIN,
        AdminRole.ADMIN_ASSISTANT,
        EmployeeRole.COMPANY_MANAGER,
        EmployeeRole.ACCOUNTANT,
        EmployeeRole.DATA_ENTRY,
        EmployeeRole.BRANCH_MANAGER,
        ClientRole.CLIENT,
        ClientRole.CLIENT_ASSISTANT
    ]),
    getStore
    /*
        #swagger.tags = ['Stores Routes']
    */
);

router.route("/stores/:storeID").patch(
    isLoggedIn,
    isAutherized([
        AdminRole.ADMIN,
        AdminRole.ADMIN_ASSISTANT,
        EmployeeRole.COMPANY_MANAGER,
        EmployeeRole.ACCOUNTANT,
        EmployeeRole.DATA_ENTRY,
        EmployeeRole.BRANCH_MANAGER,
        ClientRole.CLIENT,
        ClientRole.CLIENT_ASSISTANT
    ]), // upload.single("logo"),
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
    isAutherized([AdminRole.ADMIN, AdminRole.ADMIN_ASSISTANT, EmployeeRole.COMPANY_MANAGER]),
    deleteStore
    /*
        #swagger.tags = ['Stores Routes']
    */
);

router.route("/stores/:storeID/deactivate").patch(
    isLoggedIn,
    isAutherized([
        AdminRole.ADMIN,
        AdminRole.ADMIN_ASSISTANT,
        EmployeeRole.COMPANY_MANAGER,
        EmployeeRole.ACCOUNTANT,
        EmployeeRole.DATA_ENTRY,
        EmployeeRole.BRANCH_MANAGER,
        ClientRole.CLIENT,
        ClientRole.CLIENT_ASSISTANT
    ]),
    deactivateStore
    /*
        #swagger.tags = ['Stores Routes']
    */
);

router.route("/stores/:storeID/reactivate").patch(
    isLoggedIn,
    isAutherized([AdminRole.ADMIN, AdminRole.ADMIN_ASSISTANT, EmployeeRole.COMPANY_MANAGER]),
    reactivateStore
    /*
        #swagger.tags = ['Stores Routes']
    */
);

export default router;
