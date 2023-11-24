import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
import { NotificationModel } from "./notification.model";
import { NotificationUpdateSchema } from "./notifications.zod";

const notificationModel = new NotificationModel();

export const getAllNotifications = catchAsync(async (req, res) => {
    const notificationsCount = await notificationModel.getNotificationsCount();
    const size = req.query.size ? +req.query.size : 10;
    const pagesCount = Math.ceil(notificationsCount / size);
    let userID;
    if (res.locals.user.id) {
        userID = +res.locals.user.id as number;
    } else {
        throw new AppError("User not found", 404);
    }

    let seen = false;
    if (req.query.seen && req.query.seen === "true") {
        seen = true;
    }

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

    const notifications = await notificationModel.getAllNotifications(
        userID,
        skip,
        take,
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
    const notificationID = +req.params["notificationID"];

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
