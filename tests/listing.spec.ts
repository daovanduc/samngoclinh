import { expect, test } from '@playwright/test';
import { categoryTitle, homepageSections, productsInCategory, publishedProducts, sampleCategory, sampleProduct } from './published-content';

const sectionTitle = (type: string) => homepageSections.find((section) => section.type === type)?.title;
const firstProduct = publishedProducts[0];

test('generated product listing shows the branded sections and representative products', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Thảo Nguyên/);
  for (const section of homepageSections) await expect(page.getByRole('heading', { name: section.title, exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sản phẩm', exact: true })).toHaveAttribute('href', '/products/');
  if (sectionTitle('products')) await expect(page.locator('#products').getByRole('heading', { name: firstProduct.title, exact: true })).toBeVisible();
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

  const categoryPath = `/products/categories/${sampleCategory.slug}/`;
  const productPath = `/products/${sampleProduct.slug}/`;
  if (sectionTitle('categories')) {
    const categoryLink = page.locator(`[data-page-section="categories"] a[href="${categoryPath}"]`);
    await expect(categoryLink).toBeVisible();
    await categoryLink.click();
  } else {
    await page.goto(categoryPath);
  }
  await expect(page).toHaveURL(new RegExp(`${categoryPath}$`));
  await expect(page.getByRole('heading', { level: 1, name: sampleCategory.title, exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: sampleProduct.title, exact: true })).toBeVisible();
  await page.locator(`.product-card-link[href="${productPath}"]`).click();
  await expect(page).toHaveURL(new RegExp(`${productPath}$`));
  await expect(page.getByRole('heading', { level: 1, name: sampleProduct.title, exact: true })).toBeVisible();

  await page.goto('/products/');
  await expect(page.getByRole('heading', { name: 'Tất cả sản phẩm' })).toBeVisible();
  const productLinks = await page.locator('.product-card-link').evaluateAll((links) =>
    links.map((link) => (link as HTMLAnchorElement).getAttribute('href')),
  );
  expect(productLinks).toHaveLength(publishedProducts.length);
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
    if (sectionTitle('products')) {
      await expect(page.locator('#products .product-card')).toHaveCount(publishedProducts.length);
      const columns = await page.locator('#products .products-grid').evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length);
      // Phones show two compact cards per row on the homepage.
      expect(columns).toBe(viewport.width <= 768 ? 2 : viewport.columns);
    }
    const contact = homepageSections.find((section) => section.type === 'contact');
    if (contact?.body) await expect(page.locator('#contact')).toContainText(contact.body.split('\n').at(-1)!.trim());
    const pageWidth = await page.locator('body').evaluate((el) => el.scrollWidth);
    expect(pageWidth).toBeLessThanOrEqual(viewport.width);

    await page.goto(`/products/categories/${sampleCategory.slug}/`);
    await expect(page.getByRole('heading', { level: 1, name: sampleCategory.title, exact: true })).toBeVisible();
    await expect(page.locator('.product-grid .product-card')).toHaveCount(productsInCategory(sampleCategory.slug).length);
    const categoryColumns = await page.locator('.product-grid').evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length);
    expect(categoryColumns).toBe(viewport.columns);
    await page.locator('.product-card-link').first().click();
    await expect(page.getByRole('heading', { level: 1, name: sampleProduct.title, exact: true })).toBeVisible();
    await expect(page.locator('.product-detail-hero .product-category')).toHaveText(categoryTitle(sampleProduct.category));
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

test('product detail pages never render empty optional sections', async ({ page }) => {
  for (const product of publishedProducts) {
    await page.goto(`/products/${product.slug}/`);
    for (const section of await page.locator('.product-detail-copy').all()) {
      await expect(section.getByRole('heading', { level: 2 })).not.toBeEmpty();
      const text = (await section.innerText()).replace((await section.getByRole('heading', { level: 2 }).innerText()), '').trim();
      expect(text.length, `"${product.slug}" shows a heading without content`).toBeGreaterThan(0);
    }
    for (const related of await page.locator('.related-products .product-card-link').all()) {
      const slug = (await related.getAttribute('href'))!.split('/').at(-2);
      expect(publishedProducts.find((item) => item.slug === slug)?.category, 'related products share the category').toBe(product.category);
    }
  }
});
