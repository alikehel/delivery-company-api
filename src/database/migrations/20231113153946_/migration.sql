/*
  Warnings:

  - You are about to drop the column `recorded` on the `Order` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('UNPAID', 'PAID');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('COMPANY', 'REPOSITORY', 'GOVERNORATE', 'DELIVERY_AGENT', 'BRANCH', 'CLIENT');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "recorded",
ADD COLUMN     "branchReportReportNumber" INTEGER,
ADD COLUMN     "clientReportReportNumber" INTEGER,
ADD COLUMN     "deliveryAgentReportReportNumber" INTEGER,
ADD COLUMN     "governorateReportReportNumber" INTEGER,
ADD COLUMN     "repositoryReportReportNumber" INTEGER;

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'UNPAID',
    "type" "ReportType" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientReport" (
    "reportNumber" SERIAL NOT NULL,
    "clientId" TEXT NOT NULL,
    "reportId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "RepositoryReport" (
    "reportNumber" SERIAL NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "reportId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BranchReport" (
    "reportNumber" SERIAL NOT NULL,
    "branchId" TEXT NOT NULL,
    "reportId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DeliveryAgentReport" (
    "reportNumber" SERIAL NOT NULL,
    "deliveryAgentId" TEXT NOT NULL,
    "reportId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "GovernorateReport" (
    "reportNumber" SERIAL NOT NULL,
    "governorate" "Governorate" NOT NULL,
    "reportId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientReport_reportNumber_key" ON "ClientReport"("reportNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ClientReport_reportId_key" ON "ClientReport"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "RepositoryReport_reportNumber_key" ON "RepositoryReport"("reportNumber");

-- CreateIndex
CREATE UNIQUE INDEX "RepositoryReport_reportId_key" ON "RepositoryReport"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "BranchReport_reportNumber_key" ON "BranchReport"("reportNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BranchReport_reportId_key" ON "BranchReport"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryAgentReport_reportNumber_key" ON "DeliveryAgentReport"("reportNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryAgentReport_reportId_key" ON "DeliveryAgentReport"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "GovernorateReport_reportNumber_key" ON "GovernorateReport"("reportNumber");

-- CreateIndex
CREATE UNIQUE INDEX "GovernorateReport_reportId_key" ON "GovernorateReport"("reportId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_clientReportReportNumber_fkey" FOREIGN KEY ("clientReportReportNumber") REFERENCES "ClientReport"("reportNumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_repositoryReportReportNumber_fkey" FOREIGN KEY ("repositoryReportReportNumber") REFERENCES "RepositoryReport"("reportNumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_branchReportReportNumber_fkey" FOREIGN KEY ("branchReportReportNumber") REFERENCES "BranchReport"("reportNumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryAgentReportReportNumber_fkey" FOREIGN KEY ("deliveryAgentReportReportNumber") REFERENCES "DeliveryAgentReport"("reportNumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_governorateReportReportNumber_fkey" FOREIGN KEY ("governorateReportReportNumber") REFERENCES "GovernorateReport"("reportNumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientReport" ADD CONSTRAINT "ClientReport_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientReport" ADD CONSTRAINT "ClientReport_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepositoryReport" ADD CONSTRAINT "RepositoryReport_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepositoryReport" ADD CONSTRAINT "RepositoryReport_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchReport" ADD CONSTRAINT "BranchReport_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchReport" ADD CONSTRAINT "BranchReport_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryAgentReport" ADD CONSTRAINT "DeliveryAgentReport_deliveryAgentId_fkey" FOREIGN KEY ("deliveryAgentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryAgentReport" ADD CONSTRAINT "DeliveryAgentReport_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GovernorateReport" ADD CONSTRAINT "GovernorateReport_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
