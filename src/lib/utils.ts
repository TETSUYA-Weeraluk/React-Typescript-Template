// shadcn รุ่นใหม่ใช้ package `cn` (ของทีม shadcn) แทน clsx + tailwind-merge — เร็วกว่าและ API เหมือนเดิม
// คงไฟล์นี้ไว้เพราะ components.json ชี้ alias "utils" มาที่นี่ และโค้ดเก่าที่ import จาก '@/lib/utils' ยังใช้ได้
export { cn } from 'cn'
