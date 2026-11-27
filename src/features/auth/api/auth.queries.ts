import type { LoginRequest } from '../types'

import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import { useAuthStore } from '@/stores/auth-store'

import { getCurrentUser, login } from './auth.api'

/** query key factory — รวม key ของ feature ไว้ที่เดียว ใช้ทั้งตอน query และ invalidate */
export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'current-user'] as const,
}

export const currentUserQueryOptions = () =>
  queryOptions({
    queryKey: authKeys.currentUser(),
    queryFn: getCurrentUser,
    staleTime: 5 * 60_000,
    // 401 = session หมด ซึ่ง route guard จัดการแล้ว ไม่ต้อง toast
    meta: { suppressErrorToast: true },
  })

/**
 * ผู้ใช้ที่ login อยู่ — ใช้ได้เฉพาะใต้ route `/_authenticated` เพราะ guard โหลดข้อมูลไว้ให้แล้ว
 * (useSuspenseQuery จึงได้ data ทันทีและ type ไม่เป็น undefined)
 */
export const useCurrentUser = () => useSuspenseQuery(currentUserQueryOptions()).data

export const useLogin = () => {
  const queryClient = useQueryClient()
  const setTokens = useAuthStore((state) => state.setTokens)

  return useMutation({
    mutationFn: (body: LoginRequest) => login(body),
    // ฟอร์ม login แสดง error เอง (เช่น รหัสผิด) จึงปิด toast กลาง
    meta: { suppressErrorToast: true },
    onSuccess: async (tokens) => {
      setTokens({ accessToken: tokens.access, refreshToken: tokens.refresh })
      // โหลดข้อมูลผู้ใช้ทันที เพื่อให้หน้าแรกหลัง login ไม่ต้องรอ guard ยิงซ้ำ
      await queryClient.prefetchQuery(currentUserQueryOptions())
    },
  })
}

/** logout = ล้าง session — ที่เหลือ (ล้าง cache, พาไปหน้า login) ทำที่ src/app/router.ts ที่เดียว */
export const useLogout = () => {
  const clearSession = useAuthStore((state) => state.clearSession)
  return clearSession
}
