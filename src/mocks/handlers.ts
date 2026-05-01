// ============================================================
// MSW Mock Handlers — 每个 API 端点的成功 + 失败响应
// ============================================================

import { http, HttpResponse, delay } from 'msw'
import type {
  ArticleSummary,
  ArticleDetail,
  Category,
  Tag,
  Comment,
  DashboardStats,
  User,
  SiteSettings,
  ArchiveItem,
  PaginatedList,
} from '../types'
import type { ApiResponse } from '../types/api-contract'

// ============================================================
// Mock 数据
// ============================================================

const mockCategories: Category[] = [
  { id: 'cat-1', name: '前端开发', slug: 'frontend', description: '前端技术文章', articleCount: 5, sortOrder: 1 },
  { id: 'cat-2', name: '后端开发', slug: 'backend', description: '后端技术文章', articleCount: 3, sortOrder: 2 },
  { id: 'cat-3', name: '生活随笔', slug: 'life', description: '生活感悟', articleCount: 2, sortOrder: 3 },
]

const mockTags: Tag[] = [
  { id: 'tag-1', name: 'React', slug: 'react', articleCount: 3 },
  { id: 'tag-2', name: 'TypeScript', slug: 'typescript', articleCount: 4 },
  { id: 'tag-3', name: 'Node.js', slug: 'nodejs', articleCount: 2 },
  { id: 'tag-4', name: 'CSS', slug: 'css', articleCount: 2 },
  { id: 'tag-5', name: 'Python', slug: 'python', articleCount: 1 },
]

const mockArticles: ArticleDetail[] = [
  {
    id: 'art-1',
    title: '深入理解 React Hooks',
    slug: 'deep-dive-react-hooks',
    summary: '本文详细介绍了 React Hooks 的原理和最佳实践，包括 useState、useEffect、useCallback 等核心 Hook 的使用技巧。',
    content: '# 深入理解 React Hooks\n\nReact Hooks 是 React 16.8 引入的新特性，它让函数组件也能使用状态和其他 React 特性。\n\n## useState\n\n`useState` 是最基础的 Hook，用于在函数组件中添加状态...\n\n## useEffect\n\n`useEffect` 用于处理副作用，相当于类组件中的 componentDidMount、componentDidUpdate 和 componentWillUnmount 的组合...',
    coverImage: 'https://picsum.photos/seed/react/800/400',
    categoryId: 'cat-1',
    tagIds: ['tag-1', 'tag-2'],
    status: 'published',
    viewCount: 1234,
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-03-15T10:00:00Z',
  },
  {
    id: 'art-2',
    title: 'TypeScript 高级类型技巧',
    slug: 'typescript-advanced-types',
    summary: '探索 TypeScript 中的条件类型、映射类型、模板字面量类型等高级用法，提升类型安全。',
    content: '# TypeScript 高级类型技巧\n\nTypeScript 的类型系统非常强大，掌握高级类型技巧可以让你的代码更加安全...\n\n## 条件类型\n\n条件类型类似于三元表达式...',
    coverImage: 'https://picsum.photos/seed/ts/800/400',
    categoryId: 'cat-1',
    tagIds: ['tag-2'],
    status: 'published',
    viewCount: 856,
    createdAt: '2026-03-10T08:00:00Z',
    updatedAt: '2026-03-10T08:00:00Z',
  },
  {
    id: 'art-3',
    title: 'Node.js 性能优化实战',
    slug: 'nodejs-performance',
    summary: '从内存管理、事件循环、集群模式等多个维度，全面优化 Node.js 应用性能。',
    content: '# Node.js 性能优化实战\n\nNode.js 的性能优化是一个系统工程...\n\n## 内存管理\n\n合理管理内存是性能优化的基础...',
    coverImage: 'https://picsum.photos/seed/node/800/400',
    categoryId: 'cat-2',
    tagIds: ['tag-3'],
    status: 'published',
    viewCount: 678,
    createdAt: '2026-02-20T14:00:00Z',
    updatedAt: '2026-02-20T14:00:00Z',
  },
  {
    id: 'art-4',
    title: 'CSS Grid 布局完全指南',
    slug: 'css-grid-complete-guide',
    summary: '从基础到进阶，全面掌握 CSS Grid 布局，打造复杂的响应式页面布局。',
    content: '# CSS Grid 布局完全指南\n\nCSS Grid 是现代 CSS 布局的终极方案...',
    coverImage: 'https://picsum.photos/seed/css/800/400',
    categoryId: 'cat-1',
    tagIds: ['tag-4'],
    status: 'published',
    viewCount: 543,
    createdAt: '2026-02-10T09:00:00Z',
    updatedAt: '2026-02-10T09:00:00Z',
  },
  {
    id: 'art-5',
    title: '我的 2026 年计划',
    slug: 'my-2026-plan',
    summary: '回顾 2025 年的收获，展望 2026 年的目标和计划。',
    content: '# 我的 2026 年计划\n\n新的一年，新的开始...',
    coverImage: 'https://picsum.photos/seed/plan/800/400',
    categoryId: 'cat-3',
    tagIds: [],
    status: 'published',
    viewCount: 321,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'art-6',
    title: 'Draft: 新特性预告',
    slug: 'draft-new-feature',
    summary: '这是一篇草稿文章',
    content: '# 草稿内容\n\n正在编写中...',
    coverImage: '',
    categoryId: 'cat-1',
    tagIds: ['tag-1'],
    status: 'draft',
    viewCount: 0,
    createdAt: '2026-04-01T12:00:00Z',
    updatedAt: '2026-04-01T12:00:00Z',
  },
]

