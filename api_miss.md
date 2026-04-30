# 路由缺失问题报告

## 问题描述

前端页面中存在 3 处链接指向未注册的路由，点击后页面空白，无任何错误提示。

## 缺失路由

| 链接所在文件 | 链接目标 | 实际表现 |
|-------------|----------|----------|
| `src/components/Sidebar.tsx` 第 21 行 | `/categories/${cat.id}` | 空白页 |
| `src/components/Sidebar.tsx` 第 43 行 | `/tags/${tag.id}` | 空白页 |
| `src/pages/ArticlePage.tsx` 第 64 行 | `/categories/${article.categoryId}` | 空白页 |

`App.tsx` 中只注册了 `/categories` 和 `/tags`，没有注册 `/categories/:id` 和 `/tags/:id`。

## 发现过程

1. 用户在文章详情页点击"查看分类"，跳转到 `/categories/cat-2` 后页面空白。
2. 用户反馈后，我检查代码确认是路由未注册。
3. 用户要求测试所有路由。我编写了 Playwright 测试脚本，但只测试了已注册的 16 条路由，全部通过。
4. 用户指出我漏测了带参数的路由。我补充测试后确认 `/categories/:id` 和 `/tags/:id` 均为空白。

## 责任说明

这是我在开发过程中的疏漏。

- **设计阶段**：我在 `Sidebar.tsx` 和 `ArticlePage.tsx` 中编写了指向 `/categories/${id}` 的链接，但没有在 `App.tsx` 中注册对应的路由，也没有检查链接与路由是否一致。
- **测试阶段**：用户首次要求测试所有路由时，我只测试了已注册路由的可达性，没有检查代码中的所有链接是否都有对应路由覆盖。直到用户再次指出，我才补充了参数路由的测试。

## 修复方向

`/?categoryId=xxx` 和 `/?tagId=xxx` 已被首页支持，上述 3 处链接应改为带 query 参数的首页路径。代码未修改，待用户确认。
