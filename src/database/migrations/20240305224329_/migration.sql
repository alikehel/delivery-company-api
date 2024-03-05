-- CreateEnum
CREATE TYPE "SecondaryStatus" AS ENUM ('WITH_CLIENT', 'WITH_AGENT', 'IN_REPOSITORY');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "secondaryStatus" "SecondaryStatus";
