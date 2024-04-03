import { Governorate } from "@prisma/client";
import { catchAsync } from "../../lib/catchAsync";
// import { loggedInUserType } from "../../types/user";
import { LocationModel } from "./location.repository";
import { LocationCreateSchema, LocationUpdateSchema } from "./locations.dto";

const locationModel = new LocationModel();

export const createLocation = catchAsync(async (req, res) => {
    const locationData = LocationCreateSchema.parse(req.body);
    const companyID = +res.locals.user.companyID;

    const createdLocation = await locationModel.createLocation(companyID, locationData);

    res.status(200).json({
        status: "success",
        data: createdLocation
    });
});

export const getAllLocations = catchAsync(async (req, res) => {
    // Filters
    // const loggedInUser = res.locals.user as loggedInUserType;
    // let companyID: number | undefined;
    // if (Object.keys(AdminRole).includes(loggedInUser.role)) {
    //     companyID = req.query.company_id ? +req.query.company_id : undefined;
    // } else if (loggedInUser.companyID) {
    //     companyID = loggedInUser.companyID;
    // }

    const minified = req.query.minified ? req.query.minified === "true" : undefined;

    const search = req.query.search as string;

    const governorate = req.query.governorate?.toString().toUpperCase() as Governorate | undefined;

    const branchID = req.query.branch_id ? +req.query.branch_id : undefined;

    const deliveryAgentID = req.query.delivery_agent_id ? +req.query.delivery_agent_id : undefined;

    let size = req.query.size ? +req.query.size : 10;
    if (size > 50 && minified !== true) {
        size = 10;
    }
    let page = 1;
    if (req.query.page && !Number.isNaN(+req.query.page) && +req.query.page > 0) {
        page = +req.query.page;
    }

    const { locations, pagesCount } = await locationModel.getAllLocationsPaginated({
        page: page,
        size: size,
        search: search,
        branchID: branchID,
        governorate: governorate,
        deliveryAgentID: deliveryAgentID,
        // companyID: companyID,
        minified: minified
    });

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: locations
    });
});

export const getLocation = catchAsync(async (req, res) => {
    const locationID = +req.params.locationID;

    const location = await locationModel.getLocation({
        locationID: locationID
    });

    res.status(200).json({
        status: "success",
        data: location
    });
});

export const updateLocation = catchAsync(async (req, res) => {
    const locationID = +req.params.locationID;

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
    const locationID = +req.params.locationID;

    await locationModel.deleteLocation({
        locationID: locationID
    });

    res.status(200).json({
        status: "success"
    });
});

export const publicGetAllLocations = catchAsync(async (_req, res) => {
    const locations = await locationModel.publicGetAllLocations();

    res.status(200).json(locations);
});
