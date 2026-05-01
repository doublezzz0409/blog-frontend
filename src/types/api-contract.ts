// ============================================================
// API 接口契约
// 所有接口统一响应格式：{ code: number; data: T; message: string }
// ============================================================

import type {
  ArticleSummary,
  ArticleDetail,
  ArticleFilterParams,
  ArticleFormData,
  Category,
  CategoryFormData,
  Tag,
  TagFormData,
  Comment,
  DashboardStats,
  LoginParams,
  LoginData,
  SiteSettings,
  SiteSettingsFormData,
  User,
  ProfileFormData,
  ChangePasswordParams,
  PaginatedList,
  PaginationParams,
  ArchiveItem,
} from './index'

/** 统一 API 响应外壳 */
export interface ApiResponse<T> {
  /**
   * 业务状态码
   * - 200: 成功
   * - 400: 参数错误 / 业务校验失败
   * - 401: 未认证（Token 缺失或无效）
   * - 403: 权限不足
   * - 404: 资源不存在
   * - 500: 服务器内部错误
   */
  code: number
  /** 业务数据。成功时为具体数据对象，失败时为 null */
  data: T
  /** 提示信息。成功时为 "ok"，失败时为可展示给用户的错误描述 */
  message: string
}

// ============================================================
// 公开接口（无需认证）
// ============================================================

/** GET /api/articles — 获取已发布文章列表 */
export type GetArticlesParams = ArticleFilterParams
export type GetArticlesResponse = ApiResponse<PaginatedList<ArticleSummary>>

/** GET /api/articles/:slug — 获取文章详情 */
/** slug 格式: URL 友好字符串，如 "deep-dive-react-hooks" */
export type GetArticleDetailResponse = ApiResponse<ArticleDetail>

/** GET /api/categories — 获取分类列表 */
export type GetCategoriesResponse = ApiResponse<Category[]>

/** GET /api/tags — 获取标签列表 */
export type GetTagsResponse = ApiResponse<Tag[]>

/** GET /api/archive — 获取文章归档 */
export type GetArchiveResponse = ApiResponse<ArchiveItem[]>

/** GET /api/site-settings — 获取站点设置（公开） */
export type GetSiteSettingsResponse = ApiResponse<SiteSettings>

/** GET /api/about — 获取关于页数据（复用 User） */
export type GetAboutResponse = ApiResponse<User>

/** POST /api/login — 管理员登录 */
export type PostLoginBody = LoginParams
export type PostLoginResponse = ApiResponse<LoginData>

// ============================================================
// 管理接口（需 Bearer Token 认证）
// ============================================================

/** GET /api/admin/dashboard — 获取仪表盘统计 */
export type GetDashboardStatsResponse = ApiResponse<DashboardStats>

/** GET /api/admin/articles — 管理文章列表（含草稿） */
export type GetAdminArticlesParams = ArticleFilterParams
export type GetAdminArticlesResponse = ApiResponse<PaginatedList<ArticleSummary>>

/** GET /api/admin/articles/:id — 获取单篇文章详情（管理用，按 ID 查询，含草稿） */
/** id 格式: "art-{uuid}" */
export type GetAdminArticleDetailResponse = ApiResponse<ArticleDetail>

/** POST /api/admin/articles — 创建文章 */
export type CreateArticleBody = ArticleFormData
export type CreateArticleResponse = ApiResponse<ArticleDetail>

/** PUT /api/admin/articles/:id — 更新文章 */
/** id 格式: "art-{uuid}" */
export type UpdateArticleBody = ArticleFormData
export type UpdateArticleResponse = ApiResponse<ArticleDetail>

/** DELETE /api/admin/articles/:id — 删除文章 */
export type DeleteArticleResponse = ApiResponse<null>

/** POST /api/admin/categories — 创建分类 */
export type CreateCategoryBody = CategoryFormData
export type CreateCategoryResponse = ApiResponse<Category>

/** PUT /api/admin/categories/:id — 更新分类 */
/** id 格式: "cat-{uuid}" */
export type UpdateCategoryBody = CategoryFormData
export type UpdateCategoryResponse = ApiResponse<Category>

/** DELETE /api/admin/categories/:id — 删除分类 */
export type DeleteCategoryResponse = ApiResponse<null>

/** POST /api/admin/tags — 创建标签 */
export type CreateTagBody = TagFormData
export type CreateTagResponse = ApiResponse<Tag>

/** PUT /api/admin/tags/:id — 更新标签 */
/** id 格式: "tag-{uuid}" */
export type UpdateTagBody = TagFormData
export type UpdateTagResponse = ApiResponse<Tag>

/** DELETE /api/admin/tags/:id — 删除标签 */
export type DeleteTagResponse = ApiResponse<null>

/** GET /api/admin/comments — 管理评论列表 */
export type GetAdminCommentsParams = PaginationParams
export type GetAdminCommentsResponse = ApiResponse<PaginatedList<Comment>>

/** PUT /api/admin/comments/:id/approve — 审核评论 */
/** id 格式: "cmt-{uuid}" */
export type ApproveCommentResponse = ApiResponse<Comment>

/** DELETE /api/admin/comments/:id — 删除评论 */
export type DeleteCommentResponse = ApiResponse<null>

/** GET /api/admin/settings — 获取站点设置（管理） */
export type GetAdminSettingsResponse = ApiResponse<SiteSettings>

/** PUT /api/admin/settings — 更新站点设置 */
export type UpdateSettingsBody = SiteSettingsFormData
export type UpdateSettingsResponse = ApiResponse<SiteSettings>

/** GET /api/admin/profile — 获取个人信息 */
export type GetProfileResponse = ApiResponse<User>

/** PUT /api/admin/profile — 更新个人信息 */
export type UpdateProfileBody = ProfileFormData
export type UpdateProfileResponse = ApiResponse<User>

/** PUT /api/admin/password — 修改密码 */
export type ChangePasswordBody = ChangePasswordParams
export type ChangePasswordResponse = ApiResponse<null>
