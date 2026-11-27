import type { CreateUserRequest, UpdateUserRequest, User, UserStats } from '../types'
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api'

import { apiClient } from '@/lib/api-client'

export const getUsers = async (params: PaginationParams): Promise<PaginatedResponse<User>> => {
  const { data } = await apiClient.get<PaginatedResponse<User>>('users/', {
    // ไม่ส่ง search ว่างไปให้ backend
    params: { ...params, search: params.search || undefined },
  })
  return data
}

export const getUserStats = async (): Promise<UserStats> => {
  const { data } = await apiClient.get<ApiResponse<UserStats>>('users/stats/')
  return data.data
}

export const getUser = async (id: string): Promise<User> => {
  const { data } = await apiClient.get<ApiResponse<User>>(`users/${encodeURIComponent(id)}/`)
  return data.data
}

export const createUser = async (body: CreateUserRequest): Promise<User> => {
  const { data } = await apiClient.post<ApiResponse<User>>('users/', body)
  return data.data
}

export const updateUser = async ({ id, body }: { id: string; body: UpdateUserRequest }): Promise<User> => {
  const { data } = await apiClient.patch<ApiResponse<User>>(`users/${encodeURIComponent(id)}/`, body)
  return data.data
}

export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`users/${encodeURIComponent(id)}/`)
}
