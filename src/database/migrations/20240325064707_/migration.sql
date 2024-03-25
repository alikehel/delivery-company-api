-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "forwarded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "forwardedAt" TIMESTAMP(3),
ADD COLUMN     "forwardedById" INTEGER,
ADD COLUMN     "forwardedFromId" INTEGER;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_forwardedById_fkey" FOREIGN KEY ("forwardedById") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_forwardedFromId_fkey" FOREIGN KEY ("forwardedFromId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
