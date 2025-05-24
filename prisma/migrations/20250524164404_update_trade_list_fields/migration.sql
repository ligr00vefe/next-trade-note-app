/*
  Warnings:

  - You are about to drop the column `desiredSellingPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `TradeList` table. All the data in the column will be lost.
  - Added the required column `totalQuantity` to the `TradeList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "desiredSellingPrice";

-- AlterTable
ALTER TABLE "TradeList" DROP COLUMN "quantity",
ADD COLUMN     "totalQuantity" DOUBLE PRECISION NOT NULL;
