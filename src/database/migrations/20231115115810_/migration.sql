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
