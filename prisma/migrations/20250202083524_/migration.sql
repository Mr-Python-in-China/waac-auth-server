-- AlterTable
ALTER TABLE `User` ADD COLUMN `profileId` CHAR(32) NULL;

-- CreateTable
CREATE TABLE `Profile` (
    `id` CHAR(32) NOT NULL,
    `name` VARCHAR(16) NOT NULL,
    `model` BOOLEAN NOT NULL DEFAULT false,
    `skinId` VARCHAR(191) NOT NULL,
    `capeId` VARCHAR(191) NULL,

    UNIQUE INDEX `Profile_id_key`(`id`),
    UNIQUE INDEX `Profile_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Texture` (
    `hash` CHAR(32) NOT NULL,
    `data` BLOB NOT NULL,

    UNIQUE INDEX `Texture_hash_key`(`hash`),
    PRIMARY KEY (`hash`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Profile`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_skinId_fkey` FOREIGN KEY (`skinId`) REFERENCES `Texture`(`hash`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_capeId_fkey` FOREIGN KEY (`capeId`) REFERENCES `Texture`(`hash`) ON DELETE SET NULL ON UPDATE CASCADE;
