import { Router } from "express";

import { Role } from "@prisma/client";
import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import {
    createClient,
    deleteClient,
    getAllClients,
    getClient,
    updateClient
} from "./clients.controller";

const router = Router();

router.route("/clients").post(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
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
    isAutherized([Role.SUPER_ADMIN]),
    getAllClients
    /*
        #swagger.tags = ['Clients Routes']

        #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page Number',
            required: false
        }
    */
);

router.route("/clients/:clientID").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getClient
    /*
        #swagger.tags = ['Clients Routes']
    */
);

router.route("/clients/:clientID").patch(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
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
    isAutherized([Role.SUPER_ADMIN]),
    deleteClient
    /*
        #swagger.tags = ['Clients Routes']
    */
);

export default router;
