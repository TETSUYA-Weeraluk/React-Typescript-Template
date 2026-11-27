import type { User } from '../types'
import type { PaginationParams } from '@/types/api'

import { keepPreviousData, queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { createUser, deleteUser, getUser, getUsers, getUserStats, updateUser } from './users.api'

/**
 * query key factory — เรียงจากกว้างไปแคบ เพื่อ invalidate ได้ทีละระดับ เช่น
 * `userKeys.lists()` = ทุกหน้าของตาราง, `userKeys.all` = ทุกอย่างของ users
 */
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...userKeys.lists(), params] as const,
  stats: () => [...userKeys.all, 'stats'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

export const usersQueryOptions = (params: PaginationParams) =>
  queryOptions({
    queryKey: userKeys.list(params),
    queryFn: () => getUsers(params),
    // เปลี่ยนหน้า/ค้นหาแล้วตารางยังแสดงข้อมูลเดิมระหว่างโหลด ไม่กระพริบเป็น skeleton
    placeholderData: keepPreviousData,
  })

export const userStatsQueryOptions = () =>
  queryOptions({
    queryKey: userKeys.stats(),
    queryFn: getUserStats,
  })

export const userQueryOptions = (id: string) =>
  queryOptions({
    queryKey: userKeys.detail(id),
    queryFn: () => getUser(id),
  })

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: async () => {
      // return promise เพื่อให้ mutation ยัง pending จนกว่าตารางจะโหลดข้อมูลใหม่เสร็จ
      await queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: async (updatedUser: User) => {
      // ใส่ข้อมูลใหม่ลง cache ของหน้า detail ทันที ไม่ต้องยิง GET ซ้ำ
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: userKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: userKeys.stats() }),
      ])
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: async (_data, id) => {
      // ลบ cache ของหน้า detail เฉพาะตอนที่ไม่มีใครใช้อยู่ — ถ้าลบตอนหน้า detail ยังเปิดอยู่
      // query จะถูกสร้างใหม่แล้วยิง GET ผู้ใช้ที่เพิ่งลบ → ได้ 404 และ toast error หลอก
      queryClient.removeQueries({ queryKey: userKeys.detail(id), type: 'inactive' })
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: userKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: userKeys.stats() }),
      ])
    },
  })
}
