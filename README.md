# React TypeScript Template

Template สำหรับเริ่มโปรเจกต์ React SPA ใหม่ — ต่อยอดจากโครงของ `rice-department-iot-frontend`
เก็บส่วนที่ดีไว้ และแก้จุดที่เป็นปัญหา (ดู [สิ่งที่ปรับปรุงจาก rice-iot](#สิ่งที่ปรับปรุงจาก-rice-iot))

| หมวด         | ใช้อะไร                                                                   |
| ------------ | ------------------------------------------------------------------------ |
| Build        | Vite 8 (Rolldown), TypeScript 6, pnpm 11, Node 24                        |
| Routing      | TanStack Router (file-based, type-safe, auto code-splitting)             |
| Server state | TanStack Query 5 + axios (refresh token อัตโนมัติ)                          |
| Forms        | TanStack Form + zod (field component ผูกกับ shadcn ไว้แล้ว)                  |
| Table        | TanStack Table (DataTable + pagination ผ่าน URL)                          |
| UI           | shadcn/ui (radix-nova) + Tailwind CSS v4 + lucide-react, light/dark mode |
| Client state | zustand (เก็บแค่ token)                                                    |
| i18n         | i18next (ไทย/อังกฤษ, ปี พ.ศ.)                                              |
| Mock / Test  | MSW 3, Vitest 5, Testing Library                                         |
| Quality      | ESLint 10 (type-aware + TanStack plugins), Prettier, GitHub Actions CI   |
| Deploy       | Docker multi-stage + nginx                                               |

## เริ่มต้นใช้งาน

```bash
pnpm install
```

รันแบบไม่ต้องมี backend (ใช้ MSW จำลอง API) — login ด้วย `admin` / `password`

```bash
pnpm dev:mock
```

รันกับ backend จริง: คัดลอก `.env.example` เป็น `.env.local` แล้วแก้ `VITE_API_URL`

```bash
cp .env.example .env.local
```

```bash
pnpm dev
```

เปิด http://localhost:3000

### Scripts

| คำสั่ง                   | ทำอะไร                                              |
| ---------------------- | --------------------------------------------------- |
| `pnpm dev`             | dev server (ใช้ `.env.local`)                        |
| `pnpm dev:mock`        | dev server + mock API (ใช้ `.env.mock`)              |
| `pnpm build`           | typecheck + build production ไปที่ `dist/`            |
| `pnpm check`           | typecheck + lint + format check + test (รันก่อน push) |
| `pnpm test`            | vitest แบบ watch                                    |
| `pnpm lint:fix`        | แก้ lint ที่แก้อัตโนมัติได้                                 |
| `pnpm format`          | จัด format ทั้งโปรเจกต์                                 |
| `pnpm ui:add <name>`   | เพิ่ม shadcn component เช่น `pnpm ui:add calendar`     |
| `pnpm gen:feature <n>` | สร้างโครง feature ใหม่ (types + api + queries)        |

## โครงสร้างโปรเจกต์

```
src/
├── main.tsx              # ตรวจ env → (dev) เปิด MSW → dynamic import App
├── app/                  # app shell: providers, router, QueryClient
├── routes/               # route ของ TanStack Router (ไฟล์บางๆ: search schema, loader, guard)
│   ├── __root.tsx
│   ├── _public/          # หน้าที่ไม่ต้อง login → /login
│   └── _authenticated/   # หน้าที่ต้อง login (มี guard ครอบทั้งโฟลเดอร์) → /, /users, /users/$userId
├── features/             # แยกตาม domain — ทุกอย่างของเรื่องนั้นอยู่ที่เดียว
│   ├── auth/             # login, current user, logout
│   ├── users/            # ตัวอย่าง CRUD ครบ: ตาราง + ค้นหา + แบ่งหน้า + ฟอร์ม + ลบ
│   └── dashboard/
│       └── (api/ components/ pages/ schemas/ types.ts)
├── components/
│   ├── ui/               # shadcn (generate ด้วย CLI)
│   ├── form/             # field ของ TanStack Form ที่ผูกกับ shadcn
│   ├── data-table/       # DataTable + DataTablePagination
│   ├── layouts/          # AppLayout (sidebar + header), AuthLayout
│   ├── feedback/         # ErrorBoundary, RouteError, NotFound, PageLoader, EnvErrorPage
│   └── theme/            # ThemeProvider + ModeToggle
├── config/               # env, i18n, เมนู sidebar
├── hooks/  lib/  stores/  locales/  mocks/  test/  types/
```

กฎทิศทางการ import: `routes → features → components / lib / hooks / stores / config`
(โฟลเดอร์ shared ห้าม import จาก `features/*`) — รายละเอียดทั้งหมดอยู่ใน [AGENTS.md](AGENTS.md)

## วิธีทำงานที่ใช้บ่อย

### เพิ่มหน้าใหม่ (ต้อง login)

1. สร้างไฟล์ `src/routes/_authenticated/reports/index.tsx` — Vite plugin จะ generate route ให้ทันที
2. ใส่ UI ใน `src/features/reports/pages/reports-page.tsx` แล้วให้ route ชี้ไป
3. เพิ่มเมนูใน `src/config/navigation.ts` และคำแปลใน `src/locales/th.json` + `en.json`

### เพิ่ม feature ที่คุยกับ API

```bash
pnpm gen:feature products
```

ได้ `types.ts`, `api/products.api.ts` (axios) และ `api/products.queries.ts` (query keys, `queryOptions`,
mutation hooks ที่ invalidate cache ให้แล้ว) — ดูตัวอย่างการใช้จริงที่ `src/features/users`

### ฟอร์ม

```tsx
const form = useAppForm({
  defaultValues: { email: '' },
  validators: { onSubmit: schema },
  onSubmit: async ({ value }) => { await createUser.mutateAsync(value) },
})

<form.AppField name="email">{(field) => <field.TextField label="Email" required />}</form.AppField>
<form.AppForm><form.SubmitButton>Save</form.SubmitButton></form.AppForm>
```

ข้อความ validation ใช้ `messages` จาก `@/lib/validation` (แปลภาษาตามภาษาปัจจุบัน)

### Auth flow

- token เก็บใน zustand (persist) — ข้อมูลผู้ใช้อยู่ใน Query cache (`currentUserQueryOptions`) ที่เดียว
- `src/routes/_authenticated/route.tsx` เป็น guard: ไม่มี token → `/login?redirect=<หน้าเดิม>`
- ได้ 401 → `apiClient` refresh token **ครั้งเดียว** แม้มีหลาย request พร้อมกัน แล้ว retry ให้
- refresh ไม่ผ่าน / กด logout → `src/app/router.tsx` ล้าง cache และพาไปหน้า login ให้เอง
- ปรับ endpoint ให้ตรง backend ที่ `features/auth/api/auth.api.ts` และ `TOKEN_REFRESH_PATH` ใน `lib/api-client.ts`

> ⚠️ token อยู่ใน localStorage (อ่านได้ถ้าเกิด XSS) — ถ้า backend รองรับ ควรย้าย refresh token เป็น httpOnly cookie

## Environment variables

| ตัวแปร               | จำเป็น | คำอธิบาย                                       |
| ------------------- | ----- | --------------------------------------------- |
| `VITE_API_URL`      | ✅    | base URL ของ API ต้องลงท้ายด้วย `/`              |
| `VITE_ENABLE_MOCKS` |       | `true` = ใช้ MSW แทน backend (มีผลเฉพาะตอน dev) |

ถ้า env ผิด แอปจะแสดงหน้าแจ้ง error แทนที่จะพังเงียบ

## Docker

```bash
docker build --build-arg VITE_API_URL=https://api.example.com/api/v1/ -t react-template .
```

```bash
docker run --rm -p 8080:80 react-template
```

ค่า `VITE_*` ถูกฝังตอน build — แต่ละ environment (dev/staging/prod) ต้อง build image แยก
health check อยู่ที่ `/healthz`

## AI agent skills

`skills-lock.json` บันทึก skill ชุดเดียวกับ rice-iot (shadcn, tanstack-form, react best practices, frontend-design ฯลฯ)
ติดตั้งด้วย:

```bash
npx skills experimental_install
```

skill เพิ่มเติมที่แนะนำสำหรับ stack นี้ (ยอดติดตั้งสูง จาก `tanstack-skills`):

```bash
npx skills add tanstack-skills/tanstack-skills@tanstack-query
```

```bash
npx skills add tanstack-skills/tanstack-skills@tanstack-router
```

## สิ่งที่ปรับปรุงจาก rice-iot

**เก็บไว้ (ดีอยู่แล้ว):** TanStack Router file-based + `_public`/`_protected` layout, global error toast ผ่าน
QueryCache/MutationCache + `meta.suppressErrorToast`, ล้าง cache ตอน logout, ตัวแปลง error ของ DRF, ปี พ.ศ.,
i18n แบบ typed, แยก vendor chunk, nginx cache header, ESLint perfectionist + unused-imports, Prettier + Tailwind plugin

| ปัญหาใน rice-iot                                                                                                               | ใน template นี้                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| refresh token ไม่ผ่าน → request ที่รอคิวอยู่ **ค้างตลอดไป** (subscriber ไม่เคยถูก reject)                                               | ใช้ promise เดียวร่วมกัน — สำเร็จ retry ทั้งหมด / ล้มเหลว reject ทั้งหมด (มี test)                |
| refresh ล้มเหลวใช้ `window.location.href = '/login'` (โหลดหน้าใหม่ทั้งแอป)                                                          | ล้าง session → router guard redirect เอง พร้อม `?redirect=` กลับหน้าเดิม                    |
| `main.tsx` ครอบ `getEnv()` ด้วย try/catch แต่ `axios.ts` เรียก `getEnv()` ตอน import → throw ก่อนถึง try → หน้า env error ไม่เคยแสดง | ตรวจ env ก่อน แล้ว dynamic import แอป — env ผิดจะเห็นหน้าแจ้งเตือนจริง                         |
| guard `_protected` ยิง `GET users/me` **ทุกครั้งที่เปลี่ยนหน้า**                                                                       | `ensureQueryData` ผ่าน cache (staleTime 5 นาที)                                          |
| ข้อมูล user เก็บซ้ำทั้งใน zustand และ API, มี flag `isAuthenticated` แยกจาก token                                                    | zustand เก็บแค่ token, user อยู่ใน Query cache, auth status derive จาก token               |
| `ThemeProvider` hard-code เป็น light (มี TODO + โค้ด comment ทิ้งไว้), sonner ใช้ `next-themes` ที่ไม่ได้ครอบไว้                          | light/dark/system ใช้งานได้จริง + กันหน้ากระพริบตอนโหลด                                      |
| `placeholderData: keepPreviousData` ตั้งเป็น global → หน้า detail อาจโชว์ข้อมูลของ id ก่อนหน้าระหว่างโหลด                               | ใช้เฉพาะ query ของตาราง; retry เฉพาะ network/5xx                                        |
| `react-query-kit` + service import `queryClient` ตรงๆ (วง import: services → react-query → routeTree → routes)                | `queryOptions` + key factory ของ TanStack Query เอง, invalidate ผ่าน `useQueryClient()` |
| `lib/form.ts` กับ field component import กันเป็นวง                                                                               | แยก `form-context.ts` ออกมา ตัดวง import                                                |
| ไม่มี `.dockerignore` → `COPY . .` เอา `node_modules` ของ macOS และ `.env.local` เข้า image                                      | มี `.dockerignore`, pnpm store cache, healthcheck, security headers                     |
| มีโฟลเดอร์ขยะชื่อ `@/app/components/ui` ที่ root — น่าจะมาจาก shadcn CLI หา alias ไม่เจอ เพราะ root `tsconfig.json` ไม่มี `paths`       | ใส่ `paths` ที่ root แล้ว                                                                  |
| shadcn component ถูกแก้มือ (สีขาว hard-code ใน sonner, ปุ่มผูกกับ constant ของโปรเจกต์) + ใช้ทั้ง radix และ base-ui                       | generate ใหม่ด้วย CLI ใช้ radix อย่างเดียว ไฟล์ที่ต้องแก้มี comment บอก                           |
| ชื่อไฟล์ปนกัน (PascalCase/kebab-case), `I` prefix, `AGENTS.md` กับ `.cursorrules` ซ้ำกัน                                             | kebab-case ทั้งหมด, ไม่มี `I` prefix, `AGENTS.md` ที่เดียว (`CLAUDE.md` ชี้มาที่นี่)                |
| ไม่มี test และห้ามเขียน test                                                                                                      | Vitest + MSW: test token refresh, login form, utils, locale keys ตรงกัน                 |
| ไม่มี CI, ESLint ไม่ type-aware                                                                                                  | GitHub Actions + `no-floating-promises` + TanStack Query/Router ESLint plugins         |
| ต้องมี backend ถึงจะรันได้                                                                                                         | `pnpm dev:mock` รันได้ทันทีด้วย MSW                                                         |
| `qs`, `react-icons`, `@radix-ui/react-slot`, `@base-ui/react` ซ้ำซ้อนกับของที่มีอยู่                                                  | ตัดออก — axios `paramsSerializer`, lucide, `radix-ui`                                   |
