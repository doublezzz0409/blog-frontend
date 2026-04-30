import { useEffect, useState } from 'react'
import type { Comment, PaginatedList } from '../../types'
import { getAdminComments, approveComment, deleteComment } from '../../services'
import LoadingSpinner from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'

type AsyncState = 'loading' | 'empty' | 'error' | 'ready'

export default function CommentManagePage() {
  const [state, setState] = useState<AsyncState>('loading')
  const [data, setData] = useState<PaginatedList<Comment> | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const fetchData = async () => {
    setState('loading')
    try {
      const res = await getAdminComments({ page: 1, pageSize: 20 })
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

  const handleApprove = async (id: string) => {
    try {
      const res = await approveComment(id)
      if (res.code === 200) fetchData()
    } catch {
      alert('操作失败')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此评论吗？')) return
    try {
      const res = await deleteComment(id)
      if (res.code === 200) fetchData()
    } catch {
      alert('删除失败')
    }
  }

  if (state === 'loading') return <LoadingSpinner />
  if (state === 'error') return <ErrorState message={errorMsg} onRetry={fetchData} />
  if (state === 'empty') return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">评论管理</h1>
      <EmptyState message="暂无评论" />
    </div>
  )

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">评论管理</h1>
      <div className="space-y-4">
        {data!.items.map((comment) => (
          <div key={comment.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">{comment.authorName}</span>
                <span className="text-xs text-gray-400">{comment.authorEmail}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${comment.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {comment.isApproved ? '已审核' : '待审核'}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleString('zh-CN')}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-3">{comment.content}</p>
            <div className="text-xs text-gray-400 mb-2">文章 ID: {comment.articleId}</div>
            <div className="flex gap-2">
              {!comment.isApproved && (
                <button onClick={() => handleApprove(comment.id)} className="text-xs text-green-600 hover:underline">通过</button>
              )}
              <button onClick={() => handleDelete(comment.id)} className="text-xs text-red-600 hover:underline">删除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
