-- AlterTable
ALTER TABLE "BranchReport" ADD COLUMN     "deliveryAgentDeliveryCost" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ClientReport" ADD COLUMN     "baghdadDeliveryCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "governoratesDeliveryCost" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "CompanyReport" ADD COLUMN     "baghdadDeliveryCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "governoratesDeliveryCost" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "DeliveryAgentReport" ADD COLUMN     "deliveryAgentDeliveryCost" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "GovernorateReport" ADD COLUMN     "deliveryAgentDeliveryCost" DOUBLE PRECISION NOT NULL DEFAULT 0;
