import { Link, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { auth } from '../services/auth'

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = auth.currentUser()
  const [dark, setDark] = useState<boolean>(() => localStorage.getItem('chatai_theme') === 'dark')

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('chatai_theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('chatai_theme', 'light')
    }
  }, [dark])
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <header className="sticky top-0 z-10 border-b border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-bold">ChatAI</Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/explore" className={({isActive}) => isActive ? 'text-blue-600' : 'hover:text-blue-600'}>探索</NavLink>
            <NavLink to="/create" className={({isActive}) => isActive ? 'text-blue-600' : 'hover:text-blue-600'}>创建角色</NavLink>
            {user ? (
              <NavLink to="/me" className={({isActive}) => isActive ? 'text-blue-600' : 'hover:text-blue-600'}>我的</NavLink>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink to="/login" className={({isActive}) => isActive ? 'text-blue-600' : 'hover:text-blue-600'}>登录</NavLink>
                <NavLink to="/register" className={({isActive}) => isActive ? 'text-blue-600' : 'hover:text-blue-600'}>注册</NavLink>
              </div>
            )}
            <button onClick={() => setDark(v => !v)} className="ml-2 rounded-md border px-2 py-1 text-xs">
              {dark ? '浅色' : '深色'}
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        {children}
      </main>
      <footer className="mx-auto max-w-6xl px-4 py-8 text-xs text-gray-500">
        © 2025 ChatAI Demo
      </footer>
    </div>
  )
}


