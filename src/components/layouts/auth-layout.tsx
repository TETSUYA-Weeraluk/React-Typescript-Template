import { Outlet } from '@tanstack/react-router'

import { LanguageSwitcher } from '@/components/language-switcher'
import { ModeToggle } from '@/components/theme/mode-toggle'

/** layout ของหน้าที่ไม่ต้อง login (login, forgot password ฯลฯ) */
export function AuthLayout() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-muted/40 p-4">
      <div className="absolute top-4 right-4 flex items-center gap-1">
        <LanguageSwitcher />
        <ModeToggle />
      </div>
      <Outlet />
    </div>
  )
}
