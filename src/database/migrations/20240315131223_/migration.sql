-- CreateTable
CREATE TABLE "OrdersInquiryEmployees" (
    "orderId" INTEGER NOT NULL,
    "inquiryEmployeeId" INTEGER NOT NULL,

    CONSTRAINT "OrdersInquiryEmployees_pkey" PRIMARY KEY ("orderId","inquiryEmployeeId")
);

-- AddForeignKey
ALTER TABLE "OrdersInquiryEmployees" ADD CONSTRAINT "OrdersInquiryEmployees_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdersInquiryEmployees" ADD CONSTRAINT "OrdersInquiryEmployees_inquiryEmployeeId_fkey" FOREIGN KEY ("inquiryEmployeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
