/*
  Warnings:

  - The values [ADD_ORDER_TO_DELIVERY_AGENT,ADD_PAGE,EDIT_CLIENT_NAME,EDIT_ORDER_TOTAL_AMOUNT,DELETE_PRICES,DELETE_ORDERS,DELETE_REPORTS,DELETE_COMPANY_REPORTS,DELETE_REPOSITORIES_REPORTS,DELETE_GOVERNMENT_REPORTS,DELETE_DELIVERY_AGENT_REPORTS] on the enum `Permission` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Permission_new" AS ENUM ('ADD_STORE', 'ADD_CLIENT', 'ADD_LOCATION', 'ADD_DELIVERY_AGENT', 'ADD_ORDER', 'DELETE_ORDER', 'CHANGE_ORDER_STATUS', 'CHANGE_CLOSED_ORDER_STATUS', 'CHANGE_ORDER_TOTAL_AMOUNT', 'LOCK_ORDER_STATUS', 'CHANGE_ORDER_DELIVERY_AGENT', 'CHANGE_ORDER_BRANCH', 'CHANGE_ORDER_CLIENT', 'CHANGE_ORDER_COMPANY', 'CREATE_DELIVERY_AGENT_REPORT', 'CREATE_CLIENT_REPORT', 'CREATE_REPOSITORY_REPORT', 'CREATE_COMPANY_REPORT', 'CREATE_GOVERNMENT_REPORT', 'CREATE_BRANCH_REPORT', 'DELETE_COMPANY_REPORT', 'DELETE_REPOSITORIES_REPORT', 'DELETE_GOVERNMENT_REPORT', 'DELETE_DELIVERY_AGENT_REPORT', 'DELETE_CLIENT_REPORT', 'DELETE_BRANCH_REPORT');
ALTER TABLE "Employee" ALTER COLUMN "permissions" TYPE "Permission_new"[] USING ("permissions"::text::"Permission_new"[]);
ALTER TYPE "Permission" RENAME TO "Permission_old";
ALTER TYPE "Permission_new" RENAME TO "Permission";
DROP TYPE "Permission_old";
COMMIT;
