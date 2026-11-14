/* CrowRules Sports Admin V7 — additive control center; existing auth/RLS remain authoritative. */
(()=>{"use strict";
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let events=[],stories=[],teams=[],leagues=[],busy=false;
const client=()=>window.CrowRulesAdminAuth?.client;
function panelMarkup(){const app=$("app"),aside=app?.querySelector("aside"),main=app?.querySelector("main");if(!app||!aside||!main||$("v7-center"))return false;
const entry=document.createElement("button");entry.className="v7-entry";entry.id="v7-open";entry.type="button";entry.textContent="✦ V7 CONTROL CENTER";aside.appendChild(entry);
const section=document.createElement("section");section.id="v7-center";section.innerHTML=`
<div class="v7-head"><div><div class="v7-kicker">Sports operations · V7</div><h1>CONTROL CENTER</h1><div class="v7-sub">One operational view for event feeds, publishing, team and league coverage, moderation and performance. All actions use your existing authorized Supabase session and database policies.</div></div><div class="v7-actions"><button class="v7-btn" id="v7-back">← Original admin</button><button class="v7-btn primary" id="v7-refresh">↻ Refresh data</button></div></div>
<div class="v7-grid">
<div class="v7-card"><small>Events in workspace</small><strong id="v7-events">—</strong></div>
<div class="v7-card"><small>Live events</small><strong id="v7-live">—</strong></div>
<div class="v7-card"><small>Published stories</small><strong id="v7-published">—</strong></div>
<div class="v7-card"><small>Needs review</small><strong id="v7-review">—</strong></div>
</div>
<div class="v7-layout">
<div class="v7-panel"><h2>Feed & event operations</h2><div class="v7-health" id="v7-feed-health">Checking Supabase event feed…</div><p class="v7-muted" id="v7-feed-note">Feed health is inferred from records already stored in the CrowRules Sports events table. This does not claim an upstream provider is connected or live.</p><div class="v7-scroll"><table class="v7-table"><thead><tr><th>Event</th><th>Competition</th><th>Start / update</th><th>Status</th></tr></thead><tbody id="v7-event-rows"><tr><td colspan="4">Loading…</td></tr></tbody></table></div></div>
<div class="v7-panel"><h2>Publishing & moderation queue</h2><p class="v7-muted">Review unpublished events and draft stories. Publishing changes are checked by the existing Supabase RLS policies.</p><div id="v7-queue" class="v7-list">Loading moderation queue…</div></div>
<div class="v7-panel"><h2>Teams & leagues directory</h2><p class="v7-muted">Coverage directory derived from existing event records. This does not create a separate team/league database or imply unsupported team metadata.</p><input id="v7-directory-filter" class="v7-filter" placeholder="Filter teams and leagues…"><div class="v7-layout" style="grid-template-columns:1fr 1fr"><div><div class="v7-kicker">Teams</div><div id="v7-teams" class="v7-list"></div></div><div><div class="v7-kicker">Leagues</div><div id="v7-leagues" class="v7-list"></div></div></div></div>
<div class="v7-panel"><h2>Operational analytics</h2><div id="v7-analytics" class="v7-list">Calculating…</div><p class="v7-muted">Counts are based on the latest rows returned by the authorized queries, not an external analytics service.</p></div>
</div>`;
main.appendChild(section);
function show(){ $("overview").hidden=true;$("records").hidden=true;section.classList.add("v7-active");document.querySelectorAll(".nav button").forEach(b=>b.classList.remove("active"));entry.classList.add("active");load();}
function back(){section.classList.remove("v7-active");$("overview").hidden=false;$("records").hidden=true;entry.classList.remove("active");document.querySelectorAll(".nav button").forEach((b,i)=>b.classList.toggle("active",i===0));}
entry.addEventListener("click",show);$("v7-back").addEventListener("click",back);$("v7-refresh").addEventListener("click",load);$("v7-directory-filter").addEventListener("input",renderDirectory);
section.addEventListener("click",async e=>{const b=e.target.closest("[data-v7-action]");if(!b)return;await moderate(b.dataset.kind,b.dataset.id,b.dataset.value);});
return true;}
async function load(){if(busy)return;const db=client();if(!db){$("v7-feed-health").textContent="Admin client unavailable";return;}busy=true;$("v7-refresh").disabled=true;
try{
const [er,sr]=await Promise.all([
db.from("cr_sports_events").select("id,sport,league,event_name,home_team,away_team,starts_at,status,home_score,away_score,is_published,updated_at").order("starts_at",{ascending:false}).limit(500),
db.from("cr_sports_stories").select("id,title,slug,sport,status,published_at,created_at").order("created_at",{ascending:false}).limit(500)
]);
if(er.error)throw new Error("Events: "+er.error.message);if(sr.error)throw new Error("Stories: "+sr.error.message);
events=er.data||[];stories=sr.data||[];render();
}catch(e){$("v7-feed-health").textContent="Data query needs attention";$("v7-feed-note").textContent=e.message;$("v7-queue").textContent="Unable to load moderation records.";}
finally{busy=false;$("v7-refresh").disabled=false;}}
function render(){
const live=events.filter(x=>String(x.status||"").toLowerCase()==="live").length;
const published=stories.filter(x=>x.status==="published").length;
const reviewEvents=events.filter(x=>x.is_published!==true),drafts=stories.filter(x=>x.status==="draft");
$("v7-events").textContent=events.length;$("v7-live").textContent=live;$("v7-published").textContent=published;$("v7-review").textContent=reviewEvents.length+drafts.length;
const fresh=events.filter(x=>x.updated_at||x.starts_at).sort((a,b)=>new Date(b.updated_at||b.starts_at)-new Date(a.updated_at||a.starts_at))[0];
$("v7-feed-health").textContent=events.length?"Supabase event records available":"No event records found";
$("v7-feed-note").textContent=fresh?"Latest stored event timestamp: "+new Date(fresh.updated_at||fresh.starts_at).toLocaleString()+" · Provider connectivity is not independently verified.":"Add or import events to begin monitoring stored feed activity.";
$("v7-event-rows").innerHTML=events.slice(0,12).map(x=>'<tr><td>'+esc(x.event_name||[x.away_team,x.home_team].filter(Boolean).join(" @ ")||"Untitled event")+'</td><td>'+esc([x.sport,x.league].filter(Boolean).join(" · ")||"—")+'</td><td>'+esc(x.starts_at?new Date(x.starts_at).toLocaleString():"—")+'</td><td>'+esc(x.status||"unknown")+'</td></tr>').join("")||'<tr><td colspan="4" class="v7-empty">No event records in the table.</td></tr>';
const q=[...reviewEvents.slice(0,8).map(x=>({kind:"event",id:x.id,title:x.event_name||"Untitled event",detail:x.sport||"Event",value:"publish"})),...drafts.slice(0,8).map(x=>({kind:"story",id:x.id,title:x.title||"Untitled story",detail:x.sport||"Sports story",value:"publish"}))];
$("v7-queue").innerHTML=q.map(x=>'<div class="v7-item"><div><strong>'+esc(x.title)+'</strong><div class="v7-muted">'+esc(x.detail)+' · '+x.kind+'</div></div><button class="v7-btn primary" data-v7-action="publish" data-kind="'+x.kind+'" data-id="'+esc(x.id)+'" data-value="'+x.value+'">Publish</button></div>').join("")||'<div class="v7-empty">No unpublished events or draft stories in the current review queue.</div>';
teams=[...new Set(events.flatMap(x=>[x.home_team,x.away_team]).filter(Boolean))].sort();leagues=[...new Set(events.map(x=>x.league).filter(Boolean))].sort();renderDirectory();
const sports=[...new Set(events.map(x=>x.sport).filter(Boolean))];const finals=events.filter(x=>String(x.status||"").toLowerCase()==="final").length;
$("v7-analytics").innerHTML=[["Sports represented",sports.length],["Teams represented",teams.length],["Leagues / competitions",leagues.length],["Final events",finals],["Stories in review",drafts.length],["Unpublished events",reviewEvents.length]].map(([k,v])=>'<div class="v7-item"><span>'+esc(k)+'</span><strong>'+v+'</strong></div>').join("");
}
function renderDirectory(){const q=($("v7-directory-filter")?.value||"").toLowerCase();const t=teams.filter(x=>x.toLowerCase().includes(q)),l=leagues.filter(x=>x.toLowerCase().includes(q));$("v7-teams").innerHTML=t.slice(0,30).map(x=>'<div class="v7-item">'+esc(x)+'</div>').join("")||'<div class="v7-empty">No matching teams.</div>';$("v7-leagues").innerHTML=l.slice(0,30).map(x=>'<div class="v7-item">'+esc(x)+'</div>').join("")||'<div class="v7-empty">No matching leagues.</div>';}
async function moderate(kind,id,action){const db=client();if(!db||!confirm("Publish this "+kind+"? Existing Supabase permissions will decide whether this action is allowed."))return;const table=kind==="event"?"cr_sports_events":"cr_sports_stories";const patch=kind==="event"?{is_published:true}:{status:"published",published_at:new Date().toISOString()};const {error}=await db.from(table).update(patch).eq("id",id);if(error){alert("Publishing was blocked: "+error.message);return;}await load();}
function init(){if(panelMarkup())return true;return false;}
if(!init()){const mo=new MutationObserver(()=>{if(init())mo.disconnect();});mo.observe(document.body,{childList:true,subtree:true});}
})();
