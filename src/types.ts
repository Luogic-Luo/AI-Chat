export type User = {
  id: string
  email: string
  passwordHash: string
}

export type Character = {
  id: string
  name: string
  avatarUrl?: string
  tags: string[]
  systemPrompt: string
  style?: string
  intro?: string
  sampleOpeners?: string[]
}

export type Message = {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

export type Conversation = {
  id: string
  userId: string
  characterId: string
  messages: Message[]
  updatedAt: number
}


