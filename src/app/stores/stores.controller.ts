import { AdminRole, ClientRole, EmployeeRole } from "@prisma/client";
import { catchAsync } from "../../lib/catchAsync";
import { loggedInUserType } from "../../types/user";
import { StoreCreateSchema, StoreUpdateSchema } from "./stores.dto";
import { StoresRepository } from "./stores.repository";

const storesRepository = new StoresRepository();

export class StoresController {
    createStore = catchAsync(async (req, res) => {
        const storeData = StoreCreateSchema.parse(req.body);
        const companyID = +res.locals.user.companyID;
        const logo = req.file
            ? `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`
            : undefined;

        const createdStore = await storesRepository.createStore(companyID, {
            ...storeData,
            logo
        });

        res.status(200).json({
            status: "success",
            data: createdStore
        });
    });

    getAllStores = catchAsync(async (req, res) => {
        // Filters
        const loggedInUser = res.locals.user as loggedInUserType;
        let companyID: number | undefined;
        if (Object.keys(AdminRole).includes(loggedInUser.role)) {
            companyID = req.query.company_id ? +req.query.company_id : undefined;
        } else if (loggedInUser.companyID) {
            companyID = loggedInUser.companyID;
        }

        let clientID: number | undefined;
        if (loggedInUser.role === ClientRole.CLIENT) {
            clientID = loggedInUser.id;
        } else if (req.query.client_id) {
            clientID = +req.query.client_id;
        }

        let clientAssistantID = req.query.client_assistant_id ? +req.query.client_assistant_id : undefined;
        if (loggedInUser.role === EmployeeRole.CLIENT_ASSISTANT) {
            clientAssistantID = loggedInUser.id;
        }

        const minified = req.query.minified ? req.query.minified === "true" : undefined;

        const deleted = (req.query.deleted as string) || "false";

        let size = req.query.size ? +req.query.size : 10;
        if (size > 500 && minified !== true) {
            size = 10;
        }
        let page = 1;
        if (req.query.page && !Number.isNaN(+req.query.page) && +req.query.page > 0) {
            page = +req.query.page;
        }

        const { stores, pagesCount } = await storesRepository.getAllStoresPaginated({
            page: page,
            size: size,
            deleted: deleted,
            clientID,
            clientAssistantID,
            companyID: companyID,
            minified: minified
        });

        res.status(200).json({
            status: "success",
            page: page,
            pagesCount: pagesCount,
            data: stores
        });
    });

    getStore = catchAsync(async (req, res) => {
        const storeID = +req.params.storeID;

        const store = await storesRepository.getStore({
            storeID: storeID
        });

        res.status(200).json({
            status: "success",
            data: store
        });
    });

    updateStore = catchAsync(async (req, res) => {
        const storeID = +req.params.storeID;
        const logo = req.file
            ? `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`
            : undefined;

        const storeData = StoreUpdateSchema.parse(req.body);

        const store = await storesRepository.updateStore({
            storeID: storeID,
            storeData: { ...storeData, logo }
        });

        res.status(200).json({
            status: "success",
            data: store
        });
    });

    deleteStore = catchAsync(async (req, res) => {
        const storeID = +req.params.storeID;

        await storesRepository.deleteStore({
            storeID: storeID
        });

        res.status(200).json({
            status: "success"
        });
    });

    deactivateStore = catchAsync(async (req, res) => {
        const storeID = +req.params.storeID;
        const loggedInUserID = +res.locals.user.id;

        await storesRepository.deactivateStore({
            storeID: storeID,
            deletedByID: loggedInUserID
        });

        res.status(200).json({
            status: "success"
        });
    });

    reactivateStore = catchAsync(async (req, res) => {
        const storeID = +req.params.storeID;

        await storesRepository.reactivateStore({
            storeID: storeID
        });

        res.status(200).json({
            status: "success"
        });
    });
}
