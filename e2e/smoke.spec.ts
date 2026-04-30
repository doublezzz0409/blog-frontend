import { test, expect } from '@playwright/test'

test('核心用户路径：首页 → 登录 → 仪表盘 → 修改站点设置', async ({ page }) => {
  // ── 1. 打开首页，验证文章列表加载 ──
  await page.goto('/')
  await expect(page.locator('header')).toBeVisible()

  // 等待文章卡片出现（MSW 有 300ms delay）
  await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 })
  const articleCount = await page.locator('article').count()
  expect(articleCount).toBeGreaterThan(0)

  // ── 2. 进入管理后台登录页 ──
  await page.goto('/admin/login')
  await expect(page.locator('h1')).toContainText('管理员登录')

  // ── 3. 输入账号密码登录 ──
  await page.fill('input[type="text"]', 'admin')
  await page.fill('input[type="password"]', 'admin123')
  await page.click('button[type="submit"]')

  // 等待跳转到仪表盘
  await page.waitForURL('/admin')
  await expect(page.locator('h1')).toContainText('仪表盘')

  // 等待统计数据加载
  await expect(page.locator('.grid > div').first()).toBeVisible({ timeout: 10000 })
  const statCards = await page.locator('.grid > div').count()
  expect(statCards).toBe(4)

  // ── 4. 进入站点设置页 ──
  await page.click('a[href="/admin/settings"]')
  await page.waitForURL('/admin/settings')
  await expect(page.locator('h1')).toContainText('站点设置')

  // 等待设置表单加载
  await page.waitForTimeout(500)

  // ── 5. 修改站点名称并保存 ──
  const siteNameInput = page.locator('input[type="text"]').first()
  await siteNameInput.clear()
  await siteNameInput.fill('我的新博客名称')
  await page.click('button:has-text("保存设置")')

  // 验证保存成功提示
  await expect(page.locator('text=设置已保存')).toBeVisible({ timeout: 5000 })
})
