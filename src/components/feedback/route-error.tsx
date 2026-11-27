import type { ErrorComponentProps } from '@tanstack/react-router'

import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

import { ErrorFallback } from './error-fallback'

/** errorComponent มาตรฐานของทุก route — กด "ลองอีกครั้ง" แล้วโหลด loader + query ใหม่ */
export function RouteError({ error }: ErrorComponentProps) {
  const router = useRouter()
  const queryErrorResetBoundary = useQueryErrorResetBoundary()

  useEffect(() => {
    // ล้างสถานะ error ของ query ที่ throw ไปถึง boundary เพื่อให้ retry ยิงใหม่จริง
    queryErrorResetBoundary.reset()
  }, [queryErrorResetBoundary])

  return <ErrorFallback error={error} onRetry={() => void router.invalidate()} />
}
