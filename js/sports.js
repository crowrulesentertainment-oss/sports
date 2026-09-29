/* CrowRules Sports 3.0 — Universal Data Layer
   Static JSON now; designed so the same API can later be backed by Supabase/live feeds.
*/
const SportsState={
  data:{leagues:[],teams:[],players:[],games:[],standings:[],schedule:[],videos:[],pickem:{games:[],leaderboard:[]}},
  selectedLeague:new URLSearchParams(location.search).get("league")||localStorage.getItem("crowrulesSportsLeague")||"all",
  search:new URLSearchParams(location.search).get("q")||"",
  ready:false
};
const $=s=>document.querySelector(s);
const esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const loadJSON=async path=>{const r=await fetch(path+"?v=3.0",{cache:"no-store"});if(!r.ok)throw new Error(path+" "+r.status);return r.json();};

async function loadData(){
  const [leagues,teams,players,games,standings,schedule,videos,pickem]=await Promise.all([
    loadJSON("data/leagues.json"),loadJSON("data/teams.json"),loadJSON("data/players.json"),loadJSON("data/games.json"),
    loadJSON("data/standings.json"),loadJSON("data/schedule.json"),loadJSON("data/videos.json"),loadJSON("data/pickem.json")
  ]);
  SportsState.data={leagues:leagues.leagues||[],teams:teams.teams||[],players:players.players||[],games:games.games||[],standings:standings.standings||[],schedule:schedule.schedule||[],videos:videos.videos||[],pickem};
  SportsState.ready=true; buildShell(); render();
}
function league(){return SportsState.data.leagues.find(x=>x.id===SportsState.selectedLeague)||null}
function selected(arr){return SportsState.selectedLeague==="all"?arr:arr.filter(x=>x.leagueId===SportsState.selectedLeague)}
function team(id){return SportsState.data.teams.find(x=>x.id===id)}
function leagueName(id){return SportsState.data.leagues.find(x=>x.id===id)?.name||id}
function setLeague(id){
  SportsState.selectedLeague=id||"all"; localStorage.setItem("crowrulesSportsLeague",SportsState.selectedLeague);
  const u=new URL(location.href); if(id&&id!=="all")u.searchParams.set("league",id);else u.searchParams.delete("league");
  history.replaceState({}, "", u); buildShell(); render();
}
function buildShell(){
  const top=document.querySelector(".topbar"); if(!top)return;
  if(!document.querySelector("#sportsControls")){
    const controls=document.createElement("div"); controls.id="sportsControls"; controls.className="sportsControls";
    controls.innerHTML='<label class="srOnly" for="leagueSelect">League</label><select id="leagueSelect" aria-label="Global league selector"></select><label class="srOnly" for="sportsSearch">Search sports</label><input id="sportsSearch" type="search" placeholder="SEARCH SPORTS" autocomplete="off"><span class="accountStatus">● DATA LAYER</span>';
    top.appendChild(controls);
  }
  const select=$("#leagueSelect"); if(select){
    select.innerHTML='<option value="all">ALL LEAGUES</option>'+SportsState.data.leagues.map(l=>'<option value="'+esc(l.id)+'">'+esc(l.name)+' • '+esc(l.level)+'</option>').join("");
    select.value=SportsState.selectedLeague; select.onchange=e=>setLeague(e.target.value);
  }
  const search=$("#sportsSearch"); if(search){search.value=SportsState.search; search.oninput=e=>{SportsState.search=e.target.value;render()};}
}
function render(){
  if(!SportsState.ready)return;
  const q=SportsState.search.trim().toLowerCase();
  const leagues=SportsState.data.leagues.filter(l=>SportsState.selectedLeague==="all"||l.id===SportsState.selectedLeague).filter(l=>!q||JSON.stringify(l).toLowerCase().includes(q));
  const games=selected(SportsState.data.games).filter(g=>!q||JSON.stringify(g).toLowerCase().includes(q));
  const players=selected(SportsState.data.players).filter(p=>!q||JSON.stringify(p).toLowerCase().includes(q));
  if($("#leagues"))$("#leagues").innerHTML=leagues.map(l=>'<a class="league" href="leagues.html?league='+encodeURIComponent(l.id)+'"><b>'+esc(l.name)+'</b><span>'+esc(l.level)+'</span></a>').join("")||'<div class="emptyState">NO MATCHES</div>';
  if($("#games"))$("#games").innerHTML=games.map(g=>{const a=team(g.awayTeamId),h=team(g.homeTeamId);return '<div class="game"><div><small>'+esc(leagueName(g.leagueId))+'</small><br><span class="live">'+esc(g.status)+'</span></div><div><b>'+esc(a?.name||"AWAY TEAM")+'</b><br><small>@</small><br><b>'+esc(h?.name||"HOME TEAM")+'</b></div><div><small>'+esc(g.time||"TBD")+'</small></div></div>'}).join("")||'<div class="emptyState">NO GAMES IN SELECTION</div>';
  if($("#players"))$("#players").innerHTML=players.map((p,i)=>'<div class="player"><div class="rank">'+String(i+1).padStart(2,"0")+'</div><div><b>'+esc(p.name)+'</b><br><small>'+esc(p.position||"PLAYER")+' • '+esc(leagueName(p.leagueId))+'</small></div><div class="stat">'+esc(p.statValue||"—")+'</div></div>').join("")||'<div class="emptyState">NO PLAYERS IN SELECTION</div>';
  document.querySelectorAll("[data-sports-selection]").forEach(el=>el.textContent=SportsState.selectedLeague==="all"?"ALL LEAGUES":(league()?.name||"ALL LEAGUES"));
  document.querySelectorAll("[data-sports-count]").forEach(el=>el.textContent=selected(SportsState.data.games).length);
  document.querySelectorAll("[data-sports-module]").forEach(el=>{el.classList.add("dataReady");});
}
function clock(){if($("#clock"))$("#clock").textContent=new Date().toLocaleTimeString([], {hour12:false})+" LOCAL"}
document.addEventListener("click",e=>{if(e.target.closest("#menu"))$("#mobileNav")?.classList.toggle("open")});
clock();setInterval(clock,1000);loadData().catch(err=>{console.error(err);document.querySelectorAll("[data-error]").forEach(x=>x.textContent="DATA LAYER ERROR — "+err.message)});
