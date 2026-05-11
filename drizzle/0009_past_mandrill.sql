ALTER TABLE "user_blogs" DROP CONSTRAINT "user_blogs_blog_id_blogs_id_fk";
--> statement-breakpoint
ALTER TABLE "user_blogs" ADD COLUMN "blogs_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "user_blogs" ADD CONSTRAINT "user_blogs_blogs_id_blogs_id_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_blogs" DROP COLUMN "blog_id";