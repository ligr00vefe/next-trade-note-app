/*
  Warnings:

  - You are about to drop the column `desired_selling_price` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `desired_selling_price` on the `Product` table. All the data in the column will be lost.
  - Added the required column `orderType` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "desired_selling_price",
ADD COLUMN     "desiredSellingPrice" INTEGER;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "desired_selling_price",
ADD COLUMN     "desiredSellingPrice" DOUBLE PRECISION,
ADD COLUMN     "orderType" TEXT NOT NULL;
