import { Router } from "express";

import { Role } from "@prisma/client";
import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import {
    getAllNotifications,
    updateNotification
} from "./notifications.controller";

const router = Router();

router.route("/notifications").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getAllNotifications
    /*
        #swagger.tags = ['Notifications Routes']

        #swagger.description = 'Must be a super admin'

        #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page Number',
            required: false
        }

        #swagger.parameters['seen'] = {
            in: 'query',
            description: 'Get seen notifications or not ( boolean )',
            required: false
        }

        #swagger.responses[200-1] = {
            description: 'Got all notifications',
            schema: {
                status: "success",
                data: [
                    {
                        id: 'true',
                        title: 'true',
                        content: 'true',
                        seen: 'true'
                    }
                ]
            }
        }

        #swagger.responses[500-1] = {
            description: 'Cant get the notifications data',
            schema: {
                status: "error",
                message: 'Cant get the notifications data'
            }
        }
    */
);

router.route("/notifications/:notificationID").patch(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    updateNotification
    /*
        #swagger.tags = ['Notifications Routes']

        #swagger.description = 'Must be a super admin'

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    "schema": { $ref: "#/components/schemas/NotificationUpdateSchema" },
                    "examples": {
                        "NotificationUpdateExample": { $ref: "#/components/examples/NotificationUpdateExample" }
                    }
                }
            }
        }

        #swagger.responses[201-1] = {
            description: 'Notification updated successfully',
            schema: {
                status: "success",
                data: {
                    seen: 'true',
                }
            }
        }
    */
);

export default router;
