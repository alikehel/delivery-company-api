/*
  Warnings:

  - You are about to alter the column `governoratePrice` on the `Company` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `deliveryAgentFee` on the `Company` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `baghdadPrice` on the `Company` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `additionalPriceForEvery500000IraqiDinar` on the `Company` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `additionalPriceForEveryKilogram` on the `Company` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `additionalPriceForRemoteAreas` on the `Company` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `salary` on the `Employee` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `deliveryCost` on the `Employee` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `totalCost` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `paidAmount` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `discount` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `clientNet` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `companyNet` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `deliveryAgentNet` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `deliveryCost` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `clientNet` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `companyNet` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `deliveryAgentNet` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `deliveryCost` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `paidAmount` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `totalCost` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - Made the column `color` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "governoratePrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "deliveryAgentFee" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "baghdadPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "additionalPriceForEvery500000IraqiDinar" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "additionalPriceForEveryKilogram" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "additionalPriceForRemoteAreas" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "color" SET NOT NULL,
ALTER COLUMN "color" SET DEFAULT 'FF0000';

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "salary" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "deliveryCost" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "totalCost" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "paidAmount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "discount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "clientNet" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "companyNet" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "deliveryAgentNet" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "deliveryCost" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "clientNet" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "companyNet" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "deliveryAgentNet" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "deliveryCost" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "paidAmount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "totalCost" SET DATA TYPE DOUBLE PRECISION;
