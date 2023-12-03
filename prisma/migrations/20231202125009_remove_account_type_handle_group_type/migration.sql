/*
  Warnings:

  - You are about to drop the column `accountTypeId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `AccountType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_accountTypeId_fkey`;

-- AlterTable
ALTER TABLE `Group` ADD COLUMN `groupTypeId` INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `accountTypeId`;

-- DropTable
DROP TABLE `AccountType`;

-- CreateTable
CREATE TABLE `GroupType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(16) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Group` ADD CONSTRAINT `Group_groupTypeId_fkey` FOREIGN KEY (`groupTypeId`) REFERENCES `GroupType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
