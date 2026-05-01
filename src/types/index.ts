// ============================================================
// 数据实体类型定义
// 字段格式约定：
//   - ID 字段：string，格式为 "{前缀}-{uuid}"，如 "art-abc123"
//   - 可空字段：使用空字符串 "" 表示空，禁止使用 null
//   - 日期时间：string，ISO 8601 UTC 格式，如 "2026-04-30T12:00:00Z"
//   - 数值字段：number，均为非负整数（0 或正整数）
// ============================================================

/** 文章状态 */
export type ArticleStatus = 'draft' | 'published' | 'archived'

/** 文章列表项（不含正文） */
export interface ArticleSummary {
  /** 文章 ID，格式: "art-{uuid}"，如 "art-abc123" */
  id: string
  /** 文章标题，非空 */
  title: string
  /** URL 标识，非空，全局唯一 */
  slug: string
  /** 文章摘要，可为空字符串（表示无摘要） */
  summary: string
  /** 封面图 URL，可为空字符串（表示无封面图） */
  coverImage: string
  /** 分类 ID，格式: "cat-{uuid}"，可为空字符串（表示未分类） */
  categoryId: string
  /** 标签 ID 数组，每个格式: "tag-{uuid}"，可为空数组 */
  tagIds: string[]
  /** 文章状态，枚举值 */
  status: ArticleStatus
  /** 阅读次数，非负整数 */
  viewCount: number
  /** 创建时间，ISO 8601 UTC 格式 */
  createdAt: string
  /** 更新时间，ISO 8601 UTC 格式 */
  updatedAt: string
}

/** 文章详情（含正文） */
export interface ArticleDetail extends ArticleSummary {
  /** 文章正文，Markdown 格式，非空 */
  content: string
}

/** 分类 */
export interface Category {
  /** 分类 ID，格式: "cat-{uuid}" */
  id: string
  /** 分类名称，非空 */
  name: string
  /** URL 标识，非空，全局唯一 */
  slug: string
  /** 分类描述，可为空字符串 */
  description: string
  /** 该分类下的文章数量，非负整数 */
  articleCount: number
  /** 排序权重，非负整数，数字越小越靠前 */
  sortOrder: number
}

/** 标签 */
export interface Tag {
  /** 标签 ID，格式: "tag-{uuid}" */
  id: string
  /** 标签名称，非空 */
  name: string
  /** URL 标识，非空，全局唯一 */
  slug: string
  /** 使用该标签的文章数量，非负整数 */
  articleCount: number
}

/** 用户（管理员） */
export interface User {
  /** 用户 ID，格式: "user-{uuid}" */
  id: string
  /** 登录用户名，非空，不可修改 */
  username: string
  /** 显示昵称，非空 */
  nickname: string
  /** 头像 URL，可为空字符串（表示使用默认头像） */
  avatar: string
  /** 邮箱地址，非空 */
  email: string
  /** 个人简介，可为空字符串 */
  bio: string
}

/** 站点设置 */
export interface SiteSettings {
  /** 站点名称，非空 */
  siteName: string
  /** 站点描述，可为空字符串 */
  siteDescription: string
  /** Logo 图片 URL，可为空字符串 */
  logo: string
  /** Favicon 路径，非空 */
  favicon: string
  /** 页脚文字，可为空字符串 */
  footerText: string
  /** 社交链接 */
  socialLinks: SocialLinks
  /** 每页显示文章数，正整数，范围 1-100 */
  postsPerPage: number
}

/** 社交链接 */
export interface SocialLinks {
  /** GitHub 主页 URL，可为空字符串（表示未设置） */
  github: string
  /** Twitter 主页 URL，可为空字符串（表示未设置） */
  twitter: string
  /** 联系邮箱，可为空字符串（表示未设置） */
  email: string
}

