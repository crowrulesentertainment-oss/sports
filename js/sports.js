/* CrowRules Sports — Shared Engine 22.0 */
(function(){
"use strict";

const SUPABASE_URL="https://cevylpnoexugwgygvtgu.supabase.co";
const SUPABASE_KEY="sb_publishable_AdfM5y6RqvF3tbvEVzDZSg_JuGTQLD-";

const HAS_SUPABASE=!!(window.supabase&&typeof window.supabase.createClient==="function");
let sb=null;
if(HAS_SUPABASE){
 sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{
 auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true},
 global:{headers:{"x-client-info":"crowrules-sports/22.0"}}
 });
}else{
 console.warn("CrowRules Sports: Supabase JS was not loaded. Navigation remains available.");
}
window.sb=sb;
window.supabaseClient=sb;
window.sbClient=sb;
window.CROW_SPORTS_READY=HAS_SUPABASE;
window.CROW_SPORTS_VERSION="22.0";
window.CROW_SPORTS_SHELL_VERSION="22.0";

const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

async function withTimeout(promise,ms=12000,label="Request"){
 let timer;
 const timeout=new Promise((_,reject)=>timer=setTimeout(()=>reject(new Error(label+" timed out after "+Math.round(ms/1000)+" seconds.")),ms));
 try{return await Promise.race([promise,timeout]);}finally{clearTimeout(timer);}
}
function normalizeError(error){
 if(!error)return null;
 return {message:error.message||String(error),code:error.code||"",details:error.details||"",hint:error.hint||""};
}
function reportError(label,error){console.error("[CrowRules Sports]",label,normalizeError(error)||error);return normalizeError(error);}
function storage(type){try{return type==="session"?sessionStorage:localStorage;}catch(_){return null;}}
function storageGet(key,fallback=null,type="local"){try{const s=storage(type),v=s?.getItem(key);return v==null?fallback:JSON.parse(v);}catch(_){return fallback;}}
function storageSet(key,value,type="local"){try{const s=storage(type);if(!s)return false;s.setItem(key,JSON.stringify(value));return true;}catch(_){return false;}}
function storageRemove(key,type="local"){try{storage(type)?.removeItem(key);}catch(_){}}

const NAV_GROUPS=[
 {key:"games",label:"GAMES",icon:"◉",items:[["home","HOME","index.html"],["scores","SCORES","scores.html"],["schedule","SCHEDULE","schedule.html"],["live","LIVE","live.html"]]},
 {key:"teams",label:"TEAMS",icon:"◆",items:[["teams","TEAMS","teams.html"],["standings","STANDINGS","standings.html"],["rankings","RANKINGS","rankings.html"],["leaders","LEADERS","leaders.html"]]},
 {key:"data",label:"DATA",icon:"▦",items:[["championships","CHAMPIONSHIPS","championships.html"],["championship","CHAMPIONSHIP","championship.html"],["event","EVENT CENTER","event.html"],["sync-health","SYNC HEALTH","sync-health.html"]]},
 {key:"media",label:"MEDIA",icon:"▶",items:[["media","AUDIO / VIDEO","media.html"],["combat","COMBAT / WRESTLING","combat.html"]]},
 {key:"community",label:"COMMUNITY",icon:"✦",items:[["pickem","PICK 'EM","pickem.html"],["notifications","NOTIFICATIONS","notifications.html"],["partners","PARTNERS","partners.html"]]},
 {key:"account",label:"ACCOUNT",icon:"●",items:[["account","MY SPORTS","account.html"]]}
];
const NAV=NAV_GROUPS.flatMap(group=>group.items);

function currentPage(){return location.pathname.split("/").pop()||"index.html";}

function normalizeActiveKey(active){
 const page=currentPage().toLowerCase();
 if(active)return String(active).replace(/\\.html$/i,"").toLowerCase();
 const match=NAV.find(([,label,url])=>url.toLowerCase()===page);
 return match?match[0]:"home";
}

