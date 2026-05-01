import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ArticleSummary, PaginatedList } from '../../types'
import { getAdminArticles, deleteArticle } from '../../services'
import LoadingSpinner from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'

type AsyncState = 'loading' | 'empty' | 'error' | 'ready'

const statusLabel: Record<string, { text: string; cls: string }> = {
  draft: { text: '草稿', cls: 'bg-gray-100 text-gray-600' },
  published: { text: '已发布', cls: 'bg-green-100 text-green-700' },
  archived: { text: '已归档', cls: 'bg-yellow-100 text-yellow-700' },
}

export default function ArticleListPage() {
  const [state, setState] = useState<AsyncState>('loading')
  const [data, setData] = useState<PaginatedList<ArticleSummary> | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const fetchData = async () => {
    setState('loading')
    try {
      const res = await getAdminArticles({ page: 1, pageSize: 20 })
      if (res.code === 200) {
        if (res.data.items.length === 0) {
          setState('empty')
        } else {
          setData(res.data)
          setState('ready')
        }
      } else {
        setErrorMsg(res.message)
        setState('error')
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : '加载失败')
      setState('error')
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除这篇文章吗？')) return
    try {
      const res = await deleteArticle(id)
      if (res.code === 200) {
        fetchData()
      }
    } catch {
      alert('删除失败')
    }
  }

  if (state === 'loading') return <LoadingSpinner />
  if (state === 'error') return <ErrorState message={errorMsg} onRetry={fetchData} />
  if (state === 'empty') return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">文章管理</h1>
        <Link to="/admin/articles/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
          新建文章
        </Link>
      </div>
      <EmptyState message="暂无文章" />
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">文章管理</h1>
        <Link to="/admin/articles/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
          新建文章
        </Link>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">标题</th>
              <th className="text-left px-4 py-3 font-medium w-20">状态</th>
              <th className="text-left px-4 py-3 font-medium w-20">阅读</th>
              <th className="text-left px-4 py-3 font-medium w-32">创建时间</th>
              <th className="text-right px-4 py-3 font-medium w-32">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data!.items.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link to={`/article/${article.slug}`} className="text-gray-900 hover:text-blue-600" target="_blank">
                    {article.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${statusLabel[article.status]?.cls}`}>
                    {statusLabel[article.status]?.text}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{article.viewCount}</td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(article.createdAt).toLocaleDateString('zh-CN')}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link to={`/admin/articles/${article.id}`} className="text-blue-600 hover:underline text-xs">编辑</Link>
                  <button onClick={() => handleDelete(article.id)} className="text-red-600 hover:underline text-xs">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
