import { catchAsync } from "../../lib/catchAsync";
import { loggedInUserType } from "../../types/user";
import { EmployeeCreateSchema, EmployeeUpdateSchema, EmployeesFiltersSchema } from "./employees.dto";
import { EmployeesService } from "./employees.service";

const employeesService = new EmployeesService();

export class EmployeesController {
    createEmployee = catchAsync(async (req, res) => {
        const employeeData = EmployeeCreateSchema.parse(req.body);
        const loggedInUser = res.locals.user;
        const avatar = req.file
            ? `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`
            : undefined;

        const createdEmployee = await employeesService.createEmployee({
            loggedInUser,
            employeeData: { ...employeeData, avatar }
        });

        res.status(200).json({
            status: "success",
            data: createdEmployee
        });
    });

    getAllEmployees = catchAsync(async (req, res) => {
        const loggedInUser = res.locals.user as loggedInUserType;

        const filters = EmployeesFiltersSchema.parse({
            minified: req.query.minified,
            roles: req.query.roles,
            permissions: req.query.permissions,
            role: req.query.role,
            location_id: req.query.location_id,
            branch_id: req.query.branch_id,
            orders_start_date: req.query.orders_start_date,
            orders_end_date: req.query.orders_end_date,
            deleted: req.query.deleted,
            size: req.query.size,
            page: req.query.page,
            companyID: req.query.company_id
        });

        const { employees, pagesCount } = await employeesService.getAllEmployees({ filters, loggedInUser });

        res.status(200).json({
            status: "success",
            page: filters.page,
            pagesCount: pagesCount,
            data: employees
        });
    });

    getEmployee = catchAsync(async (req, res) => {
        const params = {
            employeeID: +req.params.employeeID
        };

        const employee = await employeesService.getEmployee({
            params
        });

        res.status(200).json({
            status: "success",
            data: employee
        });
    });

    updateEmployee = catchAsync(async (req, res) => {
        const employeeData = EmployeeUpdateSchema.parse(req.body);
        const params = {
            employeeID: +req.params.employeeID
        };

        if (req.file) {
            employeeData.avatar = req.file
                ? `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`
                : undefined;
        }

        const updatedEmployee = await employeesService.updateEmployee({
            params,
            employeeData: employeeData
        });

        res.status(200).json({
            status: "success",
            data: { ...updatedEmployee }
        });
    });

    deleteEmployee = catchAsync(async (req, res) => {
        const params = {
            employeeID: +req.params.employeeID
        };

        await employeesService.deleteEmployee({
            params
        });

        res.status(200).json({
            status: "success"
        });
    });

    deactivateEmployee = catchAsync(async (req, res) => {
        const params = {
            employeeID: +req.params.employeeID
        };
        const loggedInUser = res.locals.user as loggedInUserType;

        await employeesService.deactivateEmployee({
            params,
            loggedInUser: loggedInUser
        });

        res.status(200).json({
            status: "success"
        });
    });

    reactivateEmployee = catchAsync(async (req, res) => {
        const params = {
            employeeID: +req.params.employeeID
        };

        await employeesService.reactivateEmployee({
            params
        });

        res.status(200).json({
            status: "success"
        });
    });
}
