import { PrismaClient } from "@prisma/client";
import {
    NotificationCreateType,
    NotificationUpdateType
} from "./notifications.zod";

const prisma = new PrismaClient();

// model Notification {
//   id             String           @id @default(uuid())
//   title          String
//   price          Decimal
//   createdAt      DateTime         @default(now())
//   updatedAt      DateTime         @updatedAt
//   image          String?
//   stock          Int              @default(0)
// }

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
            }
        });
        return createdNotification;
    }

    async getNotificationsCount() {
        const notificationsCount = await prisma.notification.count();
        return notificationsCount;
    }

    async getAllNotifications(
        userID: string,
        skip: number,
        take: number,
        seen: boolean
    ) {
        const notifications = await prisma.notification.findMany({
            // if seen true gett all notifications seen and unseen
            // if seen false get only unseen notifications
            where: {
                seen: seen
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
            select: {
                id: true,
                title: true,
                content: true,
                seen: true,
                createdAt: true
            }
        });
        return notifications;
    }

    async updateNotification(data: {
        notificationID: string;
        notificationData: NotificationUpdateType;
    }) {
        const notification = await prisma.notification.update({
            where: {
                id: data.notificationID
            },
            data: {
                seen: data.notificationData.seen
            },
            select: {
                id: true,
                title: true,
                content: true,
                seen: true
            }
        });
        return notification;
    }

    async updateNotifications(data: {
        userID: string;
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
