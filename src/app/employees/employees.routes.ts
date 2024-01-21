import { Router } from "express";

// import { upload } from "../../middlewares/upload.middleware";
import { AdminRole, ClientRole, EmployeeRole, Permission } from "@prisma/client";
import { isAutherized } from "../../middlewares/isAutherized.middleware";
// import { EmployeeRole } from "@prisma/client";
// import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import { upload } from "../../middlewares/upload.middleware";
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
    isAutherized(
        [
            AdminRole.ADMIN,
            AdminRole.ADMIN_ASSISTANT,
            EmployeeRole.COMPANY_MANAGER,
            EmployeeRole.BRANCH_MANAGER
        ],
        [Permission.ADD_DELIVERY_AGENT]
    ),
    // upload.single("avatar"),
    upload.none(),
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
    isAutherized([
        EmployeeRole.COMPANY_MANAGER,
        AdminRole.ADMIN,
        AdminRole.ADMIN_ASSISTANT,
        //TODO: Remove later
        ...Object.values(EmployeeRole),
        ...Object.values(ClientRole)
    ]),
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
    isAutherized([EmployeeRole.COMPANY_MANAGER, AdminRole.ADMIN, AdminRole.ADMIN_ASSISTANT]),
    getEmployee
    /*
        #swagger.tags = ['Employees Routes']
    */
);

router.route("/employees/:employeeID").patch(
    isLoggedIn,
    isAutherized([EmployeeRole.COMPANY_MANAGER, AdminRole.ADMIN, AdminRole.ADMIN_ASSISTANT]),
    // upload.single("avatar"),
    upload.none(),
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
    isAutherized([EmployeeRole.COMPANY_MANAGER, AdminRole.ADMIN, AdminRole.ADMIN_ASSISTANT]),
    deleteEmployee
    /*
        #swagger.tags = ['Employees Routes']
    */
);

router.route("/employees/:employeeID/deactivate").patch(
    isLoggedIn,
    isAutherized([EmployeeRole.COMPANY_MANAGER, AdminRole.ADMIN, AdminRole.ADMIN_ASSISTANT]),
    deactivateEmployee
    /*
        #swagger.tags = ['Employees Routes']
    */
);

router.route("/employees/:employeeID/reactivate").patch(
    isLoggedIn,
    //TODO: Maybe add All Employee Roles for profile update
    isAutherized([EmployeeRole.COMPANY_MANAGER, AdminRole.ADMIN, AdminRole.ADMIN_ASSISTANT]),
    reactivateEmployee
    /*
        #swagger.tags = ['Employees Routes']
    */
);

export default router;
