import { test, expect } from '@playwright/test'

// 已注册的参数路由
test('/article/:slug 正常渲染', async ({ page }) => {
  await page.goto('/article/deep-dive-react-hooks')
  await expect(page.getByRole('heading', { name: '深入理解 React Hooks' }).first()).toBeVisible({ timeout: 10000 })
  console.log('PASS: /article/:slug')
})

test('/admin/articles/:id 编辑页正常渲染', async ({ page }) => {
  // 先登录
  await page.goto('/admin/login')
  await page.fill('input[type="text"]', 'admin')
  await page.fill('input[type="password"]', 'admin123')
  await page.click('button[type="submit"]')
  await page.waitForURL('/admin')

  // 访问编辑页（用真实文章 ID 无法直接访问，因为 slug 路径匹配）
  // 但路由 /admin/articles/:id 会匹配 /admin/articles/art-1
  await page.goto('/admin/articles/art-1')
  await expect(page.locator('h1')).toContainText('编辑文章', { timeout: 10000 })
  console.log('PASS: /admin/articles/:id')
})

// 未注册的参数路由 — 预期空白
test('/categories/:id 未注册，应为空白', async ({ page }) => {
  await page.goto('/categories/cat-1')
  // 没有任何 h1 渲染（PublicLayout 会渲染但无子路由匹配）
  const h1Count = await page.locator('main h1').count()
  console.log(`/categories/cat-1 → main h1 数量: ${h1Count}`)
  expect(h1Count).toBe(0)
  console.log('CONFIRMED: /categories/:id 空白（路由未注册）')
})

test('/tags/:id 未注册，应为空白', async ({ page }) => {
  await page.goto('/tags/tag-1')
  const h1Count = await page.locator('main h1').count()
  console.log(`/tags/tag-1 → main h1 数量: ${h1Count}`)
  expect(h1Count).toBe(0)
  console.log('CONFIRMED: /tags/:id 空白（路由未注册）')
})
