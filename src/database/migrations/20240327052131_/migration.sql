-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "inquiryGovernorates" "Governorate"[],
ADD COLUMN     "inquiryStatuses" "OrderStatus"[];

-- CreateTable
CREATE TABLE "InquiryEmployeesDeliveryAgents" (
    "inquiryEmployeeId" INTEGER NOT NULL,
    "deliveryAgentId" INTEGER NOT NULL,

    CONSTRAINT "InquiryEmployeesDeliveryAgents_pkey" PRIMARY KEY ("inquiryEmployeeId","deliveryAgentId")
);

-- CreateTable
CREATE TABLE "InquiryEmployeesStores" (
    "inquiryEmployeeId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,

    CONSTRAINT "InquiryEmployeesStores_pkey" PRIMARY KEY ("inquiryEmployeeId","storeId")
);

-- CreateTable
CREATE TABLE "InquiryEmployeesBranches" (
    "inquiryEmployeeId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,

    CONSTRAINT "InquiryEmployeesBranches_pkey" PRIMARY KEY ("inquiryEmployeeId","branchId")
);

-- CreateTable
CREATE TABLE "InquiryEmployeesLocations" (
    "inquiryEmployeeId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,

    CONSTRAINT "InquiryEmployeesLocations_pkey" PRIMARY KEY ("inquiryEmployeeId","locationId")
);

-- CreateTable
CREATE TABLE "InquiryEmployeesCompanies" (
    "inquiryEmployeeId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "InquiryEmployeesCompanies_pkey" PRIMARY KEY ("inquiryEmployeeId","companyId")
);

-- AddForeignKey
ALTER TABLE "InquiryEmployeesDeliveryAgents" ADD CONSTRAINT "InquiryEmployeesDeliveryAgents_inquiryEmployeeId_fkey" FOREIGN KEY ("inquiryEmployeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryEmployeesDeliveryAgents" ADD CONSTRAINT "InquiryEmployeesDeliveryAgents_deliveryAgentId_fkey" FOREIGN KEY ("deliveryAgentId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryEmployeesStores" ADD CONSTRAINT "InquiryEmployeesStores_inquiryEmployeeId_fkey" FOREIGN KEY ("inquiryEmployeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryEmployeesStores" ADD CONSTRAINT "InquiryEmployeesStores_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryEmployeesBranches" ADD CONSTRAINT "InquiryEmployeesBranches_inquiryEmployeeId_fkey" FOREIGN KEY ("inquiryEmployeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryEmployeesBranches" ADD CONSTRAINT "InquiryEmployeesBranches_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryEmployeesLocations" ADD CONSTRAINT "InquiryEmployeesLocations_inquiryEmployeeId_fkey" FOREIGN KEY ("inquiryEmployeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryEmployeesLocations" ADD CONSTRAINT "InquiryEmployeesLocations_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryEmployeesCompanies" ADD CONSTRAINT "InquiryEmployeesCompanies_inquiryEmployeeId_fkey" FOREIGN KEY ("inquiryEmployeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryEmployeesCompanies" ADD CONSTRAINT "InquiryEmployeesCompanies_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
