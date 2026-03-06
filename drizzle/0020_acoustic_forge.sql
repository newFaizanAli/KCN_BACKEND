CREATE TABLE "suppliers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(100),
	"phone" varchar(100),
	"address" varchar(100) DEFAULT null,
	CONSTRAINT "suppliers_email_unique" UNIQUE("email"),
	CONSTRAINT "suppliers_phone_unique" UNIQUE("phone")
);
