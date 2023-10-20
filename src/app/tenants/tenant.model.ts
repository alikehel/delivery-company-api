import { PrismaClient } from "@prisma/client";
import { TenantCreateType, TenantUpdateType } from "./tenants.zod";

const prisma = new PrismaClient();

export class TenantModel {
    async createTenant(data: TenantCreateType) {
        const createdTenant = await prisma.tenant.create({
            data: {
                name: data.name,
                phone: data.phone,
                website: data.website,
                logo: data.logo,
                registrationText: data.registrationText,
                governoratePrice: data.governoratePrice,
                deliveryAgentFee: data.deliveryAgentFee,
                baghdadPrice: data.baghdadPrice,
                additionalPriceForEvery500000IraqiDinar:
                    data.additionalPriceForEvery500000IraqiDinar,
                additionalPriceForEveryKilogram:
                    data.additionalPriceForEveryKilogram,
                additionalPriceForRemoteAreas:
                    data.additionalPriceForRemoteAreas,
                orderStatusAutomaticUpdate: data.orderStatusAutomaticUpdate
            },
            select: {
                id: true,
                name: true,
                phone: true,
                website: true,
                logo: true,
                registrationText: true,
                governoratePrice: true,
                deliveryAgentFee: true,
                baghdadPrice: true,
                additionalPriceForEvery500000IraqiDinar: true,
                additionalPriceForEveryKilogram: true,
                additionalPriceForRemoteAreas: true,
                orderStatusAutomaticUpdate: true
            }
        });
        return createdTenant;
    }

    async getTenantsCount() {
        const tenantsCount = await prisma.tenant.count();
        return tenantsCount;
    }

    async getAllTenants(skip: number, take: number) {
        const tenants = await prisma.tenant.findMany({
            skip: skip,
            take: take,
            orderBy: {
                name: "desc"
            },
            select: {
                id: true,
                name: true,
                phone: true,
                website: true,
                logo: true,
                registrationText: true,
                governoratePrice: true,
                deliveryAgentFee: true,
                baghdadPrice: true,
                additionalPriceForEvery500000IraqiDinar: true,
                additionalPriceForEveryKilogram: true,
                additionalPriceForRemoteAreas: true,
                orderStatusAutomaticUpdate: true
            }
        });
        return tenants;
    }

    async getTenant(data: { tenantID: string }) {
        const tenant = await prisma.tenant.findUnique({
            where: {
                id: data.tenantID
            },
            select: {
                id: true,
                name: true,
                phone: true,
                website: true,
                logo: true,
                registrationText: true,
                governoratePrice: true,
                deliveryAgentFee: true,
                baghdadPrice: true,
                additionalPriceForEvery500000IraqiDinar: true,
                additionalPriceForEveryKilogram: true,
                additionalPriceForRemoteAreas: true,
                orderStatusAutomaticUpdate: true
            }
        });
        return tenant;
    }

    async updateTenant(data: {
        tenantID: string;
        tenantData: TenantUpdateType;
    }) {
        const tenant = await prisma.tenant.update({
            where: {
                id: data.tenantID
            },
            data: {
                name: data.tenantData.name,
                phone: data.tenantData.phone,
                website: data.tenantData.website,
                logo: data.tenantData.logo,
                registrationText: data.tenantData.registrationText,
                governoratePrice: data.tenantData.governoratePrice,
                deliveryAgentFee: data.tenantData.deliveryAgentFee,
                baghdadPrice: data.tenantData.baghdadPrice,
                additionalPriceForEvery500000IraqiDinar:
                    data.tenantData.additionalPriceForEvery500000IraqiDinar,
                additionalPriceForEveryKilogram:
                    data.tenantData.additionalPriceForEveryKilogram,
                additionalPriceForRemoteAreas:
                    data.tenantData.additionalPriceForRemoteAreas,
                orderStatusAutomaticUpdate:
                    data.tenantData.orderStatusAutomaticUpdate
            },
            select: {
                id: true,
                name: true,
                phone: true,
                website: true,
                logo: true,
                registrationText: true,
                governoratePrice: true,
                deliveryAgentFee: true,
                baghdadPrice: true,
                additionalPriceForEvery500000IraqiDinar: true,
                additionalPriceForEveryKilogram: true,
                additionalPriceForRemoteAreas: true,
                orderStatusAutomaticUpdate: true
            }
        });
        return tenant;
    }

    async deleteTenant(data: { tenantID: string }) {
        const deletedTenant = await prisma.tenant.delete({
            where: {
                id: data.tenantID
            },
            select: {
                id: true,
                name: true,
                phone: true,
                website: true,
                logo: true,
                registrationText: true,
                governoratePrice: true,
                deliveryAgentFee: true,
                baghdadPrice: true,
                additionalPriceForEvery500000IraqiDinar: true,
                additionalPriceForEveryKilogram: true,
                additionalPriceForRemoteAreas: true,
                orderStatusAutomaticUpdate: true
            }
        });
        return deletedTenant;
    }
}
