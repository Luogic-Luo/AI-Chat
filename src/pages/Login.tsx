import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { auth } from '../services/auth'

export default function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      auth.login(email.trim(), password)
      nav('/me')
    } catch (e: any) {
      setError(e?.message ?? '登录失败')
    }
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <h1 className="text-2xl font-bold">登录</h1>
      <form onSubmit={handleSubmit} className="mt-6 max-w-sm space-y-4">
        <input className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" placeholder="邮箱" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" placeholder="密码" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button className="rounded-md bg-blue-600 px-4 py-2 text-white">登录</button>
      </form>
      <div className="mt-3 text-sm text-gray-500">
        没有账号？<Link to="/register" className="text-blue-600">去注册</Link>
      </div>
    </div>
  )
}


