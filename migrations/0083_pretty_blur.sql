ALTER TABLE `operation` ALTER COLUMN "is_paid" TO "is_paid" integer NOT NULL DEFAULT false;--> statement-breakpoint
ALTER TABLE `operation` ALTER COLUMN "is_paid" TO "is_paid" integer NOT NULL;--> statement-breakpoint
ALTER TABLE `operation` ALTER COLUMN "is_income" TO "is_income" integer NOT NULL DEFAULT false;--> statement-breakpoint
ALTER TABLE `operation` ALTER COLUMN "is_income" TO "is_income" integer NOT NULL;