function ensureNavStyles(){
 if(document.getElementById("cr-shared-nav-style"))return;
 const style=document.createElement("style");style.id="cr-shared-nav-style";
 style.textContent=`
 .cr-header .shell-tools{display:flex;align-items:center;gap:8px;flex:0 0 auto}.shell-league{border:1px solid #292929;background:#0c0c0c;color:#aaa;border-radius:7px;padding:8px 8px;font:800 8px Orbitron;cursor:pointer;max-width:105px}.shell-league:hover{color:#fff;border-color:#555}.shell-search-toggle{border:1px solid #292929;background:#0c0c0c;color:#aaa;border-radius:7px;padding:8px 10px;font:800 8px Orbitron;cursor:pointer}.shell-search-toggle:hover{color:#fff;border-color:#555}.cr-global-search{border-top:1px solid #242424;background:#070707}.cr-search-inner{max-width:1500px;margin:auto;padding:10px 18px}.cr-search-inner input{width:100%;padding:12px 14px;background:#0d0d0d;border:1px solid #333;color:#fff;font:500 12px Montserrat}.cr-global-search[hidden]{display:none}.cr-global-search a{display:flex;align-items:center;gap:10px;padding:9px 4px;color:#ccc}.cr-global-search a:hover{color:#fff}.cr-global-search small{color:#777;font-size:8px}.cr-global-search strong{font-size:10px}.search-empty{padding:10px 4px;color:#666;font-size:10px}@media(max-width:1040px){.cr-header .shell-tools{margin-left:auto}.cr-header .shell-tools .account{display:none}.cr-search-inner{padding:10px}}.cr-header{position:sticky;top:0;z-index:1000;width:100%;background:rgba(5,5,7,.97);border-bottom:1px solid rgba(255,255,255,.08);backdrop-filter:blur(18px);box-shadow:0 8px 30px rgba(0,0,0,.28)}
 .cr-nav{position:relative;min-height:58px;display:flex;align-items:center;gap:10px;padding:0 18px}
 .cr-nav .brand{display:flex;align-items:center;gap:4px;flex:0 0 auto;white-space:nowrap;color:#fff;text-decoration:none;font:900 12px Orbitron,Arial,sans-serif;letter-spacing:1.4px}.cr-nav .brand span{color:#e10600}
 .cr-nav .navlinks{min-width:0;display:flex;align-items:center;justify-content:flex-end;gap:4px;flex:1}.cr-nav .nav-group{position:relative}
 .cr-nav .nav-group>button{font:800 8px Orbitron,Arial,sans-serif;letter-spacing:.7px;color:#aeb2ba;background:transparent;border:1px solid transparent;border-radius:8px;padding:9px;cursor:pointer;white-space:nowrap}
 .cr-nav .nav-group>button:hover,.cr-nav .nav-group.active>button,.cr-nav .nav-group.open>button{color:#fff;background:rgba(225,6,0,.09);border-color:rgba(225,6,0,.24)}
 .cr-nav .nav-group-menu{position:absolute;right:0;top:calc(100% + 6px);min-width:175px;display:none;flex-direction:column;padding:6px;background:#08090d;border:1px solid rgba(255,255,255,.1);border-radius:10px;box-shadow:0 18px 45px rgba(0,0,0,.65);backdrop-filter:blur(18px);z-index:2000}
 .cr-nav .nav-group.open .nav-group-menu{display:flex}.cr-nav .nav-group-menu a{display:block;white-space:nowrap;border-radius:7px;padding:10px 11px;color:#9fa4ae;text-decoration:none;font:800 8px Orbitron,Arial,sans-serif;letter-spacing:.45px}
 .cr-nav .nav-group-menu a:hover,.cr-nav .nav-group-menu a.active{color:#fff;background:rgba(225,6,0,.12);box-shadow:inset 2px 0 #e10600}
 .cr-nav .account{white-space:nowrap;flex:0 0 auto;max-width:190px;overflow:hidden;text-overflow:ellipsis;color:#aaa;font:700 8px Orbitron,Arial,sans-serif}
 .cr-menu-toggle{display:none;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#fff;border-radius:8px;padding:9px 11px;font:800 9px Orbitron,Arial,sans-serif;cursor:pointer}
 @media(max-width:1250px){.cr-nav{padding:0 12px}.cr-nav .nav-group>button{font-size:7px;padding:8px 6px}.cr-nav .account{max-width:130px}}
 @media(max-width:1040px){.cr-menu-toggle{display:block;margin-left:auto}.cr-nav .navlinks{position:absolute;left:8px;right:8px;top:calc(100% + 7px);display:none;max-height:calc(100vh - 80px);overflow:auto;flex-direction:column;align-items:stretch;justify-content:flex-start;background:#08090d;border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:8px;box-shadow:0 20px 50px rgba(0,0,0,.65)}.cr-nav .navlinks.cr-open{display:flex}.cr-nav .nav-group{width:100%}.cr-nav .nav-group>button{width:100%;text-align:left;padding:12px;font-size:9px}.cr-nav .nav-group-menu{position:static;min-width:0;box-shadow:none;border:0;border-radius:8px;background:rgba(255,255,255,.025);margin:2px 0 6px}.cr-nav .nav-group-menu a{padding:10px 14px;font-size:9px}.cr-nav .account{display:none}}
 @media(max-width:520px){.cr-nav{min-height:54px;padding:0 10px}.cr-nav .brand{font-size:10px;letter-spacing:1px}}`;
 document.head.appendChild(style);
}

