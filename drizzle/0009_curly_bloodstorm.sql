ALTER TABLE "stock" RENAME TO "stocks";--> statement-breakpoint
ALTER TABLE "attributes" RENAME COLUMN "product_id" TO "products";--> statement-breakpoint
ALTER TABLE "stocks" RENAME COLUMN "product_id" TO "products";--> statement-breakpoint
ALTER TABLE "attributes" DROP CONSTRAINT "attributes_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "stocks" DROP CONSTRAINT "stock_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "attributes" ADD CONSTRAINT "attributes_products_products_id_fk" FOREIGN KEY ("products") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_products_products_id_fk" FOREIGN KEY ("products") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;