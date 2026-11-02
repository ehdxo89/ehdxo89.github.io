import { publishedPosts } from '../lib/posts';
const xml = (s: string) => s.replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]!));
export async function GET() {
 const posts = await publishedPosts();
 const base = 'https://ehdxo89.github.io';
 const items = posts.map(p => {
   const url = base + '/studies/' + p.id + '/';
   return `<item><title>${xml(p.data.title)}</title><link>${url}</link><guid>${url}</guid><description>${xml(p.data.description)}</description><pubDate>${p.data.date.toUTCString()}</pubDate></item>`;
 }).join('');
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>DEVLOG 스터디</title><link>${base}</link><description>학습과 구현 기록</description><language>ko</language>${items}</channel></rss>`, {headers:{'Content-Type':'application/rss+xml; charset=utf-8'}});
}
