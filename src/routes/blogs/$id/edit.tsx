import { Header } from '#/components/header'
import { PostForm } from '#/components/postForm'
import { Button } from '#/components/ui/button'
import { db } from '#/db'
import { blogs } from '#/db/schema'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { ArrowLeftIcon } from 'lucide-react'

const loaderFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const blog = await db.query.blogs.findFirst({
      where: eq(blogs.id, data.id),
    })
    if (!blog) throw notFound()

    return blog
  })

export const Route = createFileRoute('/blogs/$id/edit')({
  component: RouteComponent,
  loader: ({ params }) => loaderFn({ data: params }),
})

function RouteComponent() {
  const blog = Route.useLoaderData()
  return (
    <div className="min-h-screen container">
      <Header />
      <div className="flex justify-between py-2 gap-4">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-muted-foreground pi-0"
        >
          <Link to="/blogs/posts">
            <ArrowLeftIcon /> Back
          </Link>
        </Button>
      </div>
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <div className="flex justify-between items-center">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Edit - {blog.title}
            </h2>
          </div>
          <PostForm blog={blog} />
        </div>
      </section>
    </div>
  )
}