const mockComments: Comment[] = [
  {
    id: 'cmt-1',
    articleId: 'art-1',
    authorName: '张三',
    authorEmail: 'zhangsan@example.com',
    content: '写得非常详细，受益匪浅！',
    isApproved: true,
    createdAt: '2026-03-16T08:00:00Z',
  },
  {
    id: 'cmt-2',
    articleId: 'art-1',
    authorName: '李四',
    authorEmail: 'lisi@example.com',
    content: '请问 Hooks 和 Class 组件哪个性能更好？',
    isApproved: true,
    createdAt: '2026-03-17T10:00:00Z',
  },
  {
    id: 'cmt-3',
    articleId: 'art-2',
    authorName: '王五',
    authorEmail: 'wangwu@example.com',
    content: 'TypeScript 的类型体操真的太强了',
    isApproved: false,
    createdAt: '2026-03-11T15:00:00Z',
  },
]

const mockUser: User = {
  id: 'user-1',
  username: 'admin',
  nickname: '博主小张',
  avatar: 'https://picsum.photos/seed/avatar/200/200',
  email: 'admin@blog.com',
  bio: '一个热爱技术的全栈开发者，专注于前端和 Node.js 开发。',
}

const mockSettings: SiteSettings = {
  siteName: '小张的技术博客',
  siteDescription: '分享前端、后端技术文章和生活感悟',
  logo: 'https://picsum.photos/seed/logo/200/60',
  favicon: '/favicon.ico',
  footerText: '© 2026 小张的技术博客. All rights reserved.',
  socialLinks: {
    github: 'https://github.com/example',
    twitter: 'https://twitter.com/example',
    email: 'admin@blog.com',
  },
  postsPerPage: 10,
}

const mockDashboard: DashboardStats = {
  totalArticles: 6,
  totalViews: 3632,
  totalComments: 3,
  totalCategories: 3,
}

const mockArchive: ArchiveItem[] = [
  {
    year: 2026,
    months: [
      { month: 4, articles: [mockArticles[5]] },
      { month: 3, articles: [mockArticles[0], mockArticles[1]] },
      { month: 2, articles: [mockArticles[2], mockArticles[3]] },
      { month: 1, articles: [mockArticles[4]] },
    ],
  },
]

