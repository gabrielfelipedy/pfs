CREATE TABLE `limits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`value` integer,
	`recursive` integer NOT NULL,
	`start_date` integer DEFAULT (CURRENT_TIMESTAMP),
	`end_date` integer DEFAULT (CURRENT_TIMESTAMP),
	`category_id` integer,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE cascade ON DELETE set null
);
