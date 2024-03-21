import { Prisma, PrismaClient } from "@prisma/client";
import { ClientCreateTypeWithUserID, ClientUpdateType } from "./clients.zod";

const prisma = new PrismaClient();

const clientSelect = {
    user: {
        select: {
            id: true,
            name: true,
            username: true,
            // phone: true,
            avatar: true
        }
    },
    phone: true,
    role: true,
    governoratesDeliveryCosts: true,
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
    repository: {
        select: {
            id: true,
            name: true
        }
    },
    branch: {
        select: {
            id: true,
            name: true
        }
    },
    company: {
        select: {
            id: true,
            name: true,
            logo: true,
            color: true
        }
    },
    deleted: true,
    deletedAt: true,
    deletedBy: {
        select: {
            id: true,
            name: true
        }
    }
} satisfies Prisma.ClientSelect;

const clientReform = (
    client: Prisma.ClientGetPayload<{
        select: typeof clientSelect;
    }> | null
) => {
    if (!client) {
        return null;
    }
    return {
        // TODO
        id: client.user.id,
        name: client.user.name,
        username: client.user.username,
        phone: client.phone,
        avatar: client.user.avatar,
        role: client.role,
        company: client.company,
        repository: client.repository,
        branch: client.branch,
        governoratesDeliveryCosts: client.governoratesDeliveryCosts,
        createdBy: client.createdBy
            ? {
                  id: client.createdBy.id,
                  name: client.createdBy.user.name
              }
            : null,
        deleted: client.deleted,
        deletedBy: client.deleted && client.deletedBy,
        deletedAt: client.deletedAt?.toISOString()
    };
};

export class ClientModel {
    async createClient(companyID: number, data: ClientCreateTypeWithUserID) {
        const createdUser = await prisma.user.create({
            data: {
                name: data.name,
                username: data.username,
                password: data.password,
                // phone: data.phone,
                fcm: data.fcm,
                avatar: data.avatar
            },
            select: {
                id: true
            }
        });

        const createdClient = await prisma.client.create({
            data: {
                // id: createdUser.id,
                user: {
                    connect: {
                        id: createdUser.id
                    }
                },
                company: {
                    connect: {
                        id: companyID
                    }
                },
                role: data.role,
                phone: data.phone,
                token: data.token,
                branch: data.branchID
                    ? {
                          connect: {
                              id: data.branchID
                          }
                      }
                    : undefined,
                repository: data.repositoryID
                    ? {
                          connect: {
                              id: data.repositoryID
                          }
                      }
                    : undefined,
                createdBy: {
                    connect: {
                        id: data.userID
                    }
                },
                governoratesDeliveryCosts: data.governoratesDeliveryCosts
            },
            select: clientSelect
        });
        return clientReform(createdClient);
    }

    async getClientsCount(filters: {
        deleted?: string;
        companyID?: number;
        storeID?: number;
    }) {
        const where = {
            AND: [
                { deleted: filters.deleted === "true" },
                { company: { id: filters.companyID } },
                // TODO
                { stores: filters.storeID ? { some: { id: filters.storeID } } : undefined }
            ]
        };
        const clientsCount = await prisma.client.count({
            where: where
        });
        return clientsCount;
    }

    async getAllClients(
        skip: number,
        take: number,
        filters: { deleted?: string; companyID?: number; minified?: boolean; storeID?: number }
    ) {
        const where = {
            AND: [
                { deleted: filters.deleted === "true" },
                { company: { id: filters.companyID } },
                // TODO
                { stores: filters.storeID ? { some: { id: filters.storeID } } : undefined }
            ]
        };

        if (filters.minified === true) {
            const clients = await prisma.client.findMany({
                skip: skip,
                take: take,
                where: where,
                select: {
                    id: true,
                    user: {
                        select: {
                            name: true
                        }
                    }
                }
            });
            return clients.map((client) => {
                return {
                    id: client.id,
                    name: client.user.name
                };
            });
        }

        const clients = await prisma.client.findMany({
            skip: skip,
            take: take,
            orderBy: {
                id: "desc"
            },
            where: where,
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
        // companyID: number;
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
                        // phone: data.clientData.phone,
                        fcm: data.clientData.fcm,
                        avatar: data.clientData.avatar
                    }
                },
                // company: data.clientData.companyID
                //     ? {
                //           connect: {
                //               id: data.clientData.companyID
                //           }
                //       }
                //     : undefined,
                phone: data.clientData.phone,
                role: data.clientData.role,
                token: data.clientData.token,
                branch: data.clientData.branchID
                    ? {
                          connect: {
                              id: data.clientData.branchID
                          }
                      }
                    : undefined,
                repository: data.clientData.repositoryID
                    ? {
                          connect: {
                              id: data.clientData.repositoryID
                          }
                      }
                    : undefined,
                governoratesDeliveryCosts: data.clientData.governoratesDeliveryCosts
            },
            select: clientSelect
        });
        return clientReform(client);
    }

    async deleteClient(data: { clientID: number }) {
        const deletedClient = await prisma.client.delete({
            where: {
                id: data.clientID
            }
        });
        return deletedClient;
    }

    async deactivateClient(data: { clientID: number; deletedByID: number }) {
        const deletedClient = await prisma.client.update({
            where: {
                id: data.clientID
            },
            data: {
                deleted: true,
                deletedAt: new Date(),
                deletedBy: {
                    connect: {
                        id: data.deletedByID
                    }
                }
            }
        });
        return deletedClient;
    }

    async reactivateClient(data: { clientID: number }) {
        const deletedClient = await prisma.client.update({
            where: {
                id: data.clientID
            },
            data: {
                deleted: false
            }
        });
        return deletedClient;
    }
}
