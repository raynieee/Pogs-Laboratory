-- CreateTable
CREATE TABLE "pogs" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "tickerSymbol" VARCHAR(6) NOT NULL,
    "price" DECIMAL(19,2) NOT NULL,
    "color" VARCHAR(24) NOT NULL,

    CONSTRAINT "pogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "position" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "hashedPassword" VARCHAR(10) NOT NULL,
    "eWalletAmount" DECIMAL(19,2) NOT NULL DEFAULT 10000.00,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userpogs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "pogId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "userpogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pogs_name_key" ON "pogs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pogs_tickerSymbol_key" ON "pogs"("tickerSymbol");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "userpogs_userId_pogId_key" ON "userpogs"("userId", "pogId");

-- AddForeignKey
ALTER TABLE "userpogs" ADD CONSTRAINT "userpogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userpogs" ADD CONSTRAINT "userpogs_pogId_fkey" FOREIGN KEY ("pogId") REFERENCES "pogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
