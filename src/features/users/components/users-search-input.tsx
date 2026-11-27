import { SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { useDebouncedValue } from '@/hooks/use-debounced-value'

interface UsersSearchInputProps {
  value: string
  onChange: (value: string) => void
}

/** ช่องค้นหาที่พิมพ์ได้ลื่น (state ภายใน) แต่ส่งค่าออกไปเมื่อหยุดพิมพ์ 300ms */
export function UsersSearchInput({ value, onChange }: UsersSearchInputProps) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState(value)
  const debouncedDraft = useDebouncedValue(draft, 300)

  useEffect(() => {
    if (debouncedDraft !== value) onChange(debouncedDraft)
    // ตั้งใจไม่ใส่ value/onChange: ยิงเฉพาะตอนผู้ใช้พิมพ์ ไม่ใช่ตอน URL เปลี่ยนจากที่อื่น
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDraft])

  return (
    <InputGroup className="sm:max-w-xs">
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={t('users.search_placeholder')}
        aria-label={t('common.search')}
      />
    </InputGroup>
  )
}
