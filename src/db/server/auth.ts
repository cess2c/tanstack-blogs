import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { db } from '..'
import { eq } from 'drizzle-orm'
import { users } from '../schema'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import { redirect } from '@tanstack/react-router'

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
})

export const getSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const token = getCookie('auth_token')
    if (!token || token === '') return null
    const user = await db.query.users.findFirst({
      where: eq(users.id, token),
    })
    if (!user) return null
    return user
  },
)

export const isLoggedIn = () => {
  const token = getCookie('auth_token')
  if (!token || token === '') return false
  return true
}

export const login = createServerFn({ method: 'POST' })
  .inputValidator(loginSchema)
  .handler(async ({ data }) => {
    const user = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    })
    if (!user) throw new Error('Invalid email or password')
    if (user.password !== data.password)
      throw new Error('Invalid email or password')
    setCookie('auth_token', String(user.id), {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 60 * 24 * 7,
    })
    return user
  })

export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  setCookie('auth_token', '', {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: true,
    maxAge: 60 * 60 * 24 * 7,
  })
})
