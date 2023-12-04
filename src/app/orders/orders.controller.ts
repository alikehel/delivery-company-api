import { DeliveryType, Governorate, OrderStatus } from "@prisma/client";
import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
import { generateReceipts } from "./helpers/generateReceipts";
import { OrderModel } from "./order.model";
import {
    OrderCreateSchema,
    OrderUpdateSchema,
    OrdersReceiptsCreateSchema
} from "./orders.zod";

const orderModel = new OrderModel();

export const createOrder = catchAsync(async (req, res) => {
    const orderData = OrderCreateSchema.parse(req.body);
    const clientID = +res.locals.user.id;
    const companyID = +res.locals.user.companyID;

    const createdOrder = await orderModel.createOrder(
        companyID,
        clientID,
        orderData
    );

    res.status(200).json({
        status: "success",
        data: createdOrder
    });
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

    const deleted = (req.query.deleted as unknown as boolean) || false;

    const orders = await orderModel.getAllOrders(skip, take, {
        search: search,
        sort: sort,
        startDate: startDate,
        endDate: endDate,
        deliveryDate: deliveryDate,
        governorate: governorate,
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
        deleted: deleted
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

    if (oldOrderData?.status !== newOrder?.status) {
        const oldTimeline = oldOrderData?.timeline;
        await orderModel.updateOrderTimeline({
            orderID: orderID,
            timeline: [
                ...(oldTimeline as any),
                {
                    type: "STATUS_CHANGE",
                    old: oldOrderData?.status,
                    new: newOrder?.status,
                    date: newOrder?.updatedAt
                }
            ]
        });
    }
});

export const deleteOrder = catchAsync(async (req, res) => {
    const orderID = +req.params["orderID"];
    const loggedInUserID = +res.locals.user.id;

    await orderModel.deleteOrder({
        orderID: orderID,
        deletedByID: loggedInUserID
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

export const getAllOrdersStatuses = catchAsync(async (req, res) => {
    const ordersStatuses = await orderModel.getAllOrdersStatuses();

    res.status(200).json({
        status: "success",
        data: ordersStatuses
    });
});

export const getTodayOrdersCountAndEarnings = catchAsync(async (req, res) => {
    const todayOrdersCountAndEarnings =
        await orderModel.getTodayOrdersCountAndEarnings();

    res.status(200).json({
        status: "success",
        data: todayOrdersCountAndEarnings
    });
});

export const getOrdersStatistics = catchAsync(async (req, res) => {
    const storeID = req.query.store_id ? +req.query.store_id : undefined;

    const tenantID = req.query.tenant_id ? +req.query.tenant_id : undefined;

    // TODO: Fix this
    const recorded = (
        req.query.recorded === "true"
            ? true
            : req.query.recorded === "false"
            ? false
            : undefined
    ) as boolean | undefined;

    // const status = req.query.status?.toString().toUpperCase() as
    //     | OrderStatus
    //     | undefined;

    const startDate = req.query.start_date
        ? new Date(req.query.start_date as string)
        : undefined;

    const endDate = req.query.end_date
        ? new Date(req.query.end_date as string)
        : undefined;

    const statistics = await orderModel.getOrdersStatistics({
        storeID: storeID,
        tenantID: tenantID,
        recorded: recorded,
        // status: status,
        startDate: startDate,
        endDate: endDate
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
