import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const AUTH_STORAGE_KEY = 'app-auth'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  setTokens: (tokens: AuthTokens) => void
  clearSession: () => void
}

/**
 * เก็บเฉพาะ token — ข้อมูลผู้ใช้ (me) อยู่ใน TanStack Query cache ที่เดียว ไม่ซ้ำกันสองที่
 *
 * หมายเหตุด้านความปลอดภัย: localStorage อ่านได้จาก JavaScript ทุกตัวในหน้า (เสี่ยง XSS)
 * ถ้า backend รองรับ ควรย้าย refresh token ไปเป็น httpOnly cookie แทน
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setTokens: ({ accessToken, refreshToken }) => set({ accessToken, refreshToken }),
      clearSession: () => set({ accessToken: null, refreshToken: null }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken, refreshToken: state.refreshToken }),
    }
  )
)

/** derive จาก token แทนการเก็บ flag `isAuthenticated` แยก — กันค่าไม่ตรงกัน */
export const selectIsAuthenticated = (state: AuthState) => state.accessToken !== null

export const hasSession = () => useAuthStore.getState().accessToken !== null
