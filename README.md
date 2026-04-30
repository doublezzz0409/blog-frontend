# Blog Frontend

一个基于 React + TypeScript + Tailwind CSS 的个人博客前端项目，内置 MSW Mock 环境，可独立运行无需后端。

## 技术栈

- **框架**: React 19 + TypeScript
- **构建**: Vite
- **样式**: Tailwind CSS 4
- **路由**: React Router 7
- **Mock**: MSW (Mock Service Worker)
- **测试**: Playwright

## 功能概览

### 公开页面（访客可见）

| 页面 | 路由 | 功能 |
|------|------|------|
| 首页 | `/` | 文章列表，支持分类/标签/关键词筛选 |
| 文章详情 | `/article/:slug` | 文章正文展示 |
| 分类页 | `/categories` | 全部分类列表 |
| 标签页 | `/tags` | 标签云 |
| 归档页 | `/archive` | 按年月归档 |
| 关于页 | `/about` | 博主个人信息 |

### 后台管理（需登录）

| 页面 | 路由 | 功能 |
|------|------|------|
| 登录 | `/admin/login` | 管理员登录 |
| 仪表盘 | `/admin` | 统计概览 |
| 文章管理 | `/admin/articles` | 文章 CRUD |
| 分类管理 | `/admin/categories` | 分类 CRUD |
| 标签管理 | `/admin/tags` | 标签 CRUD |
| 评论管理 | `/admin/comments` | 评论审核/删除 |
| 站点设置 | `/admin/settings` | 站点名称、描述、社交链接等 |
| 个人信息 | `/admin/profile` | 修改昵称、头像、密码 |

## 快速开始

### 方式一：一键启动（Windows）

```
双击 start.bat
```

或 PowerShell：

```
.\start.ps1
```

### 方式二：手动启动

```bash
npm install
npm run dev
```

访问 http://localhost:5173

### Mock 登录账号

- 用户名: `admin`
- 密码: `admin123`

## 项目结构

```
blog-frontend/
├── src/
│   ├── types/              # 数据模型 + API 契约
│   │   ├── index.ts        # 所有 TypeScript interface
│   │   └── api-contract.ts # API 端点类型定义
│   ├── services/           # API 服务封装（组件禁止直接 fetch）
│   │   └── index.ts
│   ├── mocks/              # MSW Mock 环境
│   │   ├── handlers.ts     # 所有 API 的 mock 响应
│   │   └── browser.ts      # Service Worker 启动
│   ├── components/         # 共享组件
│   │   ├── Header.tsx      # 顶部导航
│   │   ├── Sidebar.tsx     # 侧边栏（分类+标签）
│   │   ├── ArticleCard.tsx # 文章卡片
│   │   ├── AdminSidebar.tsx# 管理侧边导航
│   │   ├── LoadingSpinner.tsx
│   │   ├── EmptyState.tsx
│   │   └── ErrorState.tsx
│   ├── pages/              # 页面组件
│   │   ├── HomePage.tsx
│   │   ├── ArticlePage.tsx
│   │   ├── CategoriesPage.tsx
│   │   ├── TagsPage.tsx
│   │   ├── ArchivePage.tsx
│   │   ├── AboutPage.tsx
│   │   └── admin/          # 管理页面
│   │       ├── LoginPage.tsx
│   │       ├── DashboardPage.tsx
│   │       ├── ArticleListPage.tsx
│   │       ├── ArticleEditPage.tsx
│   │       ├── CategoryManagePage.tsx
│   │       ├── TagManagePage.tsx
│   │       ├── CommentManagePage.tsx
│   │       ├── SettingsPage.tsx
│   │       └── ProfilePage.tsx
│   ├── layouts/            # 布局组件
│   │   ├── PublicLayout.tsx
│   │   └── AdminLayout.tsx
│   ├── App.tsx             # 路由配置
│   └── main.tsx            # 入口（MSW 启动）
├── e2e/                    # Playwright E2E 测试
├── mock-api-doc.md         # 后端接口文档
├── api_miss.md             # 路由缺失问题报告
├── start.bat               # Windows 启动脚本
└── start.ps1               # PowerShell 启动脚本
```

## Mock 环境

项目使用 [MSW (Mock Service Worker)](https://mswjs.io/) 拦截浏览器请求，返回模拟数据。

- Mock 数据定义在 `src/mocks/handlers.ts`
- 仅在开发模式（`npm run dev`）下启用
- 所有 API 端点均有成功和失败响应
- 详见 [mock-api-doc.md](./mock-api-doc.md)

### 从 Mock 切换到真实后端

1. 搭建后端服务，实现 `mock-api-doc.md` 中定义的接口
2. 修改 `src/services/index.ts` 中的 `BASE_URL` 为后端地址
3. 生产环境构建时 MSW 不会自动启用，无需额外操作

## 测试

```bash
# 运行冒烟测试
npx playwright test e2e/smoke.spec.ts

# 运行全部测试
npx playwright test

# 安装浏览器（首次）
npx playwright install chromium
```

## 构建部署

```bash
npm run build
```

产物输出到 `dist/` 目录，可部署到任意静态托管服务（Vercel、Netlify、GitHub Pages 等）。
