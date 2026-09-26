/* CrowRules Sports — Shared Engine 20.0 */
(function(){
"use strict";

const SUPABASE_URL="https://cevylpnoexugwgygvtgu.supabase.co";
const SUPABASE_KEY="sb_publishable_AdfM5y6RqvF3tbvEVzDZSg_JuGTQLD-";

const HAS_SUPABASE=!!(window.supabase&&typeof window.supabase.createClient==="function");
let sb=null;
if(HAS_SUPABASE){
 sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{
 auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true},
 global:{headers:{"x-client-info":"crowrules-sports/20.0"}}
 });
}else{
 console.warn("CrowRules Sports: Supabase JS was not loaded. Navigation remains available.");
}
window.sb=sb;
window.supabaseClient=sb;
window.sbClient=sb;
window.CROW_SPORTS_READY=HAS_SUPABASE;
window.CROW_SPORTS_VERSION="20.0";

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
 style.textContent=`.cr-header{position:sticky;top:0;z-index:1000;width:100%;background:rgba(5,5,7,.97);border-bottom:1px solid rgba(255,255,255,.08);backdrop-filter:blur(18px);box-shadow:0 8px 30px rgba(0,0,0,.28)}
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
 document.write(`<header class="site-header cr-header" data-cr-shell="20">
  <nav class="nav cr-nav" aria-label="CrowRules Sports navigation">
   <a class="brand" href="index.html" aria-label="CrowRules Sports home">CROW<span>RULES</span> SPORTS</a>
   <button class="cr-menu-toggle" id="crMenuToggle" type="button" aria-expanded="false" aria-controls="crNavLinks">MENU</button>
   <div class="navlinks" id="crNavLinks">${groups}</div>
   <span class="account" id="account" aria-live="polite">ACCOUNT</span>
  </nav>
 </header>`);
 ensureNavStyles();
 queueMicrotask(bindNav);
}

function footer(){document.write('<footer class="footer">CROWRULES SPORTS • ONE COMPANY. ONE UNIVERSE. • Built in Tacoma, Washington • <span id="crEngineVersion">Engine 20.0</span></footer>');}

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

window.CROW_SPORTS_NAV_VERSION="20.0";
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

window.CrowRulesSports={
 version:"20.0",navGroups:NAV_GROUPS,nav:NAV,supabase:sb,$,$,esc,sleep,timeout:withTimeout,normalizeError,reportError,loadPodcastAudio,
 getSession,loadSession,loadUnread,signIn,signUp,signOut,shell,footer,startBadgeRealtime,
 storage:{get:storageGet,set:storageSet,remove:storageRemove}
};
window.getCrowRulesSportsSession=getSession;
window.loadUnread=loadUnread;
window.signOut=signOut;
window.startSportsBadgeRealtime=startBadgeRealtime;

if(sb)bindAuth();
function initShared(){ensureNavStyles();bindNav();loadSession();if(sb)setTimeout(startBadgeRealtime,250);}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initShared,{once:true});else initShared();

})();