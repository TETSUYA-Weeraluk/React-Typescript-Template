import type { RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  // generic ต้องตรงกับ declaration เดิมของ library แม้ไม่ได้ใช้ (declaration merging)
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** การจัดตำแหน่งข้อความใน cell และ header */
    align?: 'left' | 'center' | 'right'
    /** class ที่ใส่เพิ่มให้ทั้ง header และ cell ของคอลัมน์นี้ (เช่น ความกว้าง) */
    className?: string
  }
}
