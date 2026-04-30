# Mock API 接口说明文档

> 本文档基于前端 `api-contract.ts` 和 `handlers.ts` 生成，面向后端开发人员。
> 前端严格依照此文档中的数据结构进行开发，后端实际接口应与此文档保持兼容。

---

## 目录

- [1. 通用约定](#1-通用约定)
- [2. 数据模型定义](#2-数据模型定义)
- [3. 公开接口（无需认证）](#3-公开接口无需认证)
  - [3.1 获取文章列表](#31-get-apiarticles)
  - [3.2 获取文章详情](#32-get-apiarticlesslug)
  - [3.3 获取分类列表](#33-get-apicategories)
  - [3.4 获取标签列表](#34-get-apitags)
  - [3.5 获取文章归档](#35-get-apiarchive)
  - [3.6 获取站点设置](#36-get-apisite-settings)
  - [3.7 获取关于页数据](#37-get-apiabout)
  - [3.8 管理员登录](#38-post-apilogin)
- [4. 管理接口（需认证）](#4-管理接口需认证)
  - [4.1 仪表盘统计](#41-get-apiadmindashboard)
  - [4.2 管理文章列表](#42-get-apiadminarticles)
  - [4.3 创建文章](#43-post-apiadminarticles)
  - [4.4 更新文章](#44-put-apiadminarticlesid)
  - [4.5 删除文章](#45-delete-apiadminarticlesid)
  - [4.6 创建分类](#46-post-apiadmincategories)
  - [4.7 更新分类](#47-put-apiadmincategoriesid)
  - [4.8 删除分类](#48-delete-apiadmincategoriesid)
  - [4.9 创建标签](#49-post-apiadmintags)
  - [4.10 更新标签](#410-put-apiadmintagsid)
  - [4.11 删除标签](#411-delete-apiadmintagsid)
  - [4.12 管理评论列表](#412-get-apiadmincomments)
  - [4.13 审核评论](#413-put-apiadmincommentsidapprove)
  - [4.14 删除评论](#414-delete-apiadmincommentsid)
  - [4.15 获取站点设置](#415-get-apiadminsettings)
  - [4.16 更新站点设置](#416-put-apiadminsettings)
  - [4.17 获取个人信息](#417-get-apiadminprofile)
  - [4.18 更新个人信息](#418-put-apiadminprofile)
  - [4.19 修改密码](#419-put-apiadminpassword)
- [5. Mock 已模拟的分支汇总](#5-mock-已模拟的分支汇总)
- [6. 前后端契约对齐说明](#6-前后端契约对齐说明)

---

## 1. 通用约定

### 基础 URL

```
http://localhost:5173/api
```

### 统一响应格式

所有接口均返回以下 JSON 结构：

```json
{
  "code": 200,
  "data": {},
  "message": "ok"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `code` | number | 业务状态码。200=成功，400=参数错误，401=未认证，404=资源不存在，500=服务器错误 |
| `data` | T \| null | 业务数据。成功时为具体数据对象，失败时为 `null` |
| `message` | string | 提示信息。成功时为 `"ok"`，失败时为具体错误描述 |

### Content-Type

所有接口请求和响应均为 `application/json`。

### 认证方式

管理接口（`/api/admin/*`）需要在请求头中携带 JWT Token：

```
Authorization: Bearer <token>
```

Token 通过登录接口 `/api/login` 获取。

### 分页参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `page` | number | 否 | 1 | 页码，从 1 开始 |
| `pageSize` | number | 否 | 10 | 每页条数 |

### 分页响应结构

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## 2. 数据模型定义

### ArticleSummary（文章列表项）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 文章唯一标识，如 `"art-1"` |
| `title` | string | 文章标题 |
| `slug` | string | URL 友好标识，如 `"deep-dive-react-hooks"` |
| `summary` | string | 文章摘要 |
| `coverImage` | string | 封面图 URL，可为空字符串 |
| `categoryId` | string | 所属分类 ID |
| `tagIds` | string[] | 标签 ID 数组 |
| `status` | string | 文章状态：`"draft"` / `"published"` / `"archived"` |
| `viewCount` | number | 阅读次数 |
| `createdAt` | string | 创建时间，ISO 8601 格式 |
| `updatedAt` | string | 更新时间，ISO 8601 格式 |

### ArticleDetail（文章详情）

继承 `ArticleSummary`，额外包含：

| 字段 | 类型 | 说明 |
|------|------|------|
| `content` | string | 文章正文内容（Markdown 格式） |

### Category（分类）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 分类唯一标识，如 `"cat-1"` |
| `name` | string | 分类名称 |
| `slug` | string | URL 友好标识 |
| `description` | string | 分类描述 |
| `articleCount` | number | 该分类下的文章数量 |
| `sortOrder` | number | 排序权重，数字越小越靠前 |

### Tag（标签）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 标签唯一标识，如 `"tag-1"` |
| `name` | string | 标签名称 |
| `slug` | string | URL 友好标识 |
| `articleCount` | number | 使用该标签的文章数量 |

### User（用户/管理员）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 用户唯一标识 |
| `username` | string | 登录用户名（不可修改） |
| `nickname` | string | 显示昵称 |
| `avatar` | string | 头像 URL |
| `email` | string | 邮箱地址 |
| `bio` | string | 个人简介 |

### SiteSettings（站点设置）

| 字段 | 类型 | 说明 |
|------|------|------|
| `siteName` | string | 站点名称 |
| `siteDescription` | string | 站点描述 |
| `logo` | string | Logo 图片 URL |
| `favicon` | string | Favicon 路径 |
| `footerText` | string | 页脚文字 |
| `socialLinks` | object | 社交链接（见下表） |
| `postsPerPage` | number | 每页显示文章数 |

**socialLinks 结构：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `github` | string | GitHub 主页 URL |
| `twitter` | string | Twitter 主页 URL |
| `email` | string | 联系邮箱 |

### Comment（评论）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 评论唯一标识 |
| `articleId` | string | 所属文章 ID |
| `authorName` | string | 评论者昵称 |
| `authorEmail` | string | 评论者邮箱 |
| `content` | string | 评论内容 |
| `isApproved` | boolean | 是否已审核通过 |
| `createdAt` | string | 评论时间，ISO 8601 格式 |

### DashboardStats（仪表盘统计）

| 字段 | 类型 | 说明 |
|------|------|------|
| `totalArticles` | number | 文章总数 |
| `totalViews` | number | 总阅读量 |
| `totalComments` | number | 评论总数 |
| `totalCategories` | number | 分类数量 |

### ArchiveItem（归档项）

| 字段 | 类型 | 说明 |
|------|------|------|
| `year` | number | 年份 |
| `months` | object[] | 月份列表 |
| `months[].month` | number | 月份（1-12） |
| `months[].articles` | ArticleSummary[] | 该月的文章列表 |

---

## 3. 公开接口（无需认证）

### 3.1 `GET /api/articles`

获取已发布文章列表，支持分页和筛选。

**Query 参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | number | 否 | 页码，默认 1 |
| `pageSize` | number | 否 | 每页条数，默认 10 |
| `categoryId` | string | 否 | 按分类筛选 |
| `tagId` | string | 否 | 按标签筛选 |
| `keyword` | string | 否 | 关键词搜索（匹配标题和摘要） |

**成功响应 (200)：**

```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "art-1",
        "title": "深入理解 React Hooks",
        "slug": "deep-dive-react-hooks",
        "summary": "本文详细介绍了 React Hooks 的原理和最佳实践...",
        "coverImage": "https://picsum.photos/seed/react/800/400",
        "categoryId": "cat-1",
        "tagIds": ["tag-1", "tag-2"],
        "status": "published",
        "viewCount": 1234,
        "createdAt": "2026-03-15T10:00:00Z",
        "updatedAt": "2026-03-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 5,
      "totalPages": 1
    }
  },
  "message": "ok"
}
```

**Mock 模拟说明：**
- 仅返回 `status === 'published'` 的文章
- 支持 `categoryId`、`tagId`、`keyword` 筛选
- 无结果时返回空数组 `items: []`，`total: 0`

---

### 3.2 `GET /api/articles/:slug`

根据 slug 获取文章详情（含正文）。

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `slug` | string | 文章 URL 标识 |

**成功响应 (200)：**

```json
{
  "code": 200,
  "data": {
    "id": "art-1",
    "title": "深入理解 React Hooks",
    "slug": "deep-dive-react-hooks",
    "summary": "本文详细介绍了 React Hooks 的原理和最佳实践...",
    "content": "# 深入理解 React Hooks\n\nReact Hooks 是 React 16.8 引入的新特性...",
    "coverImage": "https://picsum.photos/seed/react/800/400",
    "categoryId": "cat-1",
    "tagIds": ["tag-1", "tag-2"],
    "status": "published",
    "viewCount": 1234,
    "createdAt": "2026-03-15T10:00:00Z",
    "updatedAt": "2026-03-15T10:00:00Z"
  },
  "message": "ok"
}
```

**失败响应 (404)：**

```json
{
  "code": 404,
  "data": null,
  "message": "文章不存在"
}
```

**Mock 模拟说明：**
- 仅返回 `status === 'published'` 的文章
- slug 不存在或文章为草稿时返回 404

---

### 3.3 `GET /api/categories`

获取所有分类列表。

**成功响应 (200)：**

```json
{
  "code": 200,
  "data": [
    {
      "id": "cat-1",
      "name": "前端开发",
      "slug": "frontend",
      "description": "前端技术文章",
      "articleCount": 5,
      "sortOrder": 1
    },
    {
      "id": "cat-2",
      "name": "后端开发",
      "slug": "backend",
      "description": "后端技术文章",
      "articleCount": 3,
      "sortOrder": 2
    }
  ],
  "message": "ok"
}
```

---

### 3.4 `GET /api/tags`

获取所有标签列表。

**成功响应 (200)：**

```json
{
  "code": 200,
  "data": [
    {
      "id": "tag-1",
      "name": "React",
      "slug": "react",
      "articleCount": 3
    },
    {
      "id": "tag-2",
      "name": "TypeScript",
      "slug": "typescript",
      "articleCount": 4
    }
  ],
  "message": "ok"
}
```

---

### 3.5 `GET /api/archive`

获取文章归档数据，按年月分组。

**成功响应 (200)：**

```json
{
  "code": 200,
  "data": [
    {
      "year": 2026,
      "months": [
        {
          "month": 3,
          "articles": [
            {
              "id": "art-1",
              "title": "深入理解 React Hooks",
              "slug": "deep-dive-react-hooks",
              "summary": "...",
              "coverImage": "...",
              "categoryId": "cat-1",
              "tagIds": ["tag-1", "tag-2"],
              "status": "published",
              "viewCount": 1234,
              "createdAt": "2026-03-15T10:00:00Z",
              "updatedAt": "2026-03-15T10:00:00Z"
            }
          ]
        }
      ]
    }
  ],
  "message": "ok"
}
```

---

### 3.6 `GET /api/site-settings`

获取公开的站点设置信息（用于前台页面渲染）。

**成功响应 (200)：**

```json
{
  "code": 200,
  "data": {
    "siteName": "小张的技术博客",
    "siteDescription": "分享前端、后端技术文章和生活感悟",
    "logo": "https://picsum.photos/seed/logo/200/60",
    "favicon": "/favicon.ico",
    "footerText": "© 2026 小张的技术博客. All rights reserved.",
    "socialLinks": {
      "github": "https://github.com/example",
      "twitter": "https://twitter.com/example",
      "email": "admin@blog.com"
    },
    "postsPerPage": 10
  },
  "message": "ok"
}
```

---

### 3.7 `GET /api/about`

获取"关于我"页面数据。

**成功响应 (200)：**

```json
{
  "code": 200,
  "data": {
    "id": "user-1",
    "username": "admin",
    "nickname": "博主小张",
    "avatar": "https://picsum.photos/seed/avatar/200/200",
    "email": "admin@blog.com",
    "bio": "一个热爱技术的全栈开发者，专注于前端和 Node.js 开发。"
  },
  "message": "ok"
}
```

---

### 3.8 `POST /api/login`

管理员登录，获取 JWT Token。

**请求体：**

```json
{
  "username": "admin",
  "password": "admin123"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | string | 是 | 用户名 |
| `password` | string | 是 | 密码 |

**成功响应 (200)：**

```json
{
  "code": 200,
  "data": {
    "token": "mock-jwt-token-abc123",
    "user": {
      "id": "user-1",
      "username": "admin",
      "nickname": "博主小张",
      "avatar": "https://picsum.photos/seed/avatar/200/200",
      "email": "admin@blog.com",
      "bio": "一个热爱技术的全栈开发者，专注于前端和 Node.js 开发。"
    }
  },
  "message": "ok"
}
```

**失败响应 (401)：**

```json
{
  "code": 401,
  "data": null,
  "message": "用户名或密码错误"
}
```

**Mock 模拟说明：**
- 成功条件：`username === 'admin' && password === 'admin123'`
- 其他任意组合返回 401

---

## 4. 管理接口（需认证）

> 以下所有接口均需在请求头中携带：
> ```
> Authorization: Bearer <token>
> ```
> 未携带或 Token 无效时返回 401。

### 4.1 `GET /api/admin/dashboard`

获取仪表盘统计数据。

**成功响应 (200)：**

```json
{
  "code": 200,
  "data": {
    "totalArticles": 6,
    "totalViews": 3632,
    "totalComments": 3,
    "totalCategories": 3
  },
  "message": "ok"
}
```

---

### 4.2 `GET /api/admin/articles`

获取管理端文章列表（含草稿和归档）。

**Query 参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | number | 否 | 页码，默认 1 |
| `pageSize` | number | 否 | 每页条数，默认 10 |
| `status` | string | 否 | 按状态筛选：`"draft"` / `"published"` / `"archived"` |

**成功响应 (200)：**

```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "art-6",
        "title": "Draft: 新特性预告",
        "slug": "draft-new-feature",
        "summary": "这是一篇草稿文章",
        "coverImage": "",
        "categoryId": "cat-1",
        "tagIds": ["tag-1"],
        "status": "draft",
        "viewCount": 0,
        "createdAt": "2026-04-01T12:00:00Z",
        "updatedAt": "2026-04-01T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 6,
      "totalPages": 1
    }
  },
  "message": "ok"
}
```

**Mock 模拟说明：**
- 返回所有状态的文章（含草稿）
- 支持 `status` 参数筛选

---

### 4.3 `POST /api/admin/articles`

创建新文章。

**请求体：**

```json
{
  "title": "新文章标题",
  "slug": "new-article-slug",
  "content": "# 文章正文\n\n这是正文内容...",
  "summary": "这是文章摘要",
  "coverImage": "https://example.com/cover.jpg",
  "categoryId": "cat-1",
  "tagIds": ["tag-1", "tag-2"],
  "status": "draft"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | 是 | 文章标题 |
| `slug` | string | 是 | URL 标识，需唯一 |
| `content` | string | 是 | 文章正文（Markdown） |
| `summary` | string | 否 | 文章摘要 |
| `coverImage` | string | 否 | 封面图 URL |
| `categoryId` | string | 否 | 分类 ID |
| `tagIds` | string[] | 否 | 标签 ID 数组 |
| `status` | string | 是 | `"draft"` / `"published"` / `"archived"` |

**成功响应 (201)：**

```json
{
  "code": 200,
  "data": {
    "id": "art-1714500000000",
    "title": "新文章标题",
    "slug": "new-article-slug",
    "content": "# 文章正文\n\n这是正文内容...",
    "summary": "这是文章摘要",
    "coverImage": "https://example.com/cover.jpg",
    "categoryId": "cat-1",
    "tagIds": ["tag-1", "tag-2"],
    "status": "draft",
    "viewCount": 0,
    "createdAt": "2026-04-30T12:00:00.000Z",
    "updatedAt": "2026-04-30T12:00:00.000Z"
  },
  "message": "ok"
}
```

**失败响应 (400)：**

```json
{
  "code": 400,
  "data": null,
  "message": "文章标题不能为空"
}
```

**Mock 模拟说明：**
- 成功时返回 201，`id` 由服务端生成（格式 `art-{timestamp}`）
- `viewCount` 默认为 0，`createdAt`/`updatedAt` 为服务端当前时间
- 标题为空时返回 400

---

### 4.4 `PUT /api/admin/articles/:id`

更新已有文章。

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | string | 文章 ID |

**请求体：** 同创建文章 (4.3)

**成功响应 (200)：**

```json
{
  "code": 200,
  "data": {
    "id": "art-1",
    "title": "更新后的标题",
    "slug": "deep-dive-react-hooks",
    "content": "更新后的内容...",
    "summary": "更新后的摘要",
    "coverImage": "https://picsum.photos/seed/react/800/400",
    "categoryId": "cat-1",
    "tagIds": ["tag-1", "tag-2"],
    "status": "published",
    "viewCount": 1234,
    "createdAt": "2026-03-15T10:00:00Z",
    "updatedAt": "2026-04-30T12:00:00.000Z"
  },
  "message": "ok"
}
```

**失败响应 (404)：**

```json
{
  "code": 404,
  "data": null,
  "message": "文章不存在"
}
```

**Mock 模拟说明：**
- `updatedAt` 更新为当前时间
- `viewCount` 和 `createdAt` 保持原值
- ID 不存在时返回 404

---

### 4.5 `DELETE /api/admin/articles/:id`

删除文章。

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | string | 文章 ID |

**成功响应 (200)：**

```json
{
  "code": 200,
  "data": null,
  "message": "ok"
}
```

**失败响应 (404)：**

```json
{
  "code": 404,
  "data": null,
  "message": "文章不存在"
}
```

---

### 4.6 `POST /api/admin/categories`

创建新分类。

**请求体：**

```json
{
  "name": "新分类",
  "slug": "new-category",
  "description": "分类描述",
  "sortOrder": 1
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 分类名称 |
| `slug` | string | 是 | URL 标识 |
| `description` | string | 否 | 分类描述 |
| `sortOrder` | number | 否 | 排序权重 |

**成功响应 (201)：**

```json
{
  "code": 200,
  "data": {
    "id": "cat-1714500000000",
    "name": "新分类",
    "slug": "new-category",
    "description": "分类描述",
    "articleCount": 0,
    "sortOrder": 1
  },
  "message": "ok"
}
```

**Mock 模拟说明：**
- `id` 由服务端生成，`articleCount` 默认为 0

---

### 4.7 `PUT /api/admin/categories/:id`

更新分类。

**请求体：** 同创建分类 (4.6)

**成功响应 (200)：**

```json
{
  "code": 200,
  "data": {
    "id": "cat-1",
    "name": "更新后的名称",
    "slug": "frontend",
    "description": "更新后的描述",
    "articleCount": 5,
    "sortOrder": 1
  },
  "message": "ok"
}
```

**失败响应 (404)：**

```json
{
  "code": 404,
  "data": null,
  "message": "分类不存在"
}
```

**Mock 模拟说明：**
- `articleCount` 保持原值，不随请求体修改

---

### 4.8 `DELETE /api/admin/categories/:id`

删除分类。

**成功响应 (200)：**

```json
{
  "code": 200,
  "data": null,
  "message": "ok"
}
```

**失败响应 (404)：**

```json
{
  "code": 404,
  "data": null,
  "message": "分类不存在"
}
```

**Mock 模拟的业务失败 (400)：**

```json
{
  "code": 400,
  "data": null,
  "message": "该分类下还有文章，无法删除"
}
```

> 注：此失败场景在 Mock 中通过独立路径 `/api/admin/categories/:id/has-articles` 模拟，
> 后端应实现为：当分类下仍有文章时，DELETE 接口返回 400。

---

### 4.9 `POST /api/admin/tags`

创建新标签。

**请求体：**

```json
{
  "name": "Vue",
  "slug": "vue"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 标签名称 |
| `slug` | string | 是 | URL 标识 |

**成功响应 (201)：**

```json
{
  "code": 200,
  "data": {
    "id": "tag-1714500000000",
    "name": "Vue",
    "slug": "vue",
    "articleCount": 0
  },
  "message": "ok"
}
```

---

### 4.10 `PUT /api/admin/tags/:id`

更新标签。

**请求体：** 同创建标签 (4.9)

**成功响应 (200)：**

```json
{
  "code": 200,
  "data": {
    "id": "tag-1",
    "name": "React.js",
    "slug": "react",
    "articleCount": 3
  },
  "message": "ok"
}
```

**失败响应 (404)：**

```json
{
  "code": 404,
  "data": null,
  "message": "标签不存在"
}
```

---

### 4.11 `DELETE /api/admin/tags/:id`

删除标签。

**成功响应 (200)：**

```json
{
  "code": 200,
  "data": null,
  "message": "ok"
}
```

**失败响应 (404)：**

```json
{
  "code": 404,
  "data": null,
  "message": "标签不存在"
}
```

---

### 4.12 `GET /api/admin/comments`

获取评论管理列表（含待审核）。

**Query 参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | number | 否 | 页码，默认 1 |
| `pageSize` | number | 否 | 每页条数，默认 10 |

**成功响应 (200)：**

```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "cmt-1",
        "articleId": "art-1",
        "authorName": "张三",
        "authorEmail": "zhangsan@example.com",
        "content": "写得非常详细，受益匪浅！",
        "isApproved": true,
        "createdAt": "2026-03-16T08:00:00Z"
      },
      {
        "id": "cmt-3",
        "articleId": "art-2",
        "authorName": "王五",
        "authorEmail": "wangwu@example.com",
        "content": "TypeScript 的类型体操真的太强了",
        "isApproved": false,
        "createdAt": "2026-03-11T15:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 3,
      "totalPages": 1
    }
  },
  "message": "ok"
}
```

---

### 4.13 `PUT /api/admin/comments/:id/approve`

审核通过评论。

**成功响应 (200)：**

```json
{
  "code": 200,
  "data": {
    "id": "cmt-3",
    "articleId": "art-2",
    "authorName": "王五",
    "authorEmail": "wangwu@example.com",
    "content": "TypeScript 的类型体操真的太强了",
    "isApproved": true,
    "createdAt": "2026-03-11T15:00:00Z"
  },
  "message": "ok"
}
```

**失败响应 (404)：**

```json
{
  "code": 404,
  "data": null,
  "message": "评论不存在"
}
```

**Mock 模拟说明：**
- 成功时 `isApproved` 强制设为 `true`
- 无请求体，直接调用即可

---

### 4.14 `DELETE /api/admin/comments/:id`

删除评论。

**成功响应 (200)：**

```json
{
  "code": 200,
  "data": null,
  "message": "ok"
}
```

**失败响应 (404)：**

```json
{
  "code": 404,
  "data": null,
  "message": "评论不存在"
}
```

---

### 4.15 `GET /api/admin/settings`

获取站点设置（管理端，内容同公开接口，但需认证）。

**成功响应 (200)：** 同 [3.6 GET /api/site-settings](#36-get-apisite-settings)

---

### 4.16 `PUT /api/admin/settings`

更新站点设置。

**请求体：** 完整的 SiteSettings 对象

```json
{
  "siteName": "新博客名称",
  "siteDescription": "新的描述",
  "logo": "https://example.com/new-logo.png",
  "favicon": "/favicon.ico",
  "footerText": "© 2026 新博客. All rights reserved.",
  "socialLinks": {
    "github": "https://github.com/new",
    "twitter": "https://twitter.com/new",
    "email": "new@blog.com"
  },
  "postsPerPage": 20
}
```

**成功响应 (200)：** 返回更新后的完整 SiteSettings 对象。

**Mock 模拟说明：**
- 请求体直接作为响应返回（全量更新）

---

### 4.17 `GET /api/admin/profile`

获取管理员个人信息。

**成功响应 (200)：** 同 [3.7 GET /api/about](#37-get-apiabout)

---

### 4.18 `PUT /api/admin/profile`

更新管理员个人信息。

**请求体：**

```json
{
  "nickname": "新昵称",
  "avatar": "https://example.com/new-avatar.jpg",
  "email": "new@blog.com",
  "bio": "新的个人简介"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `nickname` | string | 是 | 显示昵称 |
| `avatar` | string | 否 | 头像 URL |
| `email` | string | 是 | 邮箱 |
| `bio` | string | 否 | 个人简介 |

**成功响应 (200)：** 返回更新后的完整 User 对象（`username` 和 `id` 不变）。

```json
{
  "code": 200,
  "data": {
    "id": "user-1",
    "username": "admin",
    "nickname": "新昵称",
    "avatar": "https://example.com/new-avatar.jpg",
    "email": "new@blog.com",
    "bio": "新的个人简介"
  },
  "message": "ok"
}
```

**Mock 模拟说明：**
- `username` 和 `id` 始终保持原值，不会被请求体覆盖

---

### 4.19 `PUT /api/admin/password`

修改管理员密码。

**请求体：**

```json
{
  "oldPassword": "admin123",
  "newPassword": "newSecurePass456"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `oldPassword` | string | 是 | 原密码 |
| `newPassword` | string | 是 | 新密码 |

**成功响应 (200)：**

```json
{
  "code": 200,
  "data": null,
  "message": "ok"
}
```

**失败响应 (400)：**

```json
{
  "code": 400,
  "data": null,
  "message": "原密码错误"
}
```

**Mock 模拟说明：**
- 成功条件：`oldPassword === 'admin123'`
- 其他原密码返回 400

---

## 5. Mock 已模拟的分支汇总

| 接口 | 成功分支 | 失败分支 | 失败业务含义 |
|------|----------|----------|-------------|
| `POST /api/login` | admin/admin123 | 其他凭据 → 401 | 用户名或密码错误 |
| `POST /api/admin/articles` | 正常创建 → 201 | 标题为空 → 400 | 文章标题不能为空 |
| `PUT /api/admin/articles/:id` | 正常更新 → 200 | ID 不存在 → 404 | 文章不存在 |
| `DELETE /api/admin/articles/:id` | 正常删除 → 200 | ID 不存在 → 404 | 文章不存在 |
| `PUT /api/admin/categories/:id` | 正常更新 → 200 | ID 不存在 → 404 | 分类不存在 |
| `DELETE /api/admin/categories/:id` | 正常删除 → 200 | ID 不存在 → 404 | 分类不存在 |
| `DELETE /api/admin/categories/:id` (has-articles) | — | 有关联文章 → 400 | 该分类下还有文章，无法删除 |
| `PUT /api/admin/tags/:id` | 正常更新 → 200 | ID 不存在 → 404 | 标签不存在 |
| `DELETE /api/admin/tags/:id` | 正常删除 → 200 | ID 不存在 → 404 | 标签不存在 |
| `PUT /api/admin/comments/:id/approve` | 正常审核 → 200 | ID 不存在 → 404 | 评论不存在 |
| `DELETE /api/admin/comments/:id` | 正常删除 → 200 | ID 不存在 → 404 | 评论不存在 |
| `PUT /api/admin/password` | 原密码正确 → 200 | 原密码错误 → 400 | 原密码错误 |

**建议后端额外实现的失败场景（Mock 未覆盖）：**

| 接口 | 建议失败场景 | 建议 HTTP 状态码 |
|------|-------------|-----------------|
| `POST /api/admin/articles` | slug 重复 → 400 | 400 |
| `POST /api/admin/categories` | 分类名重复 → 400 | 400 |
| `POST /api/admin/tags` | 标签名重复 → 400 | 400 |
| `POST /api/login` | 账号被禁用 → 403 | 403 |
| 所有 admin 接口 | Token 过期 → 401 | 401 |
| 所有 admin 接口 | 权限不足 → 403 | 403 |

---

## 6. 前后端契约对齐说明

### 前端承诺

1. 前端所有 API 调用均封装在 `src/services/index.ts` 中，组件不直接调用 `fetch`。
2. 前端严格依照本文档中的请求格式发送数据，不会发送文档未定义的字段。
3. 前端依据 `code` 字段判断业务成功/失败：`code === 200` 为成功，其他为失败。
4. 前端依赖 `message` 字段展示错误提示给用户。

### 后端承诺

1. 后端响应必须包含 `code`、`data`、`message` 三个字段，不可缺省。
2. 成功响应 `code` 必须为 `200`（HTTP 状态码可以是 200 或 201）。
3. 失败响应 `data` 必须为 `null`，`message` 必须包含可展示给用户的错误描述。
4. 分页接口必须返回 `pagination` 对象，包含 `page`、`pageSize`、`total`、`totalPages` 四个字段。
5. 所有时间字段使用 ISO 8601 格式（如 `2026-04-30T12:00:00Z`）。
6. ID 字段使用字符串类型，格式不限（建议使用 UUID 或自增数字的字符串形式）。

### 兼容性原则

- 后端可以返回本文档未定义的额外字段（向前兼容），前端会忽略未知字段。
- 后端不可省略本文档中定义的字段，否则前端渲染会出错。
- 后端可以将 `code` 的错误码细化（如 400 改为 422），但成功码必须保持 `200`。
