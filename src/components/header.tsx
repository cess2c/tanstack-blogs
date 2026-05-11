import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from './ui/button'
import { logout } from '#/db/server'

export function Header() {
  const navigate = useNavigate()
  const handleLogout = async () => {
    await logout()
    window.location.reload()
    navigate({ to: '/login' })
  }
  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <Link to="/blogs/posts">
          <img
            src="../../logo192.png"
            alt="TanStack Logo"
            className="h-8 w-auto"
          />
        </Link>
        <Link to="/">Blog</Link>
      </div>
      <div className="flex items-center gap-4">
        <Button size="sm" variant="outline" onClick={() => handleLogout()}>
          Log Out
        </Button>
      </div>
    </header>
  )
}
