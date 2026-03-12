CREATE TABLE "goods_receipt_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"purchase_orders" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "goods_receipt_notes" ADD CONSTRAINT "goods_receipt_notes_purchase_orders_purchase_orders_id_fk" FOREIGN KEY ("purchase_orders") REFERENCES "public"."purchase_orders"("id") ON DELETE cascade ON UPDATE no action;