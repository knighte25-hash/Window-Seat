const V='window-seat-v4';
const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET') return;
  if(u.origin===location.origin || u.host.endsWith('fonts.googleapis.com') || u.host.endsWith('fonts.gstatic.com')){
    e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{
      const net=fetch(e.request).then(r=>{ if(r && (r.ok||r.type==='opaque')){ const cl=r.clone(); caches.open(V).then(c=>c.put(e.request,cl)); } return r; }).catch(()=>hit);
      return hit||net;
    }));
  }
});
