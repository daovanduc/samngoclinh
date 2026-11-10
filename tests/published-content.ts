import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Reads the same JSON records the CMS edits, so browser checks follow the
// published content instead of hard-coding how many items exist today.
type Record = { archived?: boolean; category?: string };

const dataDir = join(process.cwd(), 'src', 'data');

const published = (folder: string): (Record & { slug: string })[] =>
  readdirSync(join(dataDir, folder))
    .filter((file) => file.endsWith('.json'))
    .map((file) => ({ ...(JSON.parse(readFileSync(join(dataDir, folder, file), 'utf8')) as Record), slug: file.replace(/\.json$/, '') }))
    .filter((record) => !record.archived);

const categorySlugs = new Set(published('categories').map((category) => category.slug));

export const publishedNewsCount = published('news').length;
export const publishedProducts = published('products').filter((product) => categorySlugs.has(product.category!));
export const productsInCategory = (slug: string) => publishedProducts.filter((product) => product.category === slug).length;
