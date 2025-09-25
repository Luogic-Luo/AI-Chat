import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { charactersService } from '../services/characters'

export default function CreateCharacter() {
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [tags, setTags] = useState('')
  const [prompt, setPrompt] = useState('')
  const [intro, setIntro] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!name.trim() || !prompt.trim()) {
      setError('名称与系统提示词必填')
      return
    }
    const created = charactersService.create({
      name: name.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      systemPrompt: prompt.trim(),
      intro: intro.trim(),
      sampleOpeners: [],
    })
    nav(`/character/${created.id}`)
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <h1 className="text-2xl font-bold">创建角色</h1>
      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="名称" className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" />
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="标签（用英文逗号分隔）" className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" />
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="系统提示词（用于性格设定）" className="h-40 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" />
        <textarea value={intro} onChange={(e) => setIntro(e.target.value)} placeholder="简介（可选）" className="h-24 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button className="rounded-md bg-blue-600 px-4 py-2 text-white">创建</button>
      </form>
    </div>
  )
}


