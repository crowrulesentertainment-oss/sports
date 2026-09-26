/* CrowRules Sports — Shared Engine 17.0 */
(function(){
"use strict";

const SUPABASE_URL="https://cevylpnoexugwgygvtgu.supabase.co";
const SUPABASE_KEY="sb_publishable_AdfM5y6RqvF3tbvEVzDZSg_JuGTQLD-";

if(!window.supabase||typeof window.supabase.createClient!=="function"){
 console.error("CrowRules Sports: Supabase JS was not loaded.");
 window.CROW_SPORTS_READY=false;
 return;
}

const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{
 auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true},
 global:{headers:{"x-client-info":"crowrules-sports/17.0"}}
});

window.sb=sb;
window.supabaseClient=sb;
window.sbClient=sb;
window.CROW_SPORTS_READY=true;
window.CROW_SPORTS_VERSION="17.0";

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

const NAV=[
 ["home","HOME","index.html"],
 ["live","LIVE","live.html"],
 ["scores","SCORES","scores.html"],
 ["schedule","SCHEDULE","schedule.html"],
 ["standings","STANDINGS","standings.html"],
 ["leaders","LEADERS","leaders.html"],
 ["combat","COMBAT / WRESTLING","combat.html"],
 ["event","EVENT CENTER","event.html"],
 ["media","AUDIO / VIDEO","media.html"],
 ["pickem","PICK EM","pickem.html"],
 ["notifications","NOTIFICATIONS","notifications.html"],
 ["sync-health","SYNC HEALTH","sync-health.html"],
 ["partners","PARTNERS","partners.html"],
 ["account","ACCOUNT","account.html"]
];

function currentPage(){return location.pathname.split("/").pop()||"index.html";}

function ensureNavStyles(){
 if(document.getElementById("cr-shared-nav-style"))return;
 const style=document.createElement("style");
 style.id="cr-shared-nav-style";
 style.textContent=`
 .cr-header{position:relative;z-index:100}
 .cr-nav{position:relative}
 .cr-nav .brand{flex:0 0 auto;white-space:nowrap}
 .cr-nav .navlinks{min-width:0;display:flex;align-items:center;justify-content:flex-end;gap:2px;transition:max-height .2s ease}
 .cr-nav .navlinks a{white-space:nowrap;border-radius:6px;transition:background .15s ease,color .15s ease}
 .cr-nav .navlinks a.active{color:#fff;background:#e1060014;box-shadow:inset 0 -2px 0 #e10600}
 .cr-nav .account{white-space:nowrap;flex:0 0 auto;max-width:180px;overflow:hidden;text-overflow:ellipsis}
 .cr-menu-toggle{display:none;border:1px solid #ffffff18;background:#ffffff06;color:#fff;border-radius:8px;padding:8px 10px;font:700 9px Orbitron,Arial;cursor:pointer}
 @media(max-width:1380px){.cr-nav{gap:8px;padding-left:12px;padding-right:12px}.cr-nav .brand{font-size:12px}.cr-nav .navlinks{overflow-x:auto;scrollbar-width:none}.cr-nav .navlinks::-webkit-scrollbar{display:none}.cr-nav .navlinks a{font-size:7px;padding:8px 5px}.cr-nav .account{font-size:8px;max-width:130px}}
 @media(max-width:1080px){.cr-menu-toggle{display:block;margin-left:auto}.cr-nav .navlinks{position:absolute;left:8px;right:8px;top:100%;display:none;max-height:75vh;overflow:auto;background:#07080d;backdrop-filter:blur(18px);border:1px solid #ffffff12;border-radius:12px;padding:8px;z-index:100}.cr-nav .navlinks.cr-open{display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start}.cr-nav .navlinks a{padding:11px 12px;font-size:9px}.cr-nav .account{display:none}}
 @media(max-width:520px){.cr-nav{padding:11px 10px}.cr-nav .brand{font-size:11px;letter-spacing:1px}}
 `;
 document.head.appendChild(style);
}

function bindNav(){
 const toggle=$("#crMenuToggle"),links=$("#crNavLinks");
 if(!toggle||!links||toggle.dataset.bound)return;
 toggle.dataset.bound="1";
 toggle.addEventListener("click",()=>{
  const open=links.classList.toggle("cr-open");
  toggle.setAttribute("aria-expanded",String(open));
 });
 document.addEventListener("keydown",e=>{if(e.key==="Escape"){links.classList.remove("cr-open");toggle.setAttribute("aria-expanded","false");}});
 links.addEventListener("click",e=>{
  if(e.target.closest("a")){links.classList.remove("cr-open");toggle.setAttribute("aria-expanded","false");}
 });
}

function shell(active){
 const page=active||currentPage().replace(/\.html$/,"");
 const links=NAV.map(([key,label,url])=>`<a href="${url}" class="${page===key?"active":""}" data-nav="${key}">${label}</a>`).join("");
 document.write(`<header class="site-header cr-header" data-cr-shell="17">
  <nav class="nav cr-nav" aria-label="CrowRules Sports navigation">
   <a class="brand" href="index.html" aria-label="CrowRules Sports home">CROW<span>RULES</span> SPORTS</a>
   <button class="cr-menu-toggle" id="crMenuToggle" type="button" aria-expanded="false" aria-controls="crNavLinks">MENU</button>
   <div class="navlinks" id="crNavLinks">${links}</div>
   <span class="account" id="account" aria-live="polite">ACCOUNT</span>
  </nav>
 </header>`);
 ensureNavStyles();
 queueMicrotask(bindNav);
}

function footer(){document.write('<footer class="footer">CROWRULES SPORTS • ONE COMPANY. ONE UNIVERSE. • Built in Tacoma, Washington • <span id="crEngineVersion">Engine 17.0</span></footer>');}

async function getSession(){
 try{const r=await withTimeout(sb.auth.getSession(),8000,"Session check");return r?.data?.session||null;}
 catch(e){reportError("getSession",e);return null;}
}
function accountMarkup(session){
 if(!session)return '<span class="account-dot"></span> ACCOUNT';
 return '<span class="account-dot signed"></span> '+esc(session.user?.email||"SIGNED IN");
}
async function loadUnread(sessionArg){
 const link=document.querySelector('.navlinks a[data-nav="notifications"]');
 if(!link)return 0;
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
 if(authSubscription)return;
 const r=sb.auth.onAuthStateChange((event,session)=>{
  window.CROW_SPORTS_AUTH_EVENT=event;
  setTimeout(()=>{loadSession();if(event==="SIGNED_IN"||event==="SIGNED_OUT"||event==="TOKEN_REFRESHED"||event==="USER_UPDATED")startBadgeRealtime();},0);
 });
 authSubscription=r?.data?.subscription||null;
}

window.CROW_SPORTS_NAV_VERSION="17.0";
window.CrowRulesSports={
 version:"17.0",supabase:sb,$,$$,esc,sleep,timeout:withTimeout,normalizeError,reportError,
 getSession,loadSession,loadUnread,signIn,signUp,signOut,shell,footer,startBadgeRealtime,
 storage:{get:storageGet,set:storageSet,remove:storageRemove}
};
window.getCrowRulesSportsSession=getSession;
window.loadUnread=loadUnread;
window.signOut=signOut;
window.startSportsBadgeRealtime=startBadgeRealtime;

bindAuth();
function initShared(){bindNav();loadSession();setTimeout(startBadgeRealtime,250);}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initShared,{once:true});else initShared();

})();