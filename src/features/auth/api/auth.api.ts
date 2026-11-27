import type { CurrentUser, LoginRequest, LoginTokens } from '../types'
import type { ApiResponse } from '@/types/api'

import { apiClient } from '@/lib/api-client'

// api function คืนเฉพาะข้อมูลที่ใช้จริง (ไม่ใช่ AxiosResponse) — ฝั่ง component จะได้ไม่ต้อง `.data.data`

export const login = async (body: LoginRequest): Promise<LoginTokens> => {
  const { data } = await apiClient.post<ApiResponse<LoginTokens>>('auth/login/', body, { skipAuth: true })
  return data.data
}

export const getCurrentUser = async (): Promise<CurrentUser> => {
  const { data } = await apiClient.get<ApiResponse<CurrentUser>>('auth/me/')
  return data.data
}
