/* CrowRules Sports — Shared Engine 15.0
   Universal Supabase client • auth/session • navigation • notifications • realtime • utilities
*/
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
  auth:{
    autoRefreshToken:true,
    persistSession:true,
    detectSessionInUrl:true
  },
  global:{
    headers:{"x-client-info":"crowrules-sports/15.0"}
  }
});

/* Expose both forms because legacy and upgraded pages use both. */
window.sb=sb;
window.supabaseClient=sb;
window.sbClient=sb;
window.CROW_SPORTS_READY=true;
window.CROW_SPORTS_VERSION="15.0";

const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

function safeStorage(type){
  try{return type==="session"?window.sessionStorage:window.localStorage}catch(_){return null}
}
function readStorage(key,fallback=null,type="local"){
  try{const s=safeStorage(type),v=s?.getItem(key);return v==null?fallback:JSON.parse(v)}catch(_){return fallback}
}
function writeStorage(key,value,type="local"){
  try{const s=safeStorage(type);if(!s)return false;s.setItem(key,JSON.stringify(value));return true}catch(_){return false}
}
function removeStorage(key,type="local"){
  try{safeStorage(type)?.removeItem(key)}catch(_){}
}

async function withTimeout(promise,ms=12000,label="Request"){
  let timer;
  const timeout=new Promise((_,reject)=>timer=setTimeout(()=>reject(new Error(label+" timed out after "+Math.round(ms/1000)+" seconds.")),ms));
  try{return await Promise.race([promise,timeout])}
  finally{clearTimeout(timer)}
}
window.crTimeout=withTimeout;

function normalizeError(error){
  if(!error)return null;
  return {message:error.message||String(error),code:error.code||"",details:error.details||"",hint:error.hint||""};
}
function reportError(label,error){
  const e=normalizeError(error);
  console.error("[CrowRules Sports]",label,e||error);
  return e;
}
window.crError=normalizeError;

const NAV=[
 ["home","HOME","index.html"],
 ["scores","SCORES","scores.html"],
 ["standings","STANDINGS","standings.html"],
 ["leaders","LEADERS","leaders.html"],
 ["combat","COMBAT / WRESTLING","combat.html"],
 ["rankings","RANKINGS","rankings.html"],
 ["champions","CHAMPIONS","championships.html"],
 ["teams","TEAMS","teams.html"],
 ["media","AUDIO / VIDEO","media.html"],
 ["pickem","PICK EM","pickem.html"],
 ["notifications","NOTIFICATIONS","notifications.html"],
 ["sync-health","SYNC HEALTH","sync-health.html"],
 ["partners","PARTNERS","partners.html"]
];

function currentPage(){
  return location.pathname.split("/").pop()||"index.html";
}
function shell(active){
  const page=active||currentPage().replace(/\.html$/,"");
  const links=NAV.map(([key,label,url])=>
    '<a href="'+url+'" class="'+(page===key?"active":"")+'" data-nav="'+key+'">'+label+"</a>"
  ).join("");
  document.write(
    '<header class="site-header cr-header" data-cr-shell="15">'+
      '<nav class="nav cr-nav" aria-label="CrowRules Sports navigation">'+
        '<a class="brand" href="index.html" aria-label="CrowRules Sports home">CROW<span>RULES</span> SPORTS</a>'+
        '<button class="cr-menu-toggle" id="crMenuToggle" type="button" aria-expanded="false" aria-controls="crNavLinks">MENU</button>'+
        '<div class="navlinks" id="crNavLinks">'+links+"</div>"+
        '<span class="account" id="account" aria-live="polite">ACCOUNT</span>"+
      "</nav>"+
    "</header>"
  );
  ensureNavStyles();
  queueMicrotask(bindNav);
}

function ensureNavStyles(){
  if(document.getElementById("cr-shared-nav-style"))return;
  const style=document.createElement("style");
  style.id="cr-shared-nav-style";
  style.textContent=
    ".cr-header{position:relative}.cr-menu-toggle{display:none;border:1px solid #ffffff18;background:#ffffff06;color:#fff;border-radius:8px;padding:8px 10px;font:700 9px Orbitron,Arial;cursor:pointer}.cr-nav .navlinks{transition:max-height .2s ease}.cr-nav .account{white-space:nowrap}@media(max-width:980px){.cr-menu-toggle{display:block;margin-left:auto}.cr-nav .navlinks{position:absolute;left:10px;right:10px;top:100%;display:none;max-height:70vh;overflow:auto;background:#07080d;backdrop-filter:blur(18px);border:1px solid #ffffff12;border-radius:12px;padding:8px;z-index:100}.cr-nav .navlinks.cr-open{display:flex;flex-direction:column}.cr-nav .navlinks a{padding:10px 12px}.cr-nav .account{display:none}}";
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
  links.addEventListener("click",e=>{
    if(e.target.closest("a")){links.classList.remove("cr-open");toggle.setAttribute("aria-expanded","false")}
  });
}

function footer(){
  document.write('<footer class="footer">CROWRULES SPORTS • ONE COMPANY. ONE UNIVERSE. • Built in Tacoma, Washington • <span id="crEngineVersion">Engine 15.0</span></footer>');
}

async function getSession(){
  try{
    const result=await withTimeout(sb.auth.getSession(),8000,"Session check");
    return result?.data?.session||null;
  }catch(e){reportError("getSession",e);return null}
}
window.getCrowRulesSportsSession=getSession;

