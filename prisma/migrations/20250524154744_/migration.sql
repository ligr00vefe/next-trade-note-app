-- CreateTable
CREATE TABLE "TradeList" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "symbol" TEXT,
    "company" TEXT NOT NULL,
    "currency" TEXT,
    "quantity" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "desiredSellingPrice" DOUBLE PRECISION,
    "userId" TEXT NOT NULL,
    "theme1" TEXT,
    "theme2" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradeList_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TradeList" ADD CONSTRAINT "TradeList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
