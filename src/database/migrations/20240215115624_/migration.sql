/*
  Warnings:

  - You are about to drop the column `updateAt` on the `AutomaticUpdate` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderStatus,governorate,branchId,companyId]` on the table `AutomaticUpdate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `branchId` to the `AutomaticUpdate` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AutomaticUpdate_orderStatus_governorate_companyId_key";

-- AlterTable
ALTER TABLE "AutomaticUpdate" DROP COLUMN "updateAt",
ADD COLUMN     "branchId" INTEGER NOT NULL,
ADD COLUMN     "newOrderStatus" "OrderStatus" NOT NULL DEFAULT 'DELIVERED',
ALTER COLUMN "returnCondition" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AutomaticUpdate_orderStatus_governorate_branchId_companyId_key" ON "AutomaticUpdate"("orderStatus", "governorate", "branchId", "companyId");

-- AddForeignKey
ALTER TABLE "AutomaticUpdate" ADD CONSTRAINT "AutomaticUpdate_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
