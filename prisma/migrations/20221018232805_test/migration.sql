-- AlterTable
ALTER TABLE `movement` ADD COLUMN `address_destiny` VARCHAR(191) NULL,
    ADD COLUMN `local_destiny` VARCHAR(191) NULL,
    ADD COLUMN `unit_organic_destiny` VARCHAR(191) NULL;
