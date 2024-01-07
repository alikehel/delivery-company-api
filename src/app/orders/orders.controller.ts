import { DeliveryType, Governorate, Order, OrderStatus } from "@prisma/client";
import Logger from "../../lib/logger";
import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
import { localizeOrderStatus } from "../../utils/localize.util";
import sendNotification from "../notifications/helpers/sendNotification";
import { generateReceipts } from "./helpers/generateReceipts";
import { OrderModel } from "./order.model";
import {
    OrderChatNotificationCreateSchema,
    OrderCreateSchema,
    OrderCreateType,
    OrderTimelineType,
    OrderUpdateSchema,
    OrdersReceiptsCreateSchema
} from "./orders.zod";

const orderModel = new OrderModel();

export const createOrder = catchAsync(async (req, res) => {
    // const orderData = OrderCreateSchema.parse(req.body);
    const companyID = +res.locals.user.companyID;
    let orderData: OrderCreateType;
    const createdOrders: Order[] = [];
    let createdOrder: Order;

    if (Array.isArray(req.body)) {
        const storeID = OrderCreateSchema.parse(req.body[0]).storeID;
        const clientID = await orderModel.getClientIDByStoreID({ storeID });
        if (!clientID) {
            throw new AppError("حصل حطأ في ايجاد صاحب المتجر", 500);
        }
        for (const order of req.body) {
            orderData = OrderCreateSchema.parse(order);
            const createdOrder = await orderModel.createOrder(
                companyID,
                clientID,
                orderData
            );
            if (!createdOrder) {
                throw new AppError("Failed to create order", 500);
            }
            // @ts-expect-error Fix later
            createdOrders.push(createdOrder);
        }

        res.status(200).json({
            status: "success",
            data: createdOrders
        });
    } else {
        orderData = OrderCreateSchema.parse(req.body);
        const storeID = orderData.storeID;
        const clientID = await orderModel.getClientIDByStoreID({ storeID });
        if (!clientID) {
            throw new AppError("حصل حطأ في ايجاد صاحب المتجر", 500);
        }
        // @ts-expect-error Fix later
        createdOrder = await orderModel.createOrder(
            companyID,
            clientID,
            orderData
        );

        res.status(200).json({
            status: "success",
            data: createdOrder
        });
    }
    // const createdOrder = await orderModel.createOrder(
    //     companyID,
    //     clientID,
    //     orderData
    // );
});

