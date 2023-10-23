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

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    "schema": { $ref: "#/components/schemas/RepositoryCreateSchema" },
                    "examples": {
                        "RepositoryCreateExample": { $ref: "#/components/examples/RepositoryCreateExample" }
                    }
                }
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

        #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page Number',
            required: false
        }
    */
);

router.route("/repositories/:repositoryID").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getRepository
    /*
        #swagger.tags = ['Repositories Routes']
    */
);

router.route("/repositories/:repositoryID").patch(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    updateRepository
    /*
        #swagger.tags = ['Repositories Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    "schema": { $ref: "#/components/schemas/RepositoryUpdateSchema" },
                    "examples": {
                        "RepositoryUpdateExample": { $ref: "#/components/examples/RepositoryUpdateExample" }
                    }
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
    */
);

export default router;
