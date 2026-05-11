import { db } from '#/db'
import { blogs, userBlogs } from '#/db/schema'
import { redirect, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import z from 'zod'
import { useForm, useStore } from '@tanstack/react-form-start'
import { getSession } from '@/db/server'

const userBlogSchema = z.object({
  userId: z.string().uuid(),
  blogId: z.string().uuid(),
})
const formSchema = z.object({
  title: z.string(),
  content: z.string(),
})

export const updateFormSchema = formSchema.extend({
  id: z.string().uuid(),
})
const addUserBlog = createServerFn({ method: 'POST' })
  .inputValidator(userBlogSchema)
  .handler(async ({ data }) => {
    await db
      .insert(userBlogs)
      .values({
        userId: data.userId,
        blogsId: data.blogId,
      })
      .returning()
  })
const addPost = createServerFn({ method: 'POST' })
  .inputValidator(formSchema)
  .handler(async ({ data }) => {
    const blogspost = await db
      .insert(blogs)
      .values({ ...data })
      .returning()
    return blogspost[0].id
  })

const updatePost = createServerFn({ method: 'POST' })
  .inputValidator(updateFormSchema)
  .handler(async ({ data }) => {
    await db
      .update(blogs)
      .set({ ...data })
      .where(eq(blogs.id, data.id))
  })
const fetchUserId = async () => {
  const session = await getSession()
  if (!session || !session.id) throw redirect({ to: '/login' })
  return session.id
}
export function PostForm({
  blog,
}: {
  blog?: {
    id: string
    title: string
    content: string
  }
}) {
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: {
      title: blog?.title || '',
      content: blog?.content || '',
    },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      try {
        if (blog) {
          await updatePost({ data: { id: blog.id, ...value } })
        } else {
          const postId = await addPost({ data: value })
          const userId = await fetchUserId()
          await addUserBlog({ data: { userId: userId, blogId: postId } })
        }
        navigate({ to: '/blogs/posts' })
      } catch (error) {
        console.log(error)
      }
    },
  })

  useStore(form.store, (state: any) => state.values.title)
  useStore(form.store, (state: any) => state.values.content)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <div className="sm:col-span-2">
          <label
            htmlFor="title"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Title
          </label>
          <form.Field
            name="title"
            children={(f) => (
              <>
                <input
                  type="text"
                  value={f.state.value}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                  placeholder="Enter title"
                  onChange={(e) => f.handleChange(e.target.value)}
                  required
                />
              </>
            )}
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="Content"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Content
          </label>
          <form.Field
            name="content"
            children={(f) => (
              <>
                <textarea
                  rows={4}
                  value={f.state.value}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                  placeholder="Your Content here"
                  onChange={(e) => f.handleChange(e.target.value)}
                  required
                />
              </>
            )}
          />
        </div>
      </div>
      <button
        type="submit"
        className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-teal-700 rounded-lg focus:ring-4 focus:ring-teal-200 dark:focus:ring-teal-900 hover:bg-teal-800"
      >
        {blog ? 'Update' : 'Add Blog'}
      </button>
    </form>
  )
}
function fetchUserBlogsId() {
  throw new Error('Function not implemented.')
}
