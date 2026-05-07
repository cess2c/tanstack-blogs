import { Header } from '#/components/header'
import { PostForm } from '#/components/postForm'
import { Button } from '#/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'

export const Route = createFileRoute('/blogs/new')({
  component: NewPost,
})

function NewPost() {
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
              Add a new post
            </h2>
          </div>
          <PostForm />
        </div>
      </section>
    </div>
  )
}
