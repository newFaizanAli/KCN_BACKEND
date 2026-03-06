CREATE TABLE "attributes" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attributes" ADD CONSTRAINT "attributes_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;