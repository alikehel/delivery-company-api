import { AdminRole, EmployeeRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { SECRET } from "../../config/config";
import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
import { EmployeeModel } from "./employee.model";
import { EmployeeCreateSchema, EmployeeUpdateSchema } from "./employees.zod";

const employeeModel = new EmployeeModel();

export const createEmployee = catchAsync(async (req, res) => {
    const employeeData = EmployeeCreateSchema.parse(req.body);
    let companyID = +res.locals.user.companyID;
    const loggedInUser = res.locals.user;

    // TODO: CANT CRATE ADMIN

    if (
        !companyID &&
        (loggedInUser.role === AdminRole.SUPER_ADMIN ||
            loggedInUser.role === AdminRole.ADMIN)
    ) {
        companyID = employeeData.companyID as number;
    }

    const avatar = req.file
        ? "/" + req.file.path.replace(/\\/g, "/")
        : undefined;

    const hashedPassword = bcrypt.hashSync(
        employeeData.password + (SECRET as string),
        12
    );

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
    const employeesCount = await employeeModel.getEmployeesCount();
    const size = req.query.size ? +req.query.size : 10;
    const pagesCount = Math.ceil(employeesCount / size);

    const roles = req.query.roles
        ?.toString()
        .toUpperCase()
        .split(",") as EmployeeRole[];

    const role = req.query.role?.toString().toUpperCase() as EmployeeRole;

    const locationID = req.query.location_id
        ? +req.query.location_id
        : undefined;

    const branchID = req.query.branch_id ? +req.query.branch_id : undefined;

    const ordersStartDate = req.query.orders_start_date
        ? new Date(req.query.orders_start_date as string)
        : undefined;

    const ordersEndDate = req.query.orders_end_date
        ? new Date(req.query.orders_end_date as string)
        : undefined;

    // console.log(roles);

    if (pagesCount === 0) {
        res.status(200).json({
            status: "success",
            page: 1,
            pagesCount: 1,
            data: []
        });
        return;
    }

    let page = 1;
    if (
        req.query.page &&
        !Number.isNaN(+req.query.page) &&
        +req.query.page > 0
    ) {
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

    const deleted = (req.query.deleted as string) || "false";

    const employees = await employeeModel.getAllEmployees(skip, take, {
        roles: roles,
        role: role,
        locationID: locationID,
        branchID: branchID,
        deleted: deleted,
        ordersStartDate: ordersStartDate,
        ordersEndDate: ordersEndDate
    });

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: employees
    });
});

export const getEmployee = catchAsync(async (req, res) => {
    const employeeID = +req.params["employeeID"];

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
    const employeeID = +req.params["employeeID"];
    const companyID = +res.locals.user.companyID;

    if (req.file) {
        employeeData.avatar = "/" + req.file.path.replace(/\\/g, "/");
    }

    if (employeeData.password) {
        const hashedPassword = bcrypt.hashSync(
            employeeData.password + (SECRET as string),
            12
        );
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
    const employeeID = +req.params["employeeID"];

    await employeeModel.deleteEmployee({
        employeeID: employeeID
    });

    res.status(200).json({
        status: "success"
    });
});

export const deactivateEmployee = catchAsync(async (req, res) => {
    const employeeID = +req.params["employeeID"];
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
    const employeeID = +req.params["employeeID"];

    await employeeModel.reactivateEmployee({
        employeeID: employeeID
    });

    res.status(200).json({
        status: "success"
    });
});
