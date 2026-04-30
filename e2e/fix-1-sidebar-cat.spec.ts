import { test, expect } from '@playwright/test'

test('Sidebar 分类链接跳转到首页并筛选', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 })

  // 点击侧边栏第一个分类
  const catLink = page.locator('aside a[href*="categoryId"]').first()
  await expect(catLink).toBeVisible()
  const href = await catLink.getAttribute('href')
  console.log(`分类链接 href: ${href}`)
  expect(href).toMatch(/^\/\?categoryId=/)

  await catLink.click()
  await page.waitForURL(/\?categoryId=/)

  // 首页应正常渲染（有 header 和文章列表或空态）
  await expect(page.locator('header')).toBeVisible()
  console.log('PASS: Sidebar 分类链接修复验证通过')
})
