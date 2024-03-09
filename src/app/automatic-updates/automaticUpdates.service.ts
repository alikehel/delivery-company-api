import { AdminRole, PrismaClient } from "@prisma/client";
import { AppError } from "../../lib/AppError";
import { loggedInUserType } from "../../types/user";
import {
    AutomaticUpdateCreateType,
    AutomaticUpdateUpdateType,
    AutomaticUpdatesFiltersType
} from "./automaticUpdates.dto";
import { automaticUpdateSelect } from "./automaticUpdates.responses";

const prisma = new PrismaClient();

export class AutomaticUpdatesService {
    async createAutomaticUpdate(data: {
        loggedInUser: loggedInUserType;
        automaticUpdateData: AutomaticUpdateCreateType;
    }) {
        const createdAutomaticUpdate = await prisma.automaticUpdate.create({
            data: {
                orderStatus: data.automaticUpdateData.orderStatus,
                governorate: data.automaticUpdateData.governorate,
                returnCondition: data.automaticUpdateData.returnCondition,
                newOrderStatus: data.automaticUpdateData.newOrderStatus,
                branch: {
                    connect: {
                        id: data.automaticUpdateData.branchID
                    }
                },
                updateAt: data.automaticUpdateData.updateAt,
                checkAfter: data.automaticUpdateData.checkAfter,
                company: {
                    connect: {
                        id: data.loggedInUser.companyID as number
                    }
                }
            },
            select: automaticUpdateSelect
        });
        return createdAutomaticUpdate;
    }

    async getAllAutomaticUpdates(data: {
        loggedInUser: loggedInUserType;
        filters: AutomaticUpdatesFiltersType;
    }) {
        let companyID: number | undefined;
        if (Object.keys(AdminRole).includes(data.loggedInUser.role)) {
            companyID = data.filters.companyID;
        } else if (data.loggedInUser.companyID) {
            companyID = data.loggedInUser.companyID;
        }

        // let size: number;
        // if (data.filters.size > 50 && data.filters.minified !== true) {
        //     size = 10;
        // }

        const where = {
            company: {
                id: companyID
            },
            orderStatus: data.filters.orderStatus,
            governorate: data.filters.governorate,
            enabled: data.filters.enabled,
            branch: {
                id: data.filters.branchID
            },
            returnCondition: data.filters.returnCondition,
            newOrderStatus: data.filters.newOrderStatus
        };

        const automaticUpdatesCount = await prisma.automaticUpdate.count({
            where: where
        });
        const pagesCount = Math.ceil(automaticUpdatesCount / data.filters.size);

        if (pagesCount === 0) {
            return {
                automaticUpdates: [],
                automaticUpdatesMetaData: {
                    page: 1,
                    pagesCount: 1
                }
            };
        }

        if (data.filters.page > pagesCount) {
            throw new AppError("Page number out of range", 400);
        }
        const take = data.filters.page * data.filters.size;
        const skip = (data.filters.page - 1) * data.filters.size;

        if (data.filters.minified === true) {
            const automaticUpdates = await prisma.automaticUpdate.findMany({
                skip: skip,
                take: take,
                where: where,
                select: {
                    id: true,
                    orderStatus: true,
                    governorate: true,
                    branch: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });
            return {
                automaticUpdates: automaticUpdates,
                automaticUpdatesMetaData: {
                    page: data.filters.page,
                    pagesCount: pagesCount
                }
            };
        }

        const automaticUpdates = await prisma.automaticUpdate.findMany({
            skip: skip,
            take: take,
            where: where,
            select: automaticUpdateSelect
        });

        return {
            automaticUpdates: automaticUpdates,
            automaticUpdatesMetaData: {
                page: data.filters.page,
                pagesCount: pagesCount
            }
        };
    }

    async getAutomaticUpdate(data: { params: { automaticUpdateID: number } }) {
        const automaticUpdate = await prisma.automaticUpdate.findUnique({
            where: {
                id: data.params.automaticUpdateID
            },
            select: automaticUpdateSelect
        });

        return automaticUpdate;
    }

    async updateAutomaticUpdate(data: {
        params: { automaticUpdateID: number };
        automaticUpdateData: AutomaticUpdateUpdateType;
    }) {
        const automaticUpdate = await prisma.automaticUpdate.update({
            where: {
                id: data.params.automaticUpdateID
            },
            data: {
                orderStatus: data.automaticUpdateData.orderStatus,
                governorate: data.automaticUpdateData.governorate,
                returnCondition: data.automaticUpdateData.returnCondition,
                updateAt: data.automaticUpdateData.updateAt,
                checkAfter: data.automaticUpdateData.checkAfter,
                newOrderStatus: data.automaticUpdateData.newOrderStatus,
                branch: data.automaticUpdateData.branchID
                    ? {
                          connect: {
                              id: data.automaticUpdateData.branchID
                          }
                      }
                    : undefined,
                enabled: data.automaticUpdateData.enabled
            },
            select: automaticUpdateSelect
        });

        return automaticUpdate;
    }

    async deleteAutomaticUpdate(data: { params: { automaticUpdateID: number } }) {
        await prisma.automaticUpdate.delete({
            where: {
                id: data.params.automaticUpdateID
            }
        });
    }
}
