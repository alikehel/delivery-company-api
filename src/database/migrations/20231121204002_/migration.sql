-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "companyReportReportNumber" INTEGER;

-- CreateTable
CREATE TABLE "CompanyReport" (
    "reportNumber" SERIAL NOT NULL,
    "reportId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyReport_reportNumber_key" ON "CompanyReport"("reportNumber");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyReport_reportId_key" ON "CompanyReport"("reportId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_companyReportReportNumber_fkey" FOREIGN KEY ("companyReportReportNumber") REFERENCES "CompanyReport"("reportNumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyReport" ADD CONSTRAINT "CompanyReport_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyReport" ADD CONSTRAINT "CompanyReport_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
