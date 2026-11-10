import { expect, test } from '@playwright/test';
import { homepageSections } from './published-content';

for (const viewport of [{ name: 'desktop', width: 1280 }, { name: 'tablet', width: 800 }, { name: 'phone', width: 390 }]) {
  test(`page sections stay visible and authored in order on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: 900 });
    await page.goto('/');
    const sections = page.locator('[data-page-section]');
    await expect(sections).toHaveCount(homepageSections.length);
    for (const [index, authored] of homepageSections.entries()) {
      const section = sections.nth(index);
      await expect(section).toHaveAttribute('data-page-section', authored.type);
      await expect(section).toBeVisible();
      await expect(section.getByRole('heading', { name: authored.title, exact: true }).first()).toBeVisible();
      if (authored.body && ['categories', 'products', 'certificates'].includes(authored.type)) {
        await expect(section.locator(':scope > .section-description')).toHaveText(authored.body);
      }
    }
    expect(await page.locator('body').evaluate((el) => el.scrollWidth)).toBeLessThanOrEqual(viewport.width);
  });
}
