/*
  Warnings:

  - Made the column `content` on table `Banner` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `Banner` required. This step will fail if there are existing NULL values in that column.
  - Made the column `url` on table `Banner` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `Branch` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `Branch` required. This step will fail if there are existing NULL values in that column.
  - Made the column `token` on table `Client` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `website` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `logo` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `registrationText` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `salary` on table `Employee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deliveryCost` on table `Employee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `governorate` on table `Location` required. This step will fail if there are existing NULL values in that column.
  - Made the column `paidAmount` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `discount` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `notes` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `details` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `currentLocation` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `clientNet` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `companyNet` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deliveryAgentNet` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deliveryCost` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `baghdadOrdersCount` on table `Report` required. This step will fail if there are existing NULL values in that column.
  - Made the column `governoratesOrdersCount` on table `Report` required. This step will fail if there are existing NULL values in that column.
  - Made the column `notes` on table `Store` required. This step will fail if there are existing NULL values in that column.
  - Made the column `logo` on table `Store` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fcm` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `avatar` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Banner" ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "content" SET DEFAULT '',
ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "url" SET NOT NULL,
ALTER COLUMN "url" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Branch" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "email" SET DEFAULT '',
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "phone" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "token" SET NOT NULL,
ALTER COLUMN "token" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "phone" SET DEFAULT '',
ALTER COLUMN "website" SET NOT NULL,
ALTER COLUMN "website" SET DEFAULT '',
ALTER COLUMN "logo" SET NOT NULL,
ALTER COLUMN "registrationText" SET NOT NULL,
ALTER COLUMN "registrationText" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "salary" SET NOT NULL,
ALTER COLUMN "deliveryCost" SET NOT NULL;

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT '2024-03-25 04:38:32.446 +00:00',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT '2024-03-25 04:38:32.446 +00:00',
ALTER COLUMN "governorate" SET NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "content" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "paidAmount" SET NOT NULL,
ALTER COLUMN "discount" SET NOT NULL,
ALTER COLUMN "recipientName" SET DEFAULT 'غير معرف',
ALTER COLUMN "notes" SET NOT NULL,
ALTER COLUMN "notes" SET DEFAULT '',
ALTER COLUMN "details" SET NOT NULL,
ALTER COLUMN "details" SET DEFAULT '',
ALTER COLUMN "currentLocation" SET NOT NULL,
ALTER COLUMN "currentLocation" SET DEFAULT '',
ALTER COLUMN "clientNet" SET NOT NULL,
ALTER COLUMN "companyNet" SET NOT NULL,
ALTER COLUMN "deliveryAgentNet" SET NOT NULL,
ALTER COLUMN "deliveryCost" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "image" SET NOT NULL;

-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "baghdadOrdersCount" SET NOT NULL,
ALTER COLUMN "governoratesOrdersCount" SET NOT NULL;

-- AlterTable
ALTER TABLE "Store" ALTER COLUMN "notes" SET NOT NULL,
ALTER COLUMN "notes" SET DEFAULT '',
ALTER COLUMN "logo" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "fcm" SET NOT NULL,
ALTER COLUMN "fcm" SET DEFAULT '',
ALTER COLUMN "avatar" SET NOT NULL;
