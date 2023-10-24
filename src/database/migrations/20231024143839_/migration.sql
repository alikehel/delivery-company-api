/*
  Warnings:

  - The values [ACCOUNTANT] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('SUPER_ADMIN', 'COMPANY_MANAGER', 'ACCOUNT_MANAGER', 'محاسب', 'DELIVERY_AGENT', 'RECEIVING_AGENT', 'BRANCH_MANAGER', 'EMERGENCY_EMPLOYEE', 'DATA_ENTRY', 'REPOSITORIY_EMPLOYEE', 'INQUIRY_EMPLOYEE');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;
