import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

import { showApiErrorToast } from '@/lib/api-error'

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: {
      /** true = ไม่ต้อง toast error ของ query นี้ (จัดการเองแล้ว) */
      suppressErrorToast?: boolean
    }
    mutationMeta: {
      /** true = ไม่ต้อง toast error ของ mutation นี้ (จัดการเองแล้ว เช่น แสดงใต้ฟอร์ม) */
      suppressErrorToast?: boolean
    }
  }
}

const MAX_RETRIES = 2

/** retry เฉพาะ error ที่ลองใหม่แล้วมีโอกาสผ่าน (network / 5xx) — 4xx ลองกี่ครั้งก็ผิดเหมือนเดิม */
const shouldRetry = (failureCount: number, error: unknown) => {
  if (failureCount >= MAX_RETRIES) return false
  if (isAxiosError(error) && error.response) {
    return error.response.status >= 500
  }
  return true
}

/** factory แทน instance เดียว — test แต่ละตัวสร้าง client ใหม่ได้ ไม่มี cache รั่วข้าม test */
export function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.meta?.suppressErrorToast) return
        // refetch พื้นหลังพังตอนมีข้อมูลเดิมแสดงอยู่ ไม่ต้อง toast รบกวน
        if (query.state.data !== undefined) return
        showApiErrorToast(error)
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _onMutateResult, mutation) => {
        if (mutation.meta?.suppressErrorToast) return
        showApiErrorToast(error)
      },
    }),
    defaultOptions: {
      queries: {
        // ข้อมูลยังสดอยู่ 30 วินาที — กลับมาหน้าเดิมเร็วๆ ไม่ยิง API ซ้ำ
        staleTime: 30_000,
        retry: shouldRetry,
      },
      mutations: {
        retry: false,
      },
    },
  })
}
