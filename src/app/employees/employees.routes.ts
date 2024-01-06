import { Router } from "express";

// import { EmployeeRole } from "@prisma/client";
// import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
// import { upload } from "../../middlewares/upload.middleware";
import {
    createEmployee,
    deactivateEmployee,
    deleteEmployee,
    getAllEmployees,
    getEmployee,
    reactivateEmployee,
    updateEmployee
} from "./employees.controller";

const router = Router();

router.route("/employees").post(
    isLoggedIn,
    // isAutherized([EmployeeRole.SUPER_ADMIN]),
    // upload.single("avatar"),
    createEmployee
    /*
        #swagger.tags = ['Employees Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/EmployeeCreateSchema" },
                    examples: {
                        EmployeeCreateExample: { $ref: "#/components/examples/EmployeeCreateExample" }
                    }
                }
            }
        }
    */
);

router.route("/employees").get(
    isLoggedIn,
    // isAutherized([EmployeeRole.SUPER_ADMIN]),
    getAllEmployees
    /*
        #swagger.tags = ['Employees Routes']

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

        #swagger.parameters['roles'] = {
            in: 'query',
            description: 'Employee EmployeeRoles (Comma Separated)',
            required: false
        }
    */
);

router.route("/employees/:employeeID").get(
    isLoggedIn,
    // isAutherized([EmployeeRole.SUPER_ADMIN]),
    getEmployee
    /*
        #swagger.tags = ['Employees Routes']
    */
);

router.route("/employees/:employeeID").patch(
    isLoggedIn,
    // isAutherized([EmployeeRole.SUPER_ADMIN]),
    // upload.single("avatar"),
    updateEmployee
    /*
        #swagger.tags = ['Employees Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/EmployeeUpdateSchema" },
                    examples: {
                        EmployeeUpdateExample: { $ref: "#/components/examples/EmployeeUpdateExample" }
                    }
                }
            }
        }
    */
);

router.route("/employees/:employeeID").delete(
    isLoggedIn,
    // isAutherized([EmployeeRole.SUPER_ADMIN]),
    deleteEmployee
    /*
        #swagger.tags = ['Employees Routes']
    */
);

router.route("/employees/:employeeID/deactivate").patch(
    isLoggedIn,
    // isAutherized([EmployeeRole.SUPER_ADMIN]),
    deactivateEmployee
    /*
        #swagger.tags = ['Employees Routes']
    */
);

router.route("/employees/:employeeID/reactivate").patch(
    isLoggedIn,
    // isAutherized([EmployeeRole.SUPER_ADMIN]),
    reactivateEmployee
    /*
        #swagger.tags = ['Employees Routes']
    */
);

export default router;
