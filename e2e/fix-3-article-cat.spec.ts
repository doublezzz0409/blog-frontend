import { test, expect } from '@playwright/test'

test('文章详情页"查看分类"链接跳转到首页并筛选', async ({ page }) => {
  await page.goto('/article/deep-dive-react-hooks')
  await expect(page.getByRole('heading', { name: '深入理解 React Hooks' }).first()).toBeVisible({ timeout: 10000 })

  const catLink = page.locator('a[href*="categoryId"]:has-text("查看分类")')
  await expect(catLink).toBeVisible()
  const href = await catLink.getAttribute('href')
  console.log(`查看分类链接 href: ${href}`)
  expect(href).toMatch(/^\/\?categoryId=/)

  await catLink.click()
  await page.waitForURL(/\?categoryId=/)

  await expect(page.locator('header')).toBeVisible()
  console.log('PASS: ArticlePage 查看分类链接修复验证通过')
})
