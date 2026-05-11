import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { db } from '#/db'
import { Header } from '#/components/header'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '#/components/ui/empty'
import { createServerFn } from '@tanstack/react-start'
import { Check, Layout, Pen, PlusIcon } from 'lucide-react'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useState } from 'react'
import { updateFormSchema } from '#/components/postForm'
import { eq } from 'drizzle-orm'
import { blogs, userBlogs } from '#/db/schema'
import { getSession } from '@/db/server'
import z from 'zod'

type blogInfo = {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}
const userInfo = z.object({
  id: z.string().uuid(),
  role: z.string(),
})

const getBlogsByUserId = createServerFn({ method: 'GET' })
  .inputValidator(userInfo)
  .handler(async ({ data: data }) => {
    var userBlog = []
    data.role === 'admin'
      ? (userBlog = await db.query.userBlogs.findMany())
      : (userBlog = await db.query.userBlogs.findMany({
          where: eq(userBlogs.userId, data.id),
        }))
    if (!userBlog) throw []
    return userBlog
  })

const fetchBlogs = createServerFn({ method: 'GET' })
  .inputValidator((data: Array<any>) => data)
  .handler(async ({ data }) => {
    const blogsById = data.map((blog) => blog.blogsId)
    const posts = await db.query.blogs.findMany({
      where: (blogs, { inArray }) => inArray(blogs.id, blogsById),
    })
    return posts
  })

export const Route = createFileRoute('/blogs/posts')({
  component: Blogs,
  loader: async () => {
    const session = await getSession()
    if (!session || !session.id) throw redirect({ to: '/login' })
    const blogsByUserId = await getBlogsByUserId({ data: session })
    return fetchBlogs({ data: blogsByUserId })
  },
})

const handleDelete = async (content: blogInfo) => {
  if (!window.confirm('Are you sure you want to delete this post?')) return
  await deletePost({
    data: { ...content },
  })
  window.location.reload()
}

const deletePost = createServerFn({ method: 'POST' })
  .inputValidator(updateFormSchema)
  .handler(async ({ data }) => {
    await db.delete(blogs).where(eq(blogs.id, data.id))
  })

export function dateFormatter(date: Date) {
  if (!date) return ''
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Intl.DateTimeFormat('en-US', options).format(date)
}

function Blogs() {
  const blogs = Route.useLoaderData()
  const postCount = blogs.length
  const [editMode, setEditMode] = useState(false)
  return (
    <div className="min-h-screen container">
      <Header />
      <div className="flex justify-between py-2 gap-4">
        <Badge variant="outline">
          Current post: <span className="font-bold">{postCount}</span>
        </Badge>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/blogs/new">
              <PlusIcon /> New post
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditMode(!editMode)}
          >
            {!editMode ? (
              <>
                <Pen /> Edit
              </>
            ) : (
              <>
                <Check /> Done
              </>
            )}
          </Button>
        </div>
      </div>
      <div>
        <RenderBlog posts={blogs} mode={editMode} />
      </div>
    </div>
  )
}

function RenderBlog({
  posts,
  mode,
}: {
  posts: Array<blogInfo>
  mode: boolean
}) {
  if (posts.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Layout />
          </EmptyMedia>
          <EmptyTitle>No posts yet</EmptyTitle>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <ul className="grid grid-cols-3 gap-4">
      {posts.map((content) => (
        <li key={content.id}>
          <Card className="relative w-full m-0">
            <CardHeader>
              <CardAction>
                <Badge variant="secondary">
                  {dateFormatter(content.createdAt)}
                </Badge>
              </CardAction>
              <CardTitle>{content.title}</CardTitle>
              <CardDescription>{content.content}</CardDescription>
            </CardHeader>
            <CardFooter>
              {!mode ? (
                <Button className="w-full" variant="secondary">
                  <Link to="/blogs/$id" params={{ id: content.id }}>
                    View Event
                  </Link>
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-2 w-full">
                  <Button className="w-full" variant="outline">
                    <Link to="/blogs/$id/edit" params={{ id: content.id }}>
                      Update
                    </Link>
                  </Button>
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={() => handleDelete(content)}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        </li>
      ))}
    </ul>
  )
}