function bindLeagueSelector(){
 const select=$("#crLeagueSelector");
 if(!select||select.dataset.bound)return;
 select.dataset.bound="1";
 const saved=storageGet("cr_sports_league","all");
 if(saved)select.value=saved;
 select.addEventListener("change",()=>{
  storageSet("cr_sports_league",select.value);
  window.CROW_SPORTS_LEAGUE=select.value;
  document.dispatchEvent(new CustomEvent("crowrules:leaguechange",{detail:{league:select.value}}));
 });
 window.CROW_SPORTS_LEAGUE=select.value;
}
function bindGlobalSearch(){
 const toggle=$("#crSearchToggle"),box=$("#crGlobalSearch"),input=$("#crGlobalSearchInput"),results=$("#crGlobalSearchResults");
 if(!toggle||!box||!input||toggle.dataset.bound)return;
 toggle.dataset.bound="1";
 const items=NAV.flatMap(([key,label,url])=>[{type:"PAGE",title:label,url,key}]);
 async function dbSearch(term){
  if(!sb||!term)return [];
  try{
   const [teams,leagues]=await Promise.all([
    withTimeout(sb.from("cr_sports_teams").select("id,name,abbreviation").ilike("name","%"+term+"%").limit(6),5000,"Team search"),
    withTimeout(sb.from("cr_sports_leagues").select("id,name,code").or("name.ilike.%"+term+"%,code.ilike.%"+term+"%").limit(6),5000,"League search")
   ]);
   const out=[];
   (teams.data||[]).forEach(x=>out.push({type:"TEAM",title:x.name,url:"teams.html?id="+encodeURIComponent(x.id)}));
   (leagues.data||[]).forEach(x=>out.push({type:"LEAGUE",title:x.name||x.code,url:"scores.html?league="+encodeURIComponent(x.code||x.name)}));
   return out;
  }catch(e){reportError("globalSearch",e);return [];}
 }
 async function render(q){
  const term=String(q||"").trim().toLowerCase();
  const base=term?items.filter(x=>(x.title+" "+x.key).toLowerCase().includes(term)):items.slice(0,8);
  const extra=term?await dbSearch(term):[];
  const rows=[...base,...extra];
  results.innerHTML=rows.length?rows.map(x=>'<a href="'+x.url+'"><small>'+x.type+'</small><strong>'+esc(x.title)+'</strong></a>').join(""):'<div class="search-empty">No Sports results found.</div>';
 }
 toggle.addEventListener("click",()=>{const open=!box.hidden;box.hidden=open;toggle.setAttribute("aria-expanded",String(!open));if(!open){input.focus();render(input.value);}});
 input.addEventListener("input",()=>render(input.value));
 document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();box.hidden=false;toggle.setAttribute("aria-expanded","true");input.focus();render(input.value)}if(e.key==="Escape"&&!box.hidden){box.hidden=true;toggle.setAttribute("aria-expanded","false")}});
 render("");
}
function bindNav(){
 const toggle=$("#crMenuToggle"),links=$("#crNavLinks");
 if(!toggle||!links||toggle.dataset.bound)return;
 toggle.dataset.bound="1";
 toggle.addEventListener("click",()=>{const open=links.classList.toggle("cr-open");toggle.setAttribute("aria-expanded",String(open));});
 links.querySelectorAll(".nav-group>button").forEach(button=>button.addEventListener("click",()=>{
  const group=button.closest(".nav-group");
  links.querySelectorAll(".nav-group.open").forEach(g=>{if(g!==group)g.classList.remove("open");});
  group.classList.toggle("open");
 }));
 document.addEventListener("keydown",e=>{if(e.key==="Escape"){links.classList.remove("cr-open");links.querySelectorAll(".nav-group.open").forEach(g=>g.classList.remove("open"));toggle.setAttribute("aria-expanded","false");}});
 document.addEventListener("click",e=>{if(!e.target.closest(".cr-nav")){links.querySelectorAll(".nav-group.open").forEach(g=>g.classList.remove("open"));}});
 links.addEventListener("click",e=>{if(e.target.closest("a")){links.classList.remove("cr-open");links.querySelectorAll(".nav-group.open").forEach(g=>g.classList.remove("open"));toggle.setAttribute("aria-expanded","false");}});
}

