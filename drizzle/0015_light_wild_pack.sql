CREATE TABLE "stock_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"products" integer NOT NULL,
	"quantity" integer NOT NULL,
	"type" varchar(100) NOT NULL,
	"reference_id" varchar(100)
);
--> statement-breakpoint
ALTER TABLE "stock_transactions" ADD CONSTRAINT "stock_transactions_products_products_id_fk" FOREIGN KEY ("products") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;