/*
  Warnings:

  - You are about to drop the column `browser` on the `FormResponse` table. All the data in the column will be lost.
  - You are about to drop the column `device` on the `FormResponse` table. All the data in the column will be lost.
  - You are about to drop the column `os` on the `FormResponse` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FormResponse" DROP COLUMN "browser",
DROP COLUMN "device",
DROP COLUMN "os",
ADD COLUMN     "userAgent" TEXT;
