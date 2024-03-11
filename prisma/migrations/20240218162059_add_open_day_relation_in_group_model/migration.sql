/*
  Warnings:

  - Added the required column `openDayId` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Group` ADD COLUMN `openDayId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Group` ADD CONSTRAINT `Group_openDayId_fkey` FOREIGN KEY (`openDayId`) REFERENCES `OpenDay`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
