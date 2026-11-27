import type { LinkProps } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'

import { LayoutDashboardIcon, UsersIcon } from 'lucide-react'

export interface NavItem {
  /** key ใน locales (nav.*) */
  titleKey: 'nav.dashboard' | 'nav.users'
  to: LinkProps['to']
  icon: LucideIcon
  /** true = active เฉพาะ path ตรงตัว (ใช้กับ "/" ไม่ให้ active ทุกหน้า) */
  exact?: boolean
}

/** เมนู sidebar — เพิ่มหน้าใหม่ที่นี่ที่เดียว (`to` เช็ค type กับ route ที่มีอยู่จริง) */
export const NAV_ITEMS: NavItem[] = [
  { titleKey: 'nav.dashboard', to: '/', icon: LayoutDashboardIcon, exact: true },
  { titleKey: 'nav.users', to: '/users', icon: UsersIcon },
]
