import { useEffect, useState } from 'react'
import type { Tag, TagFormData } from '../../types'
import { getTags, createTag, updateTag, deleteTag } from '../../services'
import LoadingSpinner from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'

type AsyncState = 'loading' | 'empty' | 'error' | 'ready'

export default function TagManagePage() {
  const [state, setState] = useState<AsyncState>('loading')
  const [tags, setTags] = useState<Tag[]>([])
  const [errorMsg, setErrorMsg] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<TagFormData>({ name: '', slug: '' })

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

  const resetForm = () => {
    setForm({ name: '', slug: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (tag: Tag) => {
    setForm({ name: tag.name, slug: tag.slug })
    setEditingId(tag.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = editingId ? await updateTag(editingId, form) : await createTag(form)
      if (res.code === 200 || res.code === 201) {
        resetForm()
        fetchData()
      }
    } catch {
      alert('操作失败')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此标签吗？')) return
    try {
      const res = await deleteTag(id)
      if (res.code === 200) fetchData()
      else alert(res.message)
    } catch {
      alert('删除失败')
    }
  }

  if (state === 'loading') return <LoadingSpinner />
  if (state === 'error') return <ErrorState message={errorMsg} onRetry={fetchData} />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">标签管理</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          新建标签
        </button>
      </div>

      {state === 'empty' && !showForm && <EmptyState message="暂无标签，点击上方按钮创建" />}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-5 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">名称</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              {editingId ? '更新' : '创建'}
            </button>
            <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              取消
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div key={tag.id} className="inline-flex items-center gap-2 bg-white rounded-full border border-gray-200 pl-4 pr-1 py-1">
            <span className="text-sm text-gray-700">{tag.name}</span>
            <span className="text-xs text-gray-400">({tag.articleCount})</span>
            <button onClick={() => handleEdit(tag)} className="text-blue-600 hover:text-blue-800 text-xs px-1">编辑</button>
            <button onClick={() => handleDelete(tag.id)} className="text-red-600 hover:text-red-800 text-xs px-1">删除</button>
          </div>
        ))}
      </div>
    </div>
  )
}
