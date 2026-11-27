import { createFileRoute, stripSearchParams } from '@tanstack/react-router'

import { usersQueryOptions } from '@/features/users/api/users.queries'
import { UsersPage } from '@/features/users/pages/users-page'
import { usersSearchSchema } from '@/features/users/schemas/user.schema'

const defaultSearch = usersSearchSchema.parse({})

export const Route = createFileRoute('/_authenticated/users/')({
  validateSearch: usersSearchSchema,
  // ค่า default ไม่ต้องโชว์ใน URL (/users แทน /users?page=1&page_size=10&search=)
  search: { middlewares: [stripSearchParams(defaultSearch)] },
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => {
    // ไม่ await — ให้หน้าแสดงทันทีพร้อม skeleton/ข้อมูลเดิม แทนการค้างรอ API
    void context.queryClient.prefetchQuery(usersQueryOptions(deps))
  },
  head: () => ({ meta: [{ title: 'Users · React Template' }] }),
  component: UsersPage,
})
