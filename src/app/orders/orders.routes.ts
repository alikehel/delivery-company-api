import { Router } from "express";

import { Role } from "@prisma/client";
import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import {
    createOrder,
    deleteOrder,
    getAllOrders,
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

        #swagger.description = 'Must be a super admin'

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

        #swagger.responses[201-1] = {
            description: 'Order created successfully',
            schema: {
                status: "success",
                data: {
                    id: 'true',
                    totalCost: 'true',
                    paidAmount: 'true',
                    totalCostInUSD: 'true',
                    paidAmountInUSD: 'true',
                    discount: 'true',
                    receiptNumber: 'true',
                    quantity: 'true',
                    weight: 'true',
                    recipientName: 'true',
                    recipientPhone: 'true',
                    recipientAddress: 'true',
                    details: 'true',
                    notes: 'true',
                    status: 'true',
                    deliveryType: 'true',
                    deliveryDate: 'true',
                    client: 'true',
                    deliveryAgent: 'true'
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
            description: 'Cant create the order',
            schema: {
                status: "error",
                message: 'Cant create the order'
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

        #swagger.description = 'Must be a super admin'

         #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page Number',
            required: false
        }

        #swagger.responses[200-1] = {
            description: 'Got all orders',
            schema: {
                status: "success",
                data: [
                    {
                        id: 'true',
                        totalCost: 'true',
                        paidAmount: 'true',
                        totalCostInUSD: 'true',
                        paidAmountInUSD: 'true',
                        discount: 'true',
                        receiptNumber: 'true',
                        quantity: 'true',
                        weight: 'true',
                        recipientName: 'true',
                        recipientPhone: 'true',
                        recipientAddress: 'true',
                        details: 'true',
                        notes: 'true',
                        status: 'true',
                        deliveryType: 'true',
                        deliveryDate: 'true',
                        client: 'true',
                        deliveryAgent: 'true'
                    }
                ]
            }
        }

        #swagger.responses[500-1] = {
            description: 'Cant get the orders data',
            schema: {
                status: "error",
                message: 'Cant get the orders data'
            }
        }
    */
);

router.route("/orders/:orderID").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getOrder
    /*
        #swagger.tags = ['Orders Routes']

        #swagger.description = 'Must be a super admin'

        #swagger.responses[200-1] = {
            description: 'Got the order data',
            schema: {
                status: "success",
                data: {
                    id: 'true',
                    totalCost: 'true',
                    paidAmount: 'true',
                    totalCostInUSD: 'true',
                    paidAmountInUSD: 'true',
                    discount: 'true',
                    receiptNumber: 'true',
                    quantity: 'true',
                    weight: 'true',
                    recipientName: 'true',
                    recipientPhone: 'true',
                    recipientAddress: 'true',
                    details: 'true',
                    notes: 'true',
                    status: 'true',
                    deliveryType: 'true',
                    deliveryDate: 'true',
                    client: 'true',
                    deliveryAgent: 'true'
                }
            }
        }
    */
);

router.route("/orders/:orderID").patch(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    updateOrder
    /*
        #swagger.tags = ['Orders Routes']

        #swagger.description = 'Must be a super admin'

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

        #swagger.responses[201-1] = {
            description: 'Order updated successfully',
            schema: {
                status: "success",
                data: {
                    id: 'true',
                    totalCost: 'true',
                    paidAmount: 'true',
                    totalCostInUSD: 'true',
                    paidAmountInUSD: 'true',
                    discount: 'true',
                    receiptNumber: 'true',
                    quantity: 'true',
                    weight: 'true',
                    recipientName: 'true',
                    recipientPhone: 'true',
                    recipientAddress: 'true',
                    details: 'true',
                    notes: 'true',
                    status: 'true',
                    deliveryType: 'true',
                    deliveryDate: 'true',
                    client: 'true',
                    deliveryAgent: 'true'
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

        #swagger.description = 'Must be a super admin'

         #swagger.responses[200-1] = {
            description: 'Order deleted Successfully',
            schema: {
                status: "success",
                message: "Order deleted successfully"
            }
        }

        #swagger.responses[500-1] = {
            description: 'Cant delete the order',
            schema: {
                status: "error",
                message: 'Cant delete the order'
            }
        }
    */
);

export default router;
