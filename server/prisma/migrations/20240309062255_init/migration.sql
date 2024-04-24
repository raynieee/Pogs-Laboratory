-- CreateTable
CREATE TABLE "pogs" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "tickerSymbol" VARCHAR(6) NOT NULL,
    "price" NUMERIC(19,2) NOT NULL,
    "color" VARCHAR(24) NOT NULL,

    CONSTRAINT "pogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pogs_name_key" ON "pogs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pogs_tickerSymbol_key" ON "pogs"("tickerSymbol");
