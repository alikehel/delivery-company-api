import { Router } from "express";

// import { AdminRole } from "@prisma/client";
// import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
// import { upload } from "../../middlewares/upload.middleware";
import { upload } from "../../middlewares/upload.middleware";
import {
    createCompany,
    deleteCompany,
    getAllCompanies,
    getCompany,
    updateCompany
} from "./companies.controller";

const router = Router();

router.route("/companies").post(
    isLoggedIn,
    // isAutherized([AdminRole.SUPER_ADMIN]),
    // upload.single("logo"),
    createCompany
    /*
        #swagger.tags = ['Companies Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/CompanyCreateSchema" },
                    examples: {
                        CompanyCreateExample: { $ref: "#/components/examples/CompanyCreateExample" }
                    }
                }
            }
        }
    */
);

router.route("/companies").get(
    isLoggedIn,
    // isAutherized([AdminRole.SUPER_ADMIN]),
    getAllCompanies
    /*
        #swagger.tags = ['Companies Routes']

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

router.route("/companies/:companyID").get(
    isLoggedIn,
    // isAutherized([AdminRole.SUPER_ADMIN]),
    getCompany
    /*
        #swagger.tags = ['Companies Routes']
    */
);

router.route("/companies/:companyID").patch(
    isLoggedIn,
    // isAutherized([AdminRole.SUPER_ADMIN]),
    // upload.single("logo"),
    upload.none(),
    updateCompany
    /*
        #swagger.tags = ['Companies Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/CompanyUpdateSchema" },
                    examples: {
                        CompanyUpdateExample: { $ref: "#/components/examples/CompanyUpdateExample" }
                    }
                }
            }
        }
    */
);

router.route("/companies/:companyID").delete(
    isLoggedIn,
    // isAutherized([AdminRole.SUPER_ADMIN]),
    deleteCompany
    /*
        #swagger.tags = ['Companies Routes']
    */
);

export default router;
