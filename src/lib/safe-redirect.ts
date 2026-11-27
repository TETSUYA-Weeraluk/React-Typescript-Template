/**
 * กัน open redirect: รับเฉพาะ path ภายในแอป (ขึ้นต้นด้วย "/" แต่ไม่ใช่ "//evil.com")
 * ใช้กับค่า `?redirect=` ที่มาจาก URL ซึ่งผู้ใช้แก้เองได้
 */
export const getSafeRedirect = (target: unknown, fallback = '/'): string => {
  if (typeof target !== 'string') return fallback
  if (!target.startsWith('/') || target.startsWith('//') || target.startsWith('/\\')) return fallback
  return target
}
