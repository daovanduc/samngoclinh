import { expect, test } from '@playwright/test';
import { publishedArticles, publishedNewsCount } from './published-content';

const article = publishedArticles[0];

test('news cards open a generated article with its date, summary, body, and return link', async ({ page }) => {
  await page.goto('/news/');
  await expect(page).toHaveTitle(/Nhật ký Ngọc Linh/);
  await expect(page.getByRole('heading', { name: 'Nhật ký Ngọc Linh', exact: true })).toBeVisible();
  test.skip(!article, 'no published articles');
  const articlePath = `/news/${article.slug}/`;
  const articleLink = page.locator(`.news-card a[href="${articlePath}"]`).first();
  await expect(articleLink).toBeVisible();
  await articleLink.click();
  await expect(page).toHaveURL(new RegExp(`${articlePath}$`));
  await expect(page.getByRole('heading', { level: 1, name: article.title, exact: true })).toBeVisible();
  await expect(page.locator('time')).toHaveAttribute('datetime', article.date);
  await expect(page.getByText(article.summary.trim(), { exact: false }).first()).toBeVisible();
  await expect(page.locator('.article-body')).not.toBeEmpty();
  await page.getByRole('link', { name: 'Tất cả bài viết' }).click();
  await expect(page).toHaveURL(/\/news\/$/);
});

for (const viewport of [
  { name: 'desktop', width: 1280, columns: 3 },
  { name: 'tablet', width: 800, columns: 2 },
  { name: 'phone', width: 390, columns: 1 },
]) {
  test(`news list and article fit ${viewport.name} viewport`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: 900 });
    await page.goto('/news/');
    await expect(page.locator('.news-card')).toHaveCount(publishedNewsCount);
    const columns = await page.locator('.news-grid').evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length);
    expect(columns).toBe(viewport.columns);
    const listWidth = await page.locator('body').evaluate((el) => el.scrollWidth);
    expect(listWidth).toBeLessThanOrEqual(viewport.width);

    await page.getByRole('link', { name: 'Đọc bài viết' }).first().click();
    await expect(page.locator('.article-body')).toBeVisible();
    const articleWidth = await page.locator('body').evaluate((el) => el.scrollWidth);
    expect(articleWidth).toBeLessThanOrEqual(viewport.width);
  });
}