function shell(active){
 const page=normalizeActiveKey(active);
 const groups=NAV_GROUPS.map(group=>{
  const activeGroup=group.items.some(([key])=>key===page);
  const items=group.items.map(([key,label,url])=>`<a href="${url}" class="${page===key?"active":""}" data-nav="${key}">${label}</a>`).join("");
  return `<div class="nav-group ${activeGroup?"active":""}"><button type="button" aria-expanded="false"><span aria-hidden="true">${group.icon||""} </span>${group.label}<span aria-hidden="true"> ▾</span></button><div class="nav-group-menu">${items}</div></div>`;
 }).join("");
 document.write(`<header class="site-header cr-header" data-cr-shell="21">
  <nav class="nav cr-nav" aria-label="CrowRules Sports navigation">
   <a class="brand" href="index.html" aria-label="CrowRules Sports home">CROW<span>RULES</span> SPORTS</a>
   <button class="cr-menu-toggle" id="crMenuToggle" type="button" aria-expanded="false" aria-controls="crNavLinks">MENU</button>
   <div class="navlinks" id="crNavLinks">${groups}</div>
   <div class="shell-tools"><select class="shell-league" id="crLeagueSelector" aria-label="League"><option value="all">ALL LEAGUES</option><option value="NFL">NFL</option><option value="MLB">MLB</option><option value="MiLB">MiLB</option><option value="NHL">NHL</option><option value="NBA">NBA</option><option value="WNBA">WNBA</option><option value="NCAA">NCAA</option><option value="MLS">MLS</option><option value="UFL">UFL</option><option value="WWE">WWE</option><option value="AEW">AEW</option><option value="UFC">UFC</option></select><button class="shell-search-toggle" id="crSearchToggle" type="button" aria-expanded="false" aria-controls="crGlobalSearch">SEARCH</button><span class="account" id="account" aria-live="polite">ACCOUNT</span></div>
  </nav><div class="cr-global-search" id="crGlobalSearch" hidden><div class="cr-search-inner"><input id="crGlobalSearchInput" type="search" placeholder="Search teams, leagues, pages…" autocomplete="off"><div id="crGlobalSearchResults"></div></div></div>
 </header>`);
 ensureNavStyles();
 queueMicrotask(bindNav);
}

function footer(){document.write('<footer class="footer">CROWRULES SPORTS • ONE COMPANY. ONE UNIVERSE. • Built in Tacoma, Washington • <span id="crEngineVersion">Engine 22.0</span></footer>');}

