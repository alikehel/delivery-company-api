import { NotificationModel } from "../notification.model";
import { NotificationCreateType } from "../notifications.zod";
const notificationModel = new NotificationModel();

const sendNotification = async (data: {
    userID: string;
    notificationData: NotificationCreateType;
}) => {
    await notificationModel.createNotification(data);
};

export default sendNotification;
