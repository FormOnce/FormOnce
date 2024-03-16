-- AlterTable
ALTER TABLE "FormResponse" ADD COLUMN     "completed" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "FormViews" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "formResponseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormViews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FormViews" ADD CONSTRAINT "FormViews_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormViews" ADD CONSTRAINT "FormViews_formResponseId_fkey" FOREIGN KEY ("formResponseId") REFERENCES "FormResponse"("id") ON DELETE SET NULL ON UPDATE CASCADE;
