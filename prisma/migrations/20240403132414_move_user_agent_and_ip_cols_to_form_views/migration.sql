/*
  Warnings:

  - You are about to drop the column `ip` on the `FormResponse` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `FormResponse` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FormResponse" DROP COLUMN "ip",
DROP COLUMN "userAgent";

-- AlterTable
ALTER TABLE "FormViews" ADD COLUMN     "ip" TEXT,
ADD COLUMN     "userAgent" TEXT;
