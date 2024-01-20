import { Prisma, PrismaClient } from "@prisma/client";
import { NotificationCreateType, NotificationUpdateType } from "./notifications.zod";

const prisma = new PrismaClient();

const notificationSelect = {
    id: true,
    title: true,
    content: true,
    seen: true,
    createdAt: true,
    user: {
        select: {
            id: true,
            fcm: true
        }
    }
} satisfies Prisma.NotificationSelect;

const notificationReform = (
    notification: Prisma.NotificationGetPayload<{
        select: typeof notificationSelect;
    }>
) => {
    if (!notification) {
        return null;
    }
    return {
        id: notification.id,
        title: notification.title,
        content: notification.content,
        seen: notification.seen,
        createdAt: notification.createdAt,
        user: {
            id: notification.user.id,
            fcm: notification.user.fcm
        }
    };
};

export class NotificationModel {
    async createNotification(data: NotificationCreateType) {
        const createdNotification = await prisma.notification.create({
            data: {
                title: data.title,
                content: data.content,
                user: {
                    connect: {
                        id: data.userID
                    }
                }
                // company: {
                //     connect: {
                //         id: companyID
                //     }
                // }
            },
            select: notificationSelect
        });

        return notificationReform(createdNotification);
    }

    async getNotificationsCount(userID: number, seen: boolean) {
        const notificationsCount = await prisma.notification.count({
            where: {
                seen:
                    seen === true
                        ? undefined
                        : {
                              equals: false
                          },
                user: {
                    id: userID
                }
            }
        });
        return notificationsCount;
    }

    async getAllNotifications(userID: number, skip: number, take: number, seen: boolean) {
        const notifications = await prisma.notification.findMany({
            // if seen true gett all notifications seen and unseen
            // if seen false get only unseen notifications
            where: {
                seen:
                    seen === true
                        ? undefined
                        : {
                              equals: false
                          },
                user: {
                    id: userID
                }
            },
            skip: skip,
            take: take,
            orderBy: {
                createdAt: "desc"
            },
            select: notificationSelect
        });
        return notifications.map(notificationReform);
    }

    async updateNotification(data: {
        notificationID: number;
        notificationData: NotificationUpdateType;
    }) {
        const notification = await prisma.notification.update({
            where: {
                id: data.notificationID
            },
            data: {
                seen: data.notificationData.seen
            },
            select: notificationSelect
        });
        return notificationReform(notification);
    }

    async updateNotifications(data: {
        userID: number;
        notificationData: NotificationUpdateType;
    }) {
        const notification = await prisma.notification.updateMany({
            where: {
                user: {
                    id: data.userID
                }
            },
            data: {
                seen: data.notificationData.seen
            }
        });
        return notification;
    }
}
