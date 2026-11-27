import { authHandlers } from './auth'
import { userHandlers } from './users'

// ลำดับมีผล: handler ที่ path เฉพาะกว่า (users/stats/) ต้องอยู่ก่อน path ที่มี param (users/:id/)
export const handlers = [...authHandlers, ...userHandlers]
