import { PrismaClient } from "@prisma/client";
import { ClientCreateTypeWithUserID, ClientUpdateType } from "./clients.zod";

const prisma = new PrismaClient();

export class ClientModel {
    async createClient(data: ClientCreateTypeWithUserID) {
        const createdClient = await prisma.client.create({
            data: {
                name: data.name,
                phone: data.phone,
                accountType: data.accountType,
                token: data.token,
                password: data.password,
                avatar: data.avatar,
                branch: {
                    connect: {
                        id: data.branchID
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
                avatar: true,
                name: true,
                phone: true,
                accountType: true,
                branch: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true
                    }
                }
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
                avatar: true,
                name: true,
                phone: true,
                accountType: true,
                branch: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true
                    }
                }
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
                avatar: true,
                name: true,
                phone: true,
                accountType: true,
                branch: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true
                    }
                }
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
            data: {
                name: data.clientData.name,
                phone: data.clientData.phone,
                accountType: data.clientData.accountType,
                token: data.clientData.token,
                password: data.clientData.password,
                avatar: data.clientData.avatar,
                branch: data.clientData.branchID
                    ? {
                          connect: {
                              id: data.clientData.branchID
                          }
                      }
                    : undefined
            },
            select: {
                id: true,
                avatar: true,
                name: true,
                phone: true,
                accountType: true,
                branch: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return client;
    }

    async deleteClient(data: { clientID: string }) {
        await prisma.client.delete({
            where: {
                id: data.clientID
            }
        });
        return true;
    }
}
