/*
  Warnings:

  - A unique constraint covering the columns `[firebaseUid]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firebaseUid` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "firebaseUid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_firebaseUid_key" ON "Users"("firebaseUid");
