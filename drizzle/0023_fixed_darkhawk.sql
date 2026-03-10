CREATE TABLE "purchase_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"suppliers" integer NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"tax" integer NOT NULL,
	"total_amount" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_suppliers_suppliers_id_fk" FOREIGN KEY ("suppliers") REFERENCES "public"."suppliers"("id") ON DELETE cascade ON UPDATE no action;