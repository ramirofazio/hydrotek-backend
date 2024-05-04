/*
  Warnings:

  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - Added the required column `arsPrice` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usdPrice` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "price",
ADD COLUMN     "arsPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "usdPrice" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "DollarPrice" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DollarPrice_pkey" PRIMARY KEY ("id")
);
