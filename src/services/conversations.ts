import { storage } from './storage'
import type { Conversation, Message } from '../types'

function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export const conversationsService = {
  listByUser(userId: string): Conversation[] {
    return storage.getConversations().filter(c => c.userId === userId)
  },

  getOrCreate(userId: string, characterId: string): Conversation {
    const all = storage.getConversations()
    const found = all.find(c => c.userId === userId && c.characterId === characterId)
    if (found) return found
    const created: Conversation = {
      id: generateId('conv'),
      userId,
      characterId,
      messages: [],
      updatedAt: Date.now(),
    }
    storage.setConversations([created, ...all])
    return created
  },

  appendMessage(convId: string, msg: Message) {
    const all = storage.getConversations()
    const next = all.map(c => c.id === convId ? { ...c, messages: [...c.messages, msg], updatedAt: Date.now() } : c)
    storage.setConversations(next)
  },

  getById(convId: string): Conversation | undefined {
    return storage.getConversations().find(c => c.id === convId)
  },
}


