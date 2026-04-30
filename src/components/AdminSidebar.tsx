import { Link } from 'react-router-dom'

interface AdminSidebarProps {
  activePath: string
}

const navItems = [
  { path: '/admin', label: '仪表盘' },
  { path: '/admin/articles', label: '文章管理' },
  { path: '/admin/categories', label: '分类管理' },
  { path: '/admin/tags', label: '标签管理' },
  { path: '/admin/comments', label: '评论管理' },
  { path: '/admin/settings', label: '站点设置' },
  { path: '/admin/profile', label: '个人信息' },
]

export default function AdminSidebar({ activePath }: AdminSidebarProps) {
  return (
    <aside className="w-56 bg-gray-900 text-gray-300 min-h-screen p-4">
      <div className="text-white font-bold text-lg mb-6 px-3">后台管理</div>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-3 py-2 rounded text-sm transition-colors ${
              activePath === item.path
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-800 hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8 px-3">
        <Link to="/" className="text-xs text-gray-500 hover:text-white transition-colors">
          &larr; 返回前台
        </Link>
      </div>
    </aside>
  )
}
