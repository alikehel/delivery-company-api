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

const router = Router();

router.route("/users").post(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    createUser
    /*
        #swagger.tags = ['Users Routes']

        #swagger.description = 'Must be a super admin'

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

        #swagger.responses[201-1] = {
            description: 'User created successfully',
            schema: {
                status: "success",
                data: {
                    id: "1",
                    name: "User Name",
                    username: "username",
                    phone: "0123456789",
                    salary: 1000,
                    role: "SUPER_ADMIN",
                    permissions: ["CREATE_USER"],
                    branch: "Branch data object",
                    repository: "Repository data object"
                }
            }
        }

        #swagger.responses[400-1] = {
            schema: {
                status: "fail",
                message: ''
            },
            description: ''
        }

        #swagger.responses[500-1] = {
            description: 'Cant create the user',
            schema: {
                status: "error",
                message: 'Cant create the user'
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

        #swagger.description = 'Must be a super admin'

         #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page Number',
            required: false
        }

        #swagger.responses[200-1] = {
            description: 'Got all users',
            schema: {
                status: "success",
                data: [
                    {
                        id: "1",
                        name: "User Name",
                        username: "username",
                        phone: "0123456789",
                        salary: 1000,
                        role: "SUPER_ADMIN",
                        permissions: ["CREATE_USER"],
                        branch: "Branch data object",
                        repository: "Repository data object"
                    }
                ]
            }
        }

        #swagger.responses[500-1] = {
            description: 'Cant get the users data',
            schema: {
                status: "error",
                message: 'Cant get the users data'
            }
        }
    */
);

router.route("/users/:userID").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getUser
    /*
        #swagger.tags = ['Users Routes']

        #swagger.description = 'Must be a super admin'

        #swagger.responses[200-1] = {
            description: 'Got the user data',
            schema: {
                status: "success",
                data: {
                    id: "1",
                    name: "User Name",
                    username: "username",
                    phone: "0123456789",
                    salary: 1000,
                    role: "SUPER_ADMIN",
                    permissions: ["CREATE_USER"],
                    branch: "Branch data object",
                    repository: "Repository data object"
                }
            }
        }
    */
);

router.route("/users/:userID").patch(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    updateUser
    /*
        #swagger.tags = ['Users Routes']

        #swagger.description = 'Must be a super admin'

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

        #swagger.responses[201-1] = {
            description: 'User updated successfully',
            schema: {
                status: "success",
                data: {
                    id: "1",
                    name: "User Name",
                    username: "username",
                    phone: "0123456789",
                    salary: 1000,
                    role: "SUPER_ADMIN",
                    permissions: ["CREATE_USER"],
                    branch: "Branch data object",
                    repository: "Repository data object"
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

        #swagger.description = 'Must be a super admin'

         #swagger.responses[200-1] = {
            description: 'User deleted Successfully',
            schema: {
                status: "success",
                message: "User deleted successfully"
            }
        }

        #swagger.responses[500-1] = {
            description: 'Cant delete the user',
            schema: {
                status: "error",
                message: 'Cant delete the user'
            }
        }
    */
);

export default router;
