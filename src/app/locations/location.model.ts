import { Governorate, Prisma, PrismaClient } from "@prisma/client";
import { LocationCreateType, LocationUpdateType } from "./locations.zod";

const prisma = new PrismaClient();

const locationSelect = {
    id: true,
    name: true,
    governorate: true,
    branch: true,
    remote: true,
    deliveryAgentsLocations: {
        select: {
            deliveryAgent: {
                select: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            phone: true
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
} satisfies Prisma.LocationSelect;

const locationReform = (
    location: Prisma.LocationGetPayload<{
        select: typeof locationSelect;
    }> | null
) => {
    if (!location) {
        return null;
    }
    return {
        id: location.id,
        name: location.name,
        governorate: location.governorate,
        branch: location.branch,
        deliveryAgents: location.deliveryAgentsLocations.map((deliveryAgent) => {
            return {
                id: deliveryAgent.deliveryAgent.user.id,
                name: deliveryAgent.deliveryAgent.user.name,
                phone: deliveryAgent.deliveryAgent.user.phone
            };
        }),
        company: location.company,
        remote: location.remote
    };
};

export class LocationModel {
    async createLocation(companyID: number, data: LocationCreateType) {
        const createdLocation = await prisma.location.create({
            data: {
                name: data.name,
                governorate: data.governorate,
                remote: data.remote,
                branch: {
                    connect: {
                        id: data.branchID
                    }
                },
                deliveryAgentsLocations: data.deliveryAgentsIDs
                    ? {
                          create: data.deliveryAgentsIDs?.map((id) => {
                              return {
                                  deliveryAgent: {
                                      connect: {
                                          id: id
                                      }
                                  }
                              };
                          })
                      }
                    : undefined,
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

    async getLocationsCount(filters: {
        search?: string;
        branchID?: number;
        governorate?: Governorate;
        deliveryAgentID?: number;
        companyID?: number;
    }) {
        const locationsCount = await prisma.location.count({
            where: {
                AND: [
                    {
                        name: {
                            contains: filters.search
                        }
                    },
                    {
                        branch: {
                            id: filters.branchID
                        }
                    },
                    {
                        governorate: filters.governorate
                    },
                    {
                        deliveryAgentsLocations: filters.deliveryAgentID
                            ? {
                                  some: {
                                      deliveryAgent: {
                                          id: filters.deliveryAgentID
                                      }
                                  }
                              }
                            : undefined
                    },
                    {
                        company: {
                            id: filters.companyID
                        }
                    }
                ]
            }
        });
        return locationsCount;
    }

    async getAllLocations(
        skip: number,
        take: number,
        filters: {
            search?: string;
            branchID?: number;
            governorate?: Governorate;
            deliveryAgentID?: number;
            companyID?: number;
            minified?: boolean;
        }
    ) {
        const where = {
            AND: [
                {
                    name: {
                        contains: filters.search
                    }
                },
                {
                    branch: {
                        id: filters.branchID
                    }
                },
                {
                    governorate: filters.governorate
                },
                {
                    deliveryAgentsLocations: filters.deliveryAgentID
                        ? {
                              some: {
                                  deliveryAgent: {
                                      id: filters.deliveryAgentID
                                  }
                              }
                          }
                        : undefined
                },
                {
                    company: {
                        id: filters.companyID
                    }
                }
            ]
        };

        if (filters.minified === true) {
            const locations = await prisma.location.findMany({
                skip: skip,
                take: take,
                where: where,
                select: {
                    id: true,
                    name: true
                }
            });
            return locations;
        }

        const locations = await prisma.location.findMany({
            skip: skip,
            take: take,
            where: where,
            orderBy: {
                id: "desc"
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
                remote: data.locationData.remote,
                branch: data.locationData.branchID
                    ? {
                          connect: {
                              id: data.locationData.branchID
                          }
                      }
                    : undefined,
                deliveryAgentsLocations: data.locationData.deliveryAgentsIDs
                    ? {
                          deleteMany: {
                              locationId: data.locationID
                          },
                          create: data.locationData.deliveryAgentsIDs?.map((id) => {
                              return {
                                  deliveryAgent: {
                                      connect: {
                                          id: id
                                      }
                                  }
                              };
                          })
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

    async publicGetAllLocations() {
        const locations = await prisma.location.findMany({
            select: {
                id: true,
                name: true
            }
        });
        return locations;
    }
}
