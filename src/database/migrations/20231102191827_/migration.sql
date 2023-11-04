/*
  Warnings:

  - You are about to drop the column `details` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Order` table. All the data in the column will be lost.
  - Made the column `governorate` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `storeId` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_storeId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- AlterTable
CREATE SEQUENCE order_receiptnumber_seq;
ALTER TABLE "Order" DROP COLUMN "details",
DROP COLUMN "userId",
ADD COLUMN     "deliveryAgentId" TEXT,
ALTER COLUMN "paidAmount" DROP NOT NULL,
ALTER COLUMN "totalCostInUSD" DROP NOT NULL,
ALTER COLUMN "paidAmountInUSD" DROP NOT NULL,
ALTER COLUMN "discount" DROP NOT NULL,
ALTER COLUMN "receiptNumber" SET DEFAULT nextval('order_receiptnumber_seq'),
ALTER COLUMN "notes" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'REGISTERED',
ALTER COLUMN "deliveryType" SET DEFAULT 'NORMAL',
ALTER COLUMN "governorate" SET NOT NULL,
ALTER COLUMN "storeId" SET NOT NULL;
ALTER SEQUENCE order_receiptnumber_seq OWNED BY "Order"."receiptNumber";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryAgentId_fkey" FOREIGN KEY ("deliveryAgentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
