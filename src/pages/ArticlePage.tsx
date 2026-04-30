import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { ArticleDetail } from '../types'
import { getArticleDetail } from '../services'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorState from '../components/ErrorState'

type AsyncState = 'loading' | 'error' | 'ready'

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const [state, setState] = useState<AsyncState>('loading')
  const [article, setArticle] = useState<ArticleDetail | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const fetchData = async () => {
    if (!slug) return
    setState('loading')
    try {
      const res = await getArticleDetail(slug)
      if (res.code === 200) {
        setArticle(res.data)
        setState('ready')
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
  }, [slug])

  if (state === 'loading') return <LoadingSpinner />
  if (state === 'error') return <ErrorState message={errorMsg} onRetry={fetchData} />

  const date = new Date(article!.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="max-w-3xl mx-auto">
      {/* 封面图 */}
      {article!.coverImage && (
        <img
          src={article!.coverImage}
          alt={article!.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}

      {/* 标题 & 元信息 */}
      <h1 className="text-3xl font-bold text-gray-900 mb-3">{article!.title}</h1>
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
        <span>{date}</span>
        <span>{article!.viewCount} 阅读</span>
        <Link
          to={`/?categoryId=${article!.categoryId}`}
          className="text-blue-600 hover:underline"
        >
          查看分类
        </Link>
      </div>

      {/* 正文（Markdown 纯文本渲染，Demo 简化） */}
      <div className="prose prose-lg max-w-none">
        {article!.content.split('\n').map((line, i) => {
          if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-8 mb-4">{line.slice(2)}</h1>
          if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-semibold mt-6 mb-3">{line.slice(3)}</h2>
          if (line.trim() === '') return <br key={i} />
          return <p key={i} className="text-gray-700 leading-relaxed mb-3">{line}</p>
        })}
      </div>

      {/* 返回 */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <Link to="/" className="text-blue-600 hover:underline text-sm">&larr; 返回文章列表</Link>
      </div>
    </article>
  )
}
