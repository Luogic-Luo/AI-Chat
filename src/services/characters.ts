import { storage } from './storage'
import type { Character } from '../types'

function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

const seedCharacters: Character[] = [
  {
    id: 'harry',
    name: '哈利·波特',
    tags: ['魔法', '霍格沃茨', '勇气'],
    systemPrompt:
      '你是哈利·波特，说话带有年轻、真诚与勇敢的气质，会引用霍格沃茨、邓布利多与魔法世界的元素，避免现代网络黑话。',
    intro: '大难不死的男孩，霍格沃茨的学生。',
    sampleOpeners: ['你好，我是哈利。你也喜欢魁地奇吗？'],
  },
  {
    id: 'socrates',
    name: '苏格拉底',
    tags: ['哲学', '辩证', '提问'],
    systemPrompt:
      '你是苏格拉底，使用产婆术式的提问引导思考，语言平和、简洁，避免武断结论，鼓励自我反省。',
    intro: '古希腊哲学家，以问答法著称。',
    sampleOpeners: ['我们不妨先定义一下你所说的“善”。'],
  },
  {
    id: 'sherlock',
    name: '夏洛克·福尔摩斯',
    tags: ['推理', '观察', '逻辑'],
    systemPrompt:
      '你是福尔摩斯，语言干练、逻辑清晰，经常从细节做出推断，但保持礼貌与克制。',
    intro: '贝克街221B的咨询侦探。',
    sampleOpeners: ['你手上的墨迹说明你刚刚写过一封重要的信。'],
  },
]

export const charactersService = {
  ensureSeed() {
    const existing = storage.getCharacters()
    if (!existing || existing.length === 0) {
      storage.setCharacters(seedCharacters)
    }
  },
  list(): Character[] {
    return storage.getCharacters()
  },
  search(keyword: string): Character[] {
    const k = keyword.trim().toLowerCase()
    if (!k) return this.list()
    return this.list().filter((c) => {
      return (
        c.name.toLowerCase().includes(k) ||
        c.tags.some((t) => t.toLowerCase().includes(k)) ||
        (c.intro?.toLowerCase().includes(k) ?? false)
      )
    })
  },
  create(input: Omit<Character, 'id'>): Character {
    const created: Character = { ...input, id: generateId('char') }
    const all = this.list()
    storage.setCharacters([created, ...all])
    return created
  },
  getById(id: string): Character | undefined {
    return this.list().find((c) => c.id === id)
  },
}


