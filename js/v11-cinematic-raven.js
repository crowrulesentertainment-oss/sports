/* CrowRules Sports V11 — cinematic raven visual experience. Preserves V2/V3/V9 behavior. */
(()=>{"use strict";
const $=s=>document.querySelector(s);
const scenes=[
 {eyebrow:"THE GLOBAL GAME",title:"UNDER THE LIGHTS",url:"https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=2000&q=90"},
 {eyebrow:"THE ATHLETE",title:"BUILT BY THE GRIND",url:"https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1800&q=90"},
 {eyebrow:"THE MOMENT",title:"ONE CROWD. ONE ROAR.",url:"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1800&q=90"}
];
const heroImages={
 home:scenes[0].url,scores:scenes[0].url,sports:scenes[1].url,minor:scenes[2].url,highschool:scenes[2].url,college:scenes[1].url,standings:scenes[0].url,rankings:scenes[1].url,stats:scenes[1].url,pickem:scenes[0].url,videos:scenes[2].url,news:scenes[2].url,teams:scenes[0].url,pnw:scenes[0].url,calendar:scenes[0].url,watchlist:scenes[1].url,account:scenes[0].url,podcasts:scenes[2].url,about:scenes[0].url
};
function sceneRail(home){const rail=document.createElement("section");rail.className="v11-scene-rail"+(home?" v11-home-rail":"");rail.setAttribute("aria-label","CrowRules Sports cinematic sports scenes");rail.innerHTML=scenes.map(s=>'<div class="v11-scene" role="img" aria-label="'+s.title+'" style="background-image:url(&quot;'+s.url+'&quot;)"><span><small>'+s.eyebrow+'</small>'+s.title+'</span></div>').join("");return rail}
function install(){const body=document.body,main=$("main"),hero=$(".hero",main||document);if(!body||!main||!hero||body.dataset.v11Ready==="1")return false;
 body.dataset.v11Ready="1";body.classList.add("cr-v2");
 const page=body.dataset.page||"home",bg=$(".hero-bg",hero);if(bg)bg.style.setProperty("--v11-hero-image",'url("'+(heroImages[page]||scenes[0].url)+'")');
 const brand=$(".brand",body);if(brand){brand.setAttribute("aria-label","CrowRules Sports home");const sub=$(".brand small",brand);if(sub)sub.textContent="ONE COMPANY · ONE UNIVERSE"}
 const stamp=document.createElement("div");stamp.className="v11-raven-stamp";stamp.textContent="CROWRULES SPORTS · TACOMA, WASHINGTON";const inner=$(".hero-inner",hero);if(inner&&!$(".v11-raven-stamp",inner))inner.insertBefore(stamp,inner.firstChild);
 if(!$(".v11-scene-rail",main)){const rail=sceneRail(page==="home");hero.insertAdjacentElement("afterend",rail)}
 const ticker=$(".ticker");if(ticker&&!ticker.dataset.v11){ticker.dataset.v11="1";const status=$("#dataStatus",ticker);if(status)status.setAttribute("aria-live","polite")}
 const footer=$("footer");if(footer&&!$(".v11-footer-mark",footer)){const mark=document.createElement("div");mark.className="v11-footer-mark";mark.innerHTML='<span class="v11-raven-stamp">BUILT FOR THE GAME. MADE FOR EVERY FAN.</span>';footer.prepend(mark)}
 return true}
function start(){if(install())return;const ob=new MutationObserver(()=>{if(install())ob.disconnect()});ob.observe(document.documentElement,{childList:true,subtree:true})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();

// V12 loader: keep sync status and helpers consistent across every V11 page.
(()=>{"use strict";const add=(tag,attrs)=>{const n=document.createElement(tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);document.head.append(n)};if(!document.querySelector('link[href="css/v12-auto-sync.css"]'))add("link",{rel:"stylesheet",href:"css/v12-auto-sync.css"});if(!document.querySelector('script[src="js/v12-auto-sync.js"]'))add("script",{src:"js/v12-auto-sync.js",defer:""});})();
