import { AdminRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { SECRET } from "../../config/config";
import { loggedInUserType } from "../../types/user";
import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
import { ClientModel } from "./client.model";
import { ClientCreateSchema, ClientUpdateSchema } from "./clients.zod";

const clientModel = new ClientModel();

export const createClient = catchAsync(async (req, res) => {
    const clientData = ClientCreateSchema.parse(req.body);
    let companyID = +res.locals.user.companyID;
    const { password, ...rest } = clientData;
    const avatar = req.file
        ? `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`
        : undefined;

    const currentUser = res.locals.user;

    // TODO: CANT CRATE ADMIN_ASSISTANT

    if (
        !companyID &&
        (currentUser.role === AdminRole.ADMIN || currentUser.role === AdminRole.ADMIN_ASSISTANT)
    ) {
        companyID = clientData.companyID as number;
    }

    // hash the password
    const hashedPassword = bcrypt.hashSync(password + (SECRET as string), 12);

    const createdClient = await clientModel.createClient(companyID, {
        ...rest,
        password: hashedPassword,
        userID: currentUser.id,
        avatar
    });

    res.status(200).json({
        status: "success",
        data: createdClient
    });
});

export const getAllClients = catchAsync(async (req, res) => {
    // Filters
    const loggedInUser = res.locals.user as loggedInUserType;
    let companyID: number | undefined;
    if (Object.keys(AdminRole).includes(loggedInUser.role)) {
        companyID = req.query.company_id ? +req.query.company_id : undefined;
    } else if (loggedInUser.companyID) {
        companyID = loggedInUser.companyID;
    }
    const deleted = (req.query.deleted as string) || "false";

    const onlyTitleAndID = req.query.only_title_and_id ? req.query.only_title_and_id === "true" : undefined;

    const clientsCount = await clientModel.getClientsCount({
        companyID: companyID,
        deleted: deleted
    });
    const size = req.query.size ? +req.query.size : 10;
    const pagesCount = Math.ceil(clientsCount / size);

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

    const clients = await clientModel.getAllClients(skip, take, {
        deleted: deleted,
        companyID: companyID,
        onlyTitleAndID: onlyTitleAndID
    });

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: clients
    });
});

export const getClient = catchAsync(async (req, res) => {
    const clientID = +req.params.clientID;

    const client = await clientModel.getClient({
        clientID: clientID
    });

    res.status(200).json({
        status: "success",
        data: client
    });
});

export const updateClient = catchAsync(async (req, res) => {
    const clientData = ClientUpdateSchema.parse(req.body);
    const clientID = +req.params.clientID;
    const companyID = +res.locals.user.companyID;
    const avatar = req.file
        ? `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`
        : undefined;

    const { password, ...rest } = clientData;

    // hash the password
    const hashedPassword = bcrypt.hashSync(password + (SECRET as string), 12);

    const updatedClient = await clientModel.updateClient({
        clientID: clientID,
        companyID: companyID,
        clientData: {
            ...rest,
            password: hashedPassword,
            avatar
        }
    });

    res.status(200).json({
        status: "success",
        data: updatedClient
    });
});

export const deleteClient = catchAsync(async (req, res) => {
    const clientID = +req.params.clientID;

    await clientModel.deleteClient({
        clientID: clientID
    });

    res.status(200).json({
        status: "success"
    });
});

export const deactivateClient = catchAsync(async (req, res) => {
    const clientID = +req.params.clientID;
    const loggedInUserID = +res.locals.user.id;

    await clientModel.deactivateClient({
        clientID: clientID,
        deletedByID: loggedInUserID
    });

    res.status(200).json({
        status: "success"
    });
});

export const reactivateClient = catchAsync(async (req, res) => {
    const clientID = +req.params.clientID;

    await clientModel.reactivateClient({
        clientID: clientID
    });

    res.status(200).json({
        status: "success"
    });
});
