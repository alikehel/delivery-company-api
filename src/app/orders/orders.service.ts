import { EmployeeRole, Order } from "@prisma/client";
import { AppError } from "../../lib/AppError";
import { localizeOrderStatus } from "../../lib/localize";
import { Logger } from "../../lib/logger";
import { loggedInUserType } from "../../types/user";
import { sendNotification } from "../notifications/helpers/sendNotification";
// import { generateReceipts } from "./helpers/generateReceipts";
import { generateOrdersReport } from "./helpers/generateOrdersReport";
import { generateReceipts } from "./helpers/generateReceipts";
import {
    OrderChatNotificationCreateType,
    OrderCreateType,
    OrderTimelineType,
    OrderUpdateType,
    OrdersFiltersType,
    OrdersReceiptsCreateType,
    OrdersReportPDFCreateType,
    // OrdersReceiptsCreateType,
    OrdersStatisticsFiltersType
} from "./orders.dto";
import { OrdersRepository } from "./orders.repository";
import { orderReform } from "./orders.responses";

const ordersRepository = new OrdersRepository();

export class OrdersService {
    createOrder = async (data: {
        loggedInUser: loggedInUserType;
        orderOrOrdersData: OrderCreateType | OrderCreateType[];
    }) => {
        let confirmed: boolean;
        if (data.loggedInUser.role === "CLIENT" || data.loggedInUser.role === "CLIENT_ASSISTANT") {
            confirmed = false;
        } else {
            confirmed = true;
        }

        if (Array.isArray(data.orderOrOrdersData)) {
            const createdOrders: Order[] = [];
            for (const order of data.orderOrOrdersData) {
                const storeID = order.storeID;
                const clientID = await ordersRepository.getClientIDByStoreID({ storeID });
                if (!clientID) {
                    throw new AppError("حصل حطأ في ايجاد صاحب المتجر", 500);
                }
                const createdOrder = await ordersRepository.createOrder({
                    companyID: data.loggedInUser.companyID as number,
                    clientID,
                    orderData: { ...order, confirmed }
                });
                if (!createdOrder) {
                    throw new AppError("Failed to create order", 500);
                }
                // @ts-expect-error Fix later
                createdOrders.push(createdOrder);
            }
            return createdOrders;
        }

        const storeID = data.orderOrOrdersData.storeID;
        const clientID = await ordersRepository.getClientIDByStoreID({ storeID });
        if (!clientID) {
            throw new AppError("حصل حطأ في ايجاد صاحب المتجر", 500);
        }
        const createdOrder = await ordersRepository.createOrder({
            companyID: data.loggedInUser.companyID as number,
            clientID,
            orderData: { ...data.orderOrOrdersData, confirmed }
        });
        return createdOrder;
    };

    getAllOrders = async (data: {
        filters: OrdersFiltersType;
        loggedInUser: loggedInUserType;
    }) => {
        const clientID =
            data.loggedInUser.role === "CLIENT" || data.loggedInUser.role === "CLIENT_ASSISTANT"
                ? data.loggedInUser.id
                : data.filters.clientID;
        const deliveryAgentID =
            data.loggedInUser.role === EmployeeRole.DELIVERY_AGENT
                ? data.loggedInUser.id
                : data.filters.deliveryAgentID;
        // const companyID =
        //     Object.keys(AdminRole).includes(data.loggedInUser.role) && data.filters.companyID
        //         ? data.filters.companyID
        //         : data.loggedInUser.companyID || undefined;\

        const companyID = data.filters.companyID
            ? data.filters.companyID
            : data.loggedInUser.companyID || undefined;

        // Pagination
        const ordersCount = await ordersRepository.getOrdersCount({ filters: data.filters });
        let size = data.filters.size;
        if (size > 50 && data.filters.minified !== true) {
            size = 10;
        }
        const pagesCount = Math.ceil(ordersCount / size);

        // TODO: Fix this hard coded code
        if (pagesCount === 0) {
            return {
                page: 1,
                pagesCount: 1,
                orders: [],
                ordersMetaData: {
                    count: 0,
                    totalCost: 0,
                    paidAmount: 0,
                    clientNet: 0,
                    deliveryAgentNet: 0,
                    companyNet: 0,
                    deliveryCost: 0,
                    countByStatus: [
                        {
                            status: "REGISTERED",
                            count: 0
                        },
                        {
                            status: "READY_TO_SEND",
                            count: 0
                        },
                        {
                            status: "WITH_DELIVERY_AGENT",
                            count: 0
                        },
                        {
                            status: "DELIVERED",
                            count: 0
                        },
                        {
                            status: "REPLACED",
                            count: 0
                        },
                        {
                            status: "PARTIALLY_RETURNED",
                            count: 0
                        },
                        {
                            status: "RETURNED",
                            count: 0
                        },
                        {
                            status: "POSTPONED",
                            count: 0
                        },
                        {
                            status: "CHANGE_ADDRESS",
                            count: 0
                        },
                        {
                            status: "RESEND",
                            count: 0
                        },
                        {
                            status: "WITH_RECEIVING_AGENT",
                            count: 0
                        },
                        {
                            status: "PROCESSING",
                            count: 0
                        }
                    ]
                }
            };
        }

        if (data.filters.page > pagesCount) {
            throw new AppError("Page number out of range", 400);
        }
        const take = data.filters.page * size;
        const skip = (data.filters.page - 1) * size;

        const { orders, ordersMetaData } = await ordersRepository.getAllOrders({
            skip,
            take,
            filters: { ...data.filters, clientID, deliveryAgentID, companyID }
        });

        return {
            page: data.filters.page,
            pagesCount,
            orders,
            ordersMetaData: ordersMetaData
        };
    };

