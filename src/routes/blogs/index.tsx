import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/blogs/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Navigate to="/blogs/posts"></Navigate>;
}