function accountMarkup(session){
  if(!session)return '<span class="account-dot"></span> ACCOUNT';
  const email=session.user?.email||"SIGNED IN";
  return '<span class="account-dot signed"></span> '+esc(email);
}

async function loadSession(){
  const session=await getSession();
  const account=$("#account");
  if(account){
    account.innerHTML=accountMarkup(session);
    account.title=session?.user?.email||"CrowRules Sports account";
  }
  await loadUnread(session);
  return session;
}

async function loadUnread(sessionArg){
  const link=document.querySelector('.navlinks a[data-nav="notifications"],.navlinks a[href="notifications.html"]');
  if(!link)return 0;
  const session=sessionArg===undefined?await getSession():sessionArg;
  if(!session){link.textContent="NOTIFICATIONS";return 0}
  try{
    const r=await withTimeout(
      sb.from("cr_sports_user_notifications")
        .select("id",{count:"exact",head:true})
        .eq("user_id",session.user.id)
        .is("read_at",null),
      7000,
      "Notification count"
    );
    if(r.error)throw r.error;
    const count=Number(r.count||0);
    link.textContent=count>0?"NOTIFICATIONS ("+count+")":"NOTIFICATIONS";
    link.setAttribute("aria-label",count+" unread notifications");
    return count;
  }catch(e){
    reportError("loadUnread",e);
    link.textContent="NOTIFICATIONS";
    return 0;
  }
}
window.loadUnread=loadUnread;

async function signIn(){
  const email=$("#email")?.value?.trim()||"";
  const password=$("#password")?.value||"";
  if(!email||!password){alert("Enter your email and password.");return null}
  try{
    const r=await withTimeout(sb.auth.signInWithPassword({email,password}),12000,"Sign in");
    if(r.error)throw r.error;
    location.reload();
    return r.data;
  }catch(e){alert(normalizeError(e)?.message||"Unable to sign in.");reportError("signIn",e);return null}
}

async function signUp(){
  const email=$("#email")?.value?.trim()||"";
  const password=$("#password")?.value||"";
  if(!email||!password){alert("Enter your email and password.");return null}
  if(password.length<6){alert("Password must be at least 6 characters.");return null}
  try{
    const r=await withTimeout(sb.auth.signUp({email,password}),12000,"Account creation");
    if(r.error)throw r.error;
    alert(r.data?.session?"Account created and signed in.":"Account created. Check your email if confirmation is enabled.");
    return r.data;
  }catch(e){alert(normalizeError(e)?.message||"Unable to create account.");reportError("signUp",e);return null}
}

async function signOut(){
  try{
    const r=await withTimeout(sb.auth.signOut(),10000,"Sign out");
    if(r.error)throw r.error;
    location.reload();
  }catch(e){alert(normalizeError(e)?.message||"Unable to sign out.");reportError("signOut",e)}
}
window.signOut=signOut;

let badgeChannel=null;
let badgeUid=null;
let badgeStarting=false;

async function startBadgeRealtime(){
  if(badgeStarting)return;
  badgeStarting=true;
  try{
    const session=await getSession();
    const uid=session?.user?.id||null;
    if(uid===badgeUid&&badgeChannel)return;
    if(badgeChannel){
      try{await sb.removeChannel(badgeChannel)}catch(e){reportError("remove badge channel",e)}
      badgeChannel=null;
    }
    badgeUid=uid;
    if(!uid){await loadUnread(null);return}
    badgeChannel=sb.channel("sports-global-badge-15-"+uid)
      .on("postgres_changes",{
        event:"*",
        schema:"public",
        table:"cr_sports_user_notifications",
        filter:"user_id=eq."+uid
      },()=>loadUnread(session))
      .subscribe((status,error)=>{
        if(error)reportError("notification realtime",error);
        if(status==="CHANNEL_ERROR"||status==="TIMED_OUT"){
          setTimeout(()=>{badgeChannel=null;startBadgeRealtime()},3000);
        }
      });
    await loadUnread(session);
  }finally{badgeStarting=false}
}
window.startSportsBadgeRealtime=startBadgeRealtime;

let authSubscription=null;
function bindAuth(){
  if(authSubscription)return;
  const r=sb.auth.onAuthStateChange((event,session)=>{
    window.CROW_SPORTS_AUTH_EVENT=event;
    setTimeout(()=>{
      loadSession().catch(e=>reportError("auth session refresh",e));
      if(event==="SIGNED_IN"||event==="SIGNED_OUT"||event==="TOKEN_REFRESHED"||event==="USER_UPDATED"){
        startBadgeRealtime();
      }
    },0);
  });
  authSubscription=r?.data?.subscription||null;
}
bindAuth();

function initShared(){
  bindNav();
  bindAuth();
  setTimeout(()=>startBadgeRealtime(),250);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initShared,{once:true});
else initShared();

/* Small shared utilities used by newer Sports pages. */
window.CrowRulesSports={
  version:"15.0",
  supabase:sb,
  $,
  $$,
  esc,
  sleep,
  timeout:withTimeout,
  normalizeError,
  reportError,
  getSession,
  loadSession,
  loadUnread,
  signIn,
  signUp,
  signOut,
  shell,
  footer,
  startBadgeRealtime,
  storage:{
    get:readStorage,
    set:writeStorage,
    remove:removeStorage
  }
};

})();