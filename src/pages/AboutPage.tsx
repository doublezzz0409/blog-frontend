import { useEffect, useState } from 'react'
import type { User } from '../types'
import { getAbout } from '../services'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'

type AsyncState = 'loading' | 'empty' | 'error' | 'ready'

export default function AboutPage() {
  const [state, setState] = useState<AsyncState>('loading')
  const [user, setUser] = useState<User | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const fetchData = async () => {
    setState('loading')
    try {
      const res = await getAbout()
      if (res.code === 200) {
        if (!res.data || (!res.data.nickname && !res.data.bio)) {
          setState('empty')
        } else {
          setUser(res.data)
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
  if (state === 'empty') return <EmptyState message="暂无个人信息" />
  if (state === 'error') return <ErrorState message={errorMsg} onRetry={fetchData} />

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">关于我</h1>
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center gap-6 mb-6">
          <img
            src={user!.avatar}
            alt={user!.nickname}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user!.nickname}</h2>
            <p className="text-sm text-gray-500">{user!.email}</p>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed">{user!.bio}</p>
      </div>
    </div>
  )
}
