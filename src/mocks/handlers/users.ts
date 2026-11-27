import type { CreateUserRequest, UpdateUserRequest, User } from '@/features/users/types'

import { delay, http, HttpResponse } from 'msw'

import { env } from '@/config/env'

import { mockDb } from '../db'
import { requireAuth } from './auth'

const api = (path: string) => new URL(path, env.apiUrl).toString()

const ok = <T>(data: T, init?: ResponseInit) =>
  HttpResponse.json({ success: true, message: 'ok', code: 'ok', data }, init)

const notFound = () =>
  HttpResponse.json({ success: false, message: 'User not found', code: 'not_found' }, { status: 404 })

const isEmailTaken = (email: string, exceptId?: string) =>
  mockDb.users.some((user) => user.email.toLowerCase() === email.toLowerCase() && user.id !== exceptId)

export const userHandlers = [
  http.get(api('users/'), async ({ request }) => {
    await delay(300)
    const denied = requireAuth(request)
    if (denied) return denied

    const url = new URL(request.url)
    const page = Math.max(1, Number(url.searchParams.get('page') ?? 1))
    const pageSize = Math.max(1, Number(url.searchParams.get('page_size') ?? 10))
    const search = (url.searchParams.get('search') ?? '').trim().toLowerCase()

    const filtered = search
      ? mockDb.users.filter(
          (user) => user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search)
        )
      : mockDb.users

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
    const start = (page - 1) * pageSize

    return HttpResponse.json({
      success: true,
      message: 'ok',
      data: filtered.slice(start, start + pageSize),
      count: filtered.length,
      total_pages: totalPages,
      next: page < totalPages ? page + 1 : null,
      previous: page > 1 ? page - 1 : null,
    })
  }),

  http.get(api('users/stats/'), async ({ request }) => {
    await delay(300)
    const denied = requireAuth(request)
    if (denied) return denied

    return ok({
      total: mockDb.users.length,
      active: mockDb.users.filter((user) => user.is_active).length,
      admins: mockDb.users.filter((user) => user.role === 'admin').length,
    })
  }),

  http.get(api('users/:id/'), async ({ request, params }) => {
    await delay(200)
    const denied = requireAuth(request)
    if (denied) return denied

    const user = mockDb.users.find((item) => item.id === params.id)
    return user ? ok(user) : notFound()
  }),

  http.post(api('users/'), async ({ request }) => {
    await delay(400)
    const denied = requireAuth(request)
    if (denied) return denied

    const body = (await request.json()) as CreateUserRequest
    if (isEmailTaken(body.email)) {
      // รูปแบบ validation error ของ DRF: { field: [messages] }
      return HttpResponse.json({ email: ['user with this email already exists.'] }, { status: 400 })
    }

    const user: User = { ...body, id: crypto.randomUUID(), created_at: new Date().toISOString() }
    mockDb.users = [user, ...mockDb.users]
    return ok(user, { status: 201 })
  }),

  http.patch(api('users/:id/'), async ({ request, params }) => {
    await delay(400)
    const denied = requireAuth(request)
    if (denied) return denied

    const index = mockDb.users.findIndex((item) => item.id === params.id)
    const existing = mockDb.users[index]
    if (!existing) return notFound()

    const body = (await request.json()) as UpdateUserRequest
    if (body.email && isEmailTaken(body.email, existing.id)) {
      return HttpResponse.json({ email: ['user with this email already exists.'] }, { status: 400 })
    }

    const updated: User = { ...existing, ...body }
    mockDb.users = mockDb.users.map((item) => (item.id === updated.id ? updated : item))
    return ok(updated)
  }),

  http.delete(api('users/:id/'), async ({ request, params }) => {
    await delay(300)
    const denied = requireAuth(request)
    if (denied) return denied

    const exists = mockDb.users.some((item) => item.id === params.id)
    if (!exists) return notFound()

    mockDb.users = mockDb.users.filter((item) => item.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),
]
