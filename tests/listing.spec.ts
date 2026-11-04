import { expect, test } from '@playwright/test';

test('generated product listing shows the branded sections and representative products', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Thảo Nguyên/);
  await expect(page.getByRole('heading', { name: 'Sản phẩm nổi bật' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sản phẩm', exact: true })).toHaveAttribute('href', '/products/');
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
  await page.getByRole('link', { name: 'Sản phẩm', exact: true }).click();
  await expect(page).toHaveURL(/\/products\/$/);
});

test('catalog cards lead to generated all-products, category, and product pages', async ({ page }) => {
  await page.goto('/');

  const productLink = page.locator('.category-card').filter({ hasText: 'Sâm Ngọc Linh' }).getByRole('link');
  await expect(productLink).toHaveAttribute('href', '/products/categories/sam-ngoc-linh/');
  await productLink.click();
  await expect(page).toHaveURL(/\/products\/categories\/sam-ngoc-linh\/$/);
  await expect(page.getByRole('heading', { name: 'Sâm Ngọc Linh', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Sâm Ngọc Linh ngâm mật ong 500ml' })).toBeVisible();
  await page.getByRole('link', { name: 'Sâm Ngọc Linh ngâm mật ong 500ml' }).last().click();
  await expect(page).toHaveURL(/\/products\/sam-ngoc-linh-ngam-mat-ong-500ml\/$/);
  await expect(page.getByRole('heading', { name: 'Sâm Ngọc Linh ngâm mật ong 500ml' })).toBeVisible();

  await page.goto('/products/');
  await expect(page.getByRole('heading', { name: 'Tất cả sản phẩm' })).toBeVisible();
  const productLinks = await page.locator('.product-card-link').evaluateAll((links) =>
    links.map((link) => (link as HTMLAnchorElement).getAttribute('href')),
  );
  expect(productLinks).toHaveLength(6);
  for (const href of productLinks) {
    expect(href).toMatch(/^\/products\/[a-z0-9-]+\/$/);
    const response = await page.request.get(new URL(href!, page.url()).toString());
    expect(response.status(), `product page should exist: ${href}`).toBe(200);
  }
});

test('each product detail page offers contact and working related product links', async ({ page }) => {
  await page.goto('/products/');
  const productHrefs = await page.locator('.product-card-link').evaluateAll((links) =>
    links.map((link) => (link as HTMLAnchorElement).getAttribute('href')!),
  );

  for (const href of productHrefs) {
    await page.goto(href);
    await expect(page.locator('.product-detail-hero img')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('.product-detail-hero a[href^="tel:"]')).toBeVisible();

    const relatedLinks = page.locator('.related-products .product-card-link');
    for (const relatedLink of await relatedLinks.all()) {
      const relatedHref = await relatedLink.getAttribute('href');
      expect(relatedHref).toMatch(/^\/products\/[a-z0-9-]+\/$/);
      expect(relatedHref).not.toBe(href);
      const relatedUrl = new URL(relatedHref!, page.url()).toString();
      await relatedLink.click();
      await expect(page).toHaveURL(relatedUrl);
      await expect(page.locator('.product-detail-hero a[href^="tel:"]')).toBeVisible();
      await page.goBack();
      await expect(page).toHaveURL(new URL(href, page.url()).toString());
    }
  }
});

for (const viewport of [
  { name: 'desktop', width: 1280, height: 900, columns: 3 },
  { name: 'tablet', width: 800, height: 1024, columns: 2 },
  { name: 'phone', width: 390, height: 844, columns: 1 },
]) {
  test(`catalog routes remain usable at ${viewport.name} width`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Danh mục sản phẩm' })).toBeVisible();
    await expect(page.locator('#products .product-card')).toHaveCount(6);
    const columns = await page.locator('.product-grid').evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length);
    expect(columns).toBe(viewport.columns);
    await expect(page.locator('a[href^="tel:"]')).toBeVisible();
    const pageWidth = await page.locator('body').evaluate((el) => el.scrollWidth);
    expect(pageWidth).toBeLessThanOrEqual(viewport.width);

    await page.goto('/products/categories/sam-ngoc-linh/');
    await expect(page.getByRole('heading', { name: 'Sâm Ngọc Linh', exact: true })).toBeVisible();
    await expect(page.locator('.product-grid .product-card')).toHaveCount(2);
    const categoryColumns = await page.locator('.product-grid').evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length);
    expect(categoryColumns).toBe(viewport.columns);
    await page.locator('.product-card-link').first().click();
    await expect(page.getByRole('heading', { name: 'Sâm Ngọc Linh ngâm mật ong 500ml', exact: true })).toBeVisible();
    await expect(page.locator('.product-detail-hero > img')).toBeVisible();
    await expect(page.locator('.product-detail-hero a[href^="tel:"]')).toBeVisible();
    const imageBox = await page.locator('.product-detail-hero > img').boundingBox();
    const contentBox = await page.locator('.product-detail-hero > div').boundingBox();
    expect(imageBox).toBeTruthy();
    expect(contentBox).toBeTruthy();
    if (viewport.width === 390) expect(imageBox!.y).toBeLessThan(contentBox!.y);
    const detailPageWidth = await page.locator('body').evaluate((el) => el.scrollWidth);
    expect(detailPageWidth).toBeLessThanOrEqual(viewport.width);
  });
}
