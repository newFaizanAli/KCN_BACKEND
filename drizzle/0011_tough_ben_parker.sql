CREATE TABLE "stocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"products" integer NOT NULL,
	"quantity" integer NOT NULL,
	"serial_number" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_products_products_id_fk" FOREIGN KEY ("products") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;