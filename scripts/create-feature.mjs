#!/usr/bin/env node
/**
 * สร้างโครง feature ใหม่ตาม convention ของ template
 *
 *   pnpm gen:feature products
 *
 * ได้ไฟล์:
 *   src/features/products/types.ts
 *   src/features/products/api/products.api.ts
 *   src/features/products/api/products.queries.ts
 *
 * ไม่เขียนทับไฟล์ที่มีอยู่แล้ว
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const name = process.argv[2]

if (!name || !/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name)) {
  console.error('❌ ระบุชื่อ feature แบบ kebab-case เช่น: pnpm gen:feature work-orders')
  process.exit(1)
}

const toPascalCase = (value) =>
  value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

const Pascal = toPascalCase(name)
const camel = Pascal.charAt(0).toLowerCase() + Pascal.slice(1)
// ชื่อเอกพจน์แบบง่ายสำหรับ type (products → Product) — แก้เองได้ถ้าไม่ตรง
const Entity = Pascal.endsWith('s') ? Pascal.slice(0, -1) : Pascal

const featureDir = path.join(process.cwd(), 'src', 'features', name)

const files = {
  'types.ts': `export interface ${Entity} {
  id: string
  name: string
  created_at: string
}

export type Create${Entity}Request = Pick<${Entity}, 'name'>

export type Update${Entity}Request = Partial<Create${Entity}Request>
`,

  [`api/${name}.api.ts`]: `import type { Create${Entity}Request, ${Entity}, Update${Entity}Request } from '../types'
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api'

import { apiClient } from '@/lib/api-client'

const BASE_PATH = '${name}/'

export const get${Pascal} = async (params: PaginationParams): Promise<PaginatedResponse<${Entity}>> => {
  const { data } = await apiClient.get<PaginatedResponse<${Entity}>>(BASE_PATH, {
    params: { ...params, search: params.search || undefined },
  })
  return data
}

export const get${Entity} = async (id: string): Promise<${Entity}> => {
  const { data } = await apiClient.get<ApiResponse<${Entity}>>(\`\${BASE_PATH}\${encodeURIComponent(id)}/\`)
  return data.data
}

export const create${Entity} = async (body: Create${Entity}Request): Promise<${Entity}> => {
  const { data } = await apiClient.post<ApiResponse<${Entity}>>(BASE_PATH, body)
  return data.data
}

export const update${Entity} = async ({ id, body }: { id: string; body: Update${Entity}Request }): Promise<${Entity}> => {
  const { data } = await apiClient.patch<ApiResponse<${Entity}>>(\`\${BASE_PATH}\${encodeURIComponent(id)}/\`, body)
  return data.data
}

export const delete${Entity} = async (id: string): Promise<void> => {
  await apiClient.delete(\`\${BASE_PATH}\${encodeURIComponent(id)}/\`)
}
`,

  [`api/${name}.queries.ts`]: `import type { PaginationParams } from '@/types/api'

import { keepPreviousData, queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { create${Entity}, delete${Entity}, get${Entity}, get${Pascal}, update${Entity} } from './${name}.api'

export const ${camel}Keys = {
  all: ['${name}'] as const,
  lists: () => [...${camel}Keys.all, 'list'] as const,
  list: (params: PaginationParams) => [...${camel}Keys.lists(), params] as const,
  details: () => [...${camel}Keys.all, 'detail'] as const,
  detail: (id: string) => [...${camel}Keys.details(), id] as const,
}

export const ${camel}QueryOptions = (params: PaginationParams) =>
  queryOptions({
    queryKey: ${camel}Keys.list(params),
    queryFn: () => get${Pascal}(params),
    placeholderData: keepPreviousData,
  })

export const ${Entity.charAt(0).toLowerCase() + Entity.slice(1)}QueryOptions = (id: string) =>
  queryOptions({
    queryKey: ${camel}Keys.detail(id),
    queryFn: () => get${Entity}(id),
  })

export const useCreate${Entity} = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: create${Entity},
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ${camel}Keys.lists() }),
  })
}

export const useUpdate${Entity} = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: update${Entity},
    onSuccess: async (updated) => {
      queryClient.setQueryData(${camel}Keys.detail(updated.id), updated)
      await queryClient.invalidateQueries({ queryKey: ${camel}Keys.lists() })
    },
  })
}

export const useDelete${Entity} = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: delete${Entity},
    onSuccess: async (_data, id) => {
      queryClient.removeQueries({ queryKey: ${camel}Keys.detail(id) })
      await queryClient.invalidateQueries({ queryKey: ${camel}Keys.lists() })
    },
  })
}
`,
}

const created = []

for (const [relativePath, content] of Object.entries(files)) {
  const filePath = path.join(featureDir, relativePath)

  if (fs.existsSync(filePath)) {
    console.warn(`⚠️  ข้าม (มีอยู่แล้ว): ${path.relative(process.cwd(), filePath)}`)
    continue
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content)
  created.push(filePath)
  console.info(`✅ สร้าง: ${path.relative(process.cwd(), filePath)}`)
}

if (created.length > 0) {
  try {
    execFileSync('pnpm', ['exec', 'prettier', '--write', ...created], { stdio: 'ignore' })
  } catch {
    console.warn('⚠️  format ไม่สำเร็จ — รัน pnpm format เองอีกครั้ง')
  }
}

console.info(`
🎉 เสร็จแล้ว ขั้นต่อไป:
  1. แก้ type ใน src/features/${name}/types.ts ให้ตรงกับ API จริง
  2. สร้างหน้าใน src/features/${name}/pages/ แล้วเพิ่ม route ใน src/routes/_authenticated/${name}/
  3. เพิ่มเมนูใน src/config/navigation.ts และคำแปลใน src/locales/*.json
`)
