/*
  Warnings:

  - You are about to drop the column `reportId` on the `BranchReport` table. All the data in the column will be lost.
  - You are about to drop the column `reportNumber` on the `BranchReport` table. All the data in the column will be lost.
  - You are about to drop the column `reportId` on the `ClientReport` table. All the data in the column will be lost.
  - You are about to drop the column `reportNumber` on the `ClientReport` table. All the data in the column will be lost.
  - You are about to drop the column `reportId` on the `CompanyReport` table. All the data in the column will be lost.
  - You are about to drop the column `reportNumber` on the `CompanyReport` table. All the data in the column will be lost.
  - You are about to drop the column `reportId` on the `DeliveryAgentReport` table. All the data in the column will be lost.
  - You are about to drop the column `reportNumber` on the `DeliveryAgentReport` table. All the data in the column will be lost.
  - You are about to drop the column `reportId` on the `GovernorateReport` table. All the data in the column will be lost.
  - You are about to drop the column `reportNumber` on the `GovernorateReport` table. All the data in the column will be lost.
  - You are about to drop the column `branchReportReportNumber` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `clientReportReportNumber` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `companyReportReportNumber` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryAgentReportReportNumber` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `governorateReportReportNumber` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `repositoryReportReportNumber` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `reportId` on the `RepositoryReport` table. All the data in the column will be lost.
  - You are about to drop the column `reportNumber` on the `RepositoryReport` table. All the data in the column will be lost.
  - Added the required column `id` to the `BranchReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `ClientReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `CompanyReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `DeliveryAgentReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `GovernorateReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `RepositoryReport` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BranchReport" DROP CONSTRAINT "BranchReport_reportId_fkey";

-- DropForeignKey
ALTER TABLE "ClientReport" DROP CONSTRAINT "ClientReport_reportId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyReport" DROP CONSTRAINT "CompanyReport_reportId_fkey";

-- DropForeignKey
ALTER TABLE "DeliveryAgentReport" DROP CONSTRAINT "DeliveryAgentReport_reportId_fkey";

-- DropForeignKey
ALTER TABLE "GovernorateReport" DROP CONSTRAINT "GovernorateReport_reportId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_branchReportReportNumber_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_clientReportReportNumber_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_companyReportReportNumber_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_deliveryAgentReportReportNumber_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_governorateReportReportNumber_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_repositoryReportReportNumber_fkey";

-- DropForeignKey
ALTER TABLE "RepositoryReport" DROP CONSTRAINT "RepositoryReport_reportId_fkey";

-- DropIndex
DROP INDEX "BranchReport_reportId_key";

-- DropIndex
DROP INDEX "BranchReport_reportNumber_key";

-- DropIndex
DROP INDEX "ClientReport_reportId_key";

-- DropIndex
DROP INDEX "ClientReport_reportNumber_key";

-- DropIndex
DROP INDEX "CompanyReport_reportId_key";

-- DropIndex
DROP INDEX "CompanyReport_reportNumber_key";

-- DropIndex
DROP INDEX "DeliveryAgentReport_reportId_key";

-- DropIndex
DROP INDEX "DeliveryAgentReport_reportNumber_key";

-- DropIndex
DROP INDEX "GovernorateReport_reportId_key";

-- DropIndex
DROP INDEX "GovernorateReport_reportNumber_key";

-- DropIndex
DROP INDEX "RepositoryReport_reportId_key";

-- DropIndex
DROP INDEX "RepositoryReport_reportNumber_key";

-- AlterTable
ALTER TABLE "BranchReport" DROP COLUMN "reportId",
DROP COLUMN "reportNumber",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "BranchReport_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ClientReport" DROP COLUMN "reportId",
DROP COLUMN "reportNumber",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "ClientReport_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CompanyReport" DROP COLUMN "reportId",
DROP COLUMN "reportNumber",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "CompanyReport_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "DeliveryAgentReport" DROP COLUMN "reportId",
DROP COLUMN "reportNumber",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "DeliveryAgentReport_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "GovernorateReport" DROP COLUMN "reportId",
DROP COLUMN "reportNumber",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "GovernorateReport_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "branchReportReportNumber",
DROP COLUMN "clientReportReportNumber",
DROP COLUMN "companyReportReportNumber",
DROP COLUMN "deliveryAgentReportReportNumber",
DROP COLUMN "governorateReportReportNumber",
DROP COLUMN "repositoryReportReportNumber",
ADD COLUMN     "branchReportId" INTEGER,
ADD COLUMN     "clientReportId" INTEGER,
ADD COLUMN     "companyReportId" INTEGER,
ADD COLUMN     "deliveryAgentReportId" INTEGER,
ADD COLUMN     "governorateReportId" INTEGER,
ADD COLUMN     "repositoryReportId" INTEGER;

-- AlterTable
ALTER TABLE "RepositoryReport" DROP COLUMN "reportId",
DROP COLUMN "reportNumber",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "RepositoryReport_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_clientReportId_fkey" FOREIGN KEY ("clientReportId") REFERENCES "ClientReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_repositoryReportId_fkey" FOREIGN KEY ("repositoryReportId") REFERENCES "RepositoryReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_branchReportId_fkey" FOREIGN KEY ("branchReportId") REFERENCES "BranchReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryAgentReportId_fkey" FOREIGN KEY ("deliveryAgentReportId") REFERENCES "DeliveryAgentReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_governorateReportId_fkey" FOREIGN KEY ("governorateReportId") REFERENCES "GovernorateReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_companyReportId_fkey" FOREIGN KEY ("companyReportId") REFERENCES "CompanyReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyReport" ADD CONSTRAINT "CompanyReport_id_fkey" FOREIGN KEY ("id") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientReport" ADD CONSTRAINT "ClientReport_id_fkey" FOREIGN KEY ("id") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepositoryReport" ADD CONSTRAINT "RepositoryReport_id_fkey" FOREIGN KEY ("id") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchReport" ADD CONSTRAINT "BranchReport_id_fkey" FOREIGN KEY ("id") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryAgentReport" ADD CONSTRAINT "DeliveryAgentReport_id_fkey" FOREIGN KEY ("id") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GovernorateReport" ADD CONSTRAINT "GovernorateReport_id_fkey" FOREIGN KEY ("id") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
