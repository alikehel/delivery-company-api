import { Router } from "express";

// import { Role } from "@prisma/client";
// import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import {
    createLocation,
    deleteLocation,
    getAllLocations,
    getLocation,
    publicGetAllLocations,
    updateLocation
} from "./locations.controller";

const router = Router();

router.route("/locations").post(
    isLoggedIn,
    // isAutherized([Role.ADMIN]),
    createLocation
    /*
        #swagger.tags = ['Locations Routes']

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
    */
);

router.route("/public/locations").get(
    // isLoggedIn,
    // isAutherized([Role.ADMIN]),
    publicGetAllLocations
    /*
        #swagger.tags = ['Locations Routes']
    */
);

router.route("/locations").get(
    isLoggedIn,
    // isAutherized([Role.ADMIN]),
    getAllLocations
    /*
        #swagger.tags = ['Locations Routes']

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

router.route("/locations/:locationID").get(
    isLoggedIn,
    // isAutherized([Role.ADMIN]),
    getLocation
    /*
        #swagger.tags = ['Locations Routes']
    */
);

router.route("/locations/:locationID").patch(
    isLoggedIn,
    // isAutherized([Role.ADMIN]),
    updateLocation
    /*
        #swagger.tags = ['Locations Routes']

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
    */
);

router.route("/locations/:locationID").delete(
    isLoggedIn,
    // isAutherized([Role.ADMIN]),
    deleteLocation
    /*
        #swagger.tags = ['Locations Routes']
    */
);

export default router;
