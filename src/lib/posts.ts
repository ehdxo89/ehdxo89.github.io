import { getCollection } from 'astro:content';
export async function publishedPosts() {
  return (await getCollection('studies', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.id.localeCompare(b.id));
}
export function dateLabel(date: Date) {
  return date.toISOString().slice(0, 10).replaceAll('-', '.');
}
