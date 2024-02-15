import { AdminRole, EmployeeRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { SECRET } from "../../config/config";
import { AppError } from "../../lib/AppError";
import { catchAsync } from "../../lib/catchAsync";
import { loggedInUserType } from "../../types/user";
import { EmployeeModel } from "./employee.model";
import { EmployeeCreateSchema, EmployeeUpdateSchema } from "./employees.zod";

const employeeModel = new EmployeeModel();

export const createEmployee = catchAsync(async (req, res) => {
    const employeeData = EmployeeCreateSchema.parse(req.body);
    let companyID = +res.locals.user.companyID;
    const loggedInUser = res.locals.user;

    // TODO: CANT CRATE ADMIN_ASSISTANT

    if (
        !companyID &&
        (loggedInUser.role === AdminRole.ADMIN || loggedInUser.role === AdminRole.ADMIN_ASSISTANT)
    ) {
        companyID = employeeData.companyID as number;
    }

    if (
        employeeData.role !== EmployeeRole.DELIVERY_AGENT &&
        (loggedInUser.role !== EmployeeRole.COMPANY_MANAGER ||
            loggedInUser.role !== AdminRole.ADMIN ||
            loggedInUser.role !== AdminRole.ADMIN_ASSISTANT)
    ) {
        throw new AppError("ليس مصرح لك القيام بهذا الفعل", 403);
    }

    const avatar = req.file
        ? `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`
        : undefined;

    const hashedPassword = bcrypt.hashSync(employeeData.password + (SECRET as string), 12);

    const createdEmployee = await employeeModel.createEmployee(companyID, {
        ...employeeData,
        password: hashedPassword,
        avatar: avatar
    });

    res.status(200).json({
        status: "success",
        data: createdEmployee
    });
});

export const getAllEmployees = catchAsync(async (req, res) => {
    // Filters
    const loggedInUser = res.locals.user as loggedInUserType;
    let companyID: number | undefined;
    if (Object.keys(AdminRole).includes(loggedInUser.role)) {
        companyID = req.query.company_id ? +req.query.company_id : undefined;
    } else if (loggedInUser.companyID) {
        companyID = loggedInUser.companyID;
    }

    const minified = req.query.minified ? req.query.minified === "true" : undefined;

    const roles = req.query.roles?.toString().toUpperCase().split(",") as EmployeeRole[];

    const role = req.query.role?.toString().toUpperCase() as EmployeeRole;

    const locationID = req.query.location_id ? +req.query.location_id : undefined;

    const branchID = req.query.branch_id ? +req.query.branch_id : undefined;

    const ordersStartDate = req.query.orders_start_date
        ? new Date(req.query.orders_start_date as string)
        : undefined;

    const ordersEndDate = req.query.orders_end_date
        ? new Date(req.query.orders_end_date as string)
        : undefined;

    const deleted = (req.query.deleted as string) || "false";

    const employeesCount = await employeeModel.getEmployeesCount({
        roles: roles,
        role: role,
        locationID: locationID,
        branchID: branchID,
        deleted: deleted,
        ordersStartDate: ordersStartDate,
        ordersEndDate: ordersEndDate,
        companyID: companyID
    });
    let size = req.query.size ? +req.query.size : 10;
    if (size > 50 && minified !== true) {
        size = 10;
    }
    const pagesCount = Math.ceil(employeesCount / size);

    if (pagesCount === 0) {
        // console.log(roles);

        res.status(200).json({
            status: "success",
            page: 1,
            pagesCount: 1,
            data: []
        });
        return;
    }

    let page = 1;
    if (req.query.page && !Number.isNaN(+req.query.page) && +req.query.page > 0) {
        page = +req.query.page;
    }
    if (page > pagesCount) {
        throw new AppError("Page number out of range", 400);
    }
    const take = page * size;
    const skip = (page - 1) * size;
    // if (Number.isNaN(offset)) {
    //     skip = 0;
    // }

    const employees = await employeeModel.getAllEmployees(skip, take, {
        roles: roles,
        role: role,
        locationID: locationID,
        branchID: branchID,
        deleted: deleted,
        ordersStartDate: ordersStartDate,
        ordersEndDate: ordersEndDate,
        companyID: companyID,
        minified: minified
    });

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: employees
    });
});

export const getEmployee = catchAsync(async (req, res) => {
    const employeeID = +req.params.employeeID;

    const employee = await employeeModel.getEmployee({
        employeeID: employeeID
    });

    res.status(200).json({
        status: "success",
        data: employee
    });
});

export const updateEmployee = catchAsync(async (req, res) => {
    const employeeData = EmployeeUpdateSchema.parse(req.body);
    const employeeID = +req.params.employeeID;
    const companyID = +res.locals.user.companyID;

    if (req.file) {
        employeeData.avatar = req.file
            ? `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`
            : undefined;
    }

    if (employeeData.password) {
        const hashedPassword = bcrypt.hashSync(employeeData.password + (SECRET as string), 12);
        employeeData.password = hashedPassword;
    }

    const updatedEmployee = await employeeModel.updateEmployee({
        employeeID: employeeID,
        companyID: companyID,
        employeeData
    });

    res.status(200).json({
        status: "success",
        data: { ...updatedEmployee }
    });
});

export const deleteEmployee = catchAsync(async (req, res) => {
    const employeeID = +req.params.employeeID;

    await employeeModel.deleteEmployee({
        employeeID: employeeID
    });

    res.status(200).json({
        status: "success"
    });
});

export const deactivateEmployee = catchAsync(async (req, res) => {
    const employeeID = +req.params.employeeID;
    const loggedInUserID = +res.locals.user.id;

    await employeeModel.deactivateEmployee({
        employeeID: employeeID,
        deletedByID: loggedInUserID
    });

    res.status(200).json({
        status: "success"
    });
});

export const reactivateEmployee = catchAsync(async (req, res) => {
    const employeeID = +req.params.employeeID;

    await employeeModel.reactivateEmployee({
        employeeID: employeeID
    });

    res.status(200).json({
        status: "success"
    });
});
