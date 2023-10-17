/*
  Warnings:

  - The values [EDIT_TOTAL_AMOUNT,CHANGE_STATUS,CHANGE_CLOSED_STATUS,LOCK_STATUS,DELETE_STORE_REPORTS] on the enum `Permission` will be removed. If these variants are still used in the database, this will fail.
  - The values [STORE_EMPLOYEE] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Permission_new" AS ENUM ('ADD_ORDER_TO_DRIVER', 'ADD_PAGE', 'ADD_ORDER', 'ADD_CLIENT', 'EDIT_CLIENT_NAME', 'EDIT_ORDER_TOTAL_AMOUNT', 'CHANGE_ORDER_STATUS', 'CHANGE_CLOSED_ORDER_STATUS', 'LOCK_ORDER_STATUS', 'DELETE_PRICES', 'DELETE_ORDERS', 'DELETE_REPORTS', 'DELETE_COMPANY_REPORTS', 'DELETE_REPOSITORIES_REPORTS', 'DELETE_GOVERNMENT_REPORTS', 'DELETE_DRIVER_REPORTS');
ALTER TABLE "User" ALTER COLUMN "permissions" TYPE "Permission_new"[] USING ("permissions"::text::"Permission_new"[]);
ALTER TYPE "Permission" RENAME TO "Permission_old";
ALTER TYPE "Permission_new" RENAME TO "Permission";
DROP TYPE "Permission_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('SUPER_ADMIN', 'COMPANY_MANAGER', 'ACCOUNT_MANAGER', 'ACCOUNTANT', 'DELIVERY_AGENT', 'RECEIVING_AGENT', 'BRANCH_MANAGER', 'EMERGENCY_EMPLOYEE', 'DATA_ENTRY', 'REPOSITORIY_EMPLOYEE', 'INQUIRY_EMPLOYEE');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;
