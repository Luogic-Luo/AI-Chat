import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { charactersService } from '../services/characters'

export default function Explore() {
  const [keyword, setKeyword] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    charactersService.ensureSeed()
    setReady(true)
  }, [])

  const list = useMemo(() => {
    return ready ? charactersService.search(keyword) : []
  }, [keyword, ready])

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold">探索角色</h1>
      <div className="mt-4">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜索名字 / 标签 / 简介"
          className="w-full max-w-xl rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 outline-none"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <Link key={c.id} to={`/character/${c.id}`} className="group rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30" />
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-xs text-gray-500">{c.tags.join(' · ')}</div>
              </div>
            </div>
            {c.intro && <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{c.intro}</p>}
          </Link>
        ))}
      </div>
    </div>
  )
}


