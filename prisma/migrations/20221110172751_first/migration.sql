/*
  Warnings:

  - You are about to drop the column `destiny_user_id` on the `movement` table. All the data in the column will be lost.
  - You are about to drop the column `responsible_user_id` on the `movement` table. All the data in the column will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `destiny_user_document` to the `Movement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destiny_user_email` to the `Movement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destiny_user_name` to the `Movement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responsible_user_document` to the `Movement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responsible_user_email` to the `Movement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responsible_user_name` to the `Movement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `movement` DROP FOREIGN KEY `Movement_destiny_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `movement` DROP FOREIGN KEY `Movement_responsible_user_id_fkey`;

-- AlterTable
ALTER TABLE `movement` DROP COLUMN `destiny_user_id`,
    DROP COLUMN `responsible_user_id`,
    ADD COLUMN `destiny_user_document` VARCHAR(191) NOT NULL,
    ADD COLUMN `destiny_user_email` VARCHAR(191) NOT NULL,
    ADD COLUMN `destiny_user_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `responsible_user_document` VARCHAR(191) NOT NULL,
    ADD COLUMN `responsible_user_email` VARCHAR(191) NOT NULL,
    ADD COLUMN `responsible_user_name` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `user`;
