import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen px-6 py-10">
      <h1 className="text-2xl font-bold">页面未找到</h1>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">你访问的页面不存在。</p>
      <Link className="mt-6 inline-block text-blue-600 hover:underline" to="/">返回首页</Link>
    </div>
  )
}


