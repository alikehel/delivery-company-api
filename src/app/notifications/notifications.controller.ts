import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
import { NotificationModel } from "./notification.model";
import { NotificationUpdateSchema } from "./notifications.zod";

const notificationModel = new NotificationModel();

export const getAllNotifications = catchAsync(async (req, res) => {
    const notificationsCount = await notificationModel.getNotificationsCount();
    const pagesCount = Math.ceil(notificationsCount / 10);

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
    const take = page * 10;
    const skip = (page - 1) * 10;
    // if (Number.isNaN(offset)) {
    //     skip = 0;
    // }

    const notifications = await notificationModel.getAllNotifications(
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
    const notificationID = req.params["notificationID"];

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
