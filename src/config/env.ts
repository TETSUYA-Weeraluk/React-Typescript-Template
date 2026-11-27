// ไม่ใช้ zod ที่นี่ เพราะไฟล์นี้โหลดตอนเริ่มแอป — ถ้า import zod จะดึงทั้ง library เข้า main chunk
export interface Env {
  apiUrl: string
  enableMocks: boolean
}

export type EnvResult = { ok: true; env: Env } | { ok: false; errors: string[] }

const isValidUrl = (value: string) => {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

/** ตรวจ env ทั้งหมดครั้งเดียว แล้วคืนผลแบบไม่ throw เพื่อให้ main.tsx เลือกได้ว่าจะ render หน้า error หรือแอป */
export function parseEnv(source: ImportMetaEnv = import.meta.env): EnvResult {
  const errors: string[] = []
  const apiUrl = source.VITE_API_URL

  if (!apiUrl) {
    errors.push('VITE_API_URL: จำเป็นต้องกำหนดในไฟล์ .env')
  } else if (!isValidUrl(apiUrl)) {
    errors.push('VITE_API_URL: ต้องเป็น URL ที่ถูกต้อง (เช่น https://example.com/api/v1/)')
  } else if (!apiUrl.endsWith('/')) {
    // axios ต่อ path แบบ relative — ถ้าไม่มี / ท้าย baseURL path สุดท้ายจะหายไป
    errors.push('VITE_API_URL: ต้องลงท้ายด้วย "/" (เช่น https://example.com/api/v1/)')
  }

  if (errors.length > 0) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    env: {
      apiUrl: apiUrl,
      enableMocks: source.VITE_ENABLE_MOCKS === 'true',
    },
  }
}

const result = parseEnv()

/**
 * env ที่ผ่านการตรวจแล้ว — main.tsx รับประกันว่าแอปจะไม่ถูกโหลดถ้า env ไม่ถูกต้อง
 * ส่วนอื่นของแอปจึงใช้ `env` ได้เลยโดยไม่ต้องเช็คซ้ำ
 */
export const env: Env = result.ok ? result.env : { apiUrl: 'http://invalid.local/', enableMocks: false }

export const envResult = result