async function getSession(){
 if(!sb)return null;
 try{const r=await withTimeout(sb.auth.getSession(),8000,"Session check");return r?.data?.session||null;}
 catch(e){reportError("getSession",e);return null;}
}
function accountMarkup(session){
 if(!session)return '<span class="account-dot"></span> ACCOUNT';
 return '<span class="account-dot signed"></span> '+esc(session.user?.email||"SIGNED IN");
}
async function loadUnread(sessionArg){
 const link=document.querySelector('.navlinks a[data-nav="notifications"]');
 if(!link||!sb)return 0;
 const session=sessionArg===undefined?await getSession():sessionArg;
 if(!session){link.textContent="NOTIFICATIONS";return 0;}
 try{
  const r=await withTimeout(sb.from("cr_sports_user_notifications").select("id",{count:"exact",head:true}).eq("user_id",session.user.id).is("read_at",null),7000,"Notification count");
  if(r.error)throw r.error;
  const count=Number(r.count||0);
  link.textContent=count?"NOTIFICATIONS ("+count+")":"NOTIFICATIONS";
  return count;
 }catch(e){reportError("loadUnread",e);link.textContent="NOTIFICATIONS";return 0;}
}
async function loadSession(){
 const session=await getSession();
 const account=$("#account");
 if(account)account.innerHTML=accountMarkup(session);
 await loadUnread(session);
 return session;
}
async function signIn(){
 const email=$("#email")?.value?.trim()||"",password=$("#password")?.value||"";
 if(!email||!password){alert("Enter your email and password.");return null;}
 try{const r=await withTimeout(sb.auth.signInWithPassword({email,password}),12000,"Sign in");if(r.error)throw r.error;location.reload();return r.data;}
 catch(e){alert(normalizeError(e)?.message||"Unable to sign in.");reportError("signIn",e);return null;}
}
async function signUp(){
 const email=$("#email")?.value?.trim()||"",password=$("#password")?.value||"";
 if(!email||!password){alert("Enter your email and password.");return null;}
 if(password.length<6){alert("Password must be at least 6 characters.");return null;}
 try{const r=await withTimeout(sb.auth.signUp({email,password}),12000,"Account creation");if(r.error)throw r.error;return r.data;}
 catch(e){alert(normalizeError(e)?.message||"Unable to create account.");reportError("signUp",e);return null;}
}
async function signOut(){
 try{const r=await withTimeout(sb.auth.signOut(),10000,"Sign out");if(r.error)throw r.error;location.reload();}
 catch(e){alert(normalizeError(e)?.message||"Unable to sign out.");reportError("signOut",e);}
}

let badgeChannel=null;
async function startBadgeRealtime(){
 if(!sb)return;
 const session=await getSession(),uid=session?.user?.id||null;
 if(badgeChannel){try{await sb.removeChannel(badgeChannel);}catch(_){}badgeChannel=null;}
 if(!uid){await loadUnread(null);return;}
 badgeChannel=sb.channel("sports-global-badge-"+uid)
  .on("postgres_changes",{event:"*",schema:"public",table:"cr_sports_user_notifications",filter:"user_id=eq."+uid},()=>loadUnread(session))
  .subscribe();
 await loadUnread(session);
}

let authSubscription=null;
function bindAuth(){
 if(!sb)return;
 if(authSubscription)return;
 const r=sb.auth.onAuthStateChange((event,session)=>{
  window.CROW_SPORTS_AUTH_EVENT=event;
  setTimeout(()=>{loadSession();if(event==="SIGNED_IN"||event==="SIGNED_OUT"||event==="TOKEN_REFRESHED"||event==="USER_UPDATED")startBadgeRealtime();},0);
 });
 authSubscription=r?.data?.subscription||null;
}

