ALTER TABLE "user_blogs" DROP CONSTRAINT "user_blogs_blogs_id_blogs_id_fk";
--> statement-breakpoint
ALTER TABLE "user_blogs" ALTER COLUMN "blogs_id" DROP NOT NULL;