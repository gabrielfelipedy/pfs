CREATE TABLE `operation_two` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`value` integer,
	`date` integer DEFAULT (CURRENT_TIMESTAMP),
	`is_paid` integer,
	`is_income` integer,
	`category_id` integer,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE cascade ON DELETE set null
);
