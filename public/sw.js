if(!self.define){let e,i={};const s=(s,r)=>(s=new URL(s+".js",r).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(r,n)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let c={};const t=e=>s(e,o),l={module:{uri:o},exports:c,require:t};i[o]=Promise.all(r.map((e=>l[e]||t(e)))).then((e=>(n(...e),c)))}}define(["./workbox-1117d62c"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute(
  [{url:"assets/index-0NvcX52R.css",revision:null}
    ,{url:"assets/index-Bt9sQ8my.js",revision:null}
    ,{url:"index.html",revision:"1863e7065f81562b8c2476ada40f0ca1"}
    ,{url:"index.js",revision:"f0379773547d0b95b656bf9f378a055c"}
    ,{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"}
    ,{url:"service-worker.js",revision:"69487f3b64657ead8cc42ca98b93c9ab"}
    ,{url:"logo-120.png",revision:"cdcc20c675079eeec6c76bd658711f37"}
    ,{url:"logo-14.png",revision:"bb8918efce28ff513efebba057b51602"}
    ,{url:"manifest.webmanifest",revision:"9b1eabb05409398ba5d85bb2389b16cb"}
  ],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));


self.addEventListener('activate', (event) => {
  console.log("Service worker activado.");
  event.waitUntil(self.clients.claim()); // Hace que el SW tome el control inmediatamente
});
