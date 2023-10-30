import { Router } from "express";

import { Role } from "@prisma/client";
import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import {
    createUser,
    deleteUser,
    getAllUsers,
    getUser,
    updateUser
} from "./users.controller";
import { upload } from "../../middlewares/upload.middleware";

const router = Router();

router.route("/users").post(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    upload.single("avatar"),
    createUser
    /*
        #swagger.tags = ['Users Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/UserCreateSchema" },
                    examples: {
                        UserCreateExample: { $ref: "#/components/examples/UserCreateExample" }
                    }
                }
            }
        }
    */
);

router.route("/users").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getAllUsers
    /*
        #swagger.tags = ['Users Routes']

        #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page Number',
            required: false
        }

        #swagger.parameters['size'] = {
            in: 'query',
            description: 'Page Size (Number of Items per Page) (Default: 10)',
            required: false
        }
    */
);

router.route("/users/:userID").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getUser
    /*
        #swagger.tags = ['Users Routes']
    */
);

router.route("/users/:userID").patch(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    upload.single("avatar"),
    updateUser
    /*
        #swagger.tags = ['Users Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/UserUpdateSchema" },
                    examples: {
                        UserUpdateExample: { $ref: "#/components/examples/UserUpdateExample" }
                    }
                }
            }
        }
    */
);

router.route("/users/:userID").delete(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    deleteUser
    /*
        #swagger.tags = ['Users Routes']
    */
);

export default router;
