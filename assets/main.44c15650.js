(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function c(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(e){if(e.ep)return;e.ep=!0;const t=c(e);fetch(e.href,t)}})();const _="modulepreload",h=function(r){return"/"+r},p={},l=function(i,c,s){if(!c||c.length===0)return i();const e=document.getElementsByTagName("link");return Promise.all(c.map(t=>{if(t=h(t),t in p)return;p[t]=!0;const o=t.endsWith(".css"),f=o?'[rel="stylesheet"]':"";if(!!s)for(let a=e.length-1;a>=0;a--){const d=e[a];if(d.href===t&&(!o||d.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${t}"]${f}`))return;const n=document.createElement("link");if(n.rel=o?"stylesheet":_,o||(n.as="script",n.crossOrigin=""),n.href=t,document.head.appendChild(n),o)return new Promise((a,d)=>{n.addEventListener("load",a),n.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${t}`)))})})).then(()=>i())};function m(){const r=Object.assign({"./BackButton.ts":()=>l(()=>import("./BackButton.1bcae43f.js"),["assets/BackButton.1bcae43f.js","assets/CustomElement.43dab8c6.js"]),"./ConsentBanner.ts":()=>l(()=>import("./ConsentBanner.1b7ff146.js"),["assets/ConsentBanner.1b7ff146.js","assets/CustomElement.43dab8c6.js"]),"./GeoMap.ts":()=>l(()=>import("./GeoMap.9d469983.js"),["assets/GeoMap.9d469983.js","assets/CustomElement.43dab8c6.js","assets/geo-map.c8b756f7.js","assets/ConsentBanner.1b7ff146.js"]),"./MapMarker.ts":()=>l(()=>import("./MapMarker.93e5a8c4.js"),["assets/MapMarker.93e5a8c4.js","assets/CustomElement.43dab8c6.js","assets/geo-map.c8b756f7.js"]),"./MapPopup.ts":()=>l(()=>import("./MapPopup.b98580d4.js"),["assets/MapPopup.b98580d4.js","assets/CustomElement.43dab8c6.js"]),"./MediaGallery.ts":()=>l(()=>import("./MediaGallery.ebe9542e.js"),["assets/MediaGallery.ebe9542e.js","assets/CustomElement.43dab8c6.js"]),"./ScrollIndicator.ts":()=>l(()=>import("./ScrollIndicator.76d66817.js"),["assets/ScrollIndicator.76d66817.js","assets/CustomElement.43dab8c6.js"])});for(const i in r)r[i]().then(c=>{const s=Object.values(c)[0]||null;!s||!s.register||s.register(customElements)})}function E(r,i={},c=[]){const s=document.createElement(r);for(const e of c){if(typeof e=="string"){s.insertAdjacentText("beforeend",e);continue}s.appendChild(e)}return Object.entries(i).reduce((e,[t,o])=>{switch(t){case"class":const f=Array.isArray(o)?o:[o];e.classList.add(...f);break;case"style":for(let[u,n]of Object.entries(o))e.style.setProperty(u,n);break;case"data":for(let[u,n]of Object.entries(o))e.dataset[u]=n;default:e[t]=o}return e},s)}function y(){Array.from(document.getElementsByTagName("textarea")).forEach(r=>{r.style.height=`${r.scrollHeight}px`,r.style.overflowY="hidden",r.addEventListener("input",()=>{r.style.height=0,r.style.height=`${r.scrollHeight}px`},!1)})}document.addEventListener("DOMContentLoaded",()=>{m(),y()});export{E as c};
//# sourceMappingURL=main.44c15650.js.map