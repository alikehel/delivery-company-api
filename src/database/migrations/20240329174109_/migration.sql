-- DropForeignKey
ALTER TABLE "OrdersInquiryEmployees" DROP CONSTRAINT "OrdersInquiryEmployees_inquiryEmployeeId_fkey";

-- DropForeignKey
ALTER TABLE "OrdersInquiryEmployees" DROP CONSTRAINT "OrdersInquiryEmployees_orderId_fkey";

-- DropForeignKey
ALTER TABLE "ProductColors" DROP CONSTRAINT "ProductColors_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductSizes" DROP CONSTRAINT "ProductSizes_productId_fkey";

-- AddForeignKey
ALTER TABLE "OrdersInquiryEmployees" ADD CONSTRAINT "OrdersInquiryEmployees_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdersInquiryEmployees" ADD CONSTRAINT "OrdersInquiryEmployees_inquiryEmployeeId_fkey" FOREIGN KEY ("inquiryEmployeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductColors" ADD CONSTRAINT "ProductColors_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSizes" ADD CONSTRAINT "ProductSizes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
