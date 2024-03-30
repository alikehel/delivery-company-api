import { OrderStatus } from "@prisma/client";
import { prisma } from "../../../database/db";
import { localizeOrderStatus } from "../../../lib/localize";
import { Logger } from "../../../lib/logger";
import { sendNotification } from "../../notifications/helpers/sendNotification";
import { OrderTimelineType } from "../../orders/orders.dto";

export const automaticUpdatesTask = async () => {
    try {
        const currentDate = new Date(new Date().toLocaleString("en", { timeZone: "Asia/Baghdad" }));
        const currentHour = currentDate.getHours();
        const currentMinute = currentDate.getMinutes();
        const currentTime =
            currentMinute >= 0 && currentMinute < 30
                ? currentHour
                : currentMinute >= 30 && currentMinute < 60
                  ? currentHour + 1
                  : currentHour + 1;

        const companies = await prisma.company.findMany({
            select: {
                id: true,
                orderStatusAutomaticUpdate: true
            }
        });

        for (const company of companies) {
            const automaticUpdates = await prisma.automaticUpdate.findMany({
                where: {
                    company: {
                        id: company.id
                    },
                    updateAt: {
                        equals: currentTime
                    },
                    enabled: true
                },
                select: {
                    id: true,
                    orderStatus: true,
                    // newStatus: true,
                    governorate: true,
                    branch: {
                        select: {
                            id: true
                        }
                    },
                    checkAfter: true,
                    // updateAt: true,
                    returnCondition: true,
                    newOrderStatus: true
                }
            });

            for (const automaticUpdate of automaticUpdates) {
                const orders = await prisma.order.findMany({
                    where: {
                        company: {
                            id: company.id
                        },
                        status: automaticUpdate.orderStatus,
                        governorate: automaticUpdate.governorate,
                        branch: {
                            id: automaticUpdate.branch.id
                        }
                    },
                    select: {
                        id: true,
                        status: true,
                        timeline: true,
                        updatedAt: true,
                        createdAt: true,
                        client: {
                            select: {
                                id: true
                            }
                        },
                        deliveryAgent: {
                            select: {
                                id: true
                            }
                        }
                    }
                });

                if (!orders) {
                    return;
                }

                for (const order of orders) {
                    const lastUpdate = new Date(order.updatedAt);
                    const difference = currentDate.getTime() - lastUpdate.getTime();
                    const hoursDifference = difference / (1000 * 3600);
                    if (hoursDifference < automaticUpdate.checkAfter) {
                        continue;
                    }

                    const timeline: OrderTimelineType = [
                        // @ts-expect-error Fix later
                        ...order.timeline,
                        {
                            type: "STATUS_CHANGE",
                            old: order.status,
                            new: OrderStatus.DELIVERED,
                            date: new Date(),
                            by: {
                                id: 0,
                                name: "التحديث التلقائي",
                                role: "SYSTEM"
                            }
                        }
                    ] satisfies OrderTimelineType;

                    await prisma.order.update({
                        where: {
                            id: order.id
                        },
                        data: {
                            status: automaticUpdate.newOrderStatus,
                            secondaryStatus: automaticUpdate.returnCondition,
                            timeline: timeline,
                            automaticUpdate: {
                                connect: {
                                    id: automaticUpdate.id
                                }
                            }
                        }
                    });

                    order.client &&
                        (await sendNotification({
                            userID: order.client.id,
                            title: "تم تغيير حالة الطلب",
                            content: `تم تغيير حالة الطلب رقم ${order.id} إلى ${localizeOrderStatus(
                                automaticUpdate.newOrderStatus
                            )}`
                        }));

                    order.deliveryAgent &&
                        (await sendNotification({
                            userID: order.deliveryAgent.id,
                            title: "تم تغيير حالة الطلب",
                            content: `تم تغيير حالة الطلب رقم ${order.id} إلى ${localizeOrderStatus(
                                automaticUpdate.newOrderStatus
                            )}`
                        }));

                    Logger.info(`Automatic update for order with ID: ${order.id} has been completed.`);
                }
            }
        }

        Logger.info("Automatic updates task has been completed.");
    } catch (error) {
        Logger.error("Error in automatic updates task", error);
    }
};
