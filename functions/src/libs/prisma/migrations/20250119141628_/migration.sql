/*
  Warnings:

  - You are about to drop the column `birth_date` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `prefecture_id` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Prefectures` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_prefecture_id_fkey";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "birth_date",
DROP COLUMN "created_at",
DROP COLUMN "prefecture_id",
DROP COLUMN "updated_at",
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "prefectureId" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Prefectures_id_key" ON "Prefectures"("id");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_prefectureId_fkey" FOREIGN KEY ("prefectureId") REFERENCES "Prefectures"("id") ON DELETE SET NULL ON UPDATE CASCADE;