window.CROW_SPORTS_NAV_VERSION="22.0";
window.CROW_SPORTS_DATA_LAYER_VERSION="22.0";
async function loadPodcastAudio({limit=24,query=""}={}){
 try{
  const term=String(query||"").trim();
  let pq=sb.from("podcasts").select("id,title,slug,description,artwork_url,author_name,category,status,created_at").eq("status","published").order("created_at",{ascending:false}).limit(Math.max(1,Math.min(100,limit)));
  if(term)pq=pq.or("title.ilike.%"+term+"%,author_name.ilike.%"+term+"%,category.ilike.%"+term+"%");
  const [shows,episodes]=await Promise.all([withTimeout(pq,10000,"Podcast shows"),withTimeout(sb.from("podcast_episodes").select("id,podcast_id,title,slug,description,audio_url,thumbnail_url,episode_number,season_number,published_at,duration_seconds,play_count,status,podcasts(id,title,slug,artwork_url,author_name,category)").eq("status","published").order("published_at",{ascending:false}).limit(Math.max(1,Math.min(100,limit))),10000,"Podcast episodes")]);
  if(shows.error)throw shows.error;
  if(episodes.error)throw episodes.error;
  return {shows:shows.data||[],episodes:episodes.data||[],source:"CrowRules Podcasting",repository:"crowrulesentertainment-oss/podcasting",repositoryUrl:"https://github.com/crowrulesentertainment-oss/podcasting"};
 }catch(error){reportError("loadPodcastAudio",error);return {shows:[],episodes:[],source:"CrowRules Podcasting",repository:"crowrulesentertainment-oss/podcasting",repositoryUrl:"https://github.com/crowrulesentertainment-oss/podcasting",error:normalizeError(error)};}
}


const SPORTS_DATA_TABLES={
 leagues:"cr_sports_leagues",
 teams:"cr_sports_teams",
 games:"cr_sports_games",
 standings:"cr_sports_standings",
 leaders:"cr_sports_leaders",
 media:"cr_sports_media",
 events:"cr_sports_events",
 championships:"cr_sports_championships"
};
let leagueCatalogCache=null;
let dataChannels=[];

