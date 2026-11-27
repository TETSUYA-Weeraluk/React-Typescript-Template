import type { RouterContext } from '@/app/router'

import { createRootRouteWithContext, HeadContent, Outlet } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

import { NotFound } from '@/components/feedback/not-found'

// โหลด devtools เฉพาะตอน dev — production ไม่มีโค้ดส่วนนี้เลย
const RouterDevtools = import.meta.env.DEV
  ? lazy(() => import('@tanstack/react-router-devtools').then((module) => ({ default: module.TanStackRouterDevtools })))
  : () => null

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [{ title: 'React Template' }],
  }),
  component: RootComponent,
  notFoundComponent: () => <NotFound variant="full" />,
})

function RootComponent() {
  return (
    <>
      <HeadContent />
      <Outlet />
      <Suspense>
        <RouterDevtools position="bottom-right" />
      </Suspense>
    </>
  )
}
