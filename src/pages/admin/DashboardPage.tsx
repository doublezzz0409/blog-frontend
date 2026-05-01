import { useEffect, useState } from 'react'
import type { DashboardStats } from '../../types'
import { getDashboardStats } from '../../services'
import LoadingSpinner from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'

type AsyncState = 'loading' | 'empty' | 'error' | 'ready'

export default function DashboardPage() {
  const [state, setState] = useState<AsyncState>('loading')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const fetchData = async () => {
    setState('loading')
    try {
      const res = await getDashboardStats()
      if (res.code === 200) {
        if (!res.data) {
          setState('empty')
        } else {
          setStats(res.data)
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
  if (state === 'empty') return <EmptyState message="暂无统计数据" />
  if (state === 'error') return <ErrorState message={errorMsg} onRetry={fetchData} />

  const cards = [
    { label: '文章总数', value: stats!.totalArticles, color: 'bg-blue-500' },
    { label: '总阅读量', value: stats!.totalViews, color: 'bg-green-500' },
    { label: '评论总数', value: stats!.totalComments, color: 'bg-purple-500' },
    { label: '分类数量', value: stats!.totalCategories, color: 'bg-orange-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">仪表盘</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg border border-gray-200 p-5">
            <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center mb-3`}>
              <span className="text-white text-lg font-bold">{card.value.toString()[0]}</span>
            </div>
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
