type NewsRecord = {
  title: string;
  slug?: string;
  date: string;
  summary: string;
  body: string;
  image?: string;
  order: number;
  archived?: boolean;
};

const files = import.meta.glob('./news/*.json', { eager: true, import: 'default' });

export const articles = Object.entries(files)
  .map(([path, value]) => {
    const record = value as NewsRecord;
    const filenameSlug = path.split('/').at(-1)!.replace(/\.json$/, '');
    return { ...record, slug: record.slug || filenameSlug };
  })
  .filter((article) => !article.archived)
  .sort((a, b) => a.order - b.order || b.date.localeCompare(a.date));
