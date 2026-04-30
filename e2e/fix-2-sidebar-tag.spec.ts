import { test, expect } from '@playwright/test'

test('Sidebar 标签链接跳转到首页并筛选', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 })

  // 点击侧边栏第一个标签
  const tagLink = page.locator('aside a[href*="tagId"]').first()
  await expect(tagLink).toBeVisible()
  const href = await tagLink.getAttribute('href')
  console.log(`标签链接 href: ${href}`)
  expect(href).toMatch(/^\/\?tagId=/)

  await tagLink.click()
  await page.waitForURL(/\?tagId=/)

  await expect(page.locator('header')).toBeVisible()
  console.log('PASS: Sidebar 标签链接修复验证通过')
})
