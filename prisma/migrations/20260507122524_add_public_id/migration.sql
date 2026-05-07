/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - The required column `publicId` was added to the `Invoice` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "publicId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_publicId_key" ON "Invoice"("publicId");
