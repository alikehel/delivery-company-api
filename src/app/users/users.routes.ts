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

// username: z.string({ required_error: "Username is required" }),
//     name: z.string({ required_error: "Name is required" }),
//     password: z
//         .string({ required_error: "Password is required" })
//         .min(6, { message: "Password length is less than 6 characters" })
//         .max(12, { message: "Password length is more than 12 characters" }),
//     phone: z.string({ required_error: "Phone is required" }),
//     salary: z.number({ required_error: "Salary is required" }),
//     repositoryID: z.string({ required_error: "Repository is required" }),
//     branchID: z.string({ required_error: "Branch is required" }),
//     role: z.nativeEnum(Role),
//     permissions: z.array(z.nativeEnum(Permission))

// select: {
//                 id: true,
//                 name: true,
//                 username: true,
//                 phone: true,
//                 salary: true,
//                 role: true,
//                 permissions: true,
//                 branch: true,
//                 repository: true
//             }

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
                    "schema": {
                        "properties": {
                            username: {
                                type: "string",
                                example: "username",
                            },
                            name: {
                                type: "string",
                                example: "User Name",
                            },
                            password: {
                                type: "string",
                                example: "password",
                            },
                            phone: {
                                type: "string",
                                example: "0123456789",
                            },
                            salary: {
                                type: "number",
                                example: 1000,
                            },
                            repositoryID: {
                                type: "string",
                                example: "53rf34f345",
                            },
                            branchID: {
                                type: "string",
                                example: "53rf34f345",
                            },
                            role: {
                                type: "string",
                                example: "SUPER_ADMIN",
                            },
                            permissions: {
                                type: "array",
                                items: {
                                    type: "string",
                                    example: "CREATE_USER",
                                },
                            },
                        },
                    },
                    "additionalProperties": false
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
                    "schema": {
                        "type": "object",
                        "additionalProperties": false,
                        "properties": {
                            username: {
                                type: "string",
                                example: "username",
                            },
                            name: {
                                type: "string",
                                example: "User Name",
                            },
                            password: {
                                type: "string",
                                example: "password",
                            },
                            phone: {
                                type: "string",
                                example: "0123456789",
                            },
                            salary: {
                                type: "number",
                                example: 1000,
                            },
                            repositoryID: {
                                type: "string",
                                example: "53rf34f345",
                            },
                            branchID: {
                                type: "string",
                                example: "53rf34f345",
                            },
                            role: {
                                type: "string",
                                example: "SUPER_ADMIN",
                            },
                            permissions: {
                                type: "array",
                                items: {
                                    type: "string",
                                    example: "CREATE_USER",
                                },
                            },
                        }
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
