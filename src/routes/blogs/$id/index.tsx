import { Header } from '#/components/header'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { db } from '@/db'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'
import { dateFormatter } from '../posts'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { eq } from 'drizzle-orm'
import { blogs } from '#/db/schema'

const getBlog = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      id: z.string().uuid(),
    }),
  )
  .handler(async ({ data }) => {
    return await db.query.blogs.findFirst({
      where: eq(blogs.id, data.id),
    })
  })

export const Route = createFileRoute('/blogs/$id/')({
  loader: async ({ params }) => {
    if (!params.id) throw redirect({ to: '/' })
    const id = params.id
    const blogContent = await getBlog({ data: { id } })
    if (!blogContent) throw redirect({ to: '/' })
    return blogContent
  },
  component: RouteComponent,
})

function RouteComponent() {
  const data = Route.useLoaderData()
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
      <div className="flex">
        <Card className="relative mx-auto h-full flex-1 w-full">
          <CardHeader>
            <CardAction>{dateFormatter(data.createdAt)}</CardAction>
            <CardTitle className="text-4xl font-bold">{data.title}</CardTitle>
          </CardHeader>
          <CardFooter>
            <CardDescription className="text-lg">
              {data.content}
            </CardDescription>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
