/*
  Warnings:

  - Made the column `clientId` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "DeliveryAgentsLocations" DROP CONSTRAINT "DeliveryAgentsLocations_deliveryAgentId_fkey";

-- DropForeignKey
ALTER TABLE "DeliveryAgentsLocations" DROP CONSTRAINT "DeliveryAgentsLocations_locationId_fkey";

-- DropForeignKey
ALTER TABLE "InquiryEmployeesBranches" DROP CONSTRAINT "InquiryEmployeesBranches_branchId_fkey";

-- DropForeignKey
ALTER TABLE "InquiryEmployeesBranches" DROP CONSTRAINT "InquiryEmployeesBranches_inquiryEmployeeId_fkey";

-- DropForeignKey
ALTER TABLE "InquiryEmployeesCompanies" DROP CONSTRAINT "InquiryEmployeesCompanies_companyId_fkey";

-- DropForeignKey
ALTER TABLE "InquiryEmployeesCompanies" DROP CONSTRAINT "InquiryEmployeesCompanies_inquiryEmployeeId_fkey";

-- DropForeignKey
ALTER TABLE "InquiryEmployeesDeliveryAgents" DROP CONSTRAINT "InquiryEmployeesDeliveryAgents_deliveryAgentId_fkey";

-- DropForeignKey
ALTER TABLE "InquiryEmployeesDeliveryAgents" DROP CONSTRAINT "InquiryEmployeesDeliveryAgents_inquiryEmployeeId_fkey";

-- DropForeignKey
ALTER TABLE "InquiryEmployeesLocations" DROP CONSTRAINT "InquiryEmployeesLocations_inquiryEmployeeId_fkey";

-- DropForeignKey
ALTER TABLE "InquiryEmployeesLocations" DROP CONSTRAINT "InquiryEmployeesLocations_locationId_fkey";

-- DropForeignKey
ALTER TABLE "InquiryEmployeesStores" DROP CONSTRAINT "InquiryEmployeesStores_inquiryEmployeeId_fkey";

-- DropForeignKey
ALTER TABLE "InquiryEmployeesStores" DROP CONSTRAINT "InquiryEmployeesStores_storeId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_clientId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "clientId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "InquiryEmployeesDeliveryAgents" ADD CONSTRAINT "InquiryEmployeesDeliveryAgents_inquiryEmployeeId_fkey" FOREIGN KEY ("inquiryEmployeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryEmployeesDeliveryAgents" ADD CONSTRAINT "InquiryEmployeesDeliveryAgents_deliveryAgentId_fkey" FOREIGN KEY ("deliveryAgentId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryEmployeesStores" ADD CONSTRAINT "InquiryEmployeesStores_inquiryEmployeeId_fkey" FOREIGN KEY ("inquiryEmployeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryEmployeesStores" ADD CONSTRAINT "InquiryEmployeesStores_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryEmployeesBranches" ADD CONSTRAINT "InquiryEmployeesBranches_inquiryEmployeeId_fkey" FOREIGN KEY ("inquiryEmployeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryEmployeesBranches" ADD CONSTRAINT "InquiryEmployeesBranches_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryEmployeesLocations" ADD CONSTRAINT "InquiryEmployeesLocations_inquiryEmployeeId_fkey" FOREIGN KEY ("inquiryEmployeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryEmployeesLocations" ADD CONSTRAINT "InquiryEmployeesLocations_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryAgentsLocations" ADD CONSTRAINT "DeliveryAgentsLocations_deliveryAgentId_fkey" FOREIGN KEY ("deliveryAgentId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryAgentsLocations" ADD CONSTRAINT "DeliveryAgentsLocations_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryEmployeesCompanies" ADD CONSTRAINT "InquiryEmployeesCompanies_inquiryEmployeeId_fkey" FOREIGN KEY ("inquiryEmployeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryEmployeesCompanies" ADD CONSTRAINT "InquiryEmployeesCompanies_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
