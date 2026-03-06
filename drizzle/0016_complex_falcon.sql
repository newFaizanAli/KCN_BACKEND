ALTER TABLE "stock_transactions" RENAME COLUMN "products" TO "stocks";--> statement-breakpoint
ALTER TABLE "stock_transactions" DROP CONSTRAINT "stock_transactions_products_products_id_fk";
--> statement-breakpoint
ALTER TABLE "stock_transactions" ADD CONSTRAINT "stock_transactions_stocks_stocks_id_fk" FOREIGN KEY ("stocks") REFERENCES "public"."stocks"("id") ON DELETE cascade ON UPDATE no action;