import 'i18next'

import type th from '@/locales/th.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    // ใช้ th เป็นต้นแบบ key — ถ้า en ขาด key ไหน test ใน src/locales จะจับได้
    resources: {
      translation: typeof th
    }
  }
}
