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
                    loggedInUser: data.loggedInUser,
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
            loggedInUser: data.loggedInUser,
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

        let size = data.filters.size;
        if (size > 50 && data.filters.minified !== true) {
            size = 10;
        }

        const { orders, ordersMetaData, pagesCount } = await ordersRepository.getAllOrders({
            filters: { ...data.filters, clientID, deliveryAgentID, companyID, size }
        });

        return {
            page: data.filters.page,
            pagesCount: pagesCount,
            orders: orders,
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
        if (data.orderData.confirmed && data.loggedInUser.role !== "COMPANY_MANAGER") {
            throw new AppError("ليس لديك صلاحية تأكيد الطلب", 403);
        }

        const oldOrderData = await ordersRepository.getOrder({
            orderID: data.params.orderID
        });

        const newOrder = await ordersRepository.updateOrder({
            orderID: data.params.orderID,
            loggedInUser: data.loggedInUser,
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

            // Update Repository
            if (
                data.orderData.repositoryID &&
                // @ts-expect-error Fix later
                oldOrderData?.repository?.id !== newOrder.repository.id
            ) {
                timeline.push({
                    type: "REPOSITORY_CHANGE",
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

            // Update Branch
            if (
                data.orderData.branchID &&
                // @ts-expect-error Fix later
                oldOrderData?.branch?.id !== newOrder.branch.id
            ) {
                timeline.push({
                    type: "BRANCH_CHANGE",
                    old: {
                        // @ts-expect-error Fix later
                        id: oldOrderData?.branch?.id,
                        // @ts-expect-error Fix later
                        name: oldOrderData?.branch?.name
                    },
                    new: {
                        // @ts-expect-error Fix later
                        id: newOrder?.branch.id,
                        // @ts-expect-error Fix later
                        name: newOrder?.branch.name
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
                    filters: { ...data.ordersFilters, size: 5000 }
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
            if (!data.ordersFilters.deliveryAgentID) {
                throw new AppError("يجب تحديد مندوب التوصيل لعمل التقرير", 400);
            }
            ordersData = {
                deliveryAgent: orders[0]?.deliveryAgent,
                date: new Date(),
                count: orders.length,
                baghdadCount: orders.filter((order) => order?.governorate === "BAGHDAD").length,
                governoratesCount: orders.filter((order) => order?.governorate !== "BAGHDAD").length,
                company: orders[0]?.company
            };
        } else {
            ordersData = {
                date: new Date(),
                count: orders.length,
                baghdadCount: orders.filter((order) => order?.governorate === "BAGHDAD").length,
                governoratesCount: orders.filter((order) => order?.governorate !== "BAGHDAD").length,
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
