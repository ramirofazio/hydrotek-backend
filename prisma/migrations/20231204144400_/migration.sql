/*
  Warnings:

  - You are about to drop the `City` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fresaId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "City" DROP CONSTRAINT "City_orderId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "fresaId" INTEGER NOT NULL,
ADD COLUMN     "status" INTEGER NOT NULL;

-- DropTable
DROP TABLE "City";