// ============================================================
// 辅助函数
// ============================================================

const VALID_TOKEN = 'mock-jwt-token-abc123'

function ok<T>(data: T): ApiResponse<T> {
  return { code: 200, data, message: 'ok' }
}

function fail(message: string, code = 400): ApiResponse<null> {
  return { code, data: null, message }
}

function paginate(items: ArticleSummary[], page: number, pageSize: number): PaginatedList<ArticleSummary> {
  const start = (page - 1) * pageSize
  return {
    items: items.slice(start, start + pageSize),
    pagination: { page, pageSize, total: items.length, totalPages: Math.ceil(items.length / pageSize) },
  }
}

/** 检查管理接口认证：无 Token 或 Token 无效返回 401 */
function checkAuth(request: Request): ApiResponse<null> | null {
  const auth = request.headers.get('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) {
    return fail('未认证：请先登录', 401)
  }
  const token = auth.replace('Bearer ', '')
  if (token !== VALID_TOKEN) {
    return fail('Token 无效或已过期', 401)
  }
  return null
}

/** 模拟 500 服务器错误：请求头含 X-Test-Error: 500 时触发 */
function check500(request: Request): ApiResponse<null> | null {
  if (request.headers.get('X-Test-Error') === '500') {
    return fail('服务器内部错误', 500)
  }
  return null
}

// ============================================================
// Handlers
// ============================================================

