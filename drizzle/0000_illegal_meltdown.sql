CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"room_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"address" text NOT NULL,
	"id_number" varchar(50) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"purpose" text NOT NULL,
	"check_in_date" timestamp NOT NULL,
	"check_in_time" varchar(5) NOT NULL,
	"check_out_date" timestamp NOT NULL,
	"check_out_time" varchar(5) NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"advance_amount" numeric(10, 2) NOT NULL,
	"is_paid" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" varchar(10) NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" varchar(50) NOT NULL,
	"description" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"has_ac" boolean DEFAULT false NOT NULL,
	"capacity" serial NOT NULL,
	"image" varchar(255) NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	CONSTRAINT "rooms_number_unique" UNIQUE("number")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE no action ON UPDATE no action;