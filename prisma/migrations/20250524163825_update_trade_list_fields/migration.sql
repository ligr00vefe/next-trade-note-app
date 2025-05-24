/*
  Warnings:

  - You are about to drop the column `price` on the `TradeList` table. All the data in the column will be lost.
  - Added the required column `avgPrice` to the `TradeList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `TradeList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "orderType" SET DEFAULT '매수';

-- AlterTable
ALTER TABLE "TradeList" DROP COLUMN "price",
ADD COLUMN     "avgPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL;
