/*
  Warnings:

  - You are about to drop the column `adress` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `UserProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tFacturaId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('IMAGE', 'VIDEO');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tFacturaId" INTEGER;

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "adress",
DROP COLUMN "userName",
ADD COLUMN     "address" TEXT,
ALTER COLUMN "cellPhone" DROP DEFAULT,
ALTER COLUMN "cellPhone" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "ShoppingCart" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "totalPrice" INTEGER NOT NULL,

    CONSTRAINT "ShoppingCart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductsOnCart" (
    "shoppingCartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER,

    CONSTRAINT "ProductsOnCart_pkey" PRIMARY KEY ("shoppingCartId","productId")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "publishDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostAsset" (
    "id" SERIAL NOT NULL,
    "type" "AssetType" DEFAULT 'IMAGE',
    "path" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "PostAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostComment" (
    "id" SERIAL NOT NULL,
    "publishDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "comment" TEXT NOT NULL,
    "show" BOOLEAN DEFAULT false,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PostComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedPost" (
    "id" SERIAL NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SavedPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromotionalCode" (
    "id" TEXT NOT NULL,
    "discount" INTEGER NOT NULL,

    CONSTRAINT "PromotionalCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromotionalCodeOnProducts" (
    "productId" INTEGER NOT NULL,
    "promotionalCodeId" TEXT NOT NULL,

    CONSTRAINT "PromotionalCodeOnProducts_pkey" PRIMARY KEY ("productId","promotionalCodeId")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trackingCode" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderProducts" (
    "productId" INTEGER NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "OrderProducts_pkey" PRIMARY KEY ("productId","orderId")
);

-- CreateTable
CREATE TABLE "City" (
    "postalCode" INTEGER NOT NULL,
    "orderId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "province" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("postalCode")
);

-- CreateTable
CREATE TABLE "TFacturaUserLog" (
    "id" SERIAL NOT NULL,
    "errorCode" INTEGER,
    "data" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,

    CONSTRAINT "TFacturaUserLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingCart_userId_key" ON "ShoppingCart"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PromotionalCodeOnProducts_productId_key" ON "PromotionalCodeOnProducts"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "PromotionalCodeOnProducts_promotionalCodeId_key" ON "PromotionalCodeOnProducts"("promotionalCodeId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_userId_key" ON "Order"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderProducts_productId_key" ON "OrderProducts"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderProducts_orderId_key" ON "OrderProducts"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "City_orderId_key" ON "City"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "User_tFacturaId_key" ON "User"("tFacturaId");

-- AddForeignKey
ALTER TABLE "ShoppingCart" ADD CONSTRAINT "ShoppingCart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductsOnCart" ADD CONSTRAINT "ProductsOnCart_shoppingCartId_fkey" FOREIGN KEY ("shoppingCartId") REFERENCES "ShoppingCart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductsOnCart" ADD CONSTRAINT "ProductsOnCart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostAsset" ADD CONSTRAINT "PostAsset_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPost" ADD CONSTRAINT "SavedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPost" ADD CONSTRAINT "SavedPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionalCodeOnProducts" ADD CONSTRAINT "PromotionalCodeOnProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionalCodeOnProducts" ADD CONSTRAINT "PromotionalCodeOnProducts_promotionalCodeId_fkey" FOREIGN KEY ("promotionalCodeId") REFERENCES "PromotionalCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderProducts" ADD CONSTRAINT "OrderProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderProducts" ADD CONSTRAINT "OrderProducts_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
