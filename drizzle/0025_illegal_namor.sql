CREATE TABLE "purchase_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"products" integer NOT NULL,
	"quantity" integer NOT NULL,
	"unit_cost" integer NOT NULL,
	"total" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "purchase_items" ADD CONSTRAINT "purchase_items_products_products_id_fk" FOREIGN KEY ("products") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;