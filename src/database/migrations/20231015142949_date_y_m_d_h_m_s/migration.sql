/*
  Warnings:

  - You are about to drop the column `address` on the `Repository` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Repository` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `Repository` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Repository` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `Repository` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `Repository` table. All the data in the column will be lost.
  - You are about to drop the column `branchId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `fcm` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `permissions` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `repositoryId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `roless` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_RegionToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_userId_fkey";

-- DropForeignKey
ALTER TABLE "Repository" DROP CONSTRAINT "Repository_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_branchId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_repositoryId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "_RegionToUser" DROP CONSTRAINT "_RegionToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_RegionToUser" DROP CONSTRAINT "_RegionToUser_B_fkey";

-- AlterTable
ALTER TABLE "Repository" DROP COLUMN "address",
DROP COLUMN "email",
DROP COLUMN "logo",
DROP COLUMN "phone",
DROP COLUMN "tenantId",
DROP COLUMN "website";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "branchId",
DROP COLUMN "fcm",
DROP COLUMN "image",
DROP COLUMN "permissions",
DROP COLUMN "repositoryId",
DROP COLUMN "roless",
DROP COLUMN "tenantId",
DROP COLUMN "token",
DROP COLUMN "userId";

-- DropTable
DROP TABLE "_RegionToUser";
