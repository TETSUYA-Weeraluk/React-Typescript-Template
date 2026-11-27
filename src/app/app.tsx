import '@/config/i18n'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from '@tanstack/react-router'

import { ErrorBoundary } from '@/components/feedback/error-boundary'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

import { queryClient, router } from './router'

export function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <RouterProvider router={router} />
          </TooltipProvider>
          <Toaster position="top-right" closeButton />
          {/* devtools ถูกตัดออกจาก production build ให้อัตโนมัติ */}
          <ReactQueryDevtools buttonPosition="bottom-left" />
        </QueryClientProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}
