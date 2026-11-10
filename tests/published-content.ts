import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Reads the same JSON records the CMS edits, so browser checks follow the
// published content instead of hard-coding today's representative fixtures.
// Ordering mirrors src/data/catalog.ts and src/data/news.ts.

type Category = { slug: string; title: string; order: number; archived?: boolean };
type Product = { slug: string; title: string; category: string; order: number; archived?: boolean };
type Article = { slug: string; title: string; date: string; summary: string; order: number; archived?: boolean };
type Section = { type: string; title: string; body?: string };

const dataDir = join(process.cwd(), 'src', 'data');

const records = <T>(folder: string): T[] =>
  readdirSync(join(dataDir, folder))
    .filter((file) => file.endsWith('.json'))
    .sort()
    .map((file) => {
      const record = JSON.parse(readFileSync(join(dataDir, folder, file), 'utf8'));
      return { ...record, slug: record.slug || file.replace(/\.json$/, '') } as T;
    });

export const publishedCategories = records<Category>('categories')
  .filter((category) => !category.archived)
  .sort((a, b) => a.order - b.order);

export const publishedProducts = records<Product>('products')
  .filter((product) => !product.archived && publishedCategories.some((category) => category.slug === product.category))
  .sort((a, b) => a.order - b.order);

export const productsInCategory = (slug: string) => publishedProducts.filter((product) => product.category === slug);

export const categoryTitle = (slug: string) => publishedCategories.find((category) => category.slug === slug)!.title;

export const publishedArticles = records<Article>('news')
  .filter((article) => !article.archived)
  .sort((a, b) => a.order - b.order || b.date.localeCompare(a.date));

export const publishedNewsCount = publishedArticles.length;

const knownSections = new Set(['hero', 'categories', 'products', 'certificates', 'contact']);
export const homepageSections: Section[] = (
  JSON.parse(readFileSync(join(dataDir, 'pages', 'products.json'), 'utf8')).sections as Section[]
).filter((section) => knownSections.has(section.type));

// A category that has products, used to walk the category → product journey.
export const sampleCategory = publishedCategories.find((category) => productsInCategory(category.slug).length > 0)!;
export const sampleProduct = productsInCategory(sampleCategory.slug)[0];
