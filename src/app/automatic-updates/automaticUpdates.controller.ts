import { Request, Response } from "express";
import { loggedInUserType } from "../../types/user";
import { AutomaticUpdateCreateSchema, AutomaticUpdateUpdateSchema } from "./automaticUpdates.dto";
import { AutomaticUpdatesService } from "./automaticUpdates.service";

const automaticUpdatesService = new AutomaticUpdatesService();

export class AutomaticUpdatesController {
    async createAutomaticUpdate(req: Request, res: Response) {
        const automaticUpdateData = AutomaticUpdateCreateSchema.parse(req.body);
        const loggedInUser = res.locals.user as loggedInUserType;

        const createdAutomaticUpdate = await automaticUpdatesService.createAutomaticUpdate({
            loggedInUser,
            automaticUpdateData
        });

        res.status(200).json({
            status: "success",
            data: createdAutomaticUpdate
        });
    }

    async getAllAutomaticUpdates(req: Request, res: Response) {
        const loggedInUser = res.locals.user as loggedInUserType;

        const filters = {
            companyID: req.query.company_id ? +req.query.company_id : undefined,
            size: req.query.size ? +req.query.size : 10,
            page: req.query.page ? +req.query.page : 1
        };

        const { automaticUpdates, automaticUpdatesMetaData } =
            await automaticUpdatesService.getAllAutomaticUpdates({
                loggedInUser: loggedInUser,
                filters: filters
            });

        res.status(200).json({
            status: "success",
            page: automaticUpdatesMetaData.page,
            pagesCount: automaticUpdatesMetaData.pagesCount,
            data: automaticUpdates
        });
    }

    async getAutomaticUpdate(req: Request, res: Response) {
        const params = {
            automaticUpdateID: +req.params.automaticUpdateID
        };

        const automaticUpdate = await automaticUpdatesService.getAutomaticUpdate({
            params: params
        });

        res.status(200).json({
            status: "success",
            data: automaticUpdate
        });
    }

    async updateAutomaticUpdate(req: Request, res: Response) {
        const automaticUpdateData = AutomaticUpdateUpdateSchema.parse(req.body);

        const params = {
            automaticUpdateID: +req.params.automaticUpdateID
        };

        const automaticUpdate = await automaticUpdatesService.updateAutomaticUpdate({
            params: params,
            automaticUpdateData: automaticUpdateData
        });

        res.status(200).json({
            status: "success",
            data: automaticUpdate
        });
    }

    async deleteAutomaticUpdate(req: Request, res: Response) {
        const params = {
            automaticUpdateID: +req.params.automaticUpdateID
        };

        await automaticUpdatesService.deleteAutomaticUpdate({
            params: params
        });

        res.status(200).json({
            status: "success"
        });
    }
}
