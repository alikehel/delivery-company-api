import { Prisma, PrismaClient } from "@prisma/client";
import { LocationCreateType, LocationUpdateType } from "./locations.zod";

const prisma = new PrismaClient();

const locationSelect: Prisma.LocationSelect = {
    id: true,
    name: true,
    governorate: true,
    branch: true,
    dileveryAgentsLocations: {
        select: {
            deliveryAgent: {
                select: {
                    user: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    },
    company: {
        select: {
            id: true,
            name: true
        }
    }
};

const locationReform = (location: any) => {
    return {
        id: location.id,
        name: location.name,
        governorate: location.governorate,
        branch: location.branch,
        deliveryAgents: location.dileveryAgentsLocations.map(
            (deliveryAgent: any) => {
                return {
                    id: deliveryAgent.deliveryAgent.id,
                    name: deliveryAgent.deliveryAgent.user.name
                };
            }
        ),
        company: location.company
    };
};

export class LocationModel {
    async createLocation(companyID: number, data: LocationCreateType) {
        const createdLocation = await prisma.location.create({
            data: {
                name: data.name,
                governorate: data.governorate,
                branch: {
                    connect: {
                        id: data.branchID
                    }
                },
                // dileveryAgentsLocations: {
                //     connect: data.deliveryAgentsIDs.map((id) => {
                //         return {
                //             deliveryAgentId_locationId: {
                //                 locationId: data.locationID,
                //                 deliveryAgentId: id
                //             }
                //         };
                //     })
                // },
                company: {
                    connect: {
                        id: companyID
                    }
                }
            },
            select: locationSelect
        });
        return locationReform(createdLocation);
    }

    async getLocationsCount() {
        const locationsCount = await prisma.location.count();
        return locationsCount;
    }

    async getAllLocations(skip: number, take: number) {
        const locations = await prisma.location.findMany({
            skip: skip,
            take: take,
            orderBy: {
                name: "desc"
            },
            select: locationSelect
        });
        return locations.map(locationReform);
    }

    async getLocation(data: { locationID: number }) {
        const location = await prisma.location.findUnique({
            where: {
                id: data.locationID
            },
            select: locationSelect
        });
        return locationReform(location);
    }

    async updateLocation(data: {
        locationID: number;
        locationData: LocationUpdateType;
    }) {
        const location = await prisma.location.update({
            where: {
                id: data.locationID
            },
            data: {
                name: data.locationData.name,
                governorate: data.locationData.governorate,
                branch: data.locationData.branchID
                    ? {
                          connect: {
                              id: data.locationData.branchID
                          }
                      }
                    : undefined,
                dileveryAgentsLocations: data.locationData.deliveryAgentsIDs
                    ? {
                          connect: data.locationData.deliveryAgentsIDs?.map(
                              (id) => {
                                  return {
                                      deliveryAgentId_locationId: {
                                          locationId: data.locationID,
                                          deliveryAgentId: id
                                      }
                                  };
                              }
                          )
                      }
                    : undefined
            },
            select: locationSelect
        });
        return locationReform(location);
    }

    async deleteLocation(data: { locationID: number }) {
        await prisma.location.delete({
            where: {
                id: data.locationID
            }
        });
        return true;
    }
}
