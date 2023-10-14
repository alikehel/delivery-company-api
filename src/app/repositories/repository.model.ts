import { PrismaClient } from "@prisma/client";
import { RepositoryCreateType, RepositoryUpdateType } from "./repositories.zod";

const prisma = new PrismaClient();

export class RepositoryModel {
    async createRepository(data: RepositoryCreateType) {
        const createdRepository = await prisma.repository.create({
            data: {
                name: data.name
            },
            select: {
                id: true,
                name: true
            }
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
            select: {
                id: true,
                name: true
            }
        });
        return repositories;
    }

    async getRepository(data: { repositoryID: string }) {
        const repository = await prisma.repository.findUnique({
            where: {
                id: data.repositoryID
            },
            select: {
                id: true,
                name: true
            }
        });
        return repository;
    }

    async updateRepository(data: {
        repositoryID: string;
        repositoryData: RepositoryUpdateType;
    }) {
        const repository = await prisma.repository.update({
            where: {
                id: data.repositoryID
            },
            data: {
                name: data.repositoryData.name
            },
            select: {
                id: true,
                name: true
            }
        });
        return repository;
    }

    async deleteRepository(data: { repositortID: string }) {
        const deletedRepository = await prisma.repository.delete({
            where: {
                id: data.repositortID
            },
            select: {
                id: true,
                name: true
            }
        });
        return deletedRepository;
    }
}
