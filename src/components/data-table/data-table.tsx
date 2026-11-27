import type { ColumnDef } from '@tanstack/react-table'
import type { ReactNode } from 'react'

import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

const ALIGN_CLASS = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[] // eslint-disable-line @typescript-eslint/no-explicit-any -- ColumnDef ต้องรับ value type ได้ทุกแบบในคอลัมน์เดียวกัน
  data: TData[]
  /** โหลดครั้งแรก (ยังไม่มีข้อมูลเลย) — แสดง skeleton */
  isLoading?: boolean
  /** กำลังโหลดข้อมูลชุดใหม่ทับข้อมูลเดิม (เปลี่ยนหน้า/ค้นหา) — ทำให้ตารางจางลง */
  isFetching?: boolean
  emptyMessage?: ReactNode
  getRowId?: (row: TData) => string
  skeletonRows?: number
}

/**
 * ตารางพื้นฐานบน TanStack Table + shadcn Table
 * แบ่งหน้า/ค้นหาฝั่ง server — ตารางนี้แค่แสดงผล ส่วน state อยู่ใน URL ของหน้านั้นๆ
 */
export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  isFetching = false,
  emptyMessage,
  getRowId,
  skeletonRows = 5,
}: DataTableProps<TData>) {
  const { t } = useTranslation()

  // eslint-disable-next-line react-hooks/incompatible-library -- useReactTable คืน function ที่ memo ไม่ได้ เป็นเรื่องปกติของ library นี้
  const table = useReactTable({
    data,
    columns,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
  })

  const renderBody = () => {
    if (isLoading) {
      return Array.from({ length: skeletonRows }, (_, rowIndex) => (
        <TableRow key={rowIndex}>
          {columns.map((_column, columnIndex) => (
            <TableCell key={columnIndex}>
              <Skeleton className="h-5 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))
    }

    const rows = table.getRowModel().rows
    if (rows.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
            {emptyMessage ?? t('common.no_data')}
          </TableCell>
        </TableRow>
      )
    }

    return rows.map((row) => (
      <TableRow key={row.id}>
        {row.getVisibleCells().map((cell) => {
          const meta = cell.column.columnDef.meta
          return (
            <TableCell key={cell.id} className={cn(meta?.align && ALIGN_CLASS[meta.align], meta?.className)}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          )
        })}
      </TableRow>
    ))
  }

  return (
    <div
      className={cn('overflow-hidden rounded-lg border transition-opacity', isFetching && !isLoading && 'opacity-60')}
      aria-busy={isLoading || isFetching}
    >
      <Table>
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta
                return (
                  <TableHead key={header.id} className={cn(meta?.align && ALIGN_CLASS[meta.align], meta?.className)}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>{renderBody()}</TableBody>
      </Table>
    </div>
  )
}
