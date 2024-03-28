-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_branchId_fkey";

-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "branchId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
