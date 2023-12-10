/*
 Warnings:
 - You are about to drop the column `totalCost` on the `ClientReport` table. All the data in the column will be lost.
 */

-- AlterTable

ALTER TABLE "Client"
ADD
    COLUMN "governoratesDeliveryCosts" JSONB NOT NULL DEFAULT '[]';

-- AlterTable

ALTER TABLE "ClientReport" DROP COLUMN "totalCost";

-- AlterTable

ALTER TABLE "Employee"
ADD
    COLUMN "deliveryCost" DECIMAL(65, 30) DEFAULT 0;

-- AlterTable

ALTER TABLE "Order"
ADD
    COLUMN "clientNet" DECIMAL(65, 30) DEFAULT 0,
ADD
    COLUMN "companyNet" DECIMAL(65, 30) DEFAULT 0,
ADD
    COLUMN "deliveryAgentNet" DECIMAL(65, 30) DEFAULT 0,
ADD
    COLUMN "deliveryCost" DECIMAL(65, 30) DEFAULT 0;

-- AlterTable

ALTER TABLE "Report"
ADD
    COLUMN "clientNet" DECIMAL(65, 30) NOT NULL DEFAULT 0,
ADD
    COLUMN "companyNet" DECIMAL(65, 30) NOT NULL DEFAULT 0,
ADD
    COLUMN "deliveryAgentNet" DECIMAL(65, 30) NOT NULL DEFAULT 0,
ADD
    COLUMN "deliveryCost" DECIMAL(65, 30) NOT NULL DEFAULT 0,
ADD
    COLUMN "paidAmount" DECIMAL(65, 30) NOT NULL DEFAULT 0,
ADD
    COLUMN "totalCost" DECIMAL(65, 30) NOT NULL DEFAULT 0;
