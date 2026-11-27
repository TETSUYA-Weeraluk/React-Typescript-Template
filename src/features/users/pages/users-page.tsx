import type { User } from '../types'

import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { DataTablePagination } from '@/components/data-table/data-table-pagination'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'

import { usersQueryOptions } from '../api/users.queries'
import { DeleteUserDialog } from '../components/delete-user-dialog'
import { UserFormDialog } from '../components/user-form-dialog'
import { UsersSearchInput } from '../components/users-search-input'
import { UsersTable } from '../components/users-table'
import { PAGE_SIZE_OPTIONS } from '../schemas/user.schema'

// getRouteApi = ใช้ hook ของ route แบบ type-safe โดยไม่ต้อง import ไฟล์ route (กัน circular import)
const routeApi = getRouteApi('/_authenticated/users/')

export function UsersPage() {
  const { t } = useTranslation()
  const search = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const usersQuery = useQuery(usersQueryOptions(search))

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  const updateSearch = (next: Partial<typeof search>) => {
    void navigate({ search: (previous) => ({ ...previous, ...next }) })
  }

  const handleCreate = () => {
    setEditingUser(null)
    setIsFormOpen(true)
  }

  // ส่งเข้า useMemo ของ columns — ใช้ useCallback เพื่อไม่ให้ columns ถูกสร้างใหม่ทุก render
  const handleEdit = useCallback((user: User) => {
    setEditingUser(user)
    setIsFormOpen(true)
  }, [])

  const handleDelete = useCallback((user: User) => setDeletingUser(user), [])

  const handleDeleted = () => {
    // ลบคนสุดท้ายของหน้าสุดท้าย → ถอยกลับไปหน้าก่อนหน้า ไม่ให้เหลือหน้าว่าง
    const isLastRowOnPage = usersQuery.data?.data.length === 1
    if (isLastRowOnPage && search.page > 1) updateSearch({ page: search.page - 1 })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t('users.title')}
        description={t('users.description')}
        actions={
          <Button onClick={handleCreate}>
            <PlusIcon data-icon="inline-start" />
            {t('users.create')}
          </Button>
        }
      />

      <UsersSearchInput value={search.search} onChange={(value) => updateSearch({ search: value, page: 1 })} />

      <UsersTable
        users={usersQuery.data?.data ?? []}
        isLoading={usersQuery.isPending}
        isFetching={usersQuery.isPlaceholderData}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DataTablePagination
        page={search.page}
        pageSize={search.page_size}
        total={usersQuery.data?.count ?? 0}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onPageChange={(page) => updateSearch({ page })}
        onPageSizeChange={(pageSize) => updateSearch({ page_size: pageSize, page: 1 })}
      />

      <UserFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} user={editingUser} />
      <DeleteUserDialog
        user={deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
        onDeleted={handleDeleted}
      />
    </div>
  )
}