/** 评论 */
export interface Comment {
  /** 评论 ID，格式: "cmt-{uuid}" */
  id: string
  /** 所属文章 ID，格式: "art-{uuid}" */
  articleId: string
  /** 评论者昵称，非空 */
  authorName: string
  /** 评论者邮箱，非空 */
  authorEmail: string
  /** 评论内容，非空 */
  content: string
  /** 是否已审核通过 */
  isApproved: boolean
  /** 评论时间，ISO 8601 UTC 格式 */
  createdAt: string
}

/** 仪表盘统计 */
export interface DashboardStats {
  /** 文章总数，非负整数 */
  totalArticles: number
  /** 总阅读量，非负整数 */
  totalViews: number
  /** 评论总数，非负整数 */
  totalComments: number
  /** 分类数量，非负整数 */
  totalCategories: number
}

/** 分页请求参数 */
export interface PaginationParams {
  /** 页码，从 1 开始的正整数 */
  page: number
  /** 每页条数，正整数，范围 1-100 */
  pageSize: number
}

/** 文章筛选参数 */
export interface ArticleFilterParams extends PaginationParams {
  /** 按状态筛选，可选 */
  status?: ArticleStatus
  /** 按分类筛选，格式: "cat-{uuid}"，可选 */
  categoryId?: string
  /** 按标签筛选，格式: "tag-{uuid}"，可选 */
  tagId?: string
  /** 关键词搜索（匹配标题和摘要），可选 */
  keyword?: string
}

/** 分页信息 */
export interface PaginationInfo {
  /** 当前页码，从 1 开始 */
  page: number
  /** 每页条数 */
  pageSize: number
  /** 总记录数 */
  total: number
  /** 总页数 */
  totalPages: number
}

/** 分页列表数据 */
export interface PaginatedList<T> {
  items: T[]
  pagination: PaginationInfo
}

/** 登录请求参数 */
export interface LoginParams {
  /** 用户名，非空 */
  username: string
  /** 密码，非空 */
  password: string
}

/** 登录响应数据 */
export interface LoginData {
  /** JWT Token，非空 */
  token: string
  /** 当前用户信息 */
  user: User
}

/** 创建/更新文章请求体 */
export interface ArticleFormData {
  /** 文章标题，非空 */
  title: string
  /** URL 标识，非空 */
  slug: string
  /** 文章正文，Markdown 格式，非空 */
  content: string
  /** 文章摘要，可为空字符串 */
  summary: string
  /** 封面图 URL，可为空字符串 */
  coverImage: string
  /** 分类 ID，格式: "cat-{uuid}"，可为空字符串 */
  categoryId: string
  /** 标签 ID 数组，每个格式: "tag-{uuid}" */
  tagIds: string[]
  /** 文章状态 */
  status: ArticleStatus
}

/** 创建/更新分类请求体 */
export interface CategoryFormData {
  /** 分类名称，非空 */
  name: string
  /** URL 标识，非空 */
  slug: string
  /** 分类描述，可为空字符串 */
  description: string
  /** 排序权重，非负整数 */
  sortOrder: number
}

/** 创建/更新标签请求体 */
export interface TagFormData {
  /** 标签名称，非空 */
  name: string
  /** URL 标识，非空 */
  slug: string
}

/** 更新站点设置请求体 */
export type SiteSettingsFormData = SiteSettings

/** 更新个人信息请求体 */
export interface ProfileFormData {
  /** 显示昵称，非空 */
  nickname: string
  /** 头像 URL，可为空字符串 */
  avatar: string
  /** 邮箱地址，非空 */
  email: string
  /** 个人简介，可为空字符串 */
  bio: string
}

/** 修改密码请求体 */
export interface ChangePasswordParams {
  /** 原密码，非空 */
  oldPassword: string
  /** 新密码，非空 */
  newPassword: string
}

/** 文章归档项 */
export interface ArchiveItem {
  /** 年份，如 2026 */
  year: number
  /** 月份列表 */
  months: {
    /** 月份，1-12 */
    month: number
    /** 该月的文章列表 */
    articles: ArticleSummary[]
  }[]
}