export const handlers = [
  // ── 公开接口 ──────────────────────────────────────────────

  // GET /api/articles
  http.get('/api/articles', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || '1')
    const pageSize = Number(url.searchParams.get('pageSize') || '10')
    const categoryId = url.searchParams.get('categoryId') || undefined
    const tagId = url.searchParams.get('tagId') || undefined
    const keyword = url.searchParams.get('keyword') || undefined

    let articles = mockArticles.filter((a) => a.status === 'published')
    if (categoryId) articles = articles.filter((a) => a.categoryId === categoryId)
    if (tagId) articles = articles.filter((a) => a.tagIds.includes(tagId))
    if (keyword) articles = articles.filter((a) => a.title.includes(keyword) || a.summary.includes(keyword))

    const summaries: ArticleSummary[] = articles.map(({ content, ...rest }) => rest)
    return HttpResponse.json(ok(paginate(summaries, page, pageSize)))
  }),

  // GET /api/articles/:slug
  http.get('/api/articles/:slug', async ({ params }) => {
    await delay(200)
    const article = mockArticles.find((a) => a.slug === params.slug && a.status === 'published')
    if (!article) return HttpResponse.json(fail('文章不存在', 404), { status: 404 })
    return HttpResponse.json(ok(article))
  }),

  // GET /api/categories
  http.get('/api/categories', async () => {
    await delay(200)
    return HttpResponse.json(ok(mockCategories))
  }),

  // GET /api/tags
  http.get('/api/tags', async () => {
    await delay(200)
    return HttpResponse.json(ok(mockTags))
  }),

  // GET /api/archive
  http.get('/api/archive', async () => {
    await delay(300)
    return HttpResponse.json(ok(mockArchive))
  }),

  // GET /api/site-settings
  http.get('/api/site-settings', async () => {
    await delay(100)
    return HttpResponse.json(ok(mockSettings))
  }),

  // GET /api/about
  http.get('/api/about', async () => {
    await delay(200)
    return HttpResponse.json(ok(mockUser))
  }),

  // POST /api/login
  // 成功：admin/admin123 → 200 + token
  // 失败 (400)：用户名或密码为空
  // 失败 (401)：凭据错误
  http.post('/api/login', async ({ request }) => {
    await delay(500)
    const body = (await request.json()) as { username: string; password: string }
    if (!body.username || !body.password) {
      return HttpResponse.json(fail('用户名和密码不能为空'), { status: 400 })
    }
    if (body.username === 'admin' && body.password === 'admin123') {
      return HttpResponse.json(ok({ token: VALID_TOKEN, user: mockUser }))
    }
    return HttpResponse.json(fail('用户名或密码错误', 401), { status: 401 })
  }),

  // ── 管理接口 ──────────────────────────────────────────────

  // GET /api/admin/dashboard
  http.get('/api/admin/dashboard', async ({ request }) => {
    await delay(300)
    const authErr = checkAuth(request)
    if (authErr) return HttpResponse.json(authErr, { status: 401 })
    return HttpResponse.json(ok(mockDashboard))
  }),

  // GET /api/admin/articles
  http.get('/api/admin/articles', async ({ request }) => {
    await delay(300)
    const authErr = checkAuth(request)
    if (authErr) return HttpResponse.json(authErr, { status: 401 })

    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || '1')
    const pageSize = Number(url.searchParams.get('pageSize') || '10')
    const status = url.searchParams.get('status') || undefined

    let articles = [...mockArticles]
    if (status) articles = articles.filter((a) => a.status === status)

    const summaries: ArticleSummary[] = articles.map(({ content, ...rest }) => rest)
    return HttpResponse.json(ok(paginate(summaries, page, pageSize)))
  }),

  // GET /api/admin/articles/:id — 管理用文章详情（按 ID 查询，含草稿）
  http.get('/api/admin/articles/:id', async ({ params, request }) => {
    await delay(200)
    const authErr = checkAuth(request)
    if (authErr) return HttpResponse.json(authErr, { status: 401 })

    const article = mockArticles.find((a) => a.id === params.id)
    if (!article) return HttpResponse.json(fail('文章不存在', 404), { status: 404 })
    return HttpResponse.json(ok(article))
  }),

  // POST /api/admin/articles
  // 成功 (201)：正常创建
  // 失败 (400)：标题为空
  // 失败 (401)：未认证
  // 失败 (500)：服务器错误（通过 X-Test-Error: 500 触发）
  http.post('/api/admin/articles', async ({ request }) => {
    await delay(400)
    const authErr = checkAuth(request)
    if (authErr) return HttpResponse.json(authErr, { status: 401 })
    const err500 = check500(request)
    if (err500) return HttpResponse.json(err500, { status: 500 })

    const body = (await request.json()) as Omit<ArticleDetail, 'id' | 'viewCount' | 'createdAt' | 'updatedAt'>
    if (!body.title || body.title.trim() === '') {
      return HttpResponse.json(fail('文章标题不能为空'), { status: 400 })
    }
    const newArticle: ArticleDetail = {
      ...body,
      id: `art-${Date.now()}`,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return HttpResponse.json(ok(newArticle), { status: 201 })
  }),

  // PUT /api/admin/articles/:id
  // 成功 (200)：正常更新
  // 失败 (400)：标题为空
  // 失败 (401)：未认证
  // 失败 (404)：文章不存在
  // 失败 (500)：服务器错误
  http.put('/api/admin/articles/:id', async ({ params, request }) => {
    await delay(400)
    const authErr = checkAuth(request)
    if (authErr) return HttpResponse.json(authErr, { status: 401 })
    const err500 = check500(request)
    if (err500) return HttpResponse.json(err500, { status: 500 })

    const body = (await request.json()) as Omit<ArticleDetail, 'id' | 'viewCount' | 'createdAt' | 'updatedAt'>
    if (!body.title || body.title.trim() === '') {
      return HttpResponse.json(fail('文章标题不能为空'), { status: 400 })
    }
    const existing = mockArticles.find((a) => a.id === params.id)
    if (!existing) return HttpResponse.json(fail('文章不存在', 404), { status: 404 })
    const updated: ArticleDetail = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
    }
    return HttpResponse.json(ok(updated))
  }),

  // DELETE /api/admin/articles/:id
  // 成功 (200)：正常删除
  // 失败 (401)：未认证
  // 失败 (404)：文章不存在
  // 失败 (500)：服务器错误
  http.delete('/api/admin/articles/:id', async ({ params, request }) => {
    await delay(300)
    const authErr = checkAuth(request)
    if (authErr) return HttpResponse.json(authErr, { status: 401 })
    const err500 = check500(request)
    if (err500) return HttpResponse.json(err500, { status: 500 })

    const existing = mockArticles.find((a) => a.id === params.id)
    if (!existing) return HttpResponse.json(fail('文章不存在', 404), { status: 404 })
    return HttpResponse.json(ok(null))
  }),

  // POST /api/admin/categories
  // 成功 (201)：正常创建
  // 失败 (400)：名称为空或重复
  // 失败 (401)：未认证
  // 失败 (500)：服务器错误
  http.post('/api/admin/categories', async ({ request }) => {
    await delay(300)
    const authErr = checkAuth(request)
    if (authErr) return HttpResponse.json(authErr, { status: 401 })
    const err500 = check500(request)
    if (err500) return HttpResponse.json(err500, { status: 500 })

    const body = (await request.json()) as Omit<Category, 'id' | 'articleCount'>
    if (!body.name || body.name.trim() === '') {
      return HttpResponse.json(fail('分类名称不能为空'), { status: 400 })
    }
    const duplicate = mockCategories.find((c) => c.name === body.name || c.slug === body.slug)
    if (duplicate) {
      return HttpResponse.json(fail('分类名称或标识已存在'), { status: 400 })
    }
    const newCat: Category = { ...body, id: `cat-${Date.now()}`, articleCount: 0 }
    return HttpResponse.json(ok(newCat), { status: 201 })
  }),

  // PUT /api/admin/categories/:id
  // 成功 (200)：正常更新
  // 失败 (400)：名称为空
  // 失败 (401)：未认证
  // 失败 (404)：分类不存在
  // 失败 (500)：服务器错误
  http.put('/api/admin/categories/:id', async ({ params, request }) => {
    await delay(300)
    const authErr = checkAuth(request)
    if (authErr) return HttpResponse.json(authErr, { status: 401 })
    const err500 = check500(request)
    if (err500) return HttpResponse.json(err500, { status: 500 })

    const body = (await request.json()) as Omit<Category, 'id' | 'articleCount'>
    if (!body.name || body.name.trim() === '') {
      return HttpResponse.json(fail('分类名称不能为空'), { status: 400 })
    }
    const existing = mockCategories.find((c) => c.id === params.id)
    if (!existing) return HttpResponse.json(fail('分类不存在', 404), { status: 404 })
    return HttpResponse.json(ok({ ...existing, ...body }))
  }),

  // DELETE /api/admin/categories/:id
  // 成功 (200)：正常删除
  // 失败 (400)：有关联文章
  // 失败 (401)：未认证
  // 失败 (404)：分类不存在
  // 失败 (500)：服务器错误
  http.delete('/api/admin/categories/:id', async ({ params, request }) => {
    await delay(300)
    const authErr = checkAuth(request)
    if (authErr) return HttpResponse.json(authErr, { status: 401 })
    const err500 = check500(request)
    if (err500) return HttpResponse.json(err500, { status: 500 })

    const existing = mockCategories.find((c) => c.id === params.id)
    if (!existing) return HttpResponse.json(fail('分类不存在', 404), { status: 404 })
    if (existing.articleCount > 0) {
      return HttpResponse.json(fail('该分类下还有文章，无法删除'), { status: 400 })
    }
    return HttpResponse.json(ok(null))
  }),

  // POST /api/admin/tags
  // 成功 (201)：正常创建
  // 失败 (400)：名称为空或重复
  // 失败 (401)：未认证
  // 失败 (500)：服务器错误
  http.post('/api/admin/tags', async ({ request }) => {
    await delay(300)
    const authErr = checkAuth(request)
    if (authErr) return HttpResponse.json(authErr, { status: 401 })
    const err500 = check500(request)
    if (err500) return HttpResponse.json(err500, { status: 500 })

    const body = (await request.json()) as Omit<Tag, 'id' | 'articleCount'>
    if (!body.name || body.name.trim() === '') {
      return HttpResponse.json(fail('标签名称不能为空'), { status: 400 })
    }
    const duplicate = mockTags.find((t) => t.name === body.name || t.slug === body.slug)
    if (duplicate) {
      return HttpResponse.json(fail('标签名称或标识已存在'), { status: 400 })
    }
    const newTag: Tag = { ...body, id: `tag-${Date.now()}`, articleCount: 0 }
    return HttpResponse.json(ok(newTag), { status: 201 })
  }),

  // PUT /api/admin/tags/:id
  // 成功 (200)：正常更新
  // 失败 (400)：名称为空
  // 失败 (401)：未认证
  // 失败 (404)：标签不存在
  // 失败 (500)：服务器错误
  http.put('/api/admin/tags/:id', async ({ params, request }) => {
    await delay(300)
    const authErr = checkAuth(request)
    if (authErr) return HttpResponse.json(authErr, { status: 401 })
    const err500 = check500(request)
    if (err500) return HttpResponse.json(err500, { status: 500 })

    const body = (await request.json()) as Omit<Tag, 'id' | 'articleCount'>
    if (!body.name || body.name.trim() === '') {
      return HttpResponse.json(fail('标签名称不能为空'), { status: 400 })
    }
    const existing = mockTags.find((t) => t.id === params.id)
    if (!existing) return HttpResponse.json(fail('标签不存在', 404), { status: 404 })
    return HttpResponse.json(ok({ ...existing, ...body }))
  }),

  // DELETE /api/admin/tags/:id
  // 成功 (200)：正常删除
  // 失败 (401)：未认证
  // 失败 (404)：标签不存在
  // 失败 (500)：服务器错误
  http.delete('/api/admin/tags/:id', async ({ params, request }) => {
    await delay(300)
    const authErr = checkAuth(request)
    if (authErr) return HttpResponse.json(authErr, { status: 401 })
    const err500 = check500(request)
    if (err500) return HttpResponse.json(err500, { status: 500 })

    const existing = mockTags.find((t) => t.id === params.id)
    if (!existing) return HttpResponse.json(fail('标签不存在', 404), { status: 404 })
    return HttpResponse.json(ok(null))
  }),

  // GET /api/admin/comments
  http.get('/api/admin/comments', async ({ request }) => {
    await delay(300)
    const authErr = checkAuth(request)
    if (authErr) return HttpResponse.json(authErr, { status: 401 })

    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || '1')
    const pageSize = Number(url.searchParams.get('pageSize') || '10')
    const start = (page - 1) * pageSize
    const items = mockComments.slice(start, start + pageSize)
    return HttpResponse.json(ok({
      items,
      pagination: { page, pageSize, total: mockComments.length, totalPages: Math.ceil(mockComments.length / pageSize) },
    }))
  }),

  // PUT /api/admin/comments/:id/approve
  // 成功 (200)：正常审核
  // 失败 (401)：未认证
  // 失败 (404)：评论不存在
  // 失败 (500)：服务器错误
  http.put('/api/admin/comments/:id/approve', async ({ params, request }) => {
    await delay(200)
    const authErr = checkAuth(request)
    if (authErr) return HttpResponse.json(authErr, { status: 401 })
    const err500 = check500(request)
    if (err500) return HttpResponse.json(err500, { status: 500 })

    const comment = mockComments.find((c) => c.id === params.id)
    if (!comment) return HttpResponse.json(fail('评论不存在', 404), { status: 404 })
    return HttpResponse.json(ok({ ...comment, isApproved: true }))
  }),

  // DELETE /api/admin/comments/:id
  // 成功 (200)：正常删除
  // 失败 (401)：未认证
  // 失败 (404)：评论不存在
  // 失败 (500)：服务器错误
  http.delete('/api/admin/comments/:id', async ({ params, request }) => {
    await delay(200)
    const authErr = checkAuth(request)
    if (authErr) return HttpResponse.json(authErr, { status: 401 })
    const err500 = check500(request)
    if (err500) return HttpResponse.json(err500, { status: 500 })

    const comment = mockComments.find((c) => c.id === params.id)
    if (!comment) return HttpResponse.json(fail('评论不存在', 404), { status: 404 })
    return HttpResponse.json(ok(null))
  }),

  // GET /api/admin/settings
  http.get('/api/admin/settings', async ({ request }) => {
    await delay(200)
    const authErr = checkAuth(request)
    if (authErr) return HttpResponse.json(authErr, { status: 401 })
    return HttpResponse.json(ok(mockSettings))
  }),

  // PUT /api/admin/settings
  // 成功 (200)：正常更新
  // 失败 (400)：站点名称为空
  // 失败 (401)：未认证
  // 失败 (500)：服务器错误
  http.put('/api/admin/settings', async ({ request }) => {
    await delay(400)
    const authErr = checkAuth(request)
    if (authErr) return HttpResponse.json(authErr, { status: 401 })
    const err500 = check500(request)
    if (err500) return HttpResponse.json(err500, { status: 500 })

    const body = (await request.json()) as SiteSettings
    if (!body.siteName || body.siteName.trim() === '') {
      return HttpResponse.json(fail('站点名称不能为空'), { status: 400 })
    }
    return HttpResponse.json(ok(body))
  }),

  // GET /api/admin/profile
  http.get('/api/admin/profile', async ({ request }) => {
    await delay(200)
    const authErr = checkAuth(request)
    if (authErr) return HttpResponse.json(authErr, { status: 401 })
    return HttpResponse.json(ok(mockUser))
  }),

  // PUT /api/admin/profile
  // 成功 (200)：正常更新
  // 失败 (400)：昵称或邮箱为空
  // 失败 (401)：未认证
  // 失败 (500)：服务器错误
  http.put('/api/admin/profile', async ({ request }) => {
    await delay(400)
    const authErr = checkAuth(request)
    if (authErr) return HttpResponse.json(authErr, { status: 401 })
    const err500 = check500(request)
    if (err500) return HttpResponse.json(err500, { status: 500 })

    const body = (await request.json()) as Partial<User>
    if (body.nickname !== undefined && !body.nickname.trim()) {
      return HttpResponse.json(fail('昵称不能为空'), { status: 400 })
    }
    if (body.email !== undefined && !body.email.trim()) {
      return HttpResponse.json(fail('邮箱不能为空'), { status: 400 })
    }
    return HttpResponse.json(ok({ ...mockUser, ...body }))
  }),

  // PUT /api/admin/password
  // 成功 (200)：原密码正确
  // 失败 (400)：原密码错误或新密码为空
  // 失败 (401)：未认证
  // 失败 (500)：服务器错误
  http.put('/api/admin/password', async ({ request }) => {
    await delay(400)
    const authErr = checkAuth(request)
    if (authErr) return HttpResponse.json(authErr, { status: 401 })
    const err500 = check500(request)
    if (err500) return HttpResponse.json(err500, { status: 500 })

    const body = (await request.json()) as { oldPassword: string; newPassword: string }
    if (!body.newPassword || body.newPassword.trim() === '') {
      return HttpResponse.json(fail('新密码不能为空'), { status: 400 })
    }
    if (body.oldPassword !== 'admin123') {
      return HttpResponse.json(fail('原密码错误'), { status: 400 })
    }
    return HttpResponse.json(ok(null))
  }),
]
