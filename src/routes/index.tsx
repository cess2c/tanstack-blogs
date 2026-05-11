import { isLoggedIn } from '#/db/server'
import { createFileRoute, Navigate, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    if (!isLoggedIn()) {
      throw redirect({ to: '/login' })
    }
  },
  component: App,
})

function App() {
  return <Navigate to="/blogs" />
}
