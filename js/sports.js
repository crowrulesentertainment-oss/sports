const SUPABASE_URL="https://cevylpnoexugwgygvtgu.supabase.co",SUPABASE_KEY="sb_publishable_AdfM5y6RqvF3tbvEVzDZSg_JuGTQLD-";const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);window.sb=sb;window.supabaseClient=sb;const $=s=>document.querySelector(s),esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));function shell(a){document.write('<header class="site-header"><nav class="nav"><a class="brand" href="index.html">CROW<span>RULES</span> SPORTS</a><div class="navlinks">'+['home|HOME|index.html','scores|SCORES|scores.html','standings|STANDINGS|standings.html','leaders|LEADERS|leaders.html','combat|COMBAT / WRESTLING|combat.html','rankings|RANKINGS|rankings.html','champions|CHAMPIONS|championships.html','teams|TEAMS|teams.html','media|AUDIO / VIDEO|media.html','pickem|PICK EM|pickem.html','notifications|NOTIFICATIONS|notifications.html','sync-health|SYNC HEALTH|sync-health.html','partners|PARTNERS|partners.html'].map(x=>{let q=x.split('|');return '<a href="'+q[2]+'" class="'+(a===q[0]?'active':'')+'">'+q[1]+'</a>'}).join('')+'</div><span class="account" id="account"></span></nav></header>')}function footer(){document.write('<footer class="footer">CROWRULES SPORTS • ONE COMPANY. ONE UNIVERSE. • Built in Tacoma, Washington</footer>')}async function loadSession(){const{data}=await sb.auth.getSession();if($('#account'))$('#account').innerHTML=data.session?'SIGNED IN':'ACCOUNT';loadUnread();return data.session}async function signIn(){const{error}=await sb.auth.signInWithPassword({email:$('#email').value.trim(),password:$('#password').value});if(error)return alert(error.message);location.reload()}async function loadUnread(){const el=document.querySelector('.navlinks a[href="notifications.html"]');if(!el)return;const{data}=await sb.auth.getSession();if(!data.session){el.textContent='NOTIFICATIONS';return}const r=await sb.from('cr_sports_user_notifications').select('id',{count:'exact',head:true}).eq('user_id',data.session.user.id).is('read_at',null);el.textContent='NOTIFICATIONS'+(r.count?' ('+r.count+')':'')}async function signUp(){const{error}=await sb.auth.signUp({email:$('#email').value.trim(),password:$('#password').value});if(error)return alert(error.message);alert('Account created. Check your email if confirmation is enabled.')} 
/* Sports 12.0 — global real-time notification badge */
(function(){
"use strict";
let badgeChannel=null,badgeUid=null;
async function startBadgeRealtime(){
 const {data}=await sb.auth.getSession();const uid=data.session?.user?.id||null;
 if(uid===badgeUid&&badgeChannel)return;
 if(badgeChannel){try{sb.removeChannel(badgeChannel)}catch(e){}}
 badgeUid=uid;
 if(!uid){await loadUnread();return}
 badgeChannel=sb.channel("sports-global-badge-12")
   .on("postgres_changes",{event:"*",schema:"public",table:"cr_sports_user_notifications",filter:"user_id=eq."+uid},()=>loadUnread())
   .subscribe(()=>loadUnread());
 await loadUnread();
}
window.startSports12BadgeRealtime=startBadgeRealtime;
sb.auth.onAuthStateChange(()=>setTimeout(startBadgeRealtime,50));
document.addEventListener("DOMContentLoaded",()=>setTimeout(startBadgeRealtime,350));
})();
