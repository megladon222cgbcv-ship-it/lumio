const CACHE='lumio-shell-v1';
const SHELL=['./','index.html','manifest.webmanifest','supabase-config.js','icons/icon-192.png','icons/icon-512.png','https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.hostname.endsWith('supabase.co'))return; // never cache auth/data calls
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(CACHE).then(h=>h.put('index.html',c));return x;}).catch(()=>caches.match('index.html')));return;}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok&&(u.origin===location.origin||u.hostname==='cdn.jsdelivr.net')){const c=x.clone();caches.open(CACHE).then(h=>h.put(r,c));}return x;})));
});
