/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `desiredSellingPrice` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `accountName` on the `InvestmentAccount` table. All the data in the column will be lost.
  - You are about to drop the column `accountNumber` on the `InvestmentAccount` table. All the data in the column will be lost.
  - You are about to drop the column `accountType` on the `InvestmentAccount` table. All the data in the column will be lost.
  - You are about to drop the column `balance` on the `InvestmentAccount` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `InvestmentAccount` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `InvestmentAccount` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `orderType` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sessionToken` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `avgPrice` on the `TradeList` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `TradeList` table. All the data in the column will be lost.
  - You are about to drop the column `desiredSellingPrice` on the `TradeList` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `TradeList` table. All the data in the column will be lost.
  - You are about to drop the column `totalQuantity` on the `TradeList` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `TradeList` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `TradeList` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `favoriteIds` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `hashedPassword` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userType` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[session_token]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `product_id` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `InvestmentAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `risk_tolerance` to the `InvestmentAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_profit_amount` to the `InvestmentAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_profit_rate` to the `InvestmentAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `InvestmentAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `InvestmentAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_token` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `avg_price` to the `TradeList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `TradeList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_quantity` to the `TradeList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `TradeList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `TradeList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'DELISTED');

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_productId_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_userId_fkey";

-- DropForeignKey
ALTER TABLE "InvestmentAccount" DROP CONSTRAINT "InvestmentAccount_userId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "TradeList" DROP CONSTRAINT "TradeList_userId_fkey";

-- DropIndex
DROP INDEX "InvestmentAccount_accountNumber_key";

-- DropIndex
DROP INDEX "Session_sessionToken_key";

-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "createdAt",
DROP COLUMN "desiredSellingPrice",
DROP COLUMN "productId",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "desired_selling_price" INTEGER,
ADD COLUMN     "product_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "InvestmentAccount" DROP COLUMN "accountName",
DROP COLUMN "accountNumber",
DROP COLUMN "accountType",
DROP COLUMN "balance",
DROP COLUMN "createdAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "risk_tolerance" TEXT NOT NULL,
ADD COLUMN     "total_profit_amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "total_profit_rate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "createdAt",
DROP COLUMN "orderType",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "order_type" TEXT NOT NULL DEFAULT 'BUY',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "sessionToken",
DROP COLUMN "userId",
ADD COLUMN     "session_token" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TradeList" DROP COLUMN "avgPrice",
DROP COLUMN "createdAt",
DROP COLUMN "desiredSellingPrice",
DROP COLUMN "totalPrice",
DROP COLUMN "totalQuantity",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "avg_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "desired_selling_price" DOUBLE PRECISION,
ADD COLUMN     "total_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "total_quantity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "emailVerified",
DROP COLUMN "favoriteIds",
DROP COLUMN "hashedPassword",
DROP COLUMN "updatedAt",
DROP COLUMN "userType",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email_verified" TIMESTAMP(3),
ADD COLUMN     "favorite_ids" TEXT[],
ADD COLUMN     "hashed_password" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_type" "UserType" NOT NULL DEFAULT 'User';

-- CreateTable
CREATE TABLE "Profit" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "profit_amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "isin_code" TEXT NOT NULL,
    "ticker" TEXT,
    "name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "english_name" TEXT,
    "listing_date" TIMESTAMP(3),
    "market_type" TEXT,
    "security_type" TEXT NOT NULL,
    "sector" TEXT,
    "stock_type" TEXT NOT NULL,
    "par_value" INTEGER,
    "listed_shares" INTEGER,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notice" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_important" BOOLEAN NOT NULL DEFAULT false,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "author_id" TEXT NOT NULL,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stock_isin_code_key" ON "Stock"("isin_code");

-- CreateIndex
CREATE UNIQUE INDEX "Session_session_token_key" ON "Session"("session_token");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentAccount" ADD CONSTRAINT "InvestmentAccount_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profit" ADD CONSTRAINT "Profit_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeList" ADD CONSTRAINT "TradeList_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