export const getAllOrders = catchAsync(async (req, res) => {
    // Pagination
    const ordersCount = await orderModel.getOrdersCount();
    const size = req.query.size ? +req.query.size : 10;
    const pagesCount = Math.ceil(ordersCount / size);

    // Filters Query Params

    const search = req.query.search as string;

    const sort = (req.query.sort as string) || "id:asc";

    const startDate = req.query.start_date
        ? new Date(req.query.start_date as string)
        : undefined;
    const endDate = req.query.end_date
        ? new Date(req.query.end_date as string)
        : undefined;
    const deliveryDate = req.query.delivery_date
        ? new Date(req.query.delivery_date as string)
        : undefined;

    const governorate = req.query.governorate?.toString().toUpperCase() as
        | Governorate
        | undefined;
    const statuses = req.query.statuses?.toString().toUpperCase().split(",") as
        | OrderStatus[]
        | undefined;
    const status = req.query.status?.toString().toUpperCase() as
        | OrderStatus
        | undefined;

    const deliveryType = req.query.delivery_type?.toString().toUpperCase() as
        | DeliveryType
        | undefined;

    const deliveryAgentID = req.query.delivery_agent_id
        ? +req.query.delivery_agent_id
        : undefined;
    const clientID = req.query.client_id ? +req.query.client_id : undefined;
    const storeID = req.query.store_id ? +req.query.store_id : undefined;
    // const repositoryID = req.query.repository_id as string;
    const productID = req.query.product_id ? +req.query.product_id : undefined;
    const locationID = req.query.location_id
        ? +req.query.location_id
        : undefined;

    const receiptNumber = req.query.receipt_number
        ? +req.query.receipt_number
        : undefined;
    const recipientName = req.query.recipient_name as string;
    const recipientPhone = req.query.recipient_phone as string;
    const recipientAddress = req.query.recipient_address as string;

    const clientReport = req.query.client_report as string;
    const repositoryReport = req.query.repository_report as string;
    const branchReport = req.query.branch_report as string;
    const deliveryAgentReport = req.query.delivery_agent_report as string;
    const governorateReport = req.query.governorate_report as string;
    const companyReport = req.query.company_report as string;

    const notes = req.query.notes as string;

    if (pagesCount === 0) {
        res.status(200).json({
            status: "success",
            page: 1,
            pagesCount: 1,
            data: []
        });
        return;
    }

    let page = 1;
    if (
        req.query.page &&
        !Number.isNaN(+req.query.page) &&
        +req.query.page > 0
    ) {
        page = +req.query.page;
    }
    if (page > pagesCount) {
        throw new AppError("Page number out of range", 400);
    }
    const take = page * size;
    const skip = (page - 1) * size;
    // if (Number.isNaN(offset)) {
    //     skip = 0;
    // }

    const deleted = (req.query.deleted as string) || "false";

    const orderID = req.query.order_id ? +req.query.order_id : undefined;

    const orders = await orderModel.getAllOrders(skip, take, {
        orderID: orderID,
        search: search,
        sort: sort,
        startDate: startDate,
        endDate: endDate,
        deliveryDate: deliveryDate,
        governorate: governorate,
        statuses: statuses,
        status: status,
        deliveryType: deliveryType,
        deliveryAgentID: deliveryAgentID,
        clientID: clientID,
        storeID: storeID,
        // repositoryID: repositoryID,
        productID: productID,
        locationID: locationID,
        receiptNumber: receiptNumber,
        recipientName: recipientName,
        recipientPhone: recipientPhone,
        recipientAddress: recipientAddress,
        notes: notes,
        deleted: deleted,
        clientReport: clientReport,
        repositoryReport: repositoryReport,
        branchReport: branchReport,
        deliveryAgentReport: deliveryAgentReport,
        governorateReport: governorateReport,
        companyReport: companyReport
    });

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: orders
    });
});

export const getOrder = catchAsync(async (req, res) => {
    const orderID = +req.params["orderID"];

    const order = await orderModel.getOrder({
        orderID: orderID
    });

    res.status(200).json({
        status: "success",
        data: order
    });
});

