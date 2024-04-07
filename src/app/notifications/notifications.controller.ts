import { catchAsync } from "../../lib/catchAsync";
import { NotificationModel } from "./notification.model";
import { NotificationUpdateSchema } from "./notifications.zod";

const notificationModel = new NotificationModel();

export const getAllNotifications = catchAsync(async (req, res) => {
    const userID = +res.locals.user.id as number;
    let seen = false;
    if (req.query.seen && req.query.seen === "true") {
        seen = true;
    }

    let size = req.query.size ? +req.query.size : 10;
    if (size > 50) {
        size = 10;
    }
    let page = 1;
    if (req.query.page && !Number.isNaN(+req.query.page) && +req.query.page > 0) {
        page = +req.query.page;
    }

    const { notifications, pagesCount } = await notificationModel.getAllNotificationsPaginated(
        userID,
        page,
        size,
        seen
    );

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: notifications
    });
});

export const updateNotification = catchAsync(async (req, res) => {
    const notificationID = +req.params.notificationID;

    const notificationData = NotificationUpdateSchema.parse(req.body);

    const notification = await notificationModel.updateNotification({
        notificationID: notificationID,
        notificationData: notificationData
    });

    res.status(200).json({
        status: "success",
        data: notification
    });
});

export const updateNotifications = catchAsync(async (req, res) => {
    const notificationData = NotificationUpdateSchema.parse(req.body);

    const userID = +res.locals.user.id as number;

    await notificationModel.updateNotifications({
        userID: userID,
        notificationData: notificationData
    });

    res.status(200).json({
        status: "success"
    });
});
