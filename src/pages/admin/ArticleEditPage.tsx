import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { ArticleFormData, ArticleStatus, Category, Tag } from '../../types'
import { createArticle, updateArticle, getAdminArticleDetail, getCategories, getTags } from '../../services'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorState from '../../components/ErrorState'

type PageState = 'loading' | 'error' | 'ready'

export default function ArticleEditPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = id !== 'new'

  const [pageState, setPageState] = useState<PageState>(isEdit ? 'loading' : 'ready')
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')

  const [form, setForm] = useState<ArticleFormData>({
    title: '',
    slug: '',
    content: '',
    summary: '',
    coverImage: '',
    categoryId: '',
    tagIds: [],
    status: 'draft',
  })

  const fetchDependencies = async () => {
    try {
      const [catRes, tagRes] = await Promise.all([getCategories(), getTags()])
      if (catRes.code === 200) setCategories(catRes.data)
      if (tagRes.code === 200) setTags(tagRes.data)

      if (isEdit && id) {
        const artRes = await getAdminArticleDetail(id)
        if (artRes.code === 200) {
          const a = artRes.data
          setForm({
            title: a.title,
            slug: a.slug,
            content: a.content,
            summary: a.summary,
            coverImage: a.coverImage,
            categoryId: a.categoryId,
            tagIds: a.tagIds,
            status: a.status,
          })
          setPageState('ready')
        } else {
          setLoadError(artRes.message)
          setPageState('error')
        }
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : '加载失败')
      setPageState('error')
    }
  }

  useEffect(() => { fetchDependencies() }, [id, isEdit])

  const handleChange = (field: keyof ArticleFormData, value: string | string[] | ArticleStatus) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const res = isEdit ? await updateArticle(id!, form) : await createArticle(form)
      if (res.code === 200 || res.code === 201) {
        navigate('/admin/articles')
      } else {
        setError(res.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    } finally {
      setSaving(false)
    }
  }

  const toggleTag = (tagId: string) => {
    setForm((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((t) => t !== tagId)
        : [...prev.tagIds, tagId],
    }))
  }

  if (pageState === 'loading') return <LoadingSpinner />
  if (pageState === 'error') return <ErrorState message={loadError} onRetry={fetchDependencies} />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? '编辑文章' : '新建文章'}</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">摘要</label>
          <textarea
            value={form.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">正文</label>
          <textarea
            value={form.content}
            onChange={(e) => handleChange('content', e.target.value)}
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">封面图 URL</label>
          <input
            type="text"
            value={form.coverImage}
            onChange={(e) => handleChange('coverImage', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
          <select
            value={form.categoryId}
            onChange={(e) => handleChange('categoryId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">请选择分类</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">标签</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                  form.tagIds.includes(tag.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
          <select
            value={form.status}
            onChange={(e) => handleChange('status', e.target.value as ArticleStatus)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="draft">草稿</option>
            <option value="published">发布</option>
            <option value="archived">归档</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? '保存中...' : '保存'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/articles')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  )
}
