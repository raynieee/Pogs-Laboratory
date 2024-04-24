-- AlterTable
ALTER TABLE "pogs" ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "pogs" ADD CONSTRAINT "pogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
