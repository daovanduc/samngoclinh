import { expect, test } from '@playwright/test';

test('generated product listing shows the branded sections and representative products', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Thảo Nguyên/);
  await expect(page.getByRole('heading', { name: 'Sản phẩm nổi bật' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sản phẩm', exact: true })).toHaveAttribute('href', '#products');
  await expect(page.getByRole('heading', { name: 'Sâm Ngọc Linh ngâm mật ong 500ml' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Thông tin cửa hàng & liên hệ' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Hũ sâm Ngọc Linh ngâm mật ong' })).toBeVisible();
  for (const image of await page.getByRole('img').all()) {
    const source = await image.getAttribute('src');
    expect(source).toBeTruthy();
    const response = await page.request.get(new URL(source!, page.url()).toString());
    expect(response.ok(), `image should load: ${source}`).toBeTruthy();
  }
  const internalDestinations = await page.locator('a[href^="#"]').evaluateAll((links) =>
    links.map((link) => (link as HTMLAnchorElement).hash.slice(1)),
  );
  for (const id of internalDestinations) await expect(page.locator(`#${id}`)).toHaveCount(1);
});

test('mobile navigation is keyboard operable and exposes its expanded state', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: /menu/i });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation', { name: 'Điều hướng chính' })).toBeVisible();
  await page.getByRole('link', { name: 'Sản phẩm', exact: true }).last().click();
  await expect(page).toHaveURL(/#products$/);
});

for (const viewport of [
  { name: 'desktop', width: 1280, height: 900, columns: 3 },
  { name: 'tablet', width: 800, height: 1024, columns: 2 },
  { name: 'phone', width: 390, height: 844, columns: 1 },
]) {
  test(`listing content remains visible at ${viewport.name} width`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Danh mục sản phẩm' })).toBeVisible();
    await expect(page.locator('#products .product-card')).toHaveCount(6);
    const columns = await page.locator('.product-grid').evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length);
    expect(columns).toBe(viewport.columns);
    await expect(page.getByRole('link', { name: /liên hệ/i }).last()).toBeVisible();
    const pageWidth = await page.locator('body').evaluate((el) => el.scrollWidth);
    expect(pageWidth).toBeLessThanOrEqual(viewport.width);
  });
}
