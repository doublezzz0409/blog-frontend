import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { ArticleSummary, PaginatedList } from '../types'
import { getArticles } from '../services'
import ArticleCard from '../components/ArticleCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'

type AsyncState = 'loading' | 'empty' | 'error' | 'ready'

export default function HomePage() {
  const [searchParams] = useSearchParams()
  const categoryId = searchParams.get('categoryId') || undefined
  const tagId = searchParams.get('tagId') || undefined
  const keyword = searchParams.get('keyword') || undefined

  const [state, setState] = useState<AsyncState>('loading')
  const [data, setData] = useState<PaginatedList<ArticleSummary> | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const fetchData = async () => {
    setState('loading')
    try {
      const res = await getArticles({ page: 1, pageSize: 10, categoryId, tagId, keyword })
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

  useEffect(() => {
    fetchData()
  }, [categoryId, tagId, keyword])

  if (state === 'loading') return <LoadingSpinner />
  if (state === 'error') return <ErrorState message={errorMsg} onRetry={fetchData} />
  if (state === 'empty') return <EmptyState message="暂无文章" />

  return (
    <div className="space-y-6">
      {keyword && (
        <p className="text-sm text-gray-500">
          搜索 "<span className="font-medium text-gray-700">{keyword}</span>" 的结果，
          共 {data!.pagination.total} 篇
        </p>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        {data!.items.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}
