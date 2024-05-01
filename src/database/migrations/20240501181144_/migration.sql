/*
  Warnings:

  - You are about to drop the column `timeline` on the `Order` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OrderTimelineType" AS ENUM ('STATUS_CHANGE', 'DELIVERY_AGENT_CHANGE', 'CLIENT_CHANGE', 'REPOSITORY_CHANGE', 'BRANCH_CHANGE', 'CURRENT_LOCATION_CHANGE', 'ORDER_DELIVERY', 'REPORT_CREATE', 'REPORT_DELETE', 'PAID_AMOUNT_CHANGE', 'OTHER');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "timeline";

-- CreateTable
CREATE TABLE "OrderTimeline" (
    "id" SERIAL NOT NULL,
    "type" "OrderTimelineType" NOT NULL,
    "old" JSONB,
    "new" JSONB,
    "message" TEXT NOT NULL,
    "by" JSONB NOT NULL,
    "orderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderTimeline_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderTimeline" ADD CONSTRAINT "OrderTimeline_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
