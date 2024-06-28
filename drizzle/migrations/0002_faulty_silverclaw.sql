ALTER TABLE `responses` DROP FOREIGN KEY `responses_patient_id_patients_id_fk`;
--> statement-breakpoint
ALTER TABLE `messages` MODIFY COLUMN `patient_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `responses` DROP COLUMN `patient_id`;