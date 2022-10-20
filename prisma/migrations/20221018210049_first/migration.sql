-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullname` VARCHAR(191) NOT NULL,
    `document` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `is_delete` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inventary` (
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
    `responsible_user_id` INTEGER NOT NULL,
    `destiny_user_id` INTEGER NOT NULL,
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
    `inventary_id` INTEGER NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `is_delete` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Movement` ADD CONSTRAINT `Movement_responsible_user_id_fkey` FOREIGN KEY (`responsible_user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Movement` ADD CONSTRAINT `Movement_destiny_user_id_fkey` FOREIGN KEY (`destiny_user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Details_movement` ADD CONSTRAINT `Details_movement_movement_id_fkey` FOREIGN KEY (`movement_id`) REFERENCES `Movement`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Details_movement` ADD CONSTRAINT `Details_movement_inventary_id_fkey` FOREIGN KEY (`inventary_id`) REFERENCES `Inventary`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
