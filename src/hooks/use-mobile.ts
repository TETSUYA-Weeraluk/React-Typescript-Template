import { useSyncExternalStore } from 'react'

const MOBILE_BREAKPOINT = 768
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

// แก้จากที่ shadcn generate: ใช้ useSyncExternalStore แทน useEffect + setState
// อ่านค่าถูกต้องตั้งแต่ render แรก (ไม่ render ซ้ำ) และผ่าน rule react-hooks/set-state-in-effect
const subscribe = (onChange: () => void) => {
  const mediaQuery = window.matchMedia(MOBILE_QUERY)
  mediaQuery.addEventListener('change', onChange)
  return () => mediaQuery.removeEventListener('change', onChange)
}

const getSnapshot = () => window.matchMedia(MOBILE_QUERY).matches

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
