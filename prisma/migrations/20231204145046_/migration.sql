/*
  Warnings:

  - A unique constraint covering the columns `[fresaId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "fresaId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_fresaId_key" ON "Order"("fresaId");
