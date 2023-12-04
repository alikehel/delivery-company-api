-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedById" INTEGER;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedById" INTEGER;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedById" INTEGER;

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedById" INTEGER;

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedById" INTEGER;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
