import * as bcrypt from "bcrypt";
import { SECRET } from "../../config/config";
import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
import { ClientModel } from "./client.model";
import { ClientCreateSchema, ClientUpdateSchema } from "./clients.zod";

const clientModel = new ClientModel();

export const createClient = catchAsync(async (req, res) => {
    const clientData = ClientCreateSchema.parse(req.body);
    const { password, ...rest } = clientData;

    const currentUser = res.locals.user;

    // hash the password
    const hashedPassword = bcrypt.hashSync(password + (SECRET as string), 12);

    const createdClient = await clientModel.createClient({
        ...rest,
        password: hashedPassword,
        userID: currentUser.id
    });

    res.status(200).json({
        status: "success",
        data: createdClient
    });
});

export const getAllClients = catchAsync(async (req, res) => {
    const clientsCount = await clientModel.getClientsCount();
    const pagesCount = Math.ceil(clientsCount / 10);

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
    const take = page * 10;
    const skip = (page - 1) * 10;
    // if (Number.isNaN(offset)) {
    //     skip = 0;
    // }

    const clients = await clientModel.getAllClients(skip, take);

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: clients
    });
});

export const getClient = catchAsync(async (req, res) => {
    const clientID = req.params["clientID"];

    const client = await clientModel.getClient({
        clientID: clientID
    });

    res.status(200).json({
        status: "success",
        data: client
    });
});

export const updateClient = catchAsync(async (req, res) => {
    const clientID = req.params["clientID"];

    const clientData = ClientUpdateSchema.parse(req.body);

    const client = await clientModel.updateClient({
        clientID: clientID,
        clientData: clientData
    });

    res.status(200).json({
        status: "success",
        data: client
    });
});

export const deleteClient = catchAsync(async (req, res) => {
    const clientID = req.params["clientID"];

    await clientModel.deleteClient({
        clientID: clientID
    });

    res.status(200).json({
        status: "success"
    });
});
