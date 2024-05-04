/*
  Warnings:

  - You are about to drop the column `cellPhone` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "cellPhone",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "postalCode" INTEGER,
ADD COLUMN     "province" TEXT;
