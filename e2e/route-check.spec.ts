import { test, expect } from '@playwright/test'

// 公开路由
test('公开路由: 首页 /', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('header')).toBeVisible()
  await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 })
  console.log('PASS: /')
})

test('公开路由: 文章详情 /article/deep-dive-react-hooks', async ({ page }) => {
  await page.goto('/article/deep-dive-react-hooks')
  await expect(page.locator('h1').first()).toContainText('深入理解 React Hooks')
  console.log('PASS: /article/deep-dive-react-hooks')
})

test('公开路由: 分类页 /categories', async ({ page }) => {
  await page.goto('/categories')
  await expect(page.locator('h1')).toContainText('全部分类')
  await expect(page.locator('a[href*="categoryId"]').first()).toBeVisible({ timeout: 10000 })
  console.log('PASS: /categories')
})

test('公开路由: 标签页 /tags', async ({ page }) => {
  await page.goto('/tags')
  await expect(page.locator('h1')).toContainText('全部标签')
  await expect(page.locator('a[href*="tagId"]').first()).toBeVisible({ timeout: 10000 })
  console.log('PASS: /tags')
})

test('公开路由: 归档页 /archive', async ({ page }) => {
  await page.goto('/archive')
  await expect(page.locator('h1')).toContainText('文章归档')
  console.log('PASS: /archive')
})

test('公开路由: 关于页 /about', async ({ page }) => {
  await page.goto('/about')
  await expect(page.locator('h1')).toContainText('关于我')
  await expect(page.locator('img[alt]')).toBeVisible({ timeout: 10000 })
  console.log('PASS: /about')
})

// 管理路由 - 需要先登录
test('管理路由: 登录页 /admin/login', async ({ page }) => {
  await page.goto('/admin/login')
  await expect(page.locator('h1')).toContainText('管理员登录')
  console.log('PASS: /admin/login')
})

test('管理路由: 未登录跳转到登录页', async ({ page }) => {
  await page.goto('/admin')
  await page.waitForURL('/admin/login')
  console.log('PASS: /admin -> /admin/login (redirect)')
})

test.describe('管理路由（已登录）', () => {
  test.beforeEach(async ({ page }) => {
    // 先登录
    await page.goto('/admin/login')
    await page.fill('input[type="text"]', 'admin')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin')
  })

  test('仪表盘 /admin', async ({ page }) => {
    await page.goto('/admin')
    await expect(page.locator('h1')).toContainText('仪表盘')
    await expect(page.locator('.grid > div').first()).toBeVisible({ timeout: 10000 })
    console.log('PASS: /admin')
  })

  test('文章管理 /admin/articles', async ({ page }) => {
    await page.goto('/admin/articles')
    await expect(page.locator('h1')).toContainText('文章管理')
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10000 })
    console.log('PASS: /admin/articles')
  })

  test('新建文章 /admin/articles/new', async ({ page }) => {
    await page.goto('/admin/articles/new')
    await expect(page.locator('h1')).toContainText('新建文章')
    console.log('PASS: /admin/articles/new')
  })

  test('分类管理 /admin/categories', async ({ page }) => {
    await page.goto('/admin/categories')
    await expect(page.locator('h1')).toContainText('分类管理')
    await expect(page.locator('table tbody tr').first()).toBeVisible({ timeout: 10000 })
    console.log('PASS: /admin/categories')
  })

  test('标签管理 /admin/tags', async ({ page }) => {
    await page.goto('/admin/tags')
    await expect(page.locator('h1')).toContainText('标签管理')
    console.log('PASS: /admin/tags')
  })

  test('评论管理 /admin/comments', async ({ page }) => {
    await page.goto('/admin/comments')
    await expect(page.locator('h1')).toContainText('评论管理')
    console.log('PASS: /admin/comments')
  })

  test('站点设置 /admin/settings', async ({ page }) => {
    await page.goto('/admin/settings')
    await expect(page.locator('h1')).toContainText('站点设置')
    await expect(page.locator('input[type="text"]').first()).toBeVisible({ timeout: 10000 })
    console.log('PASS: /admin/settings')
  })

  test('个人信息 /admin/profile', async ({ page }) => {
    await page.goto('/admin/profile')
    await expect(page.locator('h1')).toContainText('个人信息')
    console.log('PASS: /admin/profile')
  })
})
