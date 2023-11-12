import admin from "firebase-admin";

import Logger from "../../../lib/logger";
import { NotificationModel } from "../notification.model";
import { NotificationCreateType } from "../notifications.zod";

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    })
});

const notificationModel = new NotificationModel();

const sendNotification = async (data: NotificationCreateType) => {
    const { user } = await notificationModel.createNotification(data);

    // TODO: Remove this
    // console.log(user);

    if (!user.fcm) {
        return;
    }

    const message = {
        notification: {
            title: data.title,
            body: data.content
        },
        token: user.fcm
    };

    await admin.messaging().subscribeToTopic([user.fcm], "all");

    await admin
        .messaging()
        .send(message)
        .then((response) => {
            Logger.info("Successfully sent message to tobic 'all':", response);
        })
        .catch((error) => {
            Logger.error("Error sending message to tobic 'all':", error);
        });

    admin
        .messaging()
        .send(message)
        .then((response) => {
            Logger.log("Successfully sent message to token:", response);
        })
        .catch((error) => {
            Logger.error("Error sending message to token:", error);
        });
};

export default sendNotification;
