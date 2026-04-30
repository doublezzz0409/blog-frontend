import { useEffect, useState } from 'react'
import type { Category, CategoryFormData } from '../../types'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services'
import LoadingSpinner from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'

type AsyncState = 'loading' | 'empty' | 'error' | 'ready'

export default function CategoryManagePage() {
  const [state, setState] = useState<AsyncState>('loading')
  const [categories, setCategories] = useState<Category[]>([])
  const [errorMsg, setErrorMsg] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CategoryFormData>({ name: '', slug: '', description: '', sortOrder: 0 })

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

  const resetForm = () => {
    setForm({ name: '', slug: '', description: '', sortOrder: 0 })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, sortOrder: cat.sortOrder })
    setEditingId(cat.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = editingId
        ? await updateCategory(editingId, form)
        : await createCategory(form)
      if (res.code === 200 || res.code === 201) {
        resetForm()
        fetchData()
      }
    } catch {
      alert('操作失败')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此分类吗？')) return
    try {
      const res = await deleteCategory(id)
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
        <h1 className="text-2xl font-bold text-gray-900">分类管理</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          新建分类
        </button>
      </div>

      {state === 'empty' && !showForm && <EmptyState message="暂无分类，点击上方按钮创建" />}

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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
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

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">名称</th>
              <th className="text-left px-4 py-3 font-medium">Slug</th>
              <th className="text-left px-4 py-3 font-medium">文章数</th>
              <th className="text-right px-4 py-3 font-medium w-32">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900">{cat.name}</td>
                <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
                <td className="px-4 py-3 text-gray-500">{cat.articleCount}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:underline text-xs">编辑</button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:underline text-xs">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
