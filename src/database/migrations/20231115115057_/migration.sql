-- DropForeignKey
ALTER TABLE "BranchReport" DROP CONSTRAINT "BranchReport_branchId_fkey";

-- DropForeignKey
ALTER TABLE "BranchReport" DROP CONSTRAINT "BranchReport_reportId_fkey";

-- DropForeignKey
ALTER TABLE "ClientReport" DROP CONSTRAINT "ClientReport_clientId_fkey";

-- DropForeignKey
ALTER TABLE "ClientReport" DROP CONSTRAINT "ClientReport_reportId_fkey";

-- DropForeignKey
ALTER TABLE "ClientReport" DROP CONSTRAINT "ClientReport_storeId_fkey";

-- DropForeignKey
ALTER TABLE "DeliveryAgentReport" DROP CONSTRAINT "DeliveryAgentReport_deliveryAgentId_fkey";

-- DropForeignKey
ALTER TABLE "DeliveryAgentReport" DROP CONSTRAINT "DeliveryAgentReport_reportId_fkey";

-- DropForeignKey
ALTER TABLE "GovernorateReport" DROP CONSTRAINT "GovernorateReport_reportId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_branchReportReportNumber_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_clientReportReportNumber_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_deliveryAgentReportReportNumber_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_governorateReportReportNumber_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_repositoryReportReportNumber_fkey";

-- DropForeignKey
ALTER TABLE "RepositoryReport" DROP CONSTRAINT "RepositoryReport_reportId_fkey";

-- DropForeignKey
ALTER TABLE "RepositoryReport" DROP CONSTRAINT "RepositoryReport_repositoryId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "currentLocation" TEXT;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_clientReportReportNumber_fkey" FOREIGN KEY ("clientReportReportNumber") REFERENCES "ClientReport"("reportNumber") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_repositoryReportReportNumber_fkey" FOREIGN KEY ("repositoryReportReportNumber") REFERENCES "RepositoryReport"("reportNumber") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_branchReportReportNumber_fkey" FOREIGN KEY ("branchReportReportNumber") REFERENCES "BranchReport"("reportNumber") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryAgentReportReportNumber_fkey" FOREIGN KEY ("deliveryAgentReportReportNumber") REFERENCES "DeliveryAgentReport"("reportNumber") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_governorateReportReportNumber_fkey" FOREIGN KEY ("governorateReportReportNumber") REFERENCES "GovernorateReport"("reportNumber") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientReport" ADD CONSTRAINT "ClientReport_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientReport" ADD CONSTRAINT "ClientReport_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientReport" ADD CONSTRAINT "ClientReport_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepositoryReport" ADD CONSTRAINT "RepositoryReport_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepositoryReport" ADD CONSTRAINT "RepositoryReport_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchReport" ADD CONSTRAINT "BranchReport_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BranchReport" ADD CONSTRAINT "BranchReport_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryAgentReport" ADD CONSTRAINT "DeliveryAgentReport_deliveryAgentId_fkey" FOREIGN KEY ("deliveryAgentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryAgentReport" ADD CONSTRAINT "DeliveryAgentReport_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GovernorateReport" ADD CONSTRAINT "GovernorateReport_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
