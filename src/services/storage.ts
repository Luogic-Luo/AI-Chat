import type { User, Character, Conversation } from '../types'

const STORAGE_KEYS = {
  users: 'chatai_users',
  characters: 'chatai_characters',
  conversations: 'chatai_conversations',
  sessionUserId: 'chatai_session_user_id',
} as const

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

export const storage = {
  // Users
  getUsers(): User[] {
    return readJson<User[]>(STORAGE_KEYS.users, [])
  },
  setUsers(users: User[]) {
    writeJson(STORAGE_KEYS.users, users)
  },
  getSessionUserId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.sessionUserId)
  },
  setSessionUserId(id: string | null) {
    if (id) localStorage.setItem(STORAGE_KEYS.sessionUserId, id)
    else localStorage.removeItem(STORAGE_KEYS.sessionUserId)
  },

  // Characters
  getCharacters(): Character[] {
    return readJson<Character[]>(STORAGE_KEYS.characters, [])
  },
  setCharacters(chars: Character[]) {
    writeJson(STORAGE_KEYS.characters, chars)
  },

  // Conversations
  getConversations(): Conversation[] {
    return readJson<Conversation[]>(STORAGE_KEYS.conversations, [])
  },
  setConversations(convs: Conversation[]) {
    writeJson(STORAGE_KEYS.conversations, convs)
  },

  // Utilities
  getAllData() {
    return {
      users: this.getUsers(),
      characters: this.getCharacters(),
      conversations: this.getConversations(),
      sessionUserId: this.getSessionUserId(),
    }
  },
  clearAll() {
    localStorage.removeItem(STORAGE_KEYS.users)
    localStorage.removeItem(STORAGE_KEYS.characters)
    localStorage.removeItem(STORAGE_KEYS.conversations)
    localStorage.removeItem(STORAGE_KEYS.sessionUserId)
  },
}


