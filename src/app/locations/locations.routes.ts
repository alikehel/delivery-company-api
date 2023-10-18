import { Router } from "express";

import { Role } from "@prisma/client";
import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import {
    createLocation,
    deleteLocation,
    getAllLocations,
    getLocation,
    updateLocation
} from "./locations.controller";

const router = Router();

router.route("/locations").post(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    createLocation
    /*
        #swagger.tags = ['Locations Routes']

        #swagger.description = 'Must be a super admin'

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/LocationCreateSchema" },
                    examples: {
                        LocationCreateExample: { $ref: "#/components/examples/LocationCreateExample" }
                    }
                }
            }
        }

        #swagger.responses[201-1] = {
            description: 'Location created successfully',
            schema: {
                status: "success",
                data: {
                    id: "1",
                    name: "name",
                    governorate: "governorate",
                    branch: "branch object",
                    deliveryAgents: "deliveryAgents object",
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
            description: 'Cant create the location',
            schema: {
                status: "error",
                message: 'Cant create the location'
            }
        }
    */
);

router.route("/locations").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getAllLocations
    /*
        #swagger.tags = ['Locations Routes']

        #swagger.description = 'Must be a super admin'

         #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page Number',
            required: false
        }

        #swagger.responses[200-1] = {
            description: 'Got all locations',
            schema: {
                status: "success",
                data: [
                    {
                        id: "1",
                        name: "name",
                        governorate: "governorate",
                        branch: "branch object",
                        deliveryAgents: "deliveryAgents object",
                    }
                ]
            }
        }

        #swagger.responses[500-1] = {
            description: 'Cant get the locations data',
            schema: {
                status: "error",
                message: 'Cant get the locations data'
            }
        }
    */
);

router.route("/locations/:locationID").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getLocation
    /*
        #swagger.tags = ['Locations Routes']

        #swagger.description = 'Must be a super admin'

        #swagger.responses[200-1] = {
            description: 'Got the location data',
            schema: {
                status: "success",
                data: {
                    id: "1",
                    name: "name",
                    governorate: "governorate",
                    branch: "branch object",
                    deliveryAgents: "deliveryAgents object",
                }
            }
        }
    */
);

router.route("/locations/:locationID").patch(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    updateLocation
    /*
        #swagger.tags = ['Locations Routes']

        #swagger.description = 'Must be a super admin'

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/LocationUpdateSchema" },
                    examples: {
                        LocationUpdateExample: { $ref: "#/components/examples/LocationUpdateExample" }
                    }
                }
            }
        }

        #swagger.responses[201-1] = {
            description: 'Location updated successfully',
            schema: {
                status: "success",
                data: {
                    id: "1",
                    name: "name",
                    governorate: "governorate",
                    branch: "branch object",
                    deliveryAgents: "deliveryAgents object",
                }
            }
        }
    */
);

router.route("/locations/:locationID").delete(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    deleteLocation
    /*
        #swagger.tags = ['Locations Routes']

        #swagger.description = 'Must be a super admin'

         #swagger.responses[200-1] = {
            description: 'Location deleted Successfully',
            schema: {
                status: "success",
                message: "Location deleted successfully"
            }
        }

        #swagger.responses[500-1] = {
            description: 'Cant delete the location',
            schema: {
                status: "error",
                message: 'Cant delete the location'
            }
        }
    */
);

export default router;
