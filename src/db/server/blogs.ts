// import { createServerFn } from '@tanstack/react-start'
// import { eq } from 'drizzle-orm'
// import z from 'zod'
// import { blogs } from '#/db/schema'
// import { db } from '#/db'

// export const formSchema = z.object({
//   title: z.string(),
//   content: z.string(),
// })

// export const updateFormSchema = formSchema.extend({
//   id: z.string().uuid(),
// })

// export const addPost = createServerFn({ method: 'POST' })
//   .inputValidator(formSchema)
//   .handler(async ({ data }) => {
//     await db.insert(blogs).values({ ...data })
//   })

// export const updatePost = createServerFn({ method: 'POST' })
//   .inputValidator(updateFormSchema)
//   .handler(async ({ data }) => {
//     await db
//       .update(blogs)
//       .set({ ...data })
//       .where(eq(blogs.id, data.id))
//   })

// export const deletePost = createServerFn({ method: 'POST' })
//   .inputValidator(updateFormSchema)
//   .handler(async ({ data }) => {
//     await db.delete(blogs).where(eq(blogs.id, data.id))
//   })
