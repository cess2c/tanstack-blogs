ALTER TABLE "todos" RENAME TO "blogs";--> statement-breakpoint
ALTER TABLE "blogs" RENAME COLUMN "isComplete" TO "imgPath";--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "content" text NOT NULL;