ALTER TABLE "products" ADD COLUMN "brand" varchar(255) DEFAULT null;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "sku" varchar(100) DEFAULT null;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "type" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "description" varchar(1000) DEFAULT null;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_sku_unique" UNIQUE("sku");