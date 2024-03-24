/*
  Warnings:

  - Made the column `returnCondition` on table `AutomaticUpdate` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AutomaticUpdate" ALTER COLUMN "returnCondition" SET NOT NULL;
