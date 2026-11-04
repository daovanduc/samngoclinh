import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateContent } from '../scripts/validate-content.js';

const valid = {
  categories: [{ slug: 'herbs', title: 'Herbs', image: '/herbs.jpg', alt: 'Herbs', order: 1 }],
  products: [{ slug: 'tea-500ml', title: 'Tea', category: 'herbs', image: '/tea.jpg', alt: 'Tea', summary: '500 ml', order: 1 }],
  articles: [{ slug: 'story', title: 'Story', date: '2026-10-01', summary: 'Summary', body: 'Body', order: 1 }],
  sections: [{ type: 'hero', title: 'Welcome', body: 'Hello' }],
};

describe('content validation', () => {
  it('accepts complete content with valid references', () => assert.deepEqual(validateContent(valid), []));
  it('rejects missing required fields and invalid category references', () => {
    const errors = validateContent({ ...valid, products: [{ ...valid.products[0], title: '', category: 'missing' }] });
    assert.match(errors.join('\n'), /products\/tea-500ml.*title/);
    assert.match(errors.join('\n'), /unknown category "missing"/);
  });
  it('rejects duplicate and malformed slugs', () => {
    const errors = validateContent({ ...valid, categories: [...valid.categories, { ...valid.categories[0], title: 'Other' }], articles: [{ ...valid.articles[0], slug: 'Bad Slug' }] });
    assert.match(errors.join('\n'), /duplicate slug "herbs"/);
    assert.match(errors.join('\n'), /invalid slug "Bad Slug"/);
  });
  it('rejects unknown or incomplete authored sections', () => {
    const errors = validateContent({ ...valid, sections: [{ type: 'unknown', title: '' }] });
    assert.match(errors.join('\n'), /unsupported section type/);
    assert.match(errors.join('\n'), /section 1.*title/);
  });
});
