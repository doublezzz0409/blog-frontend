// ============================================================
// 数据实体类型定义
// ============================================================

/** 文章状态 */
export type ArticleStatus = 'draft' | 'published' | 'archived'

/** 文章列表项（不含正文） */
export interface ArticleSummary {
  id: string
  title: string
  slug: string
  summary: string
  coverImage: string
  categoryId: string
  tagIds: string[]
  status: ArticleStatus
  viewCount: number
  createdAt: string
  updatedAt: string
}

/** 文章详情（含正文） */
export interface ArticleDetail extends ArticleSummary {
  content: string
}

/** 分类 */
export interface Category {
  id: string
  name: string
  slug: string
  description: string
  articleCount: number
  sortOrder: number
}

/** 标签 */
export interface Tag {
  id: string
  name: string
  slug: string
  articleCount: number
}

/** 用户（管理员） */
export interface User {
  id: string
  username: string
  nickname: string
  avatar: string
  email: string
  bio: string
}

/** 站点设置 */
export interface SiteSettings {
  siteName: string
  siteDescription: string
  logo: string
  favicon: string
  footerText: string
  socialLinks: SocialLinks
  postsPerPage: number
}

/** 社交链接 */
export interface SocialLinks {
  github: string
  twitter: string
  email: string
}

/** 评论 */
export interface Comment {
  id: string
  articleId: string
  authorName: string
  authorEmail: string
  content: string
  isApproved: boolean
  createdAt: string
}

/** 仪表盘统计 */
export interface DashboardStats {
  totalArticles: number
  totalViews: number
  totalComments: number
  totalCategories: number
}

/** 分页请求参数 */
export interface PaginationParams {
  page: number
  pageSize: number
}

/** 文章筛选参数 */
export interface ArticleFilterParams extends PaginationParams {
  status?: ArticleStatus
  categoryId?: string
  tagId?: string
  keyword?: string
}

/** 分页信息 */
export interface PaginationInfo {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

/** 分页列表数据 */
export interface PaginatedList<T> {
  items: T[]
  pagination: PaginationInfo
}

/** 登录请求参数 */
export interface LoginParams {
  username: string
  password: string
}

/** 登录响应数据 */
export interface LoginData {
  token: string
  user: User
}

/** 创建/更新文章请求体 */
export interface ArticleFormData {
  title: string
  slug: string
  content: string
  summary: string
  coverImage: string
  categoryId: string
  tagIds: string[]
  status: ArticleStatus
}

/** 创建/更新分类请求体 */
export interface CategoryFormData {
  name: string
  slug: string
  description: string
  sortOrder: number
}

/** 创建/更新标签请求体 */
export interface TagFormData {
  name: string
  slug: string
}

/** 更新站点设置请求体 */
export type SiteSettingsFormData = SiteSettings

/** 更新个人信息请求体 */
export interface ProfileFormData {
  nickname: string
  avatar: string
  email: string
  bio: string
}

/** 修改密码请求体 */
export interface ChangePasswordParams {
  oldPassword: string
  newPassword: string
}

/** 文章归档项 */
export interface ArchiveItem {
  year: number
  months: {
    month: number
    articles: ArticleSummary[]
  }[]
}
