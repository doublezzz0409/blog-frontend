import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ArchiveItem } from '../types'
import { getArchive } from '../services'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'

type AsyncState = 'loading' | 'empty' | 'error' | 'ready'

export default function ArchivePage() {
  const [state, setState] = useState<AsyncState>('loading')
  const [archive, setArchive] = useState<ArchiveItem[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  const fetchData = async () => {
    setState('loading')
    try {
      const res = await getArchive()
      if (res.code === 200) {
        if (res.data.length === 0) {
          setState('empty')
        } else {
          setArchive(res.data)
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
  if (state === 'empty') return <EmptyState message="暂无归档" />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">文章归档</h1>
      <div className="space-y-8">
        {archive.map((yearItem) => (
          <div key={yearItem.year}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{yearItem.year} 年</h2>
            <div className="space-y-4 ml-4">
              {yearItem.months.map((monthItem) => (
                <div key={monthItem.month}>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{monthItem.month} 月</h3>
                  <ul className="space-y-2 ml-4">
                    {monthItem.articles.map((article) => (
                      <li key={article.id} className="flex items-baseline gap-3">
                        <span className="text-xs text-gray-400 shrink-0">
                          {new Date(article.createdAt).getDate()} 日
                        </span>
                        <Link
                          to={`/article/${article.slug}`}
                          className="text-gray-700 hover:text-blue-600 transition-colors"
                        >
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
