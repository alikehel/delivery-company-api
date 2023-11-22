import { Prisma, PrismaClient } from "@prisma/client";
import { ClientCreateTypeWithUserID, ClientUpdateType } from "./clients.zod";

const prisma = new PrismaClient();

const clientSelect: Prisma.ClientSelect = {
    user: {
        select: {
            id: true,
            name: true,
            username: true,
            phone: true,
            avatar: true
        }
    },
    id: true,
    role: true,
    createdBy: {
        select: {
            id: true,
            user: {
                select: {
                    id: true,
                    name: true
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
};

const clientReform = (client: any) => {
    return {
        // TODO
        id: client.id,
        name: client.user.name,
        username: client.user.username,
        phone: client.user.phone,
        avatar: client.user.avatar,
        role: client.role,
        company: client.company,
        createdBy: client.createdBy
            ? {
                  id: client.createdBy.id,
                  name: client.createdBy.user.name
              }
            : null
    };
};

export class ClientModel {
    async createClient(companyID: number, data: ClientCreateTypeWithUserID) {
        const createdClient = await prisma.client.create({
            data: {
                user: {
                    create: {
                        name: data.name,
                        username: data.username,
                        password: data.password,
                        phone: data.phone,
                        fcm: data.fcm,
                        avatar: data.avatar
                    }
                },
                company: {
                    connect: {
                        id: companyID
                    }
                },
                role: data.role,
                token: data.token,
                createdBy: {
                    connect: {
                        id: data.userID
                    }
                }
            },
            select: clientSelect
        });
        return clientReform(createdClient);
    }

    async getClientsCount() {
        const clientsCount = await prisma.client.count();
        return clientsCount;
    }

    async getAllClients(skip: number, take: number) {
        const clients = await prisma.client.findMany({
            skip: skip,
            take: take,
            // orderBy: {
            //     name: "desc"
            // },
            select: clientSelect
        });
        return clients.map(clientReform);
    }

    async getClient(data: { clientID: number }) {
        const client = await prisma.client.findUnique({
            where: {
                id: data.clientID
            },
            select: clientSelect
        });
        return clientReform(client);
    }

    async updateClient(data: {
        clientID: number;
        companyID: number;
        clientData: ClientUpdateType;
    }) {
        const client = await prisma.client.update({
            where: {
                id: data.clientID
            },
            data: {
                user: {
                    update: {
                        name: data.clientData.name,
                        username: data.clientData.username,
                        password: data.clientData.password,
                        phone: data.clientData.phone,
                        fcm: data.clientData.fcm,
                        avatar: data.clientData.avatar
                    }
                },
                company: {
                    connect: {
                        id: data.companyID
                    }
                },
                role: data.clientData.role,
                token: data.clientData.token
            },
            select: clientSelect
        });
        return clientReform(client);
    }

    async deleteClient(data: { clientID: number }) {
        await prisma.client.delete({
            where: {
                id: data.clientID
            }
        });
        return true;
    }
}
