import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
import { LocationModel } from "./location.model";
import { LocationCreateSchema, LocationUpdateSchema } from "./locations.zod";

const locationModel = new LocationModel();

export const createLocation = catchAsync(async (req, res) => {
    const locationData = LocationCreateSchema.parse(req.body);

    const createdLocation = await locationModel.createLocation(locationData);

    res.status(200).json({
        status: "success",
        data: createdLocation
    });
});

export const getAllLocations = catchAsync(async (req, res) => {
    const locationsCount = await locationModel.getLocationsCount();
    const pagesCount = Math.ceil(locationsCount / 10);

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

    const locations = await locationModel.getAllLocations(skip, take);

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: locations
    });
});

export const getLocation = catchAsync(async (req, res) => {
    const locationID = req.params["locationID"];

    const location = await locationModel.getLocation({
        locationID: locationID
    });

    res.status(200).json({
        status: "success",
        data: location
    });
});

export const updateLocation = catchAsync(async (req, res) => {
    const locationID = req.params["locationID"];

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
    const locationID = req.params["locationID"];

    await locationModel.deleteLocation({
        locationID: locationID
    });

    res.status(200).json({
        status: "success"
    });
});
