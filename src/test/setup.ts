import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'

import i18n from '@/config/i18n'
import { resetMockDb } from '@/mocks/db'
import { server } from '@/mocks/server'
import { useAuthStore } from '@/stores/auth-store'

// jsdom ไม่มี API เหล่านี้ แต่ component (theme, sidebar, radix) เรียกใช้
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}

globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver

// router เรียก scrollTo ตอนเปลี่ยนหน้า (scroll restoration)
window.scrollTo = () => {}

// radix ใช้ pointer capture / scrollIntoView ตอนเปิด Select/Dropdown
Element.prototype.hasPointerCapture ??= () => false
Element.prototype.scrollIntoView ??= () => {}

beforeAll(async () => {
  // request ที่ไม่มี handler = test เขียนไม่ครบ → ให้ fail ชัดๆ ดีกว่ายิงออก network จริง
  server.listen({ onUnhandledFrame: 'error' })
  await i18n.changeLanguage('en')
})

afterEach(() => {
  cleanup()
  server.resetHandlers()
  resetMockDb()
  useAuthStore.getState().clearSession()
  localStorage.clear()
})

afterAll(() => {
  server.close()
})
