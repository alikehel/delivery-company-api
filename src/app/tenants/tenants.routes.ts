import { Router } from "express";

import { Role } from "@prisma/client";
import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import {
    createTenant,
    deleteTenant,
    getAllTenants,
    getTenant,
    updateTenant
} from "./tenants.controller";

const router = Router();

router.route("/tenants").post(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    createTenant
    /*
        #swagger.tags = ['Tenants Routes']

        #swagger.description = 'Must be a super admin'

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/TenantCreateSchema" },
                    examples: {
                        TenantCreateExample: { $ref: "#/components/examples/TenantCreateExample" }
                    }
                }
            }
        }

        #swagger.responses[201-1] = {
            description: 'Tenant created successfully',
            schema: {
                status: "success",
                data: {
                    id: 'true',
                    name: 'true',
                    phone: 'true',
                    website: 'true',
                    logo: 'true',
                    registrationText: 'true',
                    governoratePrice: 'true',
                    deliveryAgentFee: 'true',
                    baghdadPrice: 'true',
                    additionalPriceForEvery500000IraqiDinar: 'true',
                    additionalPriceForEveryKilogram: 'true',
                    additionalPriceForRemoteAreas: 'true',
                    orderStatusAutomaticUpdate: 'true'
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
            description: 'Cant create the tenant',
            schema: {
                status: "error",
                message: 'Cant create the tenant'
            }
        }
    */
);

router.route("/tenants").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getAllTenants
    /*
        #swagger.tags = ['Tenants Routes']

        #swagger.description = 'Must be a super admin'

         #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page Number',
            required: false
        }

        #swagger.responses[200-1] = {
            description: 'Got all tenants',
            schema: {
                status: "success",
                data: [
                    {
                        id: 'true',
                        name: 'true',
                        phone: 'true',
                        website: 'true',
                        logo: 'true',
                        registrationText: 'true',
                        governoratePrice: 'true',
                        deliveryAgentFee: 'true',
                        baghdadPrice: 'true',
                        additionalPriceForEvery500000IraqiDinar: 'true',
                        additionalPriceForEveryKilogram: 'true',
                        additionalPriceForRemoteAreas: 'true',
                        orderStatusAutomaticUpdate: 'true'
                    }
                ]
            }
        }

        #swagger.responses[500-1] = {
            description: 'Cant get the tenants data',
            schema: {
                status: "error",
                message: 'Cant get the tenants data'
            }
        }
    */
);

router.route("/tenants/:tenantID").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getTenant
    /*
        #swagger.tags = ['Tenants Routes']

        #swagger.description = 'Must be a super admin'

        #swagger.responses[200-1] = {
            description: 'Got the tenant data',
            schema: {
                status: "success",
                data: {
                    id: 'true',
                    name: 'true',
                    phone: 'true',
                    website: 'true',
                    logo: 'true',
                    registrationText: 'true',
                    governoratePrice: 'true',
                    deliveryAgentFee: 'true',
                    baghdadPrice: 'true',
                    additionalPriceForEvery500000IraqiDinar: 'true',
                    additionalPriceForEveryKilogram: 'true',
                    additionalPriceForRemoteAreas: 'true',
                    orderStatusAutomaticUpdate: 'true'
                }
            }
        }
    */
);

router.route("/tenants/:tenantID").patch(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    updateTenant
    /*
        #swagger.tags = ['Tenants Routes']

        #swagger.description = 'Must be a super admin'

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/TenantUpdateSchema" },
                    examples: {
                        TenantUpdateExample: { $ref: "#/components/examples/TenantUpdateExample" }
                    }
                }
            }
        }

        #swagger.responses[201-1] = {
            description: 'Tenant updated successfully',
            schema: {
                status: "success",
                data: {
                    id: 'true',
                    name: 'true',
                    phone: 'true',
                    website: 'true',
                    logo: 'true',
                    registrationText: 'true',
                    governoratePrice: 'true',
                    deliveryAgentFee: 'true',
                    baghdadPrice: 'true',
                    additionalPriceForEvery500000IraqiDinar: 'true',
                    additionalPriceForEveryKilogram: 'true',
                    additionalPriceForRemoteAreas: 'true',
                    orderStatusAutomaticUpdate: 'true'
                }
            }
        }
    */
);

router.route("/tenants/:tenantID").delete(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    deleteTenant
    /*
        #swagger.tags = ['Tenants Routes']

        #swagger.description = 'Must be a super admin'

         #swagger.responses[200-1] = {
            description: 'Tenant deleted Successfully',
            schema: {
                status: "success",
                message: "Tenant deleted successfully"
            }
        }

        #swagger.responses[500-1] = {
            description: 'Cant delete the tenant',
            schema: {
                status: "error",
                message: 'Cant delete the tenant'
            }
        }
    */
);

export default router;
