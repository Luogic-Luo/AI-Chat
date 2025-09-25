import { llmConfig } from './config'
import type { Message } from '../types'

export type ChatChoiceDelta = {
  content?: string
}

export async function* qiniuChatStream(messages: Message[]) {
  const cfg = llmConfig.get()
  const url = cfg.baseUrl.replace(/\/$/, '') + '/chat/completions'
  const payload = {
    model: cfg.model,
    stream: true,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok || !res.body) {
    throw new Error('LLM 调用失败')
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) continue
      const data = trimmed.slice(5).trim()
      if (data === '[DONE]') return
      try {
        const json = JSON.parse(data)
        const delta = json.choices?.[0]?.delta?.content as string | undefined
        if (delta) yield delta as string
      } catch {
        // ignore
      }
    }
  }
}

export async function qiniuChatOnce(messages: Message[]): Promise<string> {
  const cfg = llmConfig.get()
  const url = cfg.baseUrl.replace(/\/$/, '') + '/chat/completions'
  const payload = {
    model: cfg.model,
    stream: false,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('LLM 调用失败')
  const json = await res.json()
  return json.choices?.[0]?.message?.content ?? ''
}

export async function listModels(): Promise<string[]> {
  const cfg = llmConfig.get()
  const url = cfg.baseUrl.replace(/\/$/, '') + '/models'
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${cfg.apiKey}`,
    },
  })
  if (!res.ok) throw new Error('获取模型列表失败')
  const json = await res.json()
  const ids = (json.data || []).map((m: any) => m.id).filter(Boolean)
  return ids
}


