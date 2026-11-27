import { useEffect, useState } from 'react'

/**
 * คืนค่าที่ "นิ่ง" แล้วเกิน delay ms — ใช้หน่วงช่องค้นหาก่อนยิง API
 * (useDeferredValue ของ React ไม่หน่วงเวลา จึงใช้แทนกันไม่ได้)
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delayMs)
    return () => clearTimeout(timeoutId)
  }, [value, delayMs])

  return debouncedValue
}
