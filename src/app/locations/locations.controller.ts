import { Governorate } from "@prisma/client";
import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
import { LocationModel } from "./location.model";
import { LocationCreateSchema, LocationUpdateSchema } from "./locations.zod";

const locationModel = new LocationModel();

export const createLocation = catchAsync(async (req, res) => {
    const locationData = LocationCreateSchema.parse(req.body);
    const companyID = +res.locals.user.companyID;

    const createdLocation = await locationModel.createLocation(
        companyID,
        locationData
    );

    res.status(200).json({
        status: "success",
        data: createdLocation
    });
});

export const getAllLocations = catchAsync(async (req, res) => {
    const locationsCount = await locationModel.getLocationsCount();
    const size = req.query.size ? +req.query.size : 10;
    const pagesCount = Math.ceil(locationsCount / size);

    const search = req.query.search as string;

    const governorate = req.query.governorate?.toString().toUpperCase() as
        | Governorate
        | undefined;

    const branchID = req.query.branch_id ? +req.query.branch_id : undefined;

    const deliveryAgentID = req.query.delivery_agent_id
        ? +req.query.delivery_agent_id
        : undefined;

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

    const locations = await locationModel.getAllLocations(skip, take, {
        search: search,
        branchID: branchID,
        governorate: governorate,
        deliveryAgentID: deliveryAgentID
    });

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: locations
    });
});

export const getLocation = catchAsync(async (req, res) => {
    const locationID = +req.params["locationID"];

    const location = await locationModel.getLocation({
        locationID: locationID
    });

    res.status(200).json({
        status: "success",
        data: location
    });
});

export const updateLocation = catchAsync(async (req, res) => {
    const locationID = +req.params["locationID"];

    const locationData = LocationUpdateSchema.parse(req.body);

    const location = await locationModel.updateLocation({
        locationID: locationID,
        locationData: locationData
    });

    res.status(200).json({
        status: "success",
        data: location
    });
});

export const deleteLocation = catchAsync(async (req, res) => {
    const locationID = +req.params["locationID"];

    await locationModel.deleteLocation({
        locationID: locationID
    });

    res.status(200).json({
        status: "success"
    });
});
