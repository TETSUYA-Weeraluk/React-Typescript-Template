import type { ReactNode } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { createQueryClient } from '@/app/query-client'

export const NAVIGATED_TEXT = 'navigated-away'

/**
 * render component ภายใต้ provider จริง (QueryClient + Router แบบ memory)
 * - ทุก path อื่นที่ไม่ใช่ initialPath จะแสดง NAVIGATED_TEXT ไว้เช็คว่ามีการเปลี่ยนหน้า
 */
export function renderWithProviders(ui: ReactNode, { initialPath = '/' }: { initialPath?: string } = {}) {
  const queryClient = createQueryClient()
  // test ไม่ต้องรอ retry
  queryClient.setDefaultOptions({ queries: { retry: false }, mutations: { retry: false } })

  const rootRoute = createRootRoute({ component: Outlet })
  const pageRoute = createRoute({ getParentRoute: () => rootRoute, path: initialPath, component: () => ui })
  const otherRoute = createRoute({ getParentRoute: () => rootRoute, path: '$', component: () => NAVIGATED_TEXT })

  const router = createRouter({
    routeTree: rootRoute.addChildren([pageRoute, otherRoute]),
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  })

  const user = userEvent.setup()
  const result = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )

  return { ...result, user, router, queryClient }
}
