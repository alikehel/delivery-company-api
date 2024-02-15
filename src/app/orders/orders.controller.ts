import { AdminRole, DeliveryType, EmployeeRole, Governorate, Order, OrderStatus } from "@prisma/client";
import { AppError } from "../../lib/AppError";
import { catchAsync } from "../../lib/catchAsync";
import { localizeOrderStatus } from "../../lib/localize";
import { Logger } from "../../lib/logger";
import { loggedInUserType } from "../../types/user";
import sendNotification from "../notifications/helpers/sendNotification";
import { generateReceipts } from "./helpers/generateReceipts";
import { OrderModel } from "./order.model";
import {
    OrderChatNotificationCreateSchema,
    OrderCreateSchema,
    OrderCreateType,
    OrderTimelineType,
    OrderUpdateSchema,
    OrdersFiltersSchema,
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
        for (const order of req.body) {
            orderData = OrderCreateSchema.parse(order);
            const storeID = orderData.storeID;
            const clientID = await orderModel.getClientIDByStoreID({ storeID });
            if (!clientID) {
                throw new AppError("حصل حطأ في ايجاد صاحب المتجر", 500);
            }
            const createdOrder = await orderModel.createOrder(companyID, clientID, orderData);
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
        createdOrder = await orderModel.createOrder(companyID, clientID, orderData);

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
    const loggedInUser = res.locals.user as loggedInUserType;

    const filters = OrdersFiltersSchema.parse({
        clientID:
            loggedInUser.role === "CLIENT" || loggedInUser.role === "CLIENT_ASSISTANT"
                ? loggedInUser.id
                : req.query.client_id,
        deliveryAgentID:
            loggedInUser.role === EmployeeRole.DELIVERY_AGENT ? loggedInUser.id : req.query.delivery_agent_id,
        companyID:
            Object.keys(AdminRole).includes(loggedInUser.role) && req.query.company_id
                ? req.query.company_id
                : loggedInUser.companyID,
        automaticUpdateID: req.query.automatic_update_id,
        search: req.query.search,
        sort: req.query.sort,
        startDate: req.query.start_date,
        endDate: req.query.end_date,
        deliveryDate: req.query.delivery_date,
        governorate: req.query.governorate,
        statuses: req.query.statuses,
        status: req.query.status,
        deliveryType: req.query.delivery_type,
        storeID: req.query.store_id,
        repositoryID: req.query.repository_id,
        branchID: req.query.branch_id,
        productID: req.query.product_id,
        locationID: req.query.location_id,
        receiptNumber: req.query.receipt_number,
        recipientName: req.query.recipient_name,
        recipientPhone: req.query.recipient_phone,
        recipientAddress: req.query.recipient_address,
        clientReport: req.query.client_report,
        repositoryReport: req.query.repository_report,
        branchReport: req.query.branch_report,
        deliveryAgentReport: req.query.delivery_agent_report,
        governorateReport: req.query.governorate_report,
        companyReport: req.query.company_report,
        notes: req.query.notes,
        deleted: req.query.deleted,
        orderID: req.query.order_id
    });

    // Pagination
    const ordersCount = await orderModel.getOrdersCount(filters);
    let size = req.query.size ? +req.query.size : 10;
    if (size > 50) {
        size = 10;
    }
    const pagesCount = Math.ceil(ordersCount / size);

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
    if (req.query.page && !Number.isNaN(+req.query.page) && +req.query.page > 0) {
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

    const orders = await orderModel.getAllOrders(skip, take, filters);

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: orders
    });
});

export const getOrder = catchAsync(async (req, res) => {
    const orderID = +req.params.orderID;

    const order = await orderModel.getOrder({
        orderID: orderID
    });

    res.status(200).json({
        status: "success",
        data: order
    });
});

export const updateOrder = catchAsync(async (req, res) => {
    const orderID = +req.params.orderID;
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
                    newOrder.notes ? `(${newOrder.notes})` : ""
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
    const orderID = +req.params.orderID;

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
    let result: Buffer;

    pdf.on("data", (chunk) => {
        chunks.push(chunk);
    });

    pdf.on("end", () => {
        result = Buffer.concat(chunks);
        res.contentType("application/pdf");
        res.send(result);
    });

    pdf.end();
});

export const getOrdersStatistics = catchAsync(async (req, res) => {
    // Filters
    const loggedInUser = res.locals.user as loggedInUserType;
    let companyID: number | undefined;
    if (Object.keys(AdminRole).includes(loggedInUser.role)) {
        companyID = req.query.company_id ? +req.query.company_id : undefined;
    } else if (loggedInUser.companyID) {
        companyID = loggedInUser.companyID;
    }

    const storeID = req.query.store_id ? +req.query.store_id : undefined;

    let clientID: number | undefined;
    if (loggedInUser.role === "CLIENT" || loggedInUser.role === "CLIENT_ASSISTANT") {
        clientID = +loggedInUser.id;
    } else if (req.query.client_id) {
        clientID = +req.query.client_id;
    } else {
        clientID = undefined;
    }

    let deliveryAgentID: number | undefined;
    if (loggedInUser.role === EmployeeRole.DELIVERY_AGENT) {
        deliveryAgentID = +loggedInUser.id;
    } else if (req.query.delivery_agent_id) {
        deliveryAgentID = +req.query.delivery_agent_id;
    } else {
        deliveryAgentID = undefined;
    }

    // TODO: Fix this
    const clientReport = (
        req.query.client_report === "true" ? true : req.query.client_report === "false" ? false : undefined
    ) as boolean | undefined;

    const branchReport = (
        req.query.branch_report === "true" ? true : req.query.branch_report === "false" ? false : undefined
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
        req.query.company_report === "true" ? true : req.query.company_report === "false" ? false : undefined
    ) as boolean | undefined;

    const statuses = req.query.statuses?.toString().toUpperCase().split(",") as OrderStatus[] | undefined;

    const deliveryType = req.query.delivery_type?.toString().toUpperCase() as DeliveryType | undefined;

    const locationID = req.query.location_id ? +req.query.location_id : undefined;

    const startDate = req.query.start_date ? new Date(req.query.start_date as string) : undefined;

    const endDate = req.query.end_date ? new Date(req.query.end_date as string) : undefined;

    const governorate = req.query.governorate?.toString().toUpperCase() as Governorate | undefined;

    const statistics = await orderModel.getOrdersStatistics({
        storeID: storeID,
        companyID: companyID,
        clientReport: clientReport,
        governorate: governorate,
        startDate: startDate,
        deliveryAgentID: deliveryAgentID,
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
    const orderID = +req.params.orderID;

    const orderTimeline = await orderModel.getOrderTimeline({
        orderID: orderID
    });

    res.status(200).json({
        status: "success",
        data: orderTimeline?.timeline as string
    });
});

export const getOrderChatMembers = catchAsync(async (req, res) => {
    const orderID = +req.params.orderID;

    const orderChatMembers = await orderModel.getOrderChatMembers({
        orderID: orderID
    });

    res.status(200).json({
        status: "success",
        data: orderChatMembers
    });
});

export const deactivateOrder = catchAsync(async (req, res) => {
    const orderID = +req.params.orderID;
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
    const orderID = +req.params.orderID;

    await orderModel.reactivateOrder({
        orderID: orderID
    });

    res.status(200).json({
        status: "success"
    });
});

export const sendNotificationToOrderChatMembers = catchAsync(async (req, res) => {
    const orderID = +req.params.orderID;
    const loggedInUser = res.locals.user;

    const notificationData = OrderChatNotificationCreateSchema.parse(req.body);

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
});