function urlParams(){try{return new URLSearchParams(location.search)}catch(_){return new URLSearchParams()}}
function activeLeagueFromUrl(){
 const v=(urlParams().get("league")||"").trim();
 return v||"";
}
function getActiveLeague(){
 const select=document.getElementById("crLeagueSelector");
 const url=activeLeagueFromUrl();
 const value=url||select?.value||window.CROW_SPORTS_LEAGUE||storageGet("cr_sports_league","all")||"all";
 return String(value||"all");
}
function setLeagueInUrl(value){
 try{
  const url=new URL(location.href);
  if(value&&value!=="all")url.searchParams.set("league",value);else url.searchParams.delete("league");
  history.replaceState({},document.title,url.href);
 }catch(_){}
}
async function populateUniversalLeagueSelector(){
 const select=document.getElementById("crLeagueSelector");
 if(!select)return;
 const current=getActiveLeague();
 const leagues=await loadSportsLeagues();
 select.innerHTML='<option value="all">ALL LEAGUES</option>'+leagues.map(l=>'<option value="'+esc(l.code||l.id)+'">'+esc(String(l.code||l.name||"LEAGUE").toUpperCase())+'</option>').join("");
 const match=leagues.find(l=>String(l.code||l.id).toLowerCase()===String(current||"all").toLowerCase());
 select.value=match?(match.code||match.id):"all";
 window.CROW_SPORTS_LEAGUE=select.value;
 syncLeagueUi(select.value);
}
async function loadSportsLeagues(force=false){
 if(!sb)return [];
 if(leagueCatalogCache&&!force)return leagueCatalogCache;
 try{
  const r=await withTimeout(sb.from(SPORTS_DATA_TABLES.leagues).select("id,name,code,sport,level,logo_url,is_active").eq("is_active",true).order("name"),8000,"League catalog");
  if(r.error)throw r.error;
  leagueCatalogCache=r.data||[];
  return leagueCatalogCache;
 }catch(e){reportError("loadSportsLeagues",e);return []}
}
async function resolveLeague(value){
 const wanted=String(value||"").trim();
 if(!wanted||wanted==="all")return null;
 const leagues=await loadSportsLeagues();
 return leagues.find(x=>String(x.code||"").toLowerCase()===wanted.toLowerCase()||String(x.id)===wanted||String(x.name||"").toLowerCase()===wanted.toLowerCase())||null;
}
async function leagueId(value=getActiveLeague()){
 const l=await resolveLeague(value);
 return l?.id||null;
}
async function leagueQuery(table,select="*",options={}){
 if(!sb)throw new Error("Supabase is not available.");
 let q=sb.from(table).select(select);
 const code=options.league===undefined?getActiveLeague():options.league;
 if(code&&code!=="all"&&options.leagueColumn!==false){
  const id=await leagueId(code);
  if(id)q=q.eq(options.leagueColumn||"league_id",id);
 }
 if(options.eq)for(const [k,v] of Object.entries(options.eq))q=q.eq(k,v);
 if(options.is)for(const [k,v] of Object.entries(options.is))q=q.is(k,v);
 if(options.ilike)for(const [k,v] of Object.entries(options.ilike))q=q.ilike(k,v);
 if(options.order)q=q.order(options.order.column,{ascending:options.order.ascending!==false});
 if(options.limit)q=q.limit(options.limit);
 return withTimeout(q,options.timeout||12000,options.label||table);
}
async function getSportsData(kind,options={}){
 const map={
  leagues:SPORTS_DATA_TABLES.leagues,teams:SPORTS_DATA_TABLES.teams,games:SPORTS_DATA_TABLES.games,
  standings:SPORTS_DATA_TABLES.standings,leaders:SPORTS_DATA_TABLES.leaders,media:SPORTS_DATA_TABLES.media,
  events:SPORTS_DATA_TABLES.events,championships:SPORTS_DATA_TABLES.championships
 };
 const table=map[kind];
 if(!table)throw new Error("Unknown Sports data set: "+kind);
 const r=await leagueQuery(table,options.select||"*",options);
 if(r.error)throw r.error;
 return r.data||[];
}
async function getSportsSnapshot(options={}){
 const league=options.league===undefined?getActiveLeague():options.league;
 const [leagues,teams,games,standings,leaders,media,events,championships]=await Promise.all([
  loadSportsLeagues(),
  getSportsData("teams",{league,select:"id,league_id,name,short_name,city,state,division,conference,level,logo_url,is_active",limit:options.limit||500}),
  getSportsData("games",{league,select:"id,league_id,home_team_id,away_team_id,starts_at,status,home_score,away_score,venue,broadcast",order:{column:"starts_at",ascending:true},limit:options.limit||500}),
  getSportsData("standings",{league,select:"*",order:{column:"rank",ascending:true},limit:options.limit||500}),
  getSportsData("leaders",{league,select:"*",order:{column:"value",ascending:false},limit:options.limit||200}),
  getSportsData("media",{league,select:"*",order:{column:"published_at",ascending:false},limit:options.limit||100}),
  getSportsData("events",{league,select:"id,league_id,title,event_type,status,starts_at,ends_at,venue,city,broadcast,event_url,image_url,description",order:{column:"starts_at",ascending:true},limit:options.limit||100}),
  getSportsData("championships",{league,select:"*",order:{column:"updated_at",ascending:false},limit:options.limit||100})
 ]);
 return {league,leagues,teams,games,standings,leaders,media,events,championships};
}
function syncLeagueUi(value=getActiveLeague()){
 const league=String(value||"all");
 document.body.dataset.sportsLeague=league;
 document.querySelectorAll("#crLeagueSelector").forEach(x=>{if(x.value!==league&&[...x.options].some(o=>o.value===league))x.value=league});
 ["leagueSelect","league"].forEach(id=>{
  const el=document.getElementById(id);
  if(!el)return;
  const opts=[...el.options];
  const match=opts.find(o=>o.value===league||o.dataset.code===league);
  if(match)el.value=match.value;
 });
 const label=league==="all"?"ALL LEAGUES":league;
 document.querySelectorAll("[data-cr-active-league]").forEach(el=>el.textContent=label);
}
function dispatchDataRefresh(reason="league"){
 document.dispatchEvent(new CustomEvent("crowrules:sportsdatarefresh",{detail:{league:getActiveLeague(),reason}}));
}
async function refreshCurrentSportsPage(){
 const page=currentPage();
 syncLeagueUi();
 try{
  if(page==="scores.html"){
   if(typeof window.loadScores==="function")await window.loadScores();
   if(typeof window.loadEvents==="function")await window.loadEvents();
  }else if(page==="schedule.html"){
   if(typeof window.loadScheduleData==="function")await window.loadScheduleData();
   }else if(page==="standings.html"){
   const l=await resolveLeague(getActiveLeague());
   const el=document.getElementById("league");
   if(el)el.value=l?.id||"";
   if(typeof window.loadRows==="function")await window.loadRows();
   else if(typeof window.loadStandings==="function")await window.loadStandings();
  }else if(page==="rankings.html"){
   if(typeof window.loadRankings==="function")await window.loadRankings();
  }else if(page==="teams.html"){
   const l=await resolveLeague(getActiveLeague());
   const el=document.getElementById("league");
   if(el)el.value=l?.id||"";
   if(typeof window.loadDirectory==="function")await window.loadDirectory();
   if(typeof window.loadDashboard==="function"){
    const id=urlParams().get("id");
    if(id)await window.loadDashboard(id);
   }
  }else if(page==="media.html"){
   dispatchDataRefresh("league");
  }else if(page==="event.html"){
   dispatchDataRefresh("league");
  }
 }catch(e){reportError("refreshCurrentSportsPage",e)}
}
function bindUniversalDataLayer(){
 if(document.body.dataset.crDataLayerBound)return;
 document.body.dataset.crDataLayerBound="1";
 document.addEventListener("crowrules:leaguechange",async e=>{
  const league=e.detail?.league||"all";
  setLeagueInUrl(league);
  syncLeagueUi(league);
  window.CROW_SPORTS_LEAGUE=league;
  dispatchDataRefresh("league");
  await refreshCurrentSportsPage();
 });
 document.addEventListener("crowrules:sportsdatarefresh",e=>{
  window.CROW_SPORTS_LAST_REFRESH={at:new Date().toISOString(),...e.detail};
 });
}
async function subscribeSportsData(tables,callback){
 if(!sb||!Array.isArray(tables)||!tables.length)return null;
 const channel=sb.channel("cr-sports-data-"+Math.random().toString(36).slice(2));
 tables.forEach(table=>channel.on("postgres_changes",{event:"*",schema:"public",table},callback));
 channel.subscribe();
 dataChannels.push(channel);
 return channel;
}

