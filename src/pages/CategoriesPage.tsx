import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Category } from '../types'
import { getCategories } from '../services'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'

type AsyncState = 'loading' | 'empty' | 'error' | 'ready'

export default function CategoriesPage() {
  const [state, setState] = useState<AsyncState>('loading')
  const [categories, setCategories] = useState<Category[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  const fetchData = async () => {
    setState('loading')
    try {
      const res = await getCategories()
      if (res.code === 200) {
        if (res.data.length === 0) {
          setState('empty')
        } else {
          setCategories(res.data)
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

  if (state === 'loading') return <LoadingSpinner />
  if (state === 'error') return <ErrorState message={errorMsg} onRetry={fetchData} />
  if (state === 'empty') return <EmptyState message="暂无分类" />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">全部分类</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/?categoryId=${cat.id}`}
            className="block bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition-all"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-1">{cat.name}</h2>
            <p className="text-sm text-gray-500 mb-2">{cat.description}</p>
            <span className="text-xs text-blue-600">{cat.articleCount} 篇文章</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
