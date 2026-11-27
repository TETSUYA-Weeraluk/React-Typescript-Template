/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { msw } from 'msw/vite'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // ต้องอยู่ก่อน react() เพื่อให้ generate routeTree.gen.ts และแตก code ของแต่ละ route ก่อน
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    // เสิร์ฟ /mockServiceWorker.js ตอน dev ให้เอง — ไม่ต้อง commit ไฟล์ worker และไม่หลุดเข้า production build
    msw(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 4173,
  },
  build: {
    rolldownOptions: {
      output: {
        // แยก vendor ที่โหลดตอนเริ่มแอปออกจาก main chunk — deploy โค้ดเราใหม่แล้ว browser ยังใช้ cache ของ vendor เดิมได้
        codeSplitting: {
          groups: [
            { name: 'vendor-react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            {
              name: 'vendor-tanstack',
              test: /node_modules[\\/]@tanstack[\\/](router-core|react-router|history|query-core|react-query)[\\/]/,
            },
            { name: 'vendor-i18n', test: /node_modules[\\/](i18next|react-i18next)[\\/]/ },
          ],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
    // ค่า env สำหรับ test — ไม่ต้องพึ่ง .env ของเครื่องใคร
    env: {
      VITE_API_URL: 'http://localhost:3000/api/',
    },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/components/ui/**', 'src/routeTree.gen.ts', 'src/mocks/**', 'src/test/**', '**/*.d.ts'],
    },
  },
})
