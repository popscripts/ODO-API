-- CreateTable
CREATE TABLE `Socket` (
    `id` VARCHAR(191) NOT NULL,
    `userId` INTEGER NULL,
    `connected` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Socket_id_key`(`id`),
    UNIQUE INDEX `Socket_userId_key`(`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Socket` ADD CONSTRAINT `Socket_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
