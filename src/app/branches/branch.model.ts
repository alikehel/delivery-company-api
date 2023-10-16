import { PrismaClient } from "@prisma/client";
import { BranchCreateType, BranchUpdateType } from "./branches.zod";

const prisma = new PrismaClient();

export class BranchModel {
    async createBranch(data: BranchCreateType) {
        const createdBranch = await prisma.branch.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                governorate: data.governorate
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                governorate: true
            }
        });
        return createdBranch;
    }

    async getBranchesCount() {
        const branchesCount = await prisma.branch.count();
        return branchesCount;
    }

    async getAllBranches(skip: number, take: number) {
        const branches = await prisma.branch.findMany({
            skip: skip,
            take: take,
            orderBy: {
                name: "desc"
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                governorate: true
            }
        });
        return branches;
    }

    async getBranch(data: { branchID: string }) {
        const branch = await prisma.branch.findUnique({
            where: {
                id: data.branchID
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                governorate: true
            }
        });
        return branch;
    }

    async updateBranch(data: {
        branchID: string;
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
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                governorate: true
            }
        });
        return branch;
    }

    async deleteBranch(data: { branchID: string }) {
        const deletedBranch = await prisma.branch.delete({
            where: {
                id: data.branchID
            }
        });
        return deletedBranch;
    }
}
