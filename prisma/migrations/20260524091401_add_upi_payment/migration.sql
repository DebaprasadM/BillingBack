/*
  Warnings:

  - A unique constraint covering the columns `[userId,companyId]` on the table `Membership` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyId,barcode]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'ONLINE');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "upiId" TEXT,
ADD COLUMN     "upiName" TEXT;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH';

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_companyId_key" ON "Membership"("userId", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_companyId_barcode_key" ON "Product"("companyId", "barcode");
