import { PrismaClient } from "@prisma/client";
import { ClientCreateTypeWithUserID, ClientUpdateType } from "./clients.zod";

const prisma = new PrismaClient();

export class ClientModel {
    async createClient(data: ClientCreateTypeWithUserID) {
        const createdClient = await prisma.client.create({
            data: {
                name: data.name,
                phone: data.phone,
                account_type: data.account_type,
                token: data.token,
                password: data.password,
                branch: {
                    connect: {
                        id: data.branch_id
                    }
                },
                createdBy: {
                    connect: {
                        id: data.userID
                    }
                }
            },
            select: {
                id: true,
                name: true,
                phone: true,
                account_type: true,
                branch: true,
                createdBy: true
            }
        });
        return createdClient;
    }

    async getClientsCount() {
        const clientsCount = await prisma.client.count();
        return clientsCount;
    }

    async getAllClients(skip: number, take: number) {
        const clients = await prisma.client.findMany({
            skip: skip,
            take: take,
            orderBy: {
                name: "desc"
            },
            select: {
                id: true,
                name: true,
                phone: true,
                account_type: true,
                branch: true,
                createdBy: true
            }
        });
        return clients;
    }

    async getClient(data: { clientID: string }) {
        const client = await prisma.client.findUnique({
            where: {
                id: data.clientID
            },
            select: {
                id: true,
                name: true,
                phone: true,
                account_type: true,
                branch: true,
                createdBy: true
            }
        });
        return client;
    }

    async updateClient(data: {
        clientID: string;
        clientData: ClientUpdateType;
    }) {
        const client = await prisma.client.update({
            where: {
                id: data.clientID
            },
            data: { ...data.clientData },
            select: {
                id: true,
                name: true,
                phone: true,
                account_type: true,
                branch: true,
                createdBy: true
            }
        });
        return client;
    }

    async deleteClient(data: { clientID: string }) {
        const deletedClient = await prisma.client.delete({
            where: {
                id: data.clientID
            },
            select: {
                id: true,
                name: true,
                phone: true,
                account_type: true,
                branch: true,
                createdBy: true
            }
        });
        return deletedClient;
    }
}
