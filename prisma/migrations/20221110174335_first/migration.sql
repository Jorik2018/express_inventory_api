-- CreateTable
CREATE TABLE `inventory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `patrimonial_code` VARCHAR(191) NOT NULL DEFAULT 'S/C',
    `denomination` VARCHAR(191) NOT NULL,
    `lot` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `dimensions` VARCHAR(191) NOT NULL,
    `serie` VARCHAR(191) NOT NULL,
    `others` VARCHAR(191) NOT NULL,
    `conservation_state` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `observations` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `is_delete` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Movement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `register_code` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `auth_document` VARCHAR(191) NOT NULL,
    `unit_organic` VARCHAR(191) NOT NULL,
    `local` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `unit_organic_destiny` VARCHAR(191) NULL,
    `local_destiny` VARCHAR(191) NULL,
    `address_destiny` VARCHAR(191) NULL,
    `responsible_user_document` VARCHAR(191) NOT NULL,
    `responsible_user_name` VARCHAR(191) NOT NULL,
    `responsible_user_email` VARCHAR(191) NOT NULL,
    `destiny_user_document` VARCHAR(191) NOT NULL,
    `destiny_user_name` VARCHAR(191) NOT NULL,
    `destiny_user_email` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `is_delete` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Details_movement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `movement_id` INTEGER NOT NULL,
    `inventory_id` INTEGER NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `is_delete` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Details_movement` ADD CONSTRAINT `Details_movement_movement_id_fkey` FOREIGN KEY (`movement_id`) REFERENCES `Movement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Details_movement` ADD CONSTRAINT `Details_movement_inventory_id_fkey` FOREIGN KEY (`inventory_id`) REFERENCES `Inventary`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
