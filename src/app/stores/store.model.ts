import { PrismaClient } from "@prisma/client";
import { StoreCreateType, StoreUpdateType } from "./stores.zod";

const prisma = new PrismaClient();

export class StoreModel {
    async createStore(data: StoreCreateType) {
        const createdStore = await prisma.store.create({
            data: {
                name: data.name,
                notes: data.notes,
                client: {
                    connect: {
                        id: data.clientID
                    }
                }
            },
            select: {
                id: true,
                name: true,
                notes: true,
                client: true
            }
        });
        return createdStore;
    }

    async getStoresCount() {
        const storesCount = await prisma.store.count();
        return storesCount;
    }

    async getAllStores(skip: number, take: number) {
        const stores = await prisma.store.findMany({
            skip: skip,
            take: take,
            orderBy: {
                name: "desc"
            },
            select: {
                id: true,
                name: true,
                notes: true,
                client: true
            }
        });
        return stores;
    }

    async getStore(data: { storeID: string }) {
        const store = await prisma.store.findUnique({
            where: {
                id: data.storeID
            },
            select: {
                id: true,
                name: true,
                notes: true,
                client: true
            }
        });
        return store;
    }

    async updateStore(data: { storeID: string; storeData: StoreUpdateType }) {
        const store = await prisma.store.update({
            where: {
                id: data.storeID
            },
            data: {
                name: data.storeData.name,
                notes: data.storeData.notes,
                client: data.storeData.clientID
                    ? {
                          connect: {
                              id: data.storeData.clientID
                          }
                      }
                    : undefined
            },
            select: {
                id: true,
                name: true,
                notes: true,
                client: true
            }
        });
        return store;
    }

    async deleteStore(data: { storeID: string }) {
        const deletedStore = await prisma.store.delete({
            where: {
                id: data.storeID
            }
        });
        return deletedStore;
    }
}
