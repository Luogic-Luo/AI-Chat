import type { Character, Message } from '../types'
import { qiniuChatStream, qiniuChatOnce } from './llm'

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function buildStylePrefix(character: Character): string {
  const name = character.name
  const tagLine = character.tags?.length ? `（${character.tags.slice(0, 3).join(' / ')}）` : ''
  return `${name}${tagLine}`
}

export const aiResponder = {
  async generateReply(character: Character, context: Message[], userText: string): Promise<string> {
    const prefix = buildStylePrefix(character)
    const styleHints = [
      '请你用简洁的口吻作答。',
      '请在末尾给出一个可继续对话的问题。',
      '避免使用现代网络流行语。',
    ]

    const last2 = context.slice(-2).map(m => `${m.role === 'user' ? '用户' : '你'}：${m.content}`).join(' ')
    const openers = character.sampleOpeners ?? []
    const base = openers.length && context.length < 2 ? openers[0] : ''

    const templates = [
      `${prefix}：我理解你的意思是“${userText}”。${base ? base + ' ' : ''}不妨从一个更具体的方面开始谈起？`,
      `${prefix}：关于“${userText}”，让我想起${character.tags?.[0] ?? '相关的话题'}。你怎么看？`,
      `${prefix}：基于刚才的对话（${last2 || '无'}），我有两个思路可以提供，你更关心哪一个？`,
    ]

    const picked = pick(templates)
    const hint = pick(styleHints)
    const reply = `${picked} ${hint}`

    await new Promise(r => setTimeout(r, 300))
    return reply
  },
  async generateReplyViaLLM(character: Character, context: Message[], userText: string, streamCb?: (delta: string) => void): Promise<string> {
    const system: Message = { id: 'sys', role: 'system', content: character.systemPrompt, timestamp: Date.now() }
    const history = [...context.slice(-8)]
    const input: Message = { id: 'u', role: 'user', content: userText, timestamp: Date.now() }

    if (streamCb) {
      let full = ''
      for await (const delta of qiniuChatStream([system, ...history, input])) {
        full += delta
        streamCb(delta)
      }
      return full
    }
    return await qiniuChatOnce([system, ...history, input])
  },
}


