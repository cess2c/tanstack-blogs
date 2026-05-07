import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'

export const blogs = pgTable('blogs', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('text').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})
