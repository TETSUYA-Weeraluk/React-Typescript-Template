import type { ResolvedTheme, Theme } from './theme-context'
import type { ReactNode } from 'react'

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'

import { THEME_STORAGE_KEY, ThemeContext } from './theme-context'

const DARK_QUERY = '(prefers-color-scheme: dark)'

const isTheme = (value: unknown): value is Theme => value === 'light' || value === 'dark' || value === 'system'

const readStoredTheme = (fallback: Theme): Theme => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(stored) ? stored : fallback
  } catch {
    return fallback
  }
}

const subscribeSystemTheme = (onChange: () => void) => {
  const mediaQuery = window.matchMedia(DARK_QUERY)
  mediaQuery.addEventListener('change', onChange)
  return () => mediaQuery.removeEventListener('change', onChange)
}

const getSystemTheme = (): ResolvedTheme => (window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light')

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
}

/**
 * ธีม light / dark / system ด้วย class `.dark` บน <html> (Tailwind custom-variant ใน index.css)
 * index.html มี inline script ใส่ class ก่อน React โหลด เพื่อไม่ให้หน้าขาวกระพริบตอนเปิดในโหมดมืด
 */
export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => readStoredTheme(defaultTheme))
  const systemTheme = useSyncExternalStore(subscribeSystemTheme, getSystemTheme)
  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', resolvedTheme === 'dark')
    root.style.colorScheme = resolvedTheme
  }, [resolvedTheme])

  // sync ธีมข้ามแท็บ
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY && isTheme(event.newValue)) {
        setThemeState(event.newValue)
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const setTheme = useCallback((nextTheme: Theme) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    } catch {
      // ignore
    }
    setThemeState(nextTheme)
  }, [])

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
