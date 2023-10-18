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

        #swagger.description = 'Must be a super admin'

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

        #swagger.responses[201-1] = {
            description: 'Client created successfully',
            schema: {
                status: "success",
                data: {
                    id: 'true',
                    name: 'true',
                    phone: 'true',
                    accountType: 'true',
                    branch: 'true',
                    createdBy: 'true'
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
            description: 'Cant create the client',
            schema: {
                status: "error",
                message: 'Cant create the client'
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

        #swagger.description = 'Must be a super admin'

         #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page Number',
            required: false
        }

        #swagger.responses[200-1] = {
            description: 'Got all clients',
            schema: {
                status: "success",
                data: [
                    {
                        id: 'true',
                        name: 'true',
                        phone: 'true',
                        accountType: 'true',
                        branch: 'true',
                        createdBy: 'true'
                    }
                ]
            }
        }

        #swagger.responses[500-1] = {
            description: 'Cant get the clients data',
            schema: {
                status: "error",
                message: 'Cant get the clients data'
            }
        }
    */
);

router.route("/clients/:clientID").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getClient
    /*
        #swagger.tags = ['Clients Routes']

        #swagger.description = 'Must be a super admin'

        #swagger.responses[200-1] = {
            description: 'Got the client data',
            schema: {
                status: "success",
                data: {
                    id: 'true',
                    name: 'true',
                    phone: 'true',
                    accountType: 'true',
                    branch: 'true',
                    createdBy: 'true'
                }
            }
        }
    */
);

router.route("/clients/:clientID").patch(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    updateClient
    /*
        #swagger.tags = ['Clients Routes']

        #swagger.description = 'Must be a super admin'

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

        #swagger.responses[201-1] = {
            description: 'Client updated successfully',
            schema: {
                status: "success",
                data: {
                    id: 'true',
                    name: 'true',
                    phone: 'true',
                    accountType: 'true',
                    branch: 'true',
                    createdBy: 'true'
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

        #swagger.description = 'Must be a super admin'

         #swagger.responses[200-1] = {
            description: 'Client deleted Successfully',
            schema: {
                status: "success",
                message: "Client deleted successfully"
            }
        }

        #swagger.responses[500-1] = {
            description: 'Cant delete the client',
            schema: {
                status: "error",
                message: 'Cant delete the client'
            }
        }
    */
);

export default router;
