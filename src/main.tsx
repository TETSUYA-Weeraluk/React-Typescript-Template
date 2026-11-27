import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { EnvErrorPage } from '@/components/feedback/env-error-page'
import { envResult } from '@/config/env'

import '@fontsource-variable/inter/wght.css'
import '@fontsource-variable/noto-sans-thai/wght.css'
import './index.css'

async function enableMocking() {
  // เงื่อนไข DEV ทำให้ MSW ไม่ถูก bundle เข้า production เลย
  if (import.meta.env.DEV && envResult.ok && envResult.env.enableMocks) {
    const { worker } = await import('@/mocks/browser')
    await worker.start({ onUnhandledFrame: 'bypass' })
  }
}

async function bootstrap() {
  const rootElement = document.getElementById('root')
  if (!rootElement) throw new Error('Missing #root element in index.html')

  const root = createRoot(rootElement)

  if (!envResult.ok) {
    root.render(<EnvErrorPage errors={envResult.errors} />)
    return
  }

  await enableMocking()

  // import แบบ dynamic: โมดูลที่อ่าน env (api client, router) จะไม่ถูกโหลดเลยถ้า env ผิด
  const { App } = await import('@/app/app')

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}

void bootstrap()
