import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
const root=new URL('../dist/',import.meta.url).pathname;
const walk=p=>readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(p,e.name)):[join(p,e.name)]);
const html=walk(root).filter(p=>p.endsWith('.html'));
test('public routes and draft exclusion',()=>{
 for(const route of ['index.html','studies/index.html','projects/index.html','projects/slack-codex/index.html','studies/slack-codex-workflow/index.html','studies/static-site-and-api/index.html','studies/automation-before-schedule/index.html','studies/ui-request-to-checklist/index.html','rss.xml','404.html']) assert.ok(existsSync(join(root,route)),route);
 assert.ok(!existsSync(join(root,'studies/writing-template/index.html')));
 for(const file of walk(root)) if(/\.(html|xml)$/.test(file)) assert.ok(!readFileSync(file,'utf8').includes('DRAFT_EXAMPLE_NOT_PUBLISHED'),file);
});
test('every local page link, asset and fragment resolves',()=>{
 for(const file of html){
 const text=readFileSync(file,'utf8');
 for(const match of text.matchAll(/(?:href|src)="([^"]+)"/g)){
 const url=new URL(match[1],'https://example.test/'+file.slice(root.length));
 if(url.origin!=='https://example.test') continue;
 const target=join(root,decodeURIComponent(url.pathname),url.pathname.endsWith('/')?'index.html':'');
 assert.ok(existsSync(target),file+' -> '+url.pathname);
 if(url.hash) assert.ok(readFileSync(target,'utf8').includes('id="'+decodeURIComponent(url.hash.slice(1))+'"'),url.href);
 }
 }
});
test('public metadata and RSS',()=>{
 for(const file of html){const text=readFileSync(file,'utf8'); assert.match(text,/<html lang="ko"/);assert.equal((text.match(/<h1[ >]/g)||[]).length,1);assert.match(text,/<meta name="description" content="[^"]+"/);assert.ok(!text.includes('/Users/'));}
 const rss=readFileSync(join(root,'rss.xml'),'utf8');const routes=html.filter(p=>p.includes('/studies/')&&!p.endsWith('/studies/index.html'));assert.equal((rss.match(/<item>/g)||[]).length,routes.length);for(const route of routes) assert.ok(rss.includes('https://ehdxo89.github.io/'+route.slice(root.length).replace(/index\.html$/, '')),route);assert.ok(!rss.includes('writing-template'));
});
