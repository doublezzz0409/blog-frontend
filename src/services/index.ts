// ============================================================
// API 服务层 — 所有接口调用封装在此，组件禁止直接 fetch
// ============================================================

import type {
  GetArticlesParams,
  GetArticlesResponse,
  GetArticleDetailResponse,
  GetCategoriesResponse,
  GetTagsResponse,
  GetArchiveResponse,
  GetSiteSettingsResponse,
  GetAboutResponse,
  PostLoginBody,
  PostLoginResponse,
  GetDashboardStatsResponse,
  GetAdminArticlesParams,
  GetAdminArticlesResponse,
  CreateArticleBody,
  CreateArticleResponse,
  UpdateArticleBody,
  UpdateArticleResponse,
  DeleteArticleResponse,
  CreateCategoryBody,
  CreateCategoryResponse,
  UpdateCategoryBody,
  UpdateCategoryResponse,
  DeleteCategoryResponse,
  CreateTagBody,
  CreateTagResponse,
  UpdateTagBody,
  UpdateTagResponse,
  DeleteTagResponse,
  GetAdminCommentsParams,
  GetAdminCommentsResponse,
  ApproveCommentResponse,
  DeleteCommentResponse,
  GetAdminSettingsResponse,
  UpdateSettingsBody,
  UpdateSettingsResponse,
  GetProfileResponse,
  UpdateProfileBody,
  UpdateProfileResponse,
  ChangePasswordBody,
  ChangePasswordResponse,
} from '../types/api-contract'

// ============================================================
// 基础请求封装
// ============================================================

const BASE_URL = '/api'

function getToken(): string | null {
  return localStorage.getItem('token')
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${url}`, { ...options, headers })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || `HTTP ${res.status}`)
  }

  return res.json()
}

function get<T>(url: string, params?: Record<string, string | number | undefined>): Promise<T> {
  let query = ''
  if (params) {
    const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
    if (entries.length > 0) {
      query = '?' + entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&')
    }
  }
  return request<T>(url + query)
}

function post<T>(url: string, body: unknown): Promise<T> {
  return request<T>(url, { method: 'POST', body: JSON.stringify(body) })
}

function put<T>(url: string, body: unknown): Promise<T> {
  return request<T>(url, { method: 'PUT', body: JSON.stringify(body) })
}

function del<T>(url: string): Promise<T> {
  return request<T>(url, { method: 'DELETE' })
}

// ============================================================
// 公开服务
// ============================================================

export function getArticles(params: GetArticlesParams): Promise<GetArticlesResponse> {
  return get('/articles', params as Record<string, string | number | undefined>)
}

export function getArticleDetail(slug: string): Promise<GetArticleDetailResponse> {
  return get(`/articles/${slug}`)
}

export function getCategories(): Promise<GetCategoriesResponse> {
  return get('/categories')
}

export function getTags(): Promise<GetTagsResponse> {
  return get('/tags')
}

export function getArchive(): Promise<GetArchiveResponse> {
  return get('/archive')
}

export function getSiteSettings(): Promise<GetSiteSettingsResponse> {
  return get('/site-settings')
}

export function getAbout(): Promise<GetAboutResponse> {
  return get('/about')
}

export function login(body: PostLoginBody): Promise<PostLoginResponse> {
  return post('/login', body)
}

// ============================================================
// 管理服务（需 Token）
// ============================================================

export function getDashboardStats(): Promise<GetDashboardStatsResponse> {
  return get('/admin/dashboard')
}

export function getAdminArticles(params: GetAdminArticlesParams): Promise<GetAdminArticlesResponse> {
  return get('/admin/articles', params as Record<string, string | number | undefined>)
}

export function createArticle(body: CreateArticleBody): Promise<CreateArticleResponse> {
  return post('/admin/articles', body)
}

export function updateArticle(id: string, body: UpdateArticleBody): Promise<UpdateArticleResponse> {
  return put(`/admin/articles/${id}`, body)
}

export function deleteArticle(id: string): Promise<DeleteArticleResponse> {
  return del(`/admin/articles/${id}`)
}

export function createCategory(body: CreateCategoryBody): Promise<CreateCategoryResponse> {
  return post('/admin/categories', body)
}

export function updateCategory(id: string, body: UpdateCategoryBody): Promise<UpdateCategoryResponse> {
  return put(`/admin/categories/${id}`, body)
}

export function deleteCategory(id: string): Promise<DeleteCategoryResponse> {
  return del(`/admin/categories/${id}`)
}

export function createTag(body: CreateTagBody): Promise<CreateTagResponse> {
  return post('/admin/tags', body)
}

export function updateTag(id: string, body: UpdateTagBody): Promise<UpdateTagResponse> {
  return put(`/admin/tags/${id}`, body)
}

export function deleteTag(id: string): Promise<DeleteTagResponse> {
  return del(`/admin/tags/${id}`)
}

export function getAdminComments(params: GetAdminCommentsParams): Promise<GetAdminCommentsResponse> {
  return get('/admin/comments', params as Record<string, string | number | undefined>)
}

export function approveComment(id: string): Promise<ApproveCommentResponse> {
  return put(`/admin/comments/${id}/approve`, {})
}

export function deleteComment(id: string): Promise<DeleteCommentResponse> {
  return del(`/admin/comments/${id}`)
}

export function getAdminSettings(): Promise<GetAdminSettingsResponse> {
  return get('/admin/settings')
}

export function updateSettings(body: UpdateSettingsBody): Promise<UpdateSettingsResponse> {
  return put('/admin/settings', body)
}

export function getProfile(): Promise<GetProfileResponse> {
  return get('/admin/profile')
}

export function updateProfile(body: UpdateProfileBody): Promise<UpdateProfileResponse> {
  return put('/admin/profile', body)
}

export function changePassword(body: ChangePasswordBody): Promise<ChangePasswordResponse> {
  return put('/admin/password', body)
}
