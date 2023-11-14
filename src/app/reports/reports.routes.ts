import { Router } from "express";

import { Role } from "@prisma/client";
import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import { ReportController } from "./reports.controller";

const router = Router();
const reportController = new ReportController();

router.route("/reports").post(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    reportController.createReport
    /*
        #swagger.tags = ['Reports Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    "schema": { $ref: "#/components/schemas/ReportCreateSchema" },
                    "examples": {
                        "ReportCreateExample": { $ref: "#/components/examples/ReportCreateExample" }
                    }
                }
            }
        }
    */
);

router.route("/reports").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    reportController.getAllReports
    /*
        #swagger.tags = ['Reports Routes']

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

        #swagger.parameters['sort'] = {
            in: 'query',
            description: 'Sort Query (Default: id:asc)',
            required: false
        }

        #swagger.parameters['start_date'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['end_date'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['clientID'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['storeID'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['repositoryID'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['branchID'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['deliveryAgentID'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['governorate'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['status'] = {
            in: 'query',
            description: '',
            required: false
        }

        #swagger.parameters['type'] = {
            in: 'query',
            description: '',
            required: false
        }type
    */
);

router.route("/reports/:reportID").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    reportController.getReport
    /*
        #swagger.tags = ['Reports Routes']
    */
);

router.route("/reports/:reportID/pdf").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    reportController.getReportPDF
    /*
        #swagger.tags = ['Reports Routes']
    */
);

router.route("/reports/:reportID").patch(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    reportController.updateReport
    /*
        #swagger.tags = ['Reports Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    "schema": { $ref: "#/components/schemas/ReportUpdateSchema" },
                    "examples": {
                        "ReportUpdateExample": { $ref: "#/components/examples/ReportUpdateExample" }
                    }
                }
            }
        }
    */
);

router.route("/reports/:reportID").delete(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    reportController.deleteReport
    /*
        #swagger.tags = ['Reports Routes']
    */
);

export default router;