window.CrowRulesSports={
 version:"22.0",shellVersion:"22.0",navGroups:NAV_GROUPS,nav:NAV,supabase:sb,$,$,esc,sleep,timeout:withTimeout,normalizeError,reportError,loadPodcastAudio,
 dataTables:SPORTS_DATA_TABLES,getActiveLeague,populateUniversalLeagueSelector,setLeagueInUrl,loadSportsLeagues,resolveLeague,leagueId,leagueQuery,getSportsData,getSportsSnapshot,syncLeagueUi,refreshCurrentSportsPage,subscribeSportsData,
 getSession,loadSession,loadUnread,signIn,signUp,signOut,shell,footer,startBadgeRealtime,
 storage:{get:storageGet,set:storageSet,remove:storageRemove}
};
window.getCrowRulesSportsSession=getSession;
window.loadUnread=loadUnread;
window.signOut=signOut;
window.startSportsBadgeRealtime=startBadgeRealtime;

if(sb)bindAuth();
function initShared(){ensureNavStyles();bindNav();bindGlobalSearch();bindLeagueSelector();bindUniversalDataLayer();syncLeagueUi();populateUniversalLeagueSelector();loadSession();if(sb)setTimeout(startBadgeRealtime,250);}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initShared,{once:true});else initShared();

})();