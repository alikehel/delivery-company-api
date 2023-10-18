import { PrismaClient } from "@prisma/client";
import { LocationCreateType, LocationUpdateType } from "./locations.zod";

const prisma = new PrismaClient();

export class LocationModel {
    async createLocation(data: LocationCreateType) {
        const createdLocation = await prisma.location.create({
            data: {
                name: data.name,
                governorate: data.governorate,
                branch: {
                    connect: {
                        id: data.branchID
                    }
                },
                deliveryAgents: {
                    connect: data.deliveryAgentsIDs.map((id) => {
                        return {
                            id: id
                        };
                    })
                }
            },
            select: {
                id: true,
                name: true,
                governorate: true,
                branch: true,
                deliveryAgents: true
            }
        });
        return createdLocation;
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
            select: {
                id: true,
                name: true,
                governorate: true,
                branch: true,
                deliveryAgents: true
            }
        });
        return locations;
    }

    async getLocation(data: { locationID: string }) {
        const location = await prisma.location.findUnique({
            where: {
                id: data.locationID
            },
            select: {
                id: true,
                name: true,
                governorate: true,
                branch: true,
                deliveryAgents: true
            }
        });
        return location;
    }

    async updateLocation(data: {
        locationID: string;
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
                deliveryAgents: data.locationData.deliveryAgentsIDs
                    ? {
                          connect: data.locationData.deliveryAgentsIDs?.map(
                              (id) => {
                                  return {
                                      id: id
                                  };
                              }
                          )
                      }
                    : undefined
            },
            select: {
                id: true,
                name: true,
                governorate: true,
                branch: true,
                deliveryAgents: true
            }
        });
        return location;
    }

    async deleteLocation(data: { locationID: string }) {
        const deletedLocation = await prisma.location.delete({
            where: {
                id: data.locationID
            }
        });
        return deletedLocation;
    }
}
