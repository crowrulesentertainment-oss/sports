/* CrowRules Sports V17 — score-center status with explicit Free Trial demo labeling. */
(()=>{"use strict";
const pages=new Set(["home","scores","pnw"]);if(!pages.has(document.body?.dataset?.page||""))return;
function mount(){const hub=document.querySelector(".cr3-hub");if(!hub||document.getElementById("cr15-feed-status"))return false;
const bar=document.createElement("aside");bar.id="cr15-feed-status";bar.className="cr15-feed-status";bar.setAttribute("aria-live","polite");
bar.innerHTML='<span class="cr15-pulse"></span><div><strong>AUTOMATIC SCOREBOARD REFRESH</strong><small>Checking published CrowRules event records every 60 seconds</small></div><span class="cr15-mode">TRIAL SCORES MARKED AS DEMO</span>';
hub.parentNode.insertBefore(bar,hub);return true}
if(mount())return;const observer=new MutationObserver(()=>{if(mount())observer.disconnect()});observer.observe(document.documentElement,{childList:true,subtree:true});
})();