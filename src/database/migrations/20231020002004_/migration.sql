/*
  Warnings:

  - The values [ADD_ORDER_TO_DRIVER,DELETE_DRIVER_REPORTS] on the enum `Permission` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Permission_new" AS ENUM ('ADD_ORDER_TO_DELIVERY_AGENT', 'ADD_PAGE', 'ADD_ORDER', 'ADD_CLIENT', 'EDIT_CLIENT_NAME', 'EDIT_ORDER_TOTAL_AMOUNT', 'CHANGE_ORDER_STATUS', 'CHANGE_CLOSED_ORDER_STATUS', 'LOCK_ORDER_STATUS', 'DELETE_PRICES', 'DELETE_ORDERS', 'DELETE_REPORTS', 'DELETE_COMPANY_REPORTS', 'DELETE_REPOSITORIES_REPORTS', 'DELETE_GOVERNMENT_REPORTS', 'DELETE_DELIVERY_AGENT_REPORTS');
ALTER TABLE "User" ALTER COLUMN "permissions" TYPE "Permission_new"[] USING ("permissions"::text::"Permission_new"[]);
ALTER TYPE "Permission" RENAME TO "Permission_old";
ALTER TYPE "Permission_new" RENAME TO "Permission";
DROP TYPE "Permission_old";
COMMIT;

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "registrationText" TEXT,
    "governoratePrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "deliveryAgentFee" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "baghdadPrice" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "additionalPriceForEvery500000IraqiDinar" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "additionalPriceForEveryKilogram" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "additionalPriceForRemoteAreas" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "orderStatusAutomaticUpdate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_name_key" ON "Tenant"("name");
