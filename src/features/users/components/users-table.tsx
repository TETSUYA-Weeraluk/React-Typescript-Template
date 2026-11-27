import type { User } from '../types'
import type { ColumnDef } from '@tanstack/react-table'

import { Link } from '@tanstack/react-router'
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { DataTable } from '@/components/data-table/data-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDate } from '@/lib/format'

import { UserRoleBadge, UserStatusBadge } from './user-badges'

interface UsersTableProps {
  users: User[]
  isLoading: boolean
  isFetching: boolean
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export function UsersTable({ users, isLoading, isFetching, onEdit, onDelete }: UsersTableProps) {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'name',
        header: t('users.fields.name'),
        cell: ({ row }) => (
          <div className="flex min-w-0 flex-col">
            <Link
              to="/users/$userId"
              params={{ userId: row.original.id }}
              className="truncate font-medium hover:underline"
            >
              {row.original.name}
            </Link>
            <span className="truncate text-xs text-muted-foreground">{row.original.email}</span>
          </div>
        ),
      },
      {
        accessorKey: 'role',
        header: t('users.fields.role'),
        cell: ({ row }) => <UserRoleBadge role={row.original.role} />,
      },
      {
        accessorKey: 'is_active',
        header: t('users.fields.status'),
        cell: ({ row }) => <UserStatusBadge isActive={row.original.is_active} />,
      },
      {
        accessorKey: 'created_at',
        header: t('users.fields.created_at'),
        meta: { className: 'hidden md:table-cell' },
        cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.created_at)}</span>,
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">{t('common.actions')}</span>,
        meta: { align: 'right', className: 'w-12' },
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label={`${t('common.actions')}: ${row.original.name}`}>
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onEdit(row.original)}>
                <PencilIcon />
                {t('common.edit')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => onDelete(row.original)}>
                <Trash2Icon />
                {t('common.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [t, onEdit, onDelete]
  )

  return (
    <DataTable
      columns={columns}
      data={users}
      isLoading={isLoading}
      isFetching={isFetching}
      getRowId={(user) => user.id}
    />
  )
}
