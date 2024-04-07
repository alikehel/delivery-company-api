-- AlterTable
ALTER TABLE "AutomaticUpdate" ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "automaticUpdateId" INTEGER;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_automaticUpdateId_fkey" FOREIGN KEY ("automaticUpdateId") REFERENCES "AutomaticUpdate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
