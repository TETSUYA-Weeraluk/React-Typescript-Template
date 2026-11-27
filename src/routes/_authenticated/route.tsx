import { createFileRoute, redirect } from '@tanstack/react-router'

import { AppLayout } from '@/components/layouts/app-layout'
import { currentUserQueryOptions } from '@/features/auth/api/auth.queries'
import { hasSession } from '@/stores/auth-store'

/**
 * Route guard ของทุกหน้าที่ต้อง login — ทุกไฟล์ใต้ src/routes/_authenticated/ ได้การป้องกันนี้อัตโนมัติ
 * - ไม่มี token → ไป /login พร้อมจำหน้าปัจจุบันไว้ใน ?redirect=
 * - มี token → โหลดข้อมูลผู้ใช้ผ่าน query cache (ไม่ยิง API ซ้ำทุกครั้งที่เปลี่ยนหน้าแบบ rice-iot เดิม)
 */
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    const redirectToLogin = () => redirect({ to: '/login', search: { redirect: location.href }, replace: true })

    if (!hasSession()) {
      throw redirectToLogin()
    }

    try {
      const currentUser = await context.queryClient.ensureQueryData(currentUserQueryOptions())
      return { currentUser }
    } catch (error) {
      // interceptor ล้าง session ไปแล้วถ้า refresh token ไม่ผ่าน → พาไป login
      if (!hasSession()) throw redirectToLogin()
      // network / 5xx → ให้ errorComponent แสดงปุ่มลองใหม่
      throw error
    }
  },
  component: AppLayout,
})
