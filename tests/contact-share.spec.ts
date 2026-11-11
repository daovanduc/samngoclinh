import { expect, test } from '@playwright/test';
import { sampleProduct } from './published-content';

test('pages carry absolute link-preview tags for Zalo and Facebook', async ({ page }) => {
  for (const route of ['/', `/products/${sampleProduct.slug}/`, '/news/']) {
    await page.goto(route);
    const image = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(image, route).toMatch(/^https:\/\/.+\.(jpe?g|png|webp)$/i);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', await page.title());
    expect(await page.locator('meta[property="og:description"]').getAttribute('content')).toBeTruthy();
  }
  await page.goto(`/products/${sampleProduct.slug}/`);
  const productImage = await page.locator('.product-detail-hero > img').getAttribute('src');
  expect(await page.locator('meta[property="og:image"]').getAttribute('content')).toContain(productImage!);
});

test('phones get a fixed call and Zalo bar; desktop does not', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/products/${sampleProduct.slug}/`);
  const bar = page.getByRole('region', { name: 'Liên hệ nhanh' });
  await expect(bar).toBeVisible();
  await expect(bar.locator('a[href^="tel:"]')).toBeVisible();
  await expect(bar.locator('a[href^="https://zalo.me/"]')).toBeVisible();
  const box = await bar.boundingBox();
  expect(box!.y + box!.height).toBeGreaterThan(830);
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(bar).toBeHidden();
  await expect(page.locator('.product-detail-hero a[href^="https://zalo.me/"]')).toBeVisible();
});

test('the hero offers a products button and Zalo consultation', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('[data-page-section="hero"]');
  await expect(hero.getByRole('link', { name: /sản phẩm/i })).toHaveAttribute('href', /^\//);
  await expect(hero.locator('a[href^="https://zalo.me/"]')).toBeVisible();
});
