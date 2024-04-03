/*
  Warnings:

  - You are about to drop the column `formResponseId` on the `FormViews` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[formViewsId]` on the table `FormResponse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `formViewsId` to the `FormResponse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FormViews" DROP CONSTRAINT "FormViews_formResponseId_fkey";

-- AlterTable
ALTER TABLE "FormResponse" ADD COLUMN     "formViewsId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FormViews" DROP COLUMN "formResponseId";

-- CreateIndex
CREATE UNIQUE INDEX "FormResponse_formViewsId_key" ON "FormResponse"("formViewsId");

-- AddForeignKey
ALTER TABLE "FormResponse" ADD CONSTRAINT "FormResponse_formViewsId_fkey" FOREIGN KEY ("formViewsId") REFERENCES "FormViews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
