-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('admin', 'manager', 'employee') NOT NULL DEFAULT 'employee';
