/*
  Warnings:

  - You are about to drop the column `employeeId` on the `Client` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_employeeId_fkey";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "employeeId",
ADD COLUMN     "createdById" INTEGER;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "createdById" INTEGER;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
