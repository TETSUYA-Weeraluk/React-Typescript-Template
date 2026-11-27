import type { QueryClient } from '@tanstack/react-query'

import { createRouter } from '@tanstack/react-router'

import { NotFound } from '@/components/feedback/not-found'
import { PageLoader } from '@/components/feedback/page-loader'
import { RouteError } from '@/components/feedback/route-error'
import { routeTree } from '@/routeTree.gen'
import { useAuthStore } from '@/stores/auth-store'

import { createQueryClient } from './query-client'

export interface RouterContext {
  queryClient: QueryClient
}

export function createAppRouter(queryClient: QueryClient) {
  return createRouter({
    routeTree,
    context: { queryClient },
    // preload ตอน hover/focus ลิงก์ — แต่ให้ TanStack Query เป็นคนตัดสินว่าข้อมูล stale หรือยัง
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    defaultPendingComponent: PageLoader,
    defaultErrorComponent: RouteError,
    defaultNotFoundComponent: () => <NotFound />,
  })
}

export const queryClient = createQueryClient()
export const router = createAppRouter(queryClient)

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>
  }
}

/**
 * จุดเดียวที่จัดการ "session หมด" ทุกกรณี (กด logout เอง / refresh token ไม่ผ่าน / ลบ token ในแท็บอื่น)
 * 1. ให้ route guard ทำงานใหม่ → หน้าที่ต้อง login จะ redirect ไป /login เอง
 * 2. ล้าง cache ทั้งหมด → ผู้ใช้คนถัดไปไม่เห็นข้อมูลของคนก่อน
 */
useAuthStore.subscribe((state, previousState) => {
  const isLoggedOut = previousState.accessToken !== null && state.accessToken === null
  if (!isLoggedOut) return

  void router.invalidate().finally(() => queryClient.clear())
})
