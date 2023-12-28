import { Prisma, PrismaClient } from "@prisma/client";
import {
    AutomaticUpdateCreateType,
    AutomaticUpdateUpdateType
} from "./automaticUpdates.zod";

const prisma = new PrismaClient();

const automaticUpdateSelect = {
    id: true,
    createdAt: true,
    updatedAt: true,
    company: {
        select: {
            id: true,
            name: true
        }
    },
    orderStatus: true,
    governorate: true,
    returnCondition: true,
    updateAt: true,
    checkAfter: true
} satisfies Prisma.AutomaticUpdateSelect;

// const automaticUpdateReform = (automaticUpdate: any) => {
//     return {
//         id: automaticUpdate.id,
//         title: automaticUpdate.title,
//         createdAt: automaticUpdate.createdAt,
//         updatedAt: automaticUpdate.updatedAt
//     };
// };

export class AutomaticUpdateModel {
    async createAutomaticUpdate(
        companyID: number,
        data: AutomaticUpdateCreateType
    ) {
        const createdAutomaticUpdate = await prisma.automaticUpdate.create({
            data: {
                orderStatus: data.orderStatus,
                governorate: data.governorate,
                returnCondition: data.returnCondition,
                updateAt: data.updateAt,
                checkAfter: data.checkAfter,
                company: {
                    connect: {
                        id: companyID
                    }
                }
            },
            select: automaticUpdateSelect
        });
        return createdAutomaticUpdate;
    }

    async getAutomaticUpdatesCount() {
        const automaticUpdatesCount = await prisma.automaticUpdate.count();
        return automaticUpdatesCount;
    }

    async getAllAutomaticUpdates(skip: number, take: number) {
        const automaticUpdates = await prisma.automaticUpdate.findMany({
            skip: skip,
            take: take,
            select: automaticUpdateSelect
        });
        return automaticUpdates;
    }

    async getAutomaticUpdate(data: { automaticUpdateID: number }) {
        const automaticUpdate = await prisma.automaticUpdate.findUnique({
            where: {
                id: data.automaticUpdateID
            },
            select: automaticUpdateSelect
        });
        return automaticUpdate;
    }

    async updateAutomaticUpdate(data: {
        automaticUpdateID: number;
        automaticUpdateData: AutomaticUpdateUpdateType;
    }) {
        const automaticUpdate = await prisma.automaticUpdate.update({
            where: {
                id: data.automaticUpdateID
            },
            data: {
                orderStatus: data.automaticUpdateData.orderStatus,
                governorate: data.automaticUpdateData.governorate,
                returnCondition: data.automaticUpdateData.returnCondition,
                updateAt: data.automaticUpdateData.updateAt,
                checkAfter: data.automaticUpdateData.checkAfter
            },
            select: automaticUpdateSelect
        });
        return automaticUpdate;
    }

    async deleteAutomaticUpdate(data: { automaticUpdateID: number }) {
        await prisma.automaticUpdate.delete({
            where: {
                id: data.automaticUpdateID
            }
        });
        return true;
    }
}
