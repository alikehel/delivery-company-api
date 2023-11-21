import { Router } from "express";

// import { Role } from "@prisma/client";
// import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import {
    createOrder,
    createOrdersReceipts,
    deleteOrder,
    getAllOrders,
    getAllOrdersStatuses,
    getOrder,
    getOrderTimeline,
    getOrdersStatistics,
    getTodayOrdersCountAndEarnings,
    updateOrder
} from "./orders.controller";

const router = Router();

router.route("/orders").post(
    isLoggedIn,
    // isAutherized([Role.CLIENT]),
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
    // isAutherized([Role.SUPER_ADMIN]),
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

        #swagger.parameters['search'] = {
            in: 'query',
            description: 'Search Query',
            required: false
        }

        #swagger.parameters['sort'] = {
            in: 'query',
            description: 'Sort Query (Default: id:asc)',
            required: false
        }

        #swagger.parameters['start_date'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['end_date'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['delivery_date'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['governorate'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['status'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['delivery_type'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['delivery_agent_id'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['client_id'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['store_id'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['product_id'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['location_id'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['receipt_number'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['recipient_name'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['recipient_phone'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['recipient_address'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['notes'] = {
            in: 'query',
            description: '',
            required: false
        }
    */
);

router.route("/orders/statuses").get(
    isLoggedIn,
    // isAutherized([Role.SUPER_ADMIN]),
    getAllOrdersStatuses
    /*
        #swagger.tags = ['Orders Routes']
    */
);

router.route("/orders/today").get(
    isLoggedIn,
    // isAutherized([Role.SUPER_ADMIN]),
    getTodayOrdersCountAndEarnings
    /*
        #swagger.tags = ['Orders Routes']
    */
);

router.route("/orders/statistics").get(
    isLoggedIn,
    // isAutherized([Role.SUPER_ADMIN]),
    getOrdersStatistics
    /*
        #swagger.tags = ['Orders Routes']

        #swagger.parameters['status'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['store_id'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['tenant_id'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['recorded'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['start_date'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['end_date'] = {
            in: 'query',
            description: '',
            required: false
        }
    */
);

router.route("/orders/:orderID").get(
    isLoggedIn,
    // isAutherized([Role.SUPER_ADMIN]),
    getOrder
    /*
        #swagger.tags = ['Orders Routes']
    */
);

router.route("/orders/:orderID/timeline").get(
    isLoggedIn,
    // isAutherized([Role.SUPER_ADMIN]),
    getOrderTimeline
    /*
        #swagger.tags = ['Orders Routes']
    */
);

router.route("/orders/receipts").post(
    isLoggedIn,
    // isAutherized([Role.SUPER_ADMIN]),
    createOrdersReceipts
    /*
        #swagger.tags = ['Orders Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    "schema": { $ref: "#/components/schemas/OrdersReceiptsCreateSchema" },
                    "examples": {
                        "OrderCreateExample": { $ref: "#/components/examples/OrdersReceiptsCreateExample" }
                    }
                }
            }
        }
    */
);

router.route("/orders/:orderID").patch(
    isLoggedIn,
    // isAutherized([Role.SUPER_ADMIN]),
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
    // isAutherized([Role.SUPER_ADMIN]),
    deleteOrder
    /*
        #swagger.tags = ['Orders Routes']
    */
);

export default router;
