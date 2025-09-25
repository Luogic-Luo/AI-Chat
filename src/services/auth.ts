import { storage } from './storage'
import type { User } from '../types'

function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

function simpleHash(text: string) {
  // 非安全，仅作本地演示
  let h = 0
  for (let i = 0; i < text.length; i++) h = (h << 5) - h + text.charCodeAt(i)
  return String(h >>> 0)
}

export const auth = {
  currentUser(): User | null {
    const id = storage.getSessionUserId()
    if (!id) return null
    return storage.getUsers().find((u) => u.id === id) ?? null
  },
  register(email: string, password: string): User {
    const users = storage.getUsers()
    if (users.some((u) => u.email === email)) {
      throw new Error('邮箱已被注册')
    }
    const user: User = { id: generateId('user'), email, passwordHash: simpleHash(password) }
    storage.setUsers([user, ...users])
    storage.setSessionUserId(user.id)
    return user
  },
  login(email: string, password: string): User {
    const users = storage.getUsers()
    const found = users.find((u) => u.email === email && u.passwordHash === simpleHash(password))
    if (!found) throw new Error('邮箱或密码错误')
    storage.setSessionUserId(found.id)
    return found
  },
  logout() {
    storage.setSessionUserId(null)
  },
}


