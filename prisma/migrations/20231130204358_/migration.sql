/*
  Warnings:

  - You are about to drop the column `city` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "city",
DROP COLUMN "postalCode",
DROP COLUMN "province",
ADD COLUMN     "cellPhone" TEXT;
