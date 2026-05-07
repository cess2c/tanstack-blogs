import { Link } from '@tanstack/react-router'

export function Header() {
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
    </header>
  )
}
