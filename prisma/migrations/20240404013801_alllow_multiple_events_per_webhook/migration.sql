/*
  Warnings:

  - You are about to drop the column `event` on the `Webhook` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Webhook" DROP COLUMN "event",
ADD COLUMN     "events" "WebhookTriggerEvent"[];
