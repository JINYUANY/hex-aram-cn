// The build substitutes these constants after the self-contained HTML is finalized.
const build='416295d2d76308e604e3f5fd1d844ac3ed74f0e87ba7148c948dd2f0ba94617d';
const checksum='f5aaae926669203ac29828f805ab6cae4af7cc7bde94173c4e6f6eb10ef7bee8';
const root=new URL('./',self.location.href).href;
const prefix='hex-aram-cn/program/'+new URL(root).pathname+'/';
const current=prefix+build;

self.addEventListener('install',event=>event.waitUntil((async()=>{
  const url=new URL(root);url.searchParams.set('v',build);
  const res=await fetch(url,{cache:'no-store',credentials:'omit',redirect:'error'});
  if(!res.ok)throw Error('程序下载失败');
  const hash=await crypto.subtle.digest('SHA-256',await res.clone().arrayBuffer());
  const hex=Array.from(new Uint8Array(hash),n=>n.toString(16).padStart(2,'0')).join('');
  if(hex!==checksum)throw Error('等待同一构建的程序文件');
  await (await caches.open(current)).put(root,res);
  await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  await self.clients.claim();
  for(const key of await caches.keys())if(key.startsWith(prefix)&&key!==current)await caches.delete(key);
})()));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.mode!=='navigate' || url.origin!==self.location.origin ||
    ![new URL(root).pathname,new URL('index.html',root).pathname].includes(url.pathname))return;
  event.respondWith((async()=>{
    const cache=await caches.open(current);
    if(url.searchParams.has('v') && url.searchParams.get('v')!==build){
      try{const res=await fetch(event.request);if(res.ok)return res;}catch{/* Recover the verified program offline. */}
    }
    return await cache.match(root) || fetch(event.request);
  })());
});
