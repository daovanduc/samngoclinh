import { expect, test } from '@playwright/test';
import { publishedArticles, sampleCategory, sampleProduct } from './published-content';

const routes = [
  '/',
  '/products/',
  `/products/categories/${sampleCategory.slug}/`,
  `/products/${sampleProduct.slug}/`,
  '/news/',
  ...publishedArticles.slice(0, 1).map((article) => `/news/${article.slug}/`),
];

for (const viewport of [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'tablet', width: 800, height: 1024 },
  { name: 'phone', width: 390, height: 844 },
]) {
  test(`all generated content routes and primary navigation work on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status(), `route should render: ${route}`).toBe(200);
      if (viewport.width <= 768) {
        const menuToggle = page.getByRole('button', { name: /menu/i });
        await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
        await menuToggle.click();
        await expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
      }
      await expect(page.getByRole('navigation', { name: 'Điều hướng chính' })).toBeVisible();
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(await page.locator('body').evaluate((el) => el.scrollWidth)).toBeLessThanOrEqual(viewport.width);
      const internalLinks = await page.locator('a[href^="/"]').evaluateAll((links) =>
        [...new Set(links.map((link) => (link as HTMLAnchorElement).getAttribute('href')!).filter((href) => !href.startsWith('/admin')))],
      );
      for (const href of internalLinks) {
        const linkResponse = await page.request.get(new URL(href, page.url()).toString());
        expect(linkResponse.status(), `internal link should resolve from ${route}: ${href}`).toBe(200);
      }
    }
  });
}

