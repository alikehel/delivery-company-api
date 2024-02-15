import { Governorate, Prisma, PrismaClient } from "@prisma/client";
import { BranchCreateType, BranchUpdateType } from "./branches.zod";

const prisma = new PrismaClient();

const branchSelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    governorate: true,
    company: {
        select: {
            id: true,
            name: true
        }
    }
} satisfies Prisma.BranchSelect;

// const branchReform = (branch: any) => {
//     return {
//         // TODO
//         id: branch.id,
//         name: branch.name,
//         email: branch.email,
//         phone: branch.phone,
//         governorate: branch.governorate,
//         company: branch.company
//     };
// };

export class BranchModel {
    async createBranch(companyID: number, data: BranchCreateType) {
        const createdBranch = await prisma.branch.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                governorate: data.governorate,
                company: {
                    connect: {
                        id: companyID
                    }
                }
            },
            select: branchSelect
        });
        return createdBranch;
    }

    async getBranchesCount(filters: {
        companyID?: number;
    }) {
        const branchesCount = await prisma.branch.count({
            where: {
                company: {
                    id: filters.companyID
                }
            }
        });
        return branchesCount;
    }

    async getAllBranches(
        skip: number,
        take: number,
        filters: {
            companyID?: number;
            governorate?: Governorate;
            locationID?: number;
            minified?: boolean;
        }
    ) {
        const where = {
            company: {
                id: filters.companyID
            },
            governorate: filters.governorate,
            locations: {
                some: {
                    id: filters.locationID
                }
            }
        };

        if (filters.minified === true) {
            const branches = await prisma.branch.findMany({
                skip: skip,
                take: take,
                where: where,
                select: {
                    id: true,
                    name: true
                }
            });
            return branches;
        }

        const branches = await prisma.branch.findMany({
            skip: skip,
            take: take,
            where: where,
            select: branchSelect
        });

        return branches;
    }

    async getBranch(data: { branchID: number }) {
        const branch = await prisma.branch.findUnique({
            where: {
                id: data.branchID
            },
            select: branchSelect
        });
        return branch;
    }

    async updateBranch(data: {
        branchID: number;
        branchData: BranchUpdateType;
    }) {
        const branch = await prisma.branch.update({
            where: {
                id: data.branchID
            },
            data: {
                name: data.branchData.name,
                email: data.branchData.email,
                phone: data.branchData.phone,
                governorate: data.branchData.governorate
            },
            select: branchSelect
        });
        return branch;
    }

    async deleteBranch(data: { branchID: number }) {
        await prisma.branch.delete({
            where: {
                id: data.branchID
            }
        });
        return true;
    }
}
