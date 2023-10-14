import { Router } from "express";

import { Role } from "@prisma/client";
import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import {
    createRepository,
    deleteRepository,
    getAllRepositories,
    getRepository,
    updateRepository
} from "./repositories.controller";

const router = Router();

router.route("/repositories").post(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    createRepository
    /*
        #swagger.tags = ['Repositories Routes']

        #swagger.description = 'Must be a super admin'

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    "schema": {
                        "properties": {
                            name: {
                                type: "string",
                                example: "Repository Name",
                            }
                        },
                    },
                    "additionalProperties": false
                }
            }
        }

        #swagger.responses[201-1] = {
            description: 'Repository created successfully',
            schema: {
                status: "success",
                data: {
                    id: "1",
                    name: "Repository Name"
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
            description: 'Cant create the repository',
            schema: {
                status: "error",
                message: 'Cant create the repository'
            }
        }
    */
);

router.route("/repositories").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getAllRepositories
    /*
        #swagger.tags = ['Repositories Routes']

        #swagger.description = 'Must be a super admin'

         #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page Number',
            required: false
        }

        #swagger.responses[200-1] = {
            description: 'Got all repositories',
            schema: {
                status: "success",
                data: [
                    {
                        id: "1",
                        name: "Repository Name",
                    },
                    {
                        id: "1",
                        name: "Repository Name",
                    }
                ]
            }
        }

        #swagger.responses[500-1] = {
            description: 'Cant get the repositories data',
            schema: {
                status: "error",
                message: 'Cant get the repositories data'
            }
        }
    */
);

router.route("/repositories/:repositoryID").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getRepository
    /*
        #swagger.tags = ['Repositories Routes']

        #swagger.description = 'Must be a super admin'

        #swagger.responses[200-1] = {
            description: 'Got the repository data',
            schema: {
                status: "success",
                data: {
                    id: "1",
                    name: "Repository Name",
                }
            }
        }
    */
);

router.route("/repositories/:repositoryID").patch(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    updateRepository
    /*
        #swagger.tags = ['Repositories Routes']

        #swagger.description = 'Must be a super admin'

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    "schema": {
                        "type": "object",
                        "additionalProperties": false,
                        "properties": {
                            name: {
                                type: "string",
                                example: "Repository Name",
                            }
                        }
                    }
                }
            }
        }

        #swagger.responses[201-1] = {
            description: 'Repository updated successfully',
            schema: {
                status: "success",
                data: {
                    id: "1",
                    name: "Repository Name"
                }
            }
        }
    */
);

router.route("/repositories/:repositoryID").delete(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    deleteRepository
    /*
        #swagger.tags = ['Repositories Routes']

        #swagger.description = 'Must be a super admin'

         #swagger.responses[200-1] = {
            description: 'Repository deleted Successfully',
            schema: {
                status: "success",
                message: "Repository deleted successfully"
            }
        }

        #swagger.responses[500-1] = {
            description: 'Cant delete the repository',
            schema: {
                status: "error",
                message: 'Cant delete the repository'
            }
        }
    */
);

export default router;
