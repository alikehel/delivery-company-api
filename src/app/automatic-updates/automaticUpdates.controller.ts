import { catchAsync } from "../../lib/catchAsync";
import { loggedInUserType } from "../../types/user";
import { AutomaticUpdateCreateSchema, AutomaticUpdateUpdateSchema } from "./automaticUpdates.dto";
import { AutomaticUpdatesService } from "./automaticUpdates.service";

const automaticUpdatesService = new AutomaticUpdatesService();

export class AutomaticUpdatesController {
    createAutomaticUpdate = catchAsync(async (req, res) => {
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
    });

    getAllAutomaticUpdates = catchAsync(async (req, res) => {
        const loggedInUser = res.locals.user as loggedInUserType;

        const filters = {
            companyID: req.query.company_id ? +req.query.company_id : undefined,
            size: req.query.size ? +req.query.size : 10,
            page: req.query.page ? +req.query.page : 1,
            onlyTitleAndID: req.query.only_title_and_id ? req.query.only_title_and_id === "true" : undefined
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
    });

    getAutomaticUpdate = catchAsync(async (req, res) => {
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
    });

    updateAutomaticUpdate = catchAsync(async (req, res) => {
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
    });

    deleteAutomaticUpdate = catchAsync(async (req, res) => {
        const params = {
            automaticUpdateID: +req.params.automaticUpdateID
        };

        await automaticUpdatesService.deleteAutomaticUpdate({
            params: params
        });

        res.status(200).json({
            status: "success"
        });
    });
}
