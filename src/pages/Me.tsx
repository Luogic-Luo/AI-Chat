import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../services/auth'
import { conversationsService } from '../services/conversations'
import { storage } from '../services/storage'
import { llmConfig, defaultConfig } from '../services/config'
import { listModels } from '../services/llm'

export default function Me() {
  const nav = useNavigate()
  const user = auth.currentUser()
  const [_, setTick] = useState(0)
  const convs = useMemo(() => (user ? conversationsService.listByUser(user.id) : []), [user, _])

  if (!user) {
    return (
      <div className="min-h-screen px-6 py-10">
        <h1 className="text-2xl font-bold">未登录</h1>
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">请先登录以查看你的会话与角色。</div>
        <div className="mt-4 flex gap-3">
          <Link className="rounded-md bg-blue-600 px-4 py-2 text-white" to="/login">去登录</Link>
          <Link className="rounded-md border px-4 py-2" to="/register">去注册</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">我的</h1>
        <div className="flex items-center gap-3">
          <button className="text-xs rounded-md border px-3 py-1" onClick={() => {
            const data = storage.getAllData()
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'chatai-data.json'
            a.click()
            URL.revokeObjectURL(url)
          }}>导出数据</button>
          <button className="text-xs rounded-md border px-3 py-1" onClick={() => {
            if (confirm('确定清空本地数据？该操作不可恢复')) {
              storage.clearAll(); location.href = '/'
            }
          }}>清空数据</button>
          <button className="text-sm text-red-600" onClick={() => { auth.logout(); nav('/'); }}>退出登录</button>
        </div>
      </div>
      <div className="mt-6 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div className="text-sm font-semibold">LLM 配置（七牛 OpenAI 兼容）</div>
        <LlmConfigForm />
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">我的会话</h2>
        <div className="mt-3 space-y-2">
          {convs.length === 0 && <div className="text-sm text-gray-500">暂无会话</div>}
          {convs.map(c => (
            <div key={c.id} className="rounded-lg border border-gray-200 dark:border-gray-800 p-3 text-sm">
              <div className="text-gray-500">角色 ID：{c.characterId}</div>
              <div className="text-gray-500">消息数：{c.messages.length}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold">我的角色</h2>
        <Link to="/create" className="mt-2 inline-block text-blue-600">去创建一个角色</Link>
      </div>
    </div>
  )
}

function LlmConfigForm() {
  const [baseUrl, setBaseUrl] = useState(llmConfig.get().baseUrl)
  const [apiKey, setApiKey] = useState(llmConfig.get().apiKey)
  const [model, setModel] = useState(llmConfig.get().model)
  const [saved, setSaved] = useState(false)
  const [models, setModels] = useState<string[] | null>(null)
  const [loading, setLoading] = useState(false)

  function save() {
    llmConfig.set({ baseUrl, apiKey, model })
    setSaved(true)
    setTimeout(() => setSaved(false), 1200)
  }

  function resetDefault() {
    llmConfig.set(defaultConfig)
    setBaseUrl(defaultConfig.baseUrl)
    setApiKey(defaultConfig.apiKey)
    setModel(defaultConfig.model)
  }

  async function fetchModels() {
    setLoading(true)
    try {
      const ids = await listModels()
      setModels(ids)
    } catch (e) {
      alert('获取模型失败，请检查 Base URL 与 API Key')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
      <input className="rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm" placeholder="Base URL" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
      <input className="rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm" placeholder="API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
      {models ? (
        <select className="rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm" value={model} onChange={(e) => setModel(e.target.value)}>
          {models.map(id => (<option key={id} value={id}>{id}</option>))}
        </select>
      ) : (
        <input className="rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm" placeholder="Model (如 deepseek-v3)" value={model} onChange={(e) => setModel(e.target.value)} />
      )}
      <div className="col-span-full flex items-center gap-3">
        <button className="rounded-md bg-blue-600 px-4 py-2 text-white text-sm" onClick={save}>保存</button>
        <button className="rounded-md border px-4 py-2 text-sm" onClick={fetchModels} disabled={loading}>{loading ? '拉取中...' : '拉取模型'}</button>
        <button className="rounded-md border px-4 py-2 text-sm" onClick={resetDefault}>恢复默认</button>
        {saved && <span className="text-xs text-green-600">已保存</span>}
      </div>
      <div className="col-span-full text-xs text-gray-500">
        参考七牛文档：<a className="text-blue-600" href="https://developer.qiniu.com/aitokenapi/12882/ai-inference-api" target="_blank">AI 大模型推理 API</a>
      </div>
    </div>
  )
}


