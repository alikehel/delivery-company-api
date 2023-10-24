import { Router } from "express";

import { Role } from "@prisma/client";
import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import {
    createOrder,
    deleteOrder,
    getAllOrders,
    getAllOrdersStatuses,
    getOrder,
    updateOrder
} from "./orders.controller";

const router = Router();

router.route("/orders").post(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    createOrder
    /*
        #swagger.tags = ['Orders Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    "schema": { $ref: "#/components/schemas/OrderCreateSchema" },
                    "examples": {
                        "OrderCreateExample": { $ref: "#/components/examples/OrderCreateExample" }
                    }
                }
            }
        }
    */
);

router.route("/orders").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getAllOrders
    /*
        #swagger.tags = ['Orders Routes']

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

router.route("/orders/statuses").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getAllOrdersStatuses
    /*
        #swagger.tags = ['Orders Routes']
    */
);

router.route("/orders/:orderID").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getOrder
    /*
        #swagger.tags = ['Orders Routes']
    */
);

router.route("/orders/:orderID").patch(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    updateOrder
    /*
        #swagger.tags = ['Orders Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    "schema": { $ref: "#/components/schemas/OrderUpdateSchema" },
                    "examples": {
                        "OrderUpdateExample": { $ref: "#/components/examples/OrderUpdateExample" }
                    }
                }
            }
        }
    */
);

router.route("/orders/:orderID").delete(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    deleteOrder
    /*
        #swagger.tags = ['Orders Routes']
    */
);

export default router;
