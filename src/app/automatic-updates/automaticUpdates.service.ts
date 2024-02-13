import { AdminRole, OrderStatus, PrismaClient } from "@prisma/client";
import { AppError } from "../../lib/AppError";
import { localizeOrderStatus } from "../../lib/localize";
import { Logger } from "../../lib/logger";
import { loggedInUserType } from "../../types/user";
import sendNotification from "../notifications/helpers/sendNotification";
import { OrderTimelineType } from "../orders/orders.zod";
import {
    AutomaticUpdateCreateType,
    AutomaticUpdateUpdateType,
    automaticUpdateSelect
} from "./automaticUpdates.dto";

const prisma = new PrismaClient();

export class AutomaticUpdatesService {
    async createAutomaticUpdate(data: {
        loggedInUser: loggedInUserType;
        automaticUpdateData: AutomaticUpdateCreateType;
    }) {
        const createdAutomaticUpdate = await prisma.automaticUpdate.create({
            data: {
                orderStatus: data.automaticUpdateData.orderStatus,
                governorate: data.automaticUpdateData.governorate,
                returnCondition: data.automaticUpdateData.returnCondition,
                updateAt: data.automaticUpdateData.updateAt,
                checkAfter: data.automaticUpdateData.checkAfter,
                company: {
                    connect: {
                        id: data.loggedInUser.companyID as number
                    }
                }
            },
            select: automaticUpdateSelect
        });
        return createdAutomaticUpdate;
    }

    async getAllAutomaticUpdates(data: {
        loggedInUser: loggedInUserType;
        filters: {
            page: number;
            size: number;
            companyID: number | undefined;
        };
    }) {
        let companyID: number | undefined;
        if (Object.keys(AdminRole).includes(data.loggedInUser.role)) {
            companyID = data.filters.companyID;
        } else if (data.loggedInUser.companyID) {
            companyID = data.loggedInUser.companyID;
        }

        const automaticUpdatesCount = await prisma.automaticUpdate.count({
            where: {
                company: {
                    id: companyID
                }
            }
        });
        const pagesCount = Math.ceil(automaticUpdatesCount / data.filters.size);

        if (pagesCount === 0) {
            return {
                automaticUpdates: [],
                automaticUpdatesMetaData: {
                    page: 1,
                    pagesCount: 1
                }
            };
        }

        if (data.filters.page > pagesCount) {
            throw new AppError("Page number out of range", 400);
        }
        const take = data.filters.page * data.filters.size;
        const skip = (data.filters.page - 1) * data.filters.size;

        const automaticUpdates = await prisma.automaticUpdate.findMany({
            skip: skip,
            take: take,
            where: {
                company: {
                    id: companyID
                }
            },
            select: automaticUpdateSelect
        });

        return {
            automaticUpdates: automaticUpdates,
            automaticUpdatesMetaData: {
                page: data.filters.page,
                pagesCount: pagesCount
            }
        };
    }

    async getAutomaticUpdate(data: { params: { automaticUpdateID: number } }) {
        const automaticUpdate = await prisma.automaticUpdate.findUnique({
            where: {
                id: data.params.automaticUpdateID
            },
            select: automaticUpdateSelect
        });

        return automaticUpdate;
    }

    async updateAutomaticUpdate(data: {
        params: { automaticUpdateID: number };
        automaticUpdateData: AutomaticUpdateUpdateType;
    }) {
        const automaticUpdate = await prisma.automaticUpdate.update({
            where: {
                id: data.params.automaticUpdateID
            },
            data: {
                orderStatus: data.automaticUpdateData.orderStatus,
                governorate: data.automaticUpdateData.governorate,
                returnCondition: data.automaticUpdateData.returnCondition,
                updateAt: data.automaticUpdateData.updateAt,
                checkAfter: data.automaticUpdateData.checkAfter
            },
            select: automaticUpdateSelect
        });

        return automaticUpdate;
    }

    async deleteAutomaticUpdate(data: { params: { automaticUpdateID: number } }) {
        await prisma.automaticUpdate.delete({
            where: {
                id: data.params.automaticUpdateID
            }
        });
    }
}

export const automaticUpdatesTask = async () => {
    try {
        const currentDate = new Date();
        const currentHour = new Date().getHours();
        const currentMinute = new Date().getMinutes();
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
                    }
                },
                select: {
                    id: true,
                    orderStatus: true,
                    // newStatus: true,
                    governorate: true,
                    checkAfter: true,
                    updateAt: true,
                    returnCondition: true
                }
            });

            for (const automaticUpdate of automaticUpdates) {
                const orders = await prisma.order.findMany({
                    where: {
                        company: {
                            id: company.id
                        },
                        status: automaticUpdate.orderStatus,
                        governorate: automaticUpdate.governorate
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
                    const lastUpdate = new Date(order.createdAt);
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
                            status: OrderStatus.DELIVERED,
                            timeline: timeline
                        }
                    });

                    order.client &&
                        (await sendNotification({
                            userID: order.client.id,
                            title: "تم تغيير حالة الطلب",
                            content: `تم تغيير حالة الطلب رقم ${order.id} إلى ${localizeOrderStatus(
                                order.status
                            )}`
                        }));

                    order.deliveryAgent &&
                        (await sendNotification({
                            userID: order.deliveryAgent.id,
                            title: "تم تغيير حالة الطلب",
                            content: `تم تغيير حالة الطلب رقم ${order.id} إلى ${localizeOrderStatus(
                                order.status
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
