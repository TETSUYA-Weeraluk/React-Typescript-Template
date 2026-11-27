import { createFileRoute } from '@tanstack/react-router'

import { AuthLayout } from '@/components/layouts/auth-layout'

/** กลุ่มหน้าที่ไม่ต้อง login — `_` นำหน้าชื่อ = pathless layout (ไม่เพิ่ม segment ใน URL) */
export const Route = createFileRoute('/_public')({
  component: AuthLayout,
})
