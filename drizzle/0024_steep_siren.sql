ALTER TABLE "purchase_orders" ALTER COLUMN "tax" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "purchase_orders" ALTER COLUMN "tax" DROP NOT NULL;