export const updateOrder = catchAsync(async (req, res) => {
    const orderID = +req.params["orderID"];
    const loggedInUser = res.locals.user;

    const orderData = OrderUpdateSchema.parse(req.body);

    const oldOrderData = await orderModel.getOrder({
        orderID: orderID
    });

    const newOrder = await orderModel.updateOrder({
        orderID: orderID,
        orderData: orderData
    });

    res.status(200).json({
        status: "success",
        data: newOrder
    });

    // Update Order Timeline
    try {
        // @ts-expect-error Fix later
        const timeline: OrderTimelineType = oldOrderData?.timeline;

        // Update status
        // @ts-expect-error Fix later
        if (orderData.status && oldOrderData.status !== newOrder.status) {
            // send notification to client
            await sendNotification({
                // @ts-expect-error Fix later
                userID: newOrder.client.id,
                title: "تم تغيير حالة الطلب",
                content: `تم تغيير حالة الطلب رقم ${
                    // @ts-expect-error Fix later
                    newOrder.id
                    // @ts-expect-error Fix later
                } إلى ${localizeOrderStatus(newOrder.status)} ${
                    // @ts-expect-error Fix later
                    newOrder.notes ? "(" + newOrder.notes + ")" : ""
                }`
            });

            timeline.push({
                type: "STATUS_CHANGE",
                // @ts-expect-error Fix later
                old: oldOrderData?.status,
                // @ts-expect-error Fix later
                new: newOrder?.status,
                // @ts-expect-error Fix later
                date: newOrder?.updatedAt,
                by: {
                    id: loggedInUser.id,
                    name: loggedInUser.name,
                    role: loggedInUser.role
                }
            });
        }

        // Update delivery agent
        if (
            orderData.deliveryAgentID &&
            // @ts-expect-error Fix later
            oldOrderData.deliveryAgent?.id !== newOrder.deliveryAgent.id
        ) {
            timeline.push({
                type: "DELIVERY_AGENT_CHANGE",
                old: {
                    // @ts-expect-error Fix later
                    id: oldOrderData.deliveryAgent?.id,
                    // @ts-expect-error Fix later
                    name: oldOrderData.deliveryAgent?.name
                },
                new: {
                    // @ts-expect-error Fix later
                    id: newOrder.deliveryAgent.id,
                    // @ts-expect-error Fix later
                    name: newOrder.deliveryAgent.name
                },
                // @ts-expect-error Fix later
                date: newOrder?.updatedAt,
                by: {
                    id: loggedInUser.id,
                    name: loggedInUser.name,
                    role: loggedInUser.role
                }
            });
        }

        // // Update current location
        if (
            orderData.currentLocation &&
            // @ts-expect-error Fix later
            oldOrderData.currentLocation !== newOrder.currentLocation
        ) {
            timeline.push({
                type: "CURRENT_LOCATION_CHANGE",
                // @ts-expect-error Fix later
                old: oldOrderData?.currentLocation,
                // @ts-expect-error Fix later
                new: newOrder?.currentLocation,
                // @ts-expect-error Fix later
                date: newOrder?.updatedAt,
                by: {
                    id: loggedInUser.id,
                    name: loggedInUser.name,
                    role: loggedInUser.role
                }
            });
        }

        // Update paid amount
        if (
            orderData.paidAmount &&
            // @ts-expect-error Fix later
            +oldOrderData.paidAmount !== +newOrder.paidAmount
        ) {
            timeline.push({
                type: "PAID_AMOUNT_CHANGE",
                // @ts-expect-error Fix later
                old: oldOrderData?.paidAmount,
                // @ts-expect-error Fix later
                new: newOrder?.paidAmount,
                // @ts-expect-error Fix later
                date: newOrder?.updatedAt,
                by: {
                    id: loggedInUser.id,
                    name: loggedInUser.name,
                    role: loggedInUser.role
                }
            });
        }

        // Update delivery date
        if (
            orderData.deliveryDate &&
            // @ts-expect-error Fix later
            oldOrderData.deliveryDate?.toString() !==
                // @ts-expect-error Fix later
                newOrder.deliveryDate.toString()
        ) {
            timeline.push({
                type: "ORDER_DELIVERY",
                // TODO
                // date: newOrder?.updatedAt,
                // @ts-expect-error Fix later
                date: newOrder?.deliveryDate,
                by: {
                    id: loggedInUser.id,
                    name: loggedInUser.name,
                    role: loggedInUser.role
                }
            });
        }

        await orderModel.updateOrderTimeline({
            orderID: orderID,
            timeline: timeline
        });
    } catch (error) {
        Logger.error(error);
    }
});

export const deleteOrder = catchAsync(async (req, res) => {
    const orderID = +req.params["orderID"];

    await orderModel.deleteOrder({
        orderID: orderID
    });

    res.status(200).json({
        status: "success"
    });
});

export const createOrdersReceipts = catchAsync(async (req, res) => {
    const ordersIDs = OrdersReceiptsCreateSchema.parse(req.body);

    const orders = await orderModel.getOrdersByIDs(ordersIDs);

    const pdf = await generateReceipts(orders);

    const chunks: Uint8Array[] = [];
    let result;

    pdf.on("data", function (chunk) {
        chunks.push(chunk);
    });

    pdf.on("end", function () {
        result = Buffer.concat(chunks);
        res.contentType("application/pdf");
        res.send(result);
    });

    pdf.end();
});

// TODO: Remove this
// export const getAllOrdersStatuses = catchAsync(async (req, res) => {
//     const ordersStatuses = await orderModel.getAllOrdersStatuses();

//     res.status(200).json({
//         status: "success",
//         data: ordersStatuses
//     });
// });

// TODO: Remove this
// export const getTodayOrdersCountAndEarnings = catchAsync(async (req, res) => {
//     const todayOrdersCountAndEarnings =
//         await orderModel.getTodayOrdersCountAndEarnings();

//     res.status(200).json({
//         status: "success",
//         data: todayOrdersCountAndEarnings
//     });
// });

