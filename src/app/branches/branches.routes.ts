import { Router } from "express";

import { Role } from "@prisma/client";
import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import {
    createBranch,
    deleteBranch,
    getAllBranches,
    getBranch,
    updateBranch
} from "./branches.controller";

const router = Router();

router.route("/branches").post(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    createBranch
    /*
        #swagger.tags = ['Branches Routes']

        #swagger.description = 'Must be a super admin'

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    "schema": {
                        "properties": {
                            name: {
                                type: "string",
                                example: "Branch Name",
                            },
                            email: {
                                type: "string",
                                example: "Branch email",
                            },
                            phone: {
                                type: "string",
                                example: "Branch phone number",
                            },
                            governorate: {
                                type: "string",
                                example: "AlBasra",
                            }
                        },
                    },
                    "additionalProperties": false
                }
            }
        }

        #swagger.responses[201-1] = {
            description: 'Branch created successfully',
            schema: {
                status: "success",
                data: {
                    id: "1",
                    name: "Branch Name",
                    email: "Branch email",
                    phone: "Branch phone number",
                    governorate: "AlBasra",
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
            description: 'Cant create the branch',
            schema: {
                status: "error",
                message: 'Cant create the branch'
            }
        }
    */
);

router.route("/branches").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getAllBranches
    /*
        #swagger.tags = ['Branches Routes']

        #swagger.description = 'Must be a super admin'

         #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page Number',
            required: false
        }

        #swagger.responses[200-1] = {
            description: 'Got all branches',
            schema: {
                status: "success",
                data: [
                    {
                        id: "1",
                        name: "Branch Name",
                        email: "Branch email",
                        phone: "Branch phone number",
                        governorate: "AlBasra",
                    }
                ]
            }
        }

        #swagger.responses[500-1] = {
            description: 'Cant get the branches data',
            schema: {
                status: "error",
                message: 'Cant get the branches data'
            }
        }
    */
);

router.route("/branches/:branchID").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getBranch
    /*
        #swagger.tags = ['Branches Routes']

        #swagger.description = 'Must be a super admin'

        #swagger.responses[200-1] = {
            description: 'Got the branch data',
            schema: {
                status: "success",
                data: {
                    id: "1",
                    name: "Branch Name",
                    email: "Branch email",
                    phone: "Branch phone number",
                    governorate: "AlBasra",
                }
            }
        }
    */
);

router.route("/branches/:branchID").patch(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    updateBranch
    /*
        #swagger.tags = ['Branches Routes']

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
                                example: "Branch Name",
                            },
                            email: {
                                type: "string",
                                example: "Branch email",
                            },
                            phone: {
                                type: "string",
                                example: "Branch phone number",
                            },
                            governorate: {
                                type: "string",
                                example: "AlBasra",
                            }
                        }
                    }
                }
            }
        }

        #swagger.responses[201-1] = {
            description: 'Branch updated successfully',
            schema: {
                status: "success",
                data: {
                    id: "1",
                    name: "Branch Name",
                    email: "Branch email",
                    phone: "Branch phone number",
                    governorate: "AlBasra",
                }
            }
        }
    */
);

router.route("/branches/:branchID").delete(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    deleteBranch
    /*
        #swagger.tags = ['Branches Routes']

        #swagger.description = 'Must be a super admin'

         #swagger.responses[200-1] = {
            description: 'Branch deleted Successfully',
            schema: {
                status: "success",
                message: "Branch deleted successfully"
            }
        }

        #swagger.responses[500-1] = {
            description: 'Cant delete the branch',
            schema: {
                status: "error",
                message: 'Cant delete the branch'
            }
        }
    */
);

export default router;
