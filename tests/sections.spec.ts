import { expect, test } from '@playwright/test';

for (const viewport of [{ name: 'desktop', width: 1280 }, { name: 'tablet', width: 800 }, { name: 'phone', width: 390 }]) {
  test(`page sections stay visible and authored in order on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: 900 });
    await page.goto('/');
    const sections = page.locator('[data-page-section]');
    await expect(sections).toHaveCount(5);
    await expect(sections.nth(0)).toHaveAttribute('data-page-section', 'hero');
    await expect(sections.nth(1)).toHaveAttribute('data-page-section', 'categories');
    await expect(sections.nth(2)).toHaveAttribute('data-page-section', 'products');
    await expect(sections.nth(3)).toHaveAttribute('data-page-section', 'certificates');
    await expect(sections.nth(4)).toHaveAttribute('data-page-section', 'contact');
    for (const section of await sections.all()) await expect(section).toBeVisible();
    await expect(page.locator('[data-page-section="categories"] > .section-description')).toHaveText('Khám phá những sản vật từ núi rừng Ngọc Linh.');
    await expect(page.locator('[data-page-section="products"] > .section-description')).toHaveText('Chọn một sản phẩm để xem thông tin chi tiết.');
    await expect(page.locator('[data-page-section="certificates"] > .section-description')).toHaveText('Thông tin chứng nhận và cam kết chất lượng của Thảo Nguyên.');
    expect(await page.locator('body').evaluate((el) => el.scrollWidth)).toBeLessThanOrEqual(viewport.width);
  });
}
