import { Link } from 'react-router-dom'
import { useState } from 'react'

interface HeaderProps {
  siteName: string
  onSearch: (keyword: string) => void
}

export default function Header({ siteName, onSearch }: HeaderProps) {
  const [keyword, setKeyword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(keyword)
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
          {siteName}
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">首页</Link>
          <Link to="/categories" className="text-gray-600 hover:text-blue-600 transition-colors">分类</Link>
          <Link to="/tags" className="text-gray-600 hover:text-blue-600 transition-colors">标签</Link>
          <Link to="/archive" className="text-gray-600 hover:text-blue-600 transition-colors">归档</Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">关于</Link>
        </nav>

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索文章..."
            className="w-48 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            搜索
          </button>
        </form>
      </div>
    </header>
  )
}
