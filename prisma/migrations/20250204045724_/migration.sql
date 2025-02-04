/*
  Warnings:

  - You are about to alter the column `skinId` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Binary(32)`.
  - You are about to alter the column `capeId` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Binary(32)`.
  - The primary key for the `Texture` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Profile` DROP FOREIGN KEY `Profile_capeId_fkey`;

-- DropForeignKey
ALTER TABLE `Profile` DROP FOREIGN KEY `Profile_skinId_fkey`;

-- DropIndex
DROP INDEX `Profile_capeId_fkey` ON `Profile`;

-- DropIndex
DROP INDEX `Profile_skinId_fkey` ON `Profile`;

-- AlterTable
ALTER TABLE `Profile` MODIFY `skinId` BINARY(32) NOT NULL,
    MODIFY `capeId` BINARY(32) NULL;

-- AlterTable
ALTER TABLE `Texture` DROP PRIMARY KEY,
    MODIFY `hash` BINARY(32) NOT NULL,
    ADD PRIMARY KEY (`hash`);

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_skinId_fkey` FOREIGN KEY (`skinId`) REFERENCES `Texture`(`hash`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_capeId_fkey` FOREIGN KEY (`capeId`) REFERENCES `Texture`(`hash`) ON DELETE SET NULL ON UPDATE CASCADE;
