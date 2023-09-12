/*
  Warnings:

  - The primary key for the `UserProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dni` on the `UserProfile` table. All the data in the column will be lost.
  - The `id` column on the `UserProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userId]` on the table `UserProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `UserProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_id_fkey";

-- DropIndex
DROP INDEX "UserProfile_id_key";

-- AlterTable
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_pkey",
DROP COLUMN "dni",
ADD COLUMN     "adress" TEXT,
ADD COLUMN     "cellPhone" INTEGER DEFAULT 111,
ADD COLUMN     "shoppingCart" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "userName" TEXT DEFAULT 'pelu',
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
