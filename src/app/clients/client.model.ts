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
            logo: true
        }
    },
    deletedBy: {
        select: {
            id: true,
            name: true
        }
    }
};

const clientReform = (client: any) => {
    if (!client) {
        return null;
    }
    return {
        // TODO
        id: client.id,
        name: client.user.name,
        username: client.user.username,
        phone: client.user.phone,
        avatar: client.user.avatar,
        role: client.role,
        company: client.company,
        repository: client.repository,
        branch: client.branch,
        createdBy: client.createdBy
            ? {
                  id: client.createdBy.id,
                  name: client.createdBy.user.name
              }
            : null,
        deletedBy: client.deleted && client.deletedBy,
        deletedAt: client.deleted && client.deletedAt.toISOString()
    };
};

export class ClientModel {
    async createClient(companyID: number, data: ClientCreateTypeWithUserID) {
        const createdUser = await prisma.user.create({
            data: {
                name: data.name,
                username: data.username,
                password: data.password,
                phone: data.phone,
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
                token: data.token,
                branch: {
                    connect: {
                        id: data.branchID
                    }
                },
                repository: {
                    connect: {
                        id: data.repositoryID
                    }
                },
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

    async getAllClients(
        skip: number,
        take: number,
        filters: { deleted?: string }
    ) {
        const clients = await prisma.client.findMany({
            skip: skip,
            take: take,
            // orderBy: {
            //     name: "desc"
            // },
            where: {
                AND: [{ deleted: filters.deleted === "true" ? true : false }]
            },
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
                company: data.companyID
                    ? {
                          connect: {
                              id: data.companyID
                          }
                      }
                    : undefined,
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
                    : undefined
            },
            select: clientSelect
        });
        return clientReform(client);
    }

    async deleteClient(data: { clientID: number; deletedByID: number }) {
        await prisma.client.update({
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
        return true;
    }
}
