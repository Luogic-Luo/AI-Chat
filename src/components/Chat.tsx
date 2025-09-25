import { useEffect, useMemo, useRef, useState } from 'react'
import type { Character, Message } from '../types'
import { conversationsService } from '../services/conversations'
import { aiResponder } from '../services/aiResponder'
import { tts } from '../services/tts'

type Props = {
  character: Character
  userId?: string // 未登录用匿名占位
}

export default function Chat({ character, userId }: Props) {
  const effectiveUserId = userId ?? 'anonymous'
  const conv = useMemo(() => conversationsService.getOrCreate(effectiveUserId, character.id), [effectiveUserId, character.id])
  const [messages, setMessages] = useState<Message[]>(conv.messages)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [recording, setRecording] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages(conversationsService.getById(conv.id)?.messages ?? [])
  }, [conv.id])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages])

  async function handleSend() {
    const text = input.trim()
    if (!text || sending) return
    setSending(true)

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text, timestamp: Date.now() }
    conversationsService.appendMessage(conv.id, userMsg)
    const nextMsgs = [...messages, userMsg]
    setMessages(nextMsgs)
    setInput('')

    // 使用 LLM 流式生成（如配置缺失则回退本地规则）
    const botId = crypto.randomUUID()
    const botEmpty: Message = { id: botId, role: 'assistant', content: '', timestamp: Date.now() }
    conversationsService.appendMessage(conv.id, botEmpty)
    setMessages((prev) => [...prev, botEmpty])

    try {
      let full = ''
      full = await aiResponder.generateReplyViaLLM(
        character,
        nextMsgs,
        text,
        (delta) => {
          setMessages((prev) => prev.map(m => m.id === botId ? { ...m, content: (m.content + delta) } : m))
        }
      )
      const finalMsg: Message = { id: botId, role: 'assistant', content: full, timestamp: Date.now() }
      conversationsService.appendMessage(conv.id, finalMsg)
      setMessages((prev) => prev.map(m => m.id === botId ? finalMsg : m))
    } catch {
      const replyText = await aiResponder.generateReply(character, nextMsgs, text)
      const finalMsg: Message = { id: botId, role: 'assistant', content: replyText, timestamp: Date.now() }
      conversationsService.appendMessage(conv.id, finalMsg)
      setMessages((prev) => prev.map(m => m.id === botId ? finalMsg : m))
    } finally {
      setSending(false)
    }
  }

  async function regenerateLast() {
    if (sending) return
    const lastUser = [...messages].reverse().find(m => m.role === 'user')
    if (!lastUser) return
    setSending(true)
    // 删除最后一个 assistant 消息（如果存在）
    const trimmed = messages[messages.length - 1]?.role === 'assistant' ? messages.slice(0, -1) : messages
    setMessages(trimmed)
    const botId = crypto.randomUUID()
    const botEmpty: Message = { id: botId, role: 'assistant', content: '', timestamp: Date.now() }
    conversationsService.appendMessage(conv.id, botEmpty)
    setMessages((prev) => [...prev, botEmpty])
    try {
      let full = ''
      full = await aiResponder.generateReplyViaLLM(
        character,
        trimmed,
        lastUser.content,
        (delta) => {
          setMessages((prev) => prev.map(m => m.id === botId ? { ...m, content: (m.content + delta) } : m))
        }
      )
      const finalMsg: Message = { id: botId, role: 'assistant', content: full, timestamp: Date.now() }
      conversationsService.appendMessage(conv.id, finalMsg)
      setMessages((prev) => prev.map(m => m.id === botId ? finalMsg : m))
    } catch {
      const replyText = await aiResponder.generateReply(character, trimmed, lastUser.content)
      const finalMsg: Message = { id: botId, role: 'assistant', content: replyText, timestamp: Date.now() }
      conversationsService.appendMessage(conv.id, finalMsg)
      setMessages((prev) => prev.map(m => m.id === botId ? finalMsg : m))
    } finally {
      setSending(false)
    }
  }

  function playLast() {
    const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant')
    if (lastAssistant && lastAssistant.content) {
      tts.speak(lastAssistant.content)
    }
  }

  function startRecord() {
    const WSR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!WSR) return
    const rec = new WSR()
    rec.lang = 'zh-CN'
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onstart = () => setRecording(true)
    rec.onerror = () => setRecording(false)
    rec.onend = () => setRecording(false)
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript
      setInput(text)
    }
    rec.start()
  }

  return (
    <div className="flex h-[70vh] flex-col rounded-lg border border-gray-200 dark:border-gray-800">
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(m => (
          <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <div className={`inline-block max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center text-sm text-gray-500">和 {character.name} 打个招呼吧～</div>
        )}
        {sending && (
          <div className="text-left">
            <div className="inline-block max-w-[80%] rounded-2xl px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-500">
              对方正在输入…
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800 p-3">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
            placeholder={`给 ${character.name} 发消息...`}
            className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 outline-none"
          />
          <button onClick={handleSend} disabled={sending || !input.trim()} className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50">
            发送
          </button>
          <button onClick={startRecord} className={`rounded-md border px-3 py-2 text-sm ${recording ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700' : ''}`}>
            语音
          </button>
          <button onClick={() => tts.stop()} className="rounded-md border px-3 py-2 text-sm">停止朗读</button>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
          <button onClick={regenerateLast} className="flex items-center gap-1 rounded-md border px-2 py-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12a9 9 0 1 1-2.64-6.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 3v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            重新生成
          </button>
          <button onClick={playLast} className="flex items-center gap-1 rounded-md border px-2 py-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5v14l11-7-11-7z" fill="currentColor"/>
            </svg>
            播放对话
          </button>
        </div>
      </div>
    </div>
  )
}


