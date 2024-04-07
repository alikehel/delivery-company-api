/*
  Warnings:

  - The values [CLIENT_ASSISTANT] on the enum `ClientRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ClientRole_new" AS ENUM ('CLIENT');
ALTER TABLE "Client" ALTER COLUMN "role" TYPE "ClientRole_new" USING ("role"::text::"ClientRole_new");
ALTER TYPE "ClientRole" RENAME TO "ClientRole_old";
ALTER TYPE "ClientRole_new" RENAME TO "ClientRole";
DROP TYPE "ClientRole_old";
COMMIT;

-- AlterEnum
ALTER TYPE "EmployeeRole" ADD VALUE 'CLIENT_ASSISTANT';

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "role" SET DEFAULT 'CLIENT';

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "clientAssistantId" INTEGER;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_clientAssistantId_fkey" FOREIGN KEY ("clientAssistantId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
