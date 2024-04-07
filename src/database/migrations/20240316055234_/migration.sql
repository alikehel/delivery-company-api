/*
  Warnings:

  - A unique constraint covering the columns `[companyId,phone]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyId,phone]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Client_companyId_phone_key" ON "Client"("companyId", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_companyId_phone_key" ON "Employee"("companyId", "phone");
