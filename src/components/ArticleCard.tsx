import { Link } from 'react-router-dom'
import type { ArticleSummary } from '../types'

interface ArticleCardProps {
  article: ArticleSummary
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const date = new Date(article.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {article.coverImage && (
        <Link to={`/article/${article.slug}`}>
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
        </Link>
      )}
      <div className="p-5">
        <Link to={`/article/${article.slug}`}>
          <h2 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </h2>
        </Link>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{article.summary}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{date}</span>
          <span>{article.viewCount} 阅读</span>
        </div>
      </div>
    </article>
  )
}