    getOrder = async (data: {
        params: {
            orderID: number;
        };
    }) => {
        const order = await ordersRepository.getOrder({
            orderID: data.params.orderID
        });

        return order;
    };

    updateOrder = async (data: {
        params: {
            orderID: number;
        };
        loggedInUser: loggedInUserType;
        orderData: OrderUpdateType;
    }) => {
        const oldOrderData = await ordersRepository.getOrder({
            orderID: data.params.orderID
        });

        const newOrder = await ordersRepository.updateOrder({
            orderID: data.params.orderID,
            orderData: data.orderData
        });

        // TODO: Move this to a separate function and call it in the controller after the response
        // Update Order Timeline
        try {
            // @ts-expect-error Fix later
            const timeline: OrderTimelineType = oldOrderData?.timeline;

            // Update status
            // @ts-expect-error Fix later
            if (data.orderData.status && oldOrderData.status !== newOrder.status) {
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
                        id: data.loggedInUser.id,
                        name: data.loggedInUser.name,
                        // @ts-expect-error Fix later
                        role: data.loggedInUser.role
                    }
                });
            }

            // Update delivery agent
            if (
                data.orderData.deliveryAgentID &&
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
                        id: data.loggedInUser.id,
                        name: data.loggedInUser.name,
                        // @ts-expect-error Fix later
                        role: data.loggedInUser.role
                    }
                });
            }

            // Update CLIENT
            if (
                data.orderData.clientID &&
                // @ts-expect-error Fix later
                oldOrderData.client?.id !== newOrder.client.id
            ) {
                timeline.push({
                    type: "CLIENT_CHANGE",
                    old: {
                        // @ts-expect-error Fix later
                        id: oldOrderData?.client?.id,
                        // @ts-expect-error Fix later
                        name: oldOrderData?.client?.name
                    },
                    new: {
                        // @ts-expect-error Fix later
                        id: newOrder?.client.id,
                        // @ts-expect-error Fix later
                        name: newOrder?.client.name
                    },
                    // @ts-expect-error Fix later
                    date: newOrder?.updatedAt,
                    by: {
                        id: data.loggedInUser.id,
                        name: data.loggedInUser.name,
                        // @ts-expect-error Fix later
                        role: data.loggedInUser.role
                    }
                });
            }

            // Update CLIENT
            if (
                data.orderData.repositoryID &&
                // @ts-expect-error Fix later
                oldOrderData?.repository?.id !== newOrder.repository.id
            ) {
                timeline.push({
                    type: "CLIENT_CHANGE",
                    old: {
                        // @ts-expect-error Fix later
                        id: oldOrderData?.repository?.id,
                        // @ts-expect-error Fix later
                        name: oldOrderData?.repository?.name
                    },
                    new: {
                        // @ts-expect-error Fix later
                        id: newOrder?.repository.id,
                        // @ts-expect-error Fix later
                        name: newOrder?.repository.name
                    },
                    // @ts-expect-error Fix later
                    date: newOrder?.updatedAt,
                    by: {
                        id: data.loggedInUser.id,
                        name: data.loggedInUser.name,
                        // @ts-expect-error Fix later
                        role: data.loggedInUser.role
                    }
                });
            }

            // // Update current location
            if (
                data.orderData.currentLocation &&
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
                        id: data.loggedInUser.id,
                        name: data.loggedInUser.name,
                        // @ts-expect-error Fix later
                        role: data.loggedInUser.role
                    }
                });
            }

            // Update paid amount
            if (
                data.orderData.paidAmount &&
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
                        id: data.loggedInUser.id,
                        name: data.loggedInUser.name,
                        // @ts-expect-error Fix later
                        role: data.loggedInUser.role
                    }
                });
            }

            // Update delivery date
            if (
                data.orderData.deliveryDate &&
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
                        id: data.loggedInUser.id,
                        name: data.loggedInUser.name,
                        // @ts-expect-error Fix later
                        role: data.loggedInUser.role
                    }
                });
            }

            await ordersRepository.updateOrderTimeline({
                orderID: data.params.orderID,
                timeline: timeline
            });
        } catch (error) {
            Logger.error(error);
        }

        return newOrder;
    };

    deleteOrder = async (data: {
        params: {
            orderID: number;
        };
    }) => {
        await ordersRepository.deleteOrder({
            orderID: data.params.orderID
        });
    };

    createOrdersReceipts = async (data: {
        ordersIDs: OrdersReceiptsCreateType;
    }) => {
        const orders = await ordersRepository.getOrdersByIDs(data.ordersIDs);

        const pdf = await generateReceipts(orders);

        return pdf;
    };

    async getOrdersReportPDF(data: {
        ordersData: OrdersReportPDFCreateType;
        ordersFilters: OrdersFiltersType;
    }) {
        let orders: ReturnType<typeof orderReform>[];
        let ordersIDs: number[] = [];
        if (data.ordersData.ordersIDs === "*") {
            orders = (
                await ordersRepository.getAllOrders({
                    take: 2000,
                    skip: 0,
                    filters: { ...data.ordersFilters }
                })
            ).orders as ReturnType<typeof orderReform>[];

            for (const order of orders) {
                if (order) {
                    ordersIDs.push(order.id);
                }
            }
        } else {
            orders = await ordersRepository.getOrdersByIDs({ ordersIDs: data.ordersData.ordersIDs });
            ordersIDs = data.ordersData.ordersIDs;
        }

        if (!orders || orders.length === 0) {
            throw new AppError("لا يوجد طلبات لعمل التقرير", 400);
        }

        let ordersData: object;
        if (data.ordersData.type === "DELIVERY_AGENT_MANIFEST") {
            ordersData = {
                deliveryAgent: orders[0]?.deliveryAgent,
                date: new Date(),
                count: orders.length,
                company: orders[0]?.company
            };
        } else {
            ordersData = {
                date: new Date(),
                count: orders.length,
                company: orders[0]?.company
            };
        }

        const pdf = await generateOrdersReport(data.ordersData.type, ordersData, orders);
        return pdf;
    }

    getOrdersStatistics = async (data: {
        filters: OrdersStatisticsFiltersType;
        loggedInUser: loggedInUserType;
    }) => {
        const statistics = await ordersRepository.getOrdersStatistics({
            filters: data.filters
        });

        return statistics;
    };

    getOrderTimeline = async (data: {
        params: {
            orderID: number;
        };
    }) => {
        const orderTimeline = await ordersRepository.getOrderTimeline({
            orderID: data.params.orderID
        });

        return orderTimeline?.timeline as string;
    };

    getOrderChatMembers = async (data: {
        params: {
            orderID: number;
        };
    }) => {
        const orderChatMembers = await ordersRepository.getOrderChatMembers({
            orderID: data.params.orderID
        });

        return orderChatMembers;
    };

    deactivateOrder = async (data: {
        params: {
            orderID: number;
        };
        loggedInUser: loggedInUserType;
    }) => {
        await ordersRepository.deactivateOrder({
            orderID: data.params.orderID,
            deletedByID: data.loggedInUser.id
        });
    };

    reactivateOrder = async (data: {
        params: {
            orderID: number;
        };
    }) => {
        await ordersRepository.reactivateOrder({
            orderID: data.params.orderID
        });
    };

    sendNotificationToOrderChatMembers = async (data: {
        params: {
            orderID: number;
        };
        loggedInUser: loggedInUserType;
        notificationData: OrderChatNotificationCreateType;
    }) => {
        const orderChatMembers = await ordersRepository.getOrderChatMembers({
            orderID: data.params.orderID
        });

        const notificationPromises = orderChatMembers.map((member) => {
            if (!member) {
                return Promise.resolve();
            }
            if (member.id === data.loggedInUser.id) {
                return Promise.resolve();
            }
            return sendNotification({
                userID: member.id,
                title: data.notificationData.title,
                content:
                    data.notificationData.content ||
                    `تم إرسال رسالة جديدة في الطلب رقم ${data.params.orderID} من قبل ${data.loggedInUser.name}`
            });
        });

        await Promise.all(notificationPromises);
    };
}
