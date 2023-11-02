import {
    DeliveryType,
    Governorate,
    Order,
    OrderStatus,
    Prisma
} from "@prisma/client";
import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
import { generateReceipt } from "./helpers/generateReceipt";
import { OrderModel } from "./order.model";
import { OrderCreateSchema, OrderUpdateSchema } from "./orders.zod";

const orderModel = new OrderModel();

export const createOrder = catchAsync(async (req, res) => {
    const orderData = OrderCreateSchema.parse(req.body);

    const createdOrder = await orderModel.createOrder(orderData);

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

    const deliveryAgentID = req.query.delivery_agent_id as string;
    const clientID = req.query.client_id as string;
    const storeID = req.query.store_id as string;
    // const repositoryID = req.query.repository_id as string;
    const productID = req.query.product_id as string;
    const locationID = req.query.location_id as string;

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
        notes: notes
    });

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: orders
    });
});

export const getOrder = catchAsync(async (req, res) => {
    const orderID = req.params["orderID"];

    const order = await orderModel.getOrder({
        orderID: orderID
    });

    res.status(200).json({
        status: "success",
        data: order
    });
});

export const updateOrder = catchAsync(async (req, res) => {
    const orderID = req.params["orderID"];

    const orderData = OrderUpdateSchema.parse(req.body);

    const order = await orderModel.updateOrder({
        orderID: orderID,
        orderData: orderData
    });

    res.status(200).json({
        status: "success",
        data: order
    });
});

export const getOrderReceipt = catchAsync(async (req, res) => {
    const orderID = req.params["orderID"];
    const order = (await orderModel.getOrder({
        orderID: orderID
    })) as unknown as Order;

    // await generateReceipt3(
    // order as Prisma.OrderGetPayload<{
    //     include: {
    //         client: boolean;
    //         tenant: boolean;
    //     };
    // }>
    // );

    const pdf = await generateReceipt(
        order as Prisma.OrderGetPayload<{
            include: {
                client: boolean;
                tenant: boolean;
            };
        }>
    );

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

    // res.status(200).json({
    //     status: "success",
    //     data: {
    //         receipt: `/storage/receipts/receipt-${order.receiptNumber}.pdf`
    //     }
    // });
});

export const deleteOrder = catchAsync(async (req, res) => {
    const orderID = req.params["orderID"];

    await orderModel.deleteOrder({
        orderID: orderID
    });

    res.status(200).json({
        status: "success"
    });
});

export const getAllOrdersStatuses = catchAsync(async (req, res) => {
    const ordersStatuses = await orderModel.getAllOrdersStatuses();

    const ordersStatusesReformed = (
        Object.keys(OrderStatus) as Array<keyof typeof OrderStatus>
    ).map((status) => {
        const statusCount = ordersStatuses.find((orderStatus) => {
            return orderStatus.status === status;
        });

        return {
            status: status,
            count: statusCount?._count?.status || 0
        };
    });

    // const ordersStatusesReformed = ordersStatuses.map((orderStatus) => {
    //     return {
    //         status: orderStatus.status,
    //         count: orderStatus._count.status
    //     };
    // });

    res.status(200).json({
        status: "success",
        data: ordersStatusesReformed
    });
});

export const getTodayOrdersCountAndEarnings = catchAsync(async (req, res) => {
    const todayOrdersCountAndEarnings =
        await orderModel.getTodayOrdersCountAndEarnings();

    const todayOrdersCountAndEarningsReformed = {
        count: todayOrdersCountAndEarnings._count.id,
        totalCost: todayOrdersCountAndEarnings._sum.totalCost || 0
    };

    res.status(200).json({
        status: "success",
        data: todayOrdersCountAndEarningsReformed
    });
});
