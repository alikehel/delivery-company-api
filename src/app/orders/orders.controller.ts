import { OrderStatus } from "@prisma/client";
import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
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
    const ordersCount = await orderModel.getOrdersCount();
    const size = req.query.size ? +req.query.size : 10;
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

    const orders = await orderModel.getAllOrders(skip, take);

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
