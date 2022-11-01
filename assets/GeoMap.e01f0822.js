var I=Object.defineProperty;var v=(i,t,e)=>t in i?I(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var h=(i,t,e)=>(v(i,typeof t!="symbol"?t+"":t,e),e);import{C as w}from"./CustomElement.43dab8c6.js";import{s as E}from"./geo-map.c8b756f7.js";import{c as A}from"./main.976d8410.js";import{consent as c}from"./ConsentBanner.6f89f9a8.js";var C=function i(t,e){if(t===e)return!0;if(t&&e&&typeof t=="object"&&typeof e=="object"){if(t.constructor!==e.constructor)return!1;var r,s,n;if(Array.isArray(t)){if(r=t.length,r!=e.length)return!1;for(s=r;s--!==0;)if(!i(t[s],e[s]))return!1;return!0}if(t.constructor===RegExp)return t.source===e.source&&t.flags===e.flags;if(t.valueOf!==Object.prototype.valueOf)return t.valueOf()===e.valueOf();if(t.toString!==Object.prototype.toString)return t.toString()===e.toString();if(n=Object.keys(t),r=n.length,r!==Object.keys(e).length)return!1;for(s=r;s--!==0;)if(!Object.prototype.hasOwnProperty.call(e,n[s]))return!1;for(s=r;s--!==0;){var a=n[s];if(!i(t[a],e[a]))return!1}return!0}return t!==t&&e!==e};const u="__googleMapsScriptId";var l;(function(i){i[i.INITIALIZED=0]="INITIALIZED",i[i.LOADING=1]="LOADING",i[i.SUCCESS=2]="SUCCESS",i[i.FAILURE=3]="FAILURE"})(l||(l={}));class o{constructor({apiKey:t,authReferrerPolicy:e,channel:r,client:s,id:n=u,language:a,libraries:p=[],mapIds:g,nonce:d,region:f,retries:m=3,url:y="https://maps.googleapis.com/maps/api/js",version:b}){if(this.CALLBACK="__googleMapsCallback",this.callbacks=[],this.done=!1,this.loading=!1,this.errors=[],this.apiKey=t,this.authReferrerPolicy=e,this.channel=r,this.client=s,this.id=n||u,this.language=a,this.libraries=p,this.mapIds=g,this.nonce=d,this.region=f,this.retries=m,this.url=y,this.version=b,o.instance){if(!C(this.options,o.instance.options))throw new Error(`Loader must not be called again with different options. ${JSON.stringify(this.options)} !== ${JSON.stringify(o.instance.options)}`);return o.instance}o.instance=this}get options(){return{version:this.version,apiKey:this.apiKey,channel:this.channel,client:this.client,id:this.id,libraries:this.libraries,language:this.language,region:this.region,mapIds:this.mapIds,nonce:this.nonce,url:this.url,authReferrerPolicy:this.authReferrerPolicy}}get status(){return this.errors.length?l.FAILURE:this.done?l.SUCCESS:this.loading?l.LOADING:l.INITIALIZED}get failed(){return this.done&&!this.loading&&this.errors.length>=this.retries+1}createUrl(){let t=this.url;return t+=`?callback=${this.CALLBACK}`,this.apiKey&&(t+=`&key=${this.apiKey}`),this.channel&&(t+=`&channel=${this.channel}`),this.client&&(t+=`&client=${this.client}`),this.libraries.length>0&&(t+=`&libraries=${this.libraries.join(",")}`),this.language&&(t+=`&language=${this.language}`),this.region&&(t+=`&region=${this.region}`),this.version&&(t+=`&v=${this.version}`),this.mapIds&&(t+=`&map_ids=${this.mapIds.join(",")}`),this.authReferrerPolicy&&(t+=`&auth_referrer_policy=${this.authReferrerPolicy}`),t}deleteScript(){const t=document.getElementById(this.id);t&&t.remove()}load(){return this.loadPromise()}loadPromise(){return new Promise((t,e)=>{this.loadCallback(r=>{r?e(r.error):t(window.google)})})}loadCallback(t){this.callbacks.push(t),this.execute()}setScript(){if(document.getElementById(this.id)){this.callback();return}const t=this.createUrl(),e=document.createElement("script");e.id=this.id,e.type="text/javascript",e.src=t,e.onerror=this.loadErrorCallback.bind(this),e.defer=!0,e.async=!0,this.nonce&&(e.nonce=this.nonce),document.head.appendChild(e)}reset(){this.deleteScript(),this.done=!1,this.loading=!1,this.errors=[],this.onerrorEvent=null}resetIfRetryingFailed(){this.failed&&this.reset()}loadErrorCallback(t){if(this.errors.push(t),this.errors.length<=this.retries){const e=this.errors.length*Math.pow(2,this.errors.length);console.log(`Failed to load Google Maps script, retrying in ${e} ms.`),setTimeout(()=>{this.deleteScript(),this.setScript()},e)}else this.onerrorEvent=t,this.callback()}setCallback(){window.__googleMapsCallback=this.callback.bind(this)}callback(){this.done=!0,this.loading=!1,this.callbacks.forEach(t=>{t(this.onerrorEvent)}),this.callbacks=[]}execute(){if(this.resetIfRetryingFailed(),this.done)this.callback();else{if(window.google&&window.google.maps&&window.google.maps.version){console.warn("Google Maps already loaded outside @googlemaps/js-api-loader.This may result in undesirable behavior as options and script parameters may not match."),this.callback();return}this.loading||(this.loading=!0,this.setCallback(),this.setScript())}}}async function k(i,t={}){var n,a;const r=await new o({apiKey:"AIzaSyDo-gPMvJAPSpOgReM-wFGFmla2PU3hTUw",version:"weekly",libraries:[]}).load(),s={...t,zoom:t.zoom||4,center:{lat:Number(((n=t.center)==null?void 0:n.lat)||48.0952351),lng:Number(((a=t.center)==null?void 0:a.lng)||7.964631499999999)}};return new r.maps.Map(i,s)}class S extends w{constructor(){super(...arguments);h(this,"map",null)}static getTagName(){return"geo-map"}styles(){return E}async render(e){const r=A("div",{class:"geo-map",style:{width:this.mapWidth,height:"0"}});e.appendChild(r),c.level>1&&(r.style.height=this.mapHeight,await this.initialize(r)),c.addEventListener("change",({detail:s})=>{if(s.level>1)return r.style.height=this.mapHeight,this.initialize(r)})}async initialize(e){this.map=await k(e,{center:this.center,mapId:this.mapId,zoom:this.zoom}),this.dispatchEvent(new CustomEvent("map:ready",{bubbles:!0,detail:{map:this.map}}))}get mapWidth(){return this.getAttribute("map-width")||"100%"}get mapHeight(){return this.getAttribute("map-height")||"300px"}get zoom(){const e=this.getAttribute("map-zoom");return e?Number(e):void 0}get mapId(){return this.getAttribute("map-id")}get center(){const e=this.getAttribute("map-center");if(!e)return;const[r,s]=e.split(",").map(n=>n.trim())||[0,0];return{lat:Number(r),lng:Number(s)}}}function R(i){S.register(i)}export{S as GeoMap,R as setup};
//# sourceMappingURL=GeoMap.e01f0822.js.map
