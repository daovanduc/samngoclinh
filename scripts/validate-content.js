import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const supportedSections = new Set(['hero', 'categories', 'products', 'recipes', 'values', 'certificates', 'contact']);
const required = {
  categories: ['title', 'image', 'alt', 'order'],
  products: ['title', 'category', 'image', 'alt', 'summary', 'order'],
  articles: ['title', 'date', 'summary', 'body', 'order'],
};
const nonblank = (value) => typeof value === 'string' && value.trim().length > 0;
const validSlug = (value) => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

export function validateContent({ categories, products, articles, sections }) {
  const errors = [];
  for (const [kind, records] of Object.entries({ categories, products, articles })) {
    const seen = new Set();
    for (const record of records) {
      const label = `${kind}/${record.slug ?? '(missing slug)'}`;
      for (const field of ['slug', ...required[kind]]) {
        if (field === 'slug' && kind === 'articles' && !record.slug) errors.push(`${label}: required field "slug" is missing`);
        else if (field === 'slug' && !validSlug(record.slug)) errors.push(`${label}: invalid slug "${record.slug}" (use lowercase letters, numbers, and hyphens)`);
        else if (field === 'order' && (!Number.isInteger(record.order) || record.order < 0)) errors.push(`${label}: "order" must be a non-negative integer`);
        else if (field !== 'slug' && field !== 'order' && !nonblank(record[field])) errors.push(`${label}: required field "${field}" is missing`);
      }
      if (validSlug(record.slug)) {
        if (seen.has(record.slug)) errors.push(`${label}: duplicate slug "${record.slug}"`);
        seen.add(record.slug);
      }
      if (kind === 'articles' && nonblank(record.date) && !/^\d{4}-\d{2}-\d{2}$/.test(record.date)) errors.push(`${label}: "date" must use YYYY-MM-DD`);
    }
  }
  const categorySlugs = new Set(categories.filter((record) => !record.archived).map((record) => record.slug));
  for (const product of products.filter((record) => !record.archived)) {
    if (nonblank(product.category) && !categorySlugs.has(product.category)) errors.push(`products/${product.slug}: unknown category "${product.category}"`);
  }
  sections.forEach((section, index) => {
    const label = `homepage section ${index + 1}`;
    if (!section || !supportedSections.has(section.type)) errors.push(`${label}: unsupported section type "${section?.type ?? ''}"`);
    if (!nonblank(section?.title)) errors.push(`${label}: required field "title" is missing`);
    if (['hero', 'contact'].includes(section?.type) && !nonblank(section.body)) errors.push(`${label}: required field "body" is missing`);
    if (['recipes', 'values'].includes(section?.type)) {
      (section.items ?? []).forEach((item, itemIndex) => {
        if (!nonblank(item?.title)) errors.push(`${label}, item ${itemIndex + 1}: required field "title" is missing`);
      });
    }
  });
  if (sections.length === 0) errors.push('homepage sections: at least one section is required');
  return errors;
}

async function recordsIn(directory, kind) {
  const files = (await readdir(directory)).filter((name) => name.endsWith('.json'));
  return Promise.all(files.map(async (filename) => {
    const record = JSON.parse(await readFile(path.join(directory, filename), 'utf8'));
    return { ...record, slug: kind === 'articles' ? record.slug : filename.replace(/\.json$/, '') };
  }));
}

export async function validateRepository(root = process.cwd()) {
  const [categories, products, articles, page] = await Promise.all([
    recordsIn(path.join(root, 'src/data/categories'), 'categories'),
    recordsIn(path.join(root, 'src/data/products'), 'products'),
    recordsIn(path.join(root, 'src/data/news'), 'articles'),
    readFile(path.join(root, 'src/data/pages/products.json'), 'utf8').then(JSON.parse),
  ]);
  return validateContent({ categories, products, articles, sections: page.sections ?? [] });
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  try {
    const errors = await validateRepository();
    if (errors.length) {
      console.error(`Content validation failed (${errors.length} issue${errors.length === 1 ? '' : 's'}):\n- ${errors.join('\n- ')}`);
      process.exitCode = 1;
    } else console.log('Content validation passed.');
  } catch (error) {
    console.error(`Content validation could not read repository content: ${error.message}`);
    process.exitCode = 1;
  }
}


