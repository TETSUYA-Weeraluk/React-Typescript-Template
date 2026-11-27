import type { ApiResponse } from '@/types/api'

import axios, { HttpStatusCode, isAxiosError } from 'axios'

import { env } from '@/config/env'
import { useAuthStore } from '@/stores/auth-store'

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** true = endpoint สาธารณะ: ไม่แนบ token และไม่ refresh เมื่อได้ 401 (เช่น login, forgot password) */
    skipAuth?: boolean
    /** ใช้ภายใน: กัน retry ซ้ำไม่รู้จบเมื่อ refresh แล้วยังได้ 401 */
    _retried?: boolean
  }
}

const REQUEST_TIMEOUT_MS = 15_000
export const TOKEN_REFRESH_PATH = 'auth/token/refresh/'

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: REQUEST_TIMEOUT_MS,
  // ส่ง array เป็น ?status=a&status=b (แบบที่ DRF อ่านได้) โดยไม่ต้องพึ่ง qs
  paramsSerializer: { indexes: null },
})

const toBearer = (token: string) => `Bearer ${token}`

apiClient.interceptors.request.use((config) => {
  if (config.skipAuth) return config

  const { accessToken } = useAuthStore.getState()
  if (accessToken) {
    config.headers.set('Authorization', toBearer(accessToken))
  }

  return config
})

interface RefreshTokenData {
  access: string
  /** backend บางตัว rotate refresh token ทุกครั้ง บางตัวไม่ส่งกลับมา */
  refresh?: string
}

const requestNewAccessToken = async (): Promise<string> => {
  const { refreshToken, setTokens } = useAuthStore.getState()
  if (!refreshToken) {
    throw new Error('No refresh token')
  }

  // ใช้ axios ตัวเปล่า (ไม่มี interceptor) เพื่อไม่ให้ 401 ของการ refresh วนกลับมา refresh ซ้ำ
  const { data } = await axios.post<ApiResponse<RefreshTokenData>>(
    TOKEN_REFRESH_PATH,
    { refresh: refreshToken },
    { baseURL: env.apiUrl, timeout: REQUEST_TIMEOUT_MS }
  )

  setTokens({ accessToken: data.data.access, refreshToken: data.data.refresh ?? refreshToken })
  return data.data.access
}

let refreshPromise: Promise<string> | null = null

/**
 * refresh token ครั้งเดียวต่อรอบ แม้หลาย request ได้ 401 พร้อมกัน — ทุกตัวรอ promise เดียวกัน
 * ถ้า refresh ไม่ผ่าน ทุก request ที่รออยู่จะ reject ตามไปด้วย (ไม่ค้างแบบ subscriber queue)
 */
export const refreshAccessToken = (): Promise<string> => {
  refreshPromise ??= requestNewAccessToken().finally(() => {
    refreshPromise = null
  })

  return refreshPromise
}

apiClient.interceptors.response.use(undefined, async (error: unknown) => {
  if (!isAxiosError(error) || !error.config) {
    return Promise.reject(error)
  }

  const config = error.config
  const isUnauthorized = error.response?.status === HttpStatusCode.Unauthorized
  const { accessToken, refreshToken } = useAuthStore.getState()

  if (!isUnauthorized || config.skipAuth || config._retried || !refreshToken) {
    return Promise.reject(error)
  }

  config._retried = true

  // request นี้ส่งไปด้วย token เก่า แต่ระหว่างนั้นมีคน refresh ให้แล้ว → ใช้ token ใหม่ได้เลย
  const sentToken = config.headers.get('Authorization')
  if (accessToken && sentToken !== toBearer(accessToken)) {
    config.headers.set('Authorization', toBearer(accessToken))
    return apiClient(config)
  }

  try {
    const newAccessToken = await refreshAccessToken()
    config.headers.set('Authorization', toBearer(newAccessToken))
    return apiClient(config)
  } catch {
    // refresh ไม่ผ่าน = session หมดจริง → ล้าง session แล้ว router จะพาไปหน้า login เอง (ดู src/app/router.ts)
    useAuthStore.getState().clearSession()
    return Promise.reject(error)
  }
})
