import { Prisma, PrismaClient } from "@prisma/client";
import { CompanyCreateType, CompanyUpdateType } from "./companies.zod";

const prisma = new PrismaClient();

const companySelect = {
    id: true,
    name: true,
    phone: true,
    website: true,
    logo: true,
    color: true,
    registrationText: true,
    governoratePrice: true,
    deliveryAgentFee: true,
    baghdadPrice: true,
    additionalPriceForEvery500000IraqiDinar: true,
    additionalPriceForEveryKilogram: true,
    additionalPriceForRemoteAreas: true,
    orderStatusAutomaticUpdate: true
} satisfies Prisma.CompanySelect;

// const companyReform = (company: any) => {
//     return {
//         id: company.id,
//         name: company.name,
//         phone: company.phone,
//         website: company.website,
//         logo: company.logo,
//         registrationText: company.registrationText,
//         governoratePrice: company.governoratePrice,
//         deliveryAgentFee: company.deliveryAgentFee,
//         baghdadPrice: company.baghdadPrice,
//         additionalPriceForEvery500000IraqiDinar:
//             company.additionalPriceForEvery500000IraqiDinar,
//         additionalPriceForEveryKilogram: company.additionalPriceForEveryKilogram,
//         additionalPriceForRemoteAreas: company.additionalPriceForRemoteAreas,
//         orderStatusAutomaticUpdate: company.orderStatusAutomaticUpdate
//     };
// };

export class CompanyModel {
    async createCompany(data: CompanyCreateType) {
        const createdCompany = await prisma.company.create({
            data: {
                name: data.name,
                phone: data.phone,
                website: data.website,
                logo: data.logo,
                color: data.color,
                registrationText: data.registrationText,
                governoratePrice: data.governoratePrice,
                deliveryAgentFee: data.deliveryAgentFee,
                baghdadPrice: data.baghdadPrice,
                additionalPriceForEvery500000IraqiDinar: data.additionalPriceForEvery500000IraqiDinar,
                additionalPriceForEveryKilogram: data.additionalPriceForEveryKilogram,
                additionalPriceForRemoteAreas: data.additionalPriceForRemoteAreas,
                orderStatusAutomaticUpdate: data.orderStatusAutomaticUpdate
            },
            select: companySelect
        });
        return createdCompany;
    }

    async getCompaniesCount() {
        const companiesCount = await prisma.company.count();
        return companiesCount;
    }

    async getAllCompanies(
        skip: number,
        take: number,
        filters: {
            minified?: boolean;
        }
    ) {
        if (filters.minified === true) {
            const companies = await prisma.company.findMany({
                skip: skip,
                take: take,
                select: {
                    id: true,
                    name: true
                }
            });
            return companies;
        }

        const companies = await prisma.company.findMany({
            skip: skip,
            take: take,
            select: companySelect
        });

        return companies;
    }

    async getCompany(data: { companyID: number }) {
        const company = await prisma.company.findUnique({
            where: {
                id: data.companyID
            },
            select: companySelect
        });
        return company;
    }

    async updateCompany(data: {
        companyID: number;
        companyData: CompanyUpdateType;
    }) {
        const company = await prisma.company.update({
            where: {
                id: data.companyID
            },
            data: {
                name: data.companyData.name,
                phone: data.companyData.phone,
                website: data.companyData.website,
                logo: data.companyData.logo,
                color: data.companyData.color,
                registrationText: data.companyData.registrationText,
                governoratePrice: data.companyData.governoratePrice,
                deliveryAgentFee: data.companyData.deliveryAgentFee,
                baghdadPrice: data.companyData.baghdadPrice,
                additionalPriceForEvery500000IraqiDinar:
                    data.companyData.additionalPriceForEvery500000IraqiDinar,
                additionalPriceForEveryKilogram: data.companyData.additionalPriceForEveryKilogram,
                additionalPriceForRemoteAreas: data.companyData.additionalPriceForRemoteAreas,
                orderStatusAutomaticUpdate: data.companyData.orderStatusAutomaticUpdate
            },
            select: companySelect
        });
        return company;
    }

    async deleteCompany(data: { companyID: number }) {
        await prisma.company.delete({
            where: {
                id: data.companyID
            },
            select: companySelect
        });
        return true;
    }
}
