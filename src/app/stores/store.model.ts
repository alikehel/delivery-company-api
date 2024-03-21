import { Prisma, PrismaClient } from "@prisma/client";
import { StoreCreateType, StoreUpdateType } from "./stores.zod";

const prisma = new PrismaClient();

const storeSelect = {
    id: true,
    name: true,
    notes: true,
    logo: true,
    client: {
        select: {
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
    },
    deleted: true,
    deletedAt: true,
    deletedBy: {
        select: {
            id: true,
            name: true
        }
    }
} satisfies Prisma.StoreSelect;

const storeSelectReform = (
    store: Prisma.StoreGetPayload<{
        select: typeof storeSelect;
    }> | null
) => {
    if (!store) {
        return null;
    }
    return {
        id: store.id,
        name: store.name,
        notes: store.notes,
        logo: store.logo,
        client: store.client.user
            ? {
                  id: store.client.user.id,
                  name: store.client.user.name
              }
            : undefined,
        company: store.company,
        deleted: store.deleted,
        deletedBy: store.deleted && store.deletedBy,
        deletedAt: store.deletedAt?.toISOString()
    };
};

export class StoreModel {
    async createStore(companyID: number, data: StoreCreateType) {
        const createdStore = await prisma.store.create({
            data: {
                name: data.name,
                notes: data.notes,
                logo: data.logo,
                company: {
                    connect: {
                        id: companyID
                    }
                },
                client: {
                    connect: {
                        id: data.clientID
                    }
                }
            },
            select: storeSelect
        });
        return storeSelectReform(createdStore);
    }

    async getStoresCount(filters: {
        deleted?: string;
        companyID?: number;
    }) {
        const storesCount = await prisma.store.count({
            where: {
                AND: [{ deleted: filters.deleted === "true" }, { company: { id: filters.companyID } }]
            }
        });
        return storesCount;
    }

    async getAllStores(
        skip: number,
        take: number,
        filters: { deleted?: string; companyID?: number; minified?: boolean }
    ) {
        const where = {
            AND: [{ deleted: filters.deleted === "true" }, { company: { id: filters.companyID } }]
        };

        if (filters.minified === true) {
            const stores = await prisma.store.findMany({
                skip: skip,
                take: take,
                where: where,
                select: {
                    id: true,
                    name: true
                }
            });
            return stores;
        }

        const stores = await prisma.store.findMany({
            skip: skip,
            take: take,
            where: where,
            orderBy: {
                id: "desc"
            },
            select: storeSelect
        });

        return stores.map(storeSelectReform);
    }

    async getStore(data: { storeID: number }) {
        const store = await prisma.store.findUnique({
            where: {
                id: data.storeID
            },
            select: storeSelect
        });
        return storeSelectReform(store);
    }

    async updateStore(data: { storeID: number; storeData: StoreUpdateType }) {
        const store = await prisma.store.update({
            where: {
                id: data.storeID
            },
            data: {
                name: data.storeData.name,
                logo: data.storeData.logo,
                notes: data.storeData.notes,
                client: data.storeData.clientID
                    ? {
                          connect: {
                              id: data.storeData.clientID
                          }
                      }
                    : undefined
            },
            select: storeSelect
        });
        return storeSelectReform(store);
    }

    async deleteStore(data: { storeID: number }) {
        const deletedStore = await prisma.store.delete({
            where: {
                id: data.storeID
            }
        });
        return deletedStore;
    }

    async deactivateStore(data: { storeID: number; deletedByID: number }) {
        const deletedStore = await prisma.store.update({
            where: {
                id: data.storeID
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
        return deletedStore;
    }

    async reactivateStore(data: { storeID: number }) {
        const deletedStore = await prisma.store.update({
            where: {
                id: data.storeID
            },
            data: {
                deleted: false
            }
        });
        return deletedStore;
    }
}
