/*
  Warnings:

  - You are about to drop the column `apiKey` on the `Workspace` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Workspace_apiKey_key";

-- AlterTable
ALTER TABLE "Workspace" DROP COLUMN "apiKey";
