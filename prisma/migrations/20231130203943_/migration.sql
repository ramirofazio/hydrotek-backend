-- DropIndex
DROP INDEX "ProductImage_productId_key";

-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "index" INTEGER;

-- AlterTable
ALTER TABLE "ProductsOnCart" ADD COLUMN     "name" TEXT;
