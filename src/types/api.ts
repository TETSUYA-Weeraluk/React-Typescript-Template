/**
 * รูปแบบ response มาตรฐานของ backend (DRF) — ปรับให้ตรงกับ backend ของโปรเจกต์
 * แยกไว้ที่เดียวเพื่อให้ api layer ทุก feature ใช้ร่วมกัน
 */
export interface ApiResponse<T> {
  success: boolean
  message: string
  code: string
  data: T
}

export interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  count: number
  total_pages: number
  next: number | null
  previous: number | null
}

export interface PaginationParams {
  page: number
  page_size: number
  search?: string
}

export interface Option<TValue extends string | number = string> {
  value: TValue
  label: string
}
