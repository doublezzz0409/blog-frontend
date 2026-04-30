import { Link } from 'react-router-dom'
import type { Category, Tag } from '../types'

interface SidebarProps {
  categories: Category[]
  tags: Tag[]
  activeCategoryId?: string
  activeTagId?: string
}

export default function Sidebar({ categories, tags, activeCategoryId, activeTagId }: SidebarProps) {
  return (
    <aside className="w-64 shrink-0 space-y-6">
      {/* 分类 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">分类</h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                to={`/?categoryId=${cat.id}`}
                className={`flex items-center justify-between text-sm px-2 py-1 rounded transition-colors ${
                  activeCategoryId === cat.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-xs text-gray-400">{cat.articleCount}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 标签云 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">标签</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              to={`/?tagId=${tag.id}`}
              className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                activeTagId === tag.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}
