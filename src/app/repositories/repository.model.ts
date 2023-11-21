import { Prisma, PrismaClient } from "@prisma/client";
import { RepositoryCreateType, RepositoryUpdateType } from "./repositories.zod";

const prisma = new PrismaClient();

const repositorySelect: Prisma.RepositorySelect = {
    id: true,
    name: true,
    branch: true
};

// const repositorySelectReform = (
//     repository: Prisma.RepositoryGetPayload<typeof repositorySelect>
// ) => {
//     return {
//         id: repository.id,
//         name: repository.name,
//         branch: repository.branch
//     };
// };

export class RepositoryModel {
    async createRepository(companyID: number, data: RepositoryCreateType) {
        const createdRepository = await prisma.repository.create({
            data: {
                name: data.name,
                branch: {
                    connect: {
                        id: data.branchID
                    }
                },
                company: {
                    connect: {
                        id: companyID
                    }
                }
            },
            select: repositorySelect
        });
        return createdRepository;
    }

    async getRepositoriesCount() {
        const repositoriesCount = await prisma.repository.count();
        return repositoriesCount;
    }

    async getAllRepositories(skip: number, take: number) {
        const repositories = await prisma.repository.findMany({
            skip: skip,
            take: take,
            orderBy: {
                name: "desc"
            },
            select: repositorySelect
        });
        return repositories;
    }

    async getRepository(data: { repositoryID: number }) {
        const repository = await prisma.repository.findUnique({
            where: {
                id: data.repositoryID
            },
            select: repositorySelect
        });
        return repository;
    }

    async updateRepository(data: {
        repositoryID: number;
        repositoryData: RepositoryUpdateType;
    }) {
        const repository = await prisma.repository.update({
            where: {
                id: data.repositoryID
            },
            data: {
                name: data.repositoryData.name
            },
            select: repositorySelect
        });
        return repository;
    }

    async deleteRepository(data: { repositoryID: number }) {
        await prisma.repository.delete({
            where: {
                id: data.repositoryID
            }
        });
        return true;
    }
}
