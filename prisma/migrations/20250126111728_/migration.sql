-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(18) NOT NULL,
    `lguid` INTEGER UNSIGNED NOT NULL,
    `password` BINARY(32) NOT NULL,
    `salt` BINARY(32) NOT NULL,

    UNIQUE INDEX `User_id_key`(`id`),
    UNIQUE INDEX `User_name_key`(`name`),
    UNIQUE INDEX `User_lguid_key`(`lguid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
