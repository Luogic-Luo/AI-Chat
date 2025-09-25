import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="py-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">和你喜欢的角色，随时开聊</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">搜索历史人物或上传你的提示词，立即开始角色扮演式对话。</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/explore" className="rounded-md bg-blue-600 px-5 py-2 text-white">探索角色</Link>
          <Link to="/create" className="rounded-md border px-5 py-2">创建角色</Link>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link to="/character/harry" className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
          <div className="text-lg font-semibold">哈利·波特</div>
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">勇气与魔法的世界</div>
        </Link>
        <Link to="/character/socrates" className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
          <div className="text-lg font-semibold">苏格拉底</div>
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">用问题引导思考</div>
        </Link>
        <Link to="/character/sherlock" className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
          <div className="text-lg font-semibold">福尔摩斯</div>
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">细节推理与洞察</div>
        </Link>
      </div>
    </div>
  )
}


