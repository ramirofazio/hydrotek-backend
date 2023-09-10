/*
  Warnings:

  - Added the required column `updated` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "updated" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
