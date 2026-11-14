/* CrowRules Sports V2 — universal sitewide interaction layer */
(()=>{"use strict";
const page=document.body?.dataset?.page;if(!page)return;
const links=[["index.html","Home","HQ"],["scores.html","Scores","Live & published games"],["sports.html","All Sports","Browse every sport"],["standings.html","Standings","Verified league tables"],["rankings.html","Rankings","Official rankings"],["stats.html","Player Stats","Athlete leaders"],["teams.html","Teams & Schools","Find teams and schools"],["calendar.html","Calendar","Upcoming competitions"],["high-school.html","High School","Youth and school athletics"],["college.html","College","College athletics"],["minor-sports.html","Minor Sports","Emerging competitions"],["pnw.html","PNW Hub","Tacoma and Northwest coverage"],["news.html","Sports Desk","CrowRules sports stories"],["videos.html","Videos","Authorized highlights and originals"],["pickem.html","Pick’em","Free community predictions"],["watchlist.html","My Sports","Your followed teams"],["podcasts.html","Sports Audio","CrowRules Podcasting"],["account.html","Member Account","Shared CrowRules membership"],["about.html","About","Mission and data standards"]];
const sportNames=["Football","Basketball","Baseball","Hockey","Soccer","Tennis","Golf","Motorsports","Volleyball","Wrestling","Boxing","MMA","Rugby","Lacrosse","Cricket","Track & Field","Swimming","Gymnastics","Softball","Cycling","Skiing & Snowboarding","Figure Skating","Esports","Pickleball","Disc Golf","Surfing","Climbing","Powerlifting","Weightlifting","Strongman","Judo","Karate","Taekwondo","Fencing","Archery","Bowling","Squash","Water Polo","Rodeo","Curling","Ultimate","Roller Derby","Cornhole","Darts","Orienteering","Wheelchair Basketball","Para Athletics","Sitting Volleyball","Para Swimming"];
const teamNames=["Seattle Seahawks","Seattle Mariners","Seattle Kraken","Seattle Storm","Seattle Sounders","Seattle Reign","Portland Trail Blazers","Portland Timbers","Portland Thorns","Vancouver Canucks","Washington Huskies","Washington State Cougars","Oregon Ducks","Oregon State Beavers"];
const $=(s,r=document)=>r.querySelector(s);
const add=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!==undefined)e.innerHTML=html;return e};
const install=()=>{
 if(!document.body||document.body.dataset.crV2Ready==="1")return;
 const header=$(".header");if(!header)return;
 document.body.dataset.crV2Ready="1";document.body.classList.add("cr-v2");
 const skip=add("a","cr2-skip",'Skip to main content');skip.href="#main-content";document.body.prepend(skip);
 const progress=add("div","cr2-progress");progress.setAttribute("aria-hidden","true");document.body.append(progress);
 const main=$("main")||$(".hero")?.parentElement;if(main){main.id=main.id||"main-content";if(!main.hasAttribute("tabindex"))main.setAttribute("tabindex","-1")}
 const utility=add("div","cr2-utility",'<strong>CROWRULES SPORTS V2</strong><span class="cr2-hide-mobile">ONE COMPANY · ONE UNIVERSE</span><span class="cr2-spacer"></span><a href="pnw.html">TACOMA / PNW</a><span class="cr2-hide-mobile">ALL SPORTS · ALL LEVELS</span>');
 header.parentNode.insertBefore(utility,header);
 const nav=$(".nav",header);if(nav){const trigger=add("button","cr2-search-trigger",'<span>Search sports, teams & pages</span><kbd>⌘ K</kbd>');trigger.type="button";trigger.setAttribute("aria-label","Open site search");trigger.addEventListener("click",openSearch);nav.append(trigger)}
 const bottom=add("nav","cr2-bottomnav",'<a href="scores.html"><span>◉</span>SCORES</a><a href="sports.html"><span>▦</span>SPORTS</a><a href="pickem.html"><span>✦</span>PICK’EM</a><a href="watchlist.html"><span>♜</span>MY SPORTS</a>');bottom.setAttribute("aria-label","Quick navigation");const current=location.pathname.split("/").pop()||"index.html";bottom.querySelectorAll("a").forEach(a=>{if(a.getAttribute("href")===current)a.classList.add("active")});document.body.append(bottom);
 const overlay=add("div","cr2-search-overlay",'<section class="cr2-search-dialog" role="dialog" aria-modal="true" aria-label="Search CrowRules Sports"><div class="cr2-search-head"><input type="search" placeholder="Search sports, teams, leagues or pages…" aria-label="Search sports, teams, leagues or pages"><button type="button" aria-label="Close search">ESC</button></div><div class="cr2-search-hint">Search across the CrowRules Sports network · Press Enter to open the first result</div><div class="cr2-search-results" role="listbox"><div class="cr2-search-empty">Start typing to find your game.</div></div></section>');
 document.body.append(overlay);
 const input=$("input",overlay),results=$(".cr2-search-results",overlay),close=$("button",overlay);
 const catalog=[...links.map(x=>({name:x[1],detail:x[2],url:x[0],type:"Page"})),...sportNames.map(x=>({name:x,detail:"Sport directory",url:"sports.html?search="+encodeURIComponent(x),type:"Sport"})),...teamNames.map(x=>({name:x,detail:"Pacific Northwest team",url:"teams.html?search="+encodeURIComponent(x),type:"Team"}))];
 let matches=[];
 function render(q){const term=q.trim().toLowerCase();matches=term?catalog.filter(x=>(x.name+" "+x.detail+" "+x.type).toLowerCase().includes(term)).slice(0,12):[];results.innerHTML=matches.length?matches.map((x,i)=>'<a role="option" href="'+x.url+'" data-index="'+i+'"><span aria-hidden="true">'+(x.type==="Sport"?"◈":x.type==="Team"?"♜":"↗")+'</span><span>'+escapeHtml(x.name)+'<small>'+escapeHtml(x.type+" · "+x.detail)+'</small></span></a>').join(""):'<div class="cr2-search-empty">'+(term?"No matching results. Try a team, sport or page name.":"Start typing to find your game.")+'</div>'}
 function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
 function openSearch(){overlay.classList.add("open");input.value="";render("");setTimeout(()=>input.focus(),20)}
 function closeSearch(){overlay.classList.remove("open")}
 input.addEventListener("input",()=>render(input.value));input.addEventListener("keydown",e=>{if(e.key==="Enter"&&matches[0])location.href=matches[0].url;if(e.key==="ArrowDown"){$("a",results)?.focus()}if(e.key==="Escape")closeSearch()});close.addEventListener("click",closeSearch);overlay.addEventListener("click",e=>{if(e.target===overlay)closeSearch()});
 document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openSearch()}if(e.key==="Escape")closeSearch()});
 const updateProgress=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?Math.min(100,scrollY/max*100):0)+"%"};addEventListener("scroll",updateProgress,{passive:true});updateProgress();
 // Keep current-page navigation state correct, including legacy sport detail links.
 document.querySelectorAll(".header nav a").forEach(a=>{const href=a.getAttribute("href");if(href&&href.split("?")[0]===current)a.classList.add("active")});
};
const observer=new MutationObserver(()=>{if($(".header")){install();observer.disconnect()}});
observer.observe(document.documentElement,{childList:true,subtree:true});
if($(".header"))install();
})();