export const getOrdersStatistics = catchAsync(async (req, res) => {
    const storeID = req.query.store_id ? +req.query.store_id : undefined;

    const clientID = req.query.client_id ? +req.query.client_id : undefined;

    const companyID = req.query.company_id ? +req.query.company_id : undefined;

    // TODO: Fix this
    const clientReport = (
        req.query.client_report === "true"
            ? true
            : req.query.client_report === "false"
              ? false
              : undefined
    ) as boolean | undefined;

    const branchReport = (
        req.query.branch_report === "true"
            ? true
            : req.query.branch_report === "false"
              ? false
              : undefined
    ) as boolean | undefined;

    const repositoryReport = (
        req.query.repository_report === "true"
            ? true
            : req.query.repository_report === "false"
              ? false
              : undefined
    ) as boolean | undefined;

    const deliveryAgentReport = (
        req.query.delivery_agent_report === "true"
            ? true
            : req.query.delivery_agent_report === "false"
              ? false
              : undefined
    ) as boolean | undefined;

    const governorateReport = (
        req.query.governorate_report === "true"
            ? true
            : req.query.governorate_report === "false"
              ? false
              : undefined
    ) as boolean | undefined;

    const companyReport = (
        req.query.company_report === "true"
            ? true
            : req.query.company_report === "false"
              ? false
              : undefined
    ) as boolean | undefined;

    const statuses = req.query.statuses?.toString().toUpperCase().split(",") as
        | OrderStatus[]
        | undefined;

    const deliveryType = req.query.delivery_type?.toString().toUpperCase() as
        | DeliveryType
        | undefined;

    const locationID = req.query.location_id
        ? +req.query.location_id
        : undefined;

    const startDate = req.query.start_date
        ? new Date(req.query.start_date as string)
        : undefined;

    const endDate = req.query.end_date
        ? new Date(req.query.end_date as string)
        : undefined;

    const governorate = req.query.governorate?.toString().toUpperCase() as
        | Governorate
        | undefined;

    const statistics = await orderModel.getOrdersStatistics({
        storeID: storeID,
        companyID: companyID,
        clientReport: clientReport,
        governorate: governorate,
        startDate: startDate,
        endDate: endDate,
        clientID: clientID,
        branchReport: branchReport,
        repositoryReport: repositoryReport,
        deliveryAgentReport: deliveryAgentReport,
        governorateReport: governorateReport,
        companyReport: companyReport,
        statuses: statuses,
        deliveryType: deliveryType,
        locationID: locationID
    });

    res.status(200).json({
        status: "success",
        data: statistics
    });
});

export const getOrderTimeline = catchAsync(async (req, res) => {
    const orderID = +req.params["orderID"];

    const orderTimeline = await orderModel.getOrderTimeline({
        orderID: orderID
    });

    res.status(200).json({
        status: "success",
        data: orderTimeline?.timeline as string
    });
});

export const getOrderChatMembers = catchAsync(async (req, res) => {
    const orderID = +req.params["orderID"];

    const orderChatMembers = await orderModel.getOrderChatMembers({
        orderID: orderID
    });

    res.status(200).json({
        status: "success",
        data: orderChatMembers
    });
});

export const deactivateOrder = catchAsync(async (req, res) => {
    const orderID = +req.params["orderID"];
    const loggedInUserID = +res.locals.user.id;

    await orderModel.deactivateOrder({
        orderID: orderID,
        deletedByID: loggedInUserID
    });

    res.status(200).json({
        status: "success"
    });
});

export const reactivateOrder = catchAsync(async (req, res) => {
    const orderID = +req.params["orderID"];

    await orderModel.reactivateOrder({
        orderID: orderID
    });

    res.status(200).json({
        status: "success"
    });
});

export const sendNotificationToOrderChatMembers = catchAsync(
    async (req, res) => {
        const orderID = +req.params["orderID"];
        const loggedInUser = res.locals.user;

        const notificationData = OrderChatNotificationCreateSchema.parse(
            req.body
        );

        const orderChatMembers = await orderModel.getOrderChatMembers({
            orderID: orderID
        });

        const notificationPromises = orderChatMembers.map((member) => {
            if (!member) {
                return Promise.resolve();
            }
            if (member.id === loggedInUser.id) {
                return Promise.resolve();
            }
            return sendNotification({
                userID: member.id,
                title: notificationData.title,
                content:
                    notificationData.content ||
                    `تم إرسال رسالة جديدة في الطلب رقم ${orderID} من قبل ${loggedInUser.name}`
            });
        });

        await Promise.all(notificationPromises);

        res.status(200).json({
            status: "success"
        });
    }
);
