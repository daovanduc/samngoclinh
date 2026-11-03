type CategoryRecord = {
  title: string;
  image: string;
  alt: string;
  description?: string;
  order: number;
  archived?: boolean;
};

type ProductRecord = {
  title: string;
  category: string;
  image: string;
  alt: string;
  summary: string;
  description?: string;
  product_info?: string;
  benefits?: string[];
  recommended_users?: string;
  directions?: string;
  usage_notes?: string;
  order: number;
  archived?: boolean;
};

type CatalogEntry<T> = T & { slug: string };

const recordsFrom = <T>(files: Record<string, unknown>): CatalogEntry<T>[] =>
  Object.entries(files).map(([path, value]) => ({
    ...(value as T),
    slug: path.split('/').at(-1)!.replace(/\.json$/, ''),
  }));

const categoryFiles = import.meta.glob('./categories/*.json', {
  eager: true,
  import: 'default',
});
const productFiles = import.meta.glob('./products/*.json', {
  eager: true,
  import: 'default',
});

export const categories = recordsFrom<CategoryRecord>(categoryFiles)
  .filter((category) => !category.archived)
  .sort((a, b) => a.order - b.order);

export const products = recordsFrom<ProductRecord>(productFiles)
  .filter((product) => !product.archived && categories.some((category) => category.slug === product.category))
  .sort((a, b) => a.order - b.order);

export const productsForCategory = (slug: string) =>
  products.filter((product) => product.category === slug);

export const certificates = [
  'Vị trí chứng nhận 1',
  'Vị trí chứng nhận 2',
  'Vị trí chứng nhận 3',
  'Vị trí chứng nhận 4',
];
