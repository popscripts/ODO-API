/*
  Warnings:

  - You are about to drop the column `groupMemberOneId` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `groupMemberTwoId` on the `Group` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Group` DROP FOREIGN KEY `Group_groupMemberOneId_fkey`;

-- DropForeignKey
ALTER TABLE `Group` DROP FOREIGN KEY `Group_groupMemberTwoId_fkey`;

-- AlterTable
ALTER TABLE `Group` DROP COLUMN `groupMemberOneId`,
    DROP COLUMN `groupMemberTwoId`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `groupId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
