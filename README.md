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

## 开发工具：frontend-standard 命令

本项目使用 `.claude/commands/frontend-standard.md` 驱动开发，在 Claude Code 中输入 `/frontend-standard` 即可触发。

### 它解决什么问题

AI 写代码有一个天生盲区：能写出单个文件的高质量代码，但不会主动检查跨文件的一致性。比如：

- 写的 `<Link to="/categories/cat-1">` 指向了不存在的路由
- 调用的 API 函数参数和 `api-contract.ts` 定义不一致
- 组件缺少 Loading / Empty / Error 状态
- `services.ts` 里请求的端点在 `handlers.ts` 里没有对应 mock

这个项目早期就发生过路由缺失 bug（`/categories/cat-2` 空白页），发现后 command 立即迭代，新增了"路由契约清算"阶段来防止同类问题。

### 7 个阶段、14 个步骤

| 阶段 | 步骤 | 做什么 |
|------|------|--------|
| 数据与接口清算 | 1-3 | types.ts → api-contract.ts → services.ts，三层契约 |
| Mock 环境搭建 | 4-5 | MSW handlers 覆盖每个 API 的成功+失败分支 |
| 组件原子化开发 | 6-8 | 组件树 → 逐一实现 → 补齐四种异步状态 |
| 路由契约清算 | 9-10 | 扫描所有 `<Link>` 和 `navigate()` → 对照路由表 → 修复未匹配项 |
| 组件交叉校验 | 11 | 检查 import / API / 类型是否一致 |
| 双模冒烟验证 | 12-13 | 正向测试已注册路由 + 逆向扫描所有链接是否可达 |
| 后端交付文档 | 14 | 生成 mock-api-doc.md 供后端开发 |

### 核心铁律

1. 每一步必须机械执行，不能跳过或合并
2. 每完成一步必须输出 `✅步骤X 完成`
3. 产出与契约不一致时必须报告"契约冲突"并停止等待裁决
4. 只准执行，不准自作聪明

### 使用方式

在 Claude Code 中：

```
/frontend-standard
```

它会强制 AI 按照上述 14 个步骤逐一执行，每步输出结果，最终生成完整的前后端代码、Mock 环境、E2E 测试和后端接口文档。
