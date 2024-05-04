/*
  Warnings:

  - Added the required column `name` to the `OrderProducts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `OrderProducts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `OrderProducts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderProducts" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;
