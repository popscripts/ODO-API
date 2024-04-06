/*
  Warnings:

  - Added the required column `classroom` to the `GroupVisitedClassroom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `GroupVisitedClassroom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `GroupVisitedClassroom` ADD COLUMN `classroom` VARCHAR(191) NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL;
