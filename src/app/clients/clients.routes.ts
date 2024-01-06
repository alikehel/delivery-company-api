import { Router } from "express";

// import { Role } from "@prisma/client";
// import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
// import { upload } from "../../middlewares/upload.middleware";
import {
    createClient,
    deactivateClient,
    deleteClient,
    getAllClients,
    getClient,
    reactivateClient,
    updateClient
} from "./clients.controller";

const router = Router();

router.route("/clients").post(
    isLoggedIn,
    // // isAutherized([Role.SUPER_ADMIN]),
    // upload.single("avatar"),
    createClient
    /*
        #swagger.tags = ['Clients Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/ClientCreateSchema" },
                    examples: {
                        ClientCreateExample: { $ref: "#/components/examples/ClientCreateExample" }
                    }
                }
            }
        }
    */
);

router.route("/clients").get(
    isLoggedIn,
    // // isAutherized([Role.SUPER_ADMIN]),
    getAllClients
    /*
        #swagger.tags = ['Clients Routes']

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

router.route("/clients/:clientID").get(
    isLoggedIn,
    // // isAutherized([Role.SUPER_ADMIN]),
    getClient
    /*
        #swagger.tags = ['Clients Routes']
    */
);

router.route("/clients/:clientID").patch(
    isLoggedIn,
    // // isAutherized([Role.SUPER_ADMIN]),
    // upload.single("avatar"),
    updateClient
    /*
        #swagger.tags = ['Clients Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/ClientUpdateSchema" },
                    examples: {
                        ClientUpdateExample: { $ref: "#/components/examples/ClientUpdateExample" }
                    }
                }
            }
        }
    */
);

router.route("/clients/:clientID").delete(
    isLoggedIn,
    // // isAutherized([Role.SUPER_ADMIN]),
    deleteClient
    /*
        #swagger.tags = ['Clients Routes']
    */
);

router.route("/clients/:clientID/deactivate").patch(
    isLoggedIn,
    // isAutherized([EmployeeRole.SUPER_ADMIN]),
    deactivateClient
    /*
        #swagger.tags = ['Clients Routes']
    */
);

router.route("/clients/:clientID/reactivate").patch(
    isLoggedIn,
    // isAutherized([EmployeeRole.SUPER_ADMIN]),
    reactivateClient
    /*
        #swagger.tags = ['Clients Routes']
    */
);

export default router;
