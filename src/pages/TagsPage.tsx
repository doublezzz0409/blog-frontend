import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Tag } from '../types'
import { getTags } from '../services'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'

type AsyncState = 'loading' | 'empty' | 'error' | 'ready'

export default function TagsPage() {
  const [state, setState] = useState<AsyncState>('loading')
  const [tags, setTags] = useState<Tag[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  const fetchData = async () => {
    setState('loading')
    try {
      const res = await getTags()
      if (res.code === 200) {
        if (res.data.length === 0) {
          setState('empty')
        } else {
          setTags(res.data)
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
  if (state === 'empty') return <EmptyState message="暂无标签" />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">全部标签</h1>
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            to={`/?tagId=${tag.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white rounded-full border border-gray-200 text-sm text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
          >
            <span>{tag.name}</span>
            <span className="text-xs text-gray-400">({tag.articleCount})</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
