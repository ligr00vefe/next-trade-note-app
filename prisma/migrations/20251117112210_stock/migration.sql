/*
  Warnings:

  - A unique constraint covering the columns `[corp_code]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Stock" ADD COLUMN     "corp_code" TEXT,
ALTER COLUMN "listed_shares" SET DATA TYPE BIGINT;

-- CreateIndex
CREATE UNIQUE INDEX "Stock_corp_code_key" ON "Stock"("corp_code");
