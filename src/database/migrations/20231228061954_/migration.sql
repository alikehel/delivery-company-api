/*
  Warnings:

  - You are about to drop the column `paidAmountInUSD` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `totalCostInUSD` on the `Order` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AutomaticUpdateReturnCondition" AS ENUM ('WITH_AGENT', 'IN_REPOSITORY');

-- DropIndex
DROP INDEX "Order_receiptNumber_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paidAmountInUSD",
DROP COLUMN "totalCostInUSD";

-- CreateTable
CREATE TABLE "AutomaticUpdate" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" INTEGER NOT NULL,
    "orderStatus" "OrderStatus" NOT NULL,
    "governorate" "Governorate" NOT NULL,
    "returnCondition" "AutomaticUpdateReturnCondition" NOT NULL,
    "updateAt" INTEGER NOT NULL DEFAULT 22,
    "checkAfter" INTEGER NOT NULL DEFAULT 24,

    CONSTRAINT "AutomaticUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AutomaticUpdate_orderStatus_governorate_companyId_key" ON "AutomaticUpdate"("orderStatus", "governorate", "companyId");

-- AddForeignKey
ALTER TABLE "AutomaticUpdate" ADD CONSTRAINT "AutomaticUpdate_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
