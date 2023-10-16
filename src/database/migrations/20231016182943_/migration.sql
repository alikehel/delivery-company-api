/*
  Warnings:

  - You are about to drop the column `account_type` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "account_type",
ADD COLUMN     "accountType" TEXT;
