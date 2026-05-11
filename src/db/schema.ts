import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

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

// export const userBlogs = pgTable('user_blogs', {
//   id: uuid('id').primaryKey().defaultRandom(),
//   userId: uuid('user_id')
//     .notNull()
//     .references(() => users.id),
//   blogsId: uuid('blogs_id').references(() => blogs.id),
//   createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
//   updatedAt: timestamp({ withTimezone: true })
//     .defaultNow()
//     .notNull()
//     .$onUpdate(() => new Date()),
// })

export const userBlogs = pgTable('user_blogs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  blogsId: uuid('blogs_id'),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})
