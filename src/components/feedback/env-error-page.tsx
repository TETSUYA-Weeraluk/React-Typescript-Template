interface EnvErrorPageProps {
  errors: string[]
}

/**
 * แสดงเมื่อ env ไม่ครบ/ไม่ถูกต้อง — render ก่อนโหลดแอปจริง จึงห้ามใช้ i18n, router หรือ shadcn component
 * (โมดูลพวกนั้นอาจอ่าน env ที่ผิดอยู่) ใช้ Tailwind class ล้วนๆ
 */
export function EnvErrorPage({ errors }: EnvErrorPageProps) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-6">
      <div className="w-full max-w-xl rounded-xl border border-destructive/30 bg-card p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-destructive">ตั้งค่า environment ไม่ถูกต้อง</h1>
        <p className="mt-1 text-sm text-muted-foreground">Invalid environment configuration</p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-foreground">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          คัดลอก <code className="rounded bg-muted px-1">.env.example</code> เป็น{' '}
          <code className="rounded bg-muted px-1">.env.local</code> แล้วรีสตาร์ท dev server
        </p>
      </div>
    </main>
  )
}
