import { createFileRoute } from '@tanstack/react-router'

import { DashboardPage } from '@/features/dashboard/pages/dashboard-page'
import { userStatsQueryOptions } from '@/features/users/api/users.queries'

export const Route = createFileRoute('/_authenticated/')({
  // เริ่มโหลดข้อมูลตั้งแต่ตอนเปลี่ยนหน้า (หรือ hover ลิงก์) ไม่ต้องรอ component render ก่อน
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(userStatsQueryOptions())
  },
  head: () => ({ meta: [{ title: 'Dashboard · React Template' }] }),
  component: DashboardPage,
})
