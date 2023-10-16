/*
  Warnings:

  - Added the required column `accountType` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('CLIENT', 'CLIENT_ASSISTANT');

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "accountType",
ADD COLUMN     "accountType" "AccountType" NOT NULL;
