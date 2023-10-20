-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('REGISTERED', 'READY_TO_SEND', 'WITH_DELIVERY_AGENT', 'DELIVERED', 'REPLACED', 'PARTIALLY_RETURNED', 'RETURNED', 'POSTPONED', 'CHANGE_ADDRESS', 'RESEND', 'WITH_RECEIVING_AGENT', 'PROCESSING');

-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('NORMAL', 'REPLACEMENT');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "totalCost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "paidAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalCostInUSD" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "paidAmountInUSD" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "discount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "receiptNumber" INTEGER NOT NULL DEFAULT 0,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "recipientName" TEXT NOT NULL,
    "recipientPhone" TEXT NOT NULL,
    "recipientAddress" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "deliveryType" "DeliveryType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deliveryDate" TIMESTAMP(3),
    "clientId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
