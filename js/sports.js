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
  SportsState.ready=true; buildShell(); render(); renderDetail();
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
  const schedule=selected(SportsState.data.schedule);
  if($("#scheduleData"))$("#scheduleData").innerHTML=schedule.map(x=>'<div class="dataRow"><b>'+esc(leagueName(x.leagueId))+'</b><span>'+esc(x.date)+' • '+esc(x.time)+'</span><span>'+esc(x.venue)+'</span></div>').join("")||'<div class="emptyState">NO SCHEDULE ITEMS IN SELECTION</div>';
  const standings=selected(SportsState.data.standings).sort((a,b)=>a.rank-b.rank);
  if($("#standingsData"))$("#standingsData").innerHTML=standings.map(x=>{const t=team(x.teamId);return '<div class="dataRow"><b>#'+esc(x.rank)+' '+esc(t?.name||"TEAM")+'</b><span>'+esc(leagueName(x.leagueId))+'</span><span>'+esc(x.wins)+'-'+esc(x.losses)+'</span></div>'}).join("")||'<div class="emptyState">NO STANDINGS IN SELECTION</div>';
  const teams=SportsState.data.teams.filter(t=>SportsState.selectedLeague==="all"||t.leagueId===SportsState.selectedLeague).filter(t=>!q||JSON.stringify(t).toLowerCase().includes(q));
  if($("#teamsData"))$("#teamsData").innerHTML=teams.map(t=>'<div class="dataRow"><b>'+esc(t.name)+'</b><span>'+esc(t.short)+'</span><span>'+esc(leagueName(t.leagueId))+'</span></div>').join("")||'<div class="emptyState">NO TEAMS IN SELECTION</div>';
  const videos=selected(SportsState.data.videos).filter(v=>!q||JSON.stringify(v).toLowerCase().includes(q));
  if($("#videosData"))$("#videosData").innerHTML=videos.map(v=>'<div class="dataRow"><b>'+esc(v.title)+'</b><span>'+esc(leagueName(v.leagueId))+'</span><span>'+esc(v.type||"VIDEO")+'</span></div>').join("")||'<div class="emptyState">NO VIDEOS IN SELECTION</div>';
  const picks=(SportsState.data.pickem?.games||[]).filter(x=>SportsState.selectedLeague==="all"||x.leagueId===SportsState.selectedLeague);
  if($("#pickemData"))$("#pickemData").innerHTML=picks.map(x=>'<div class="dataRow pickRow"><b>'+esc(leagueName(x.leagueId))+'</b><span>'+esc(x.question)+'</span><span>'+esc(x.options.join(" / "))+' • '+esc(x.points)+' PTS</span></div>').join("")||'<div class="emptyState">NO PICK ’EM GAMES IN SELECTION</div>';
}
function clock(){if($("#clock"))$("#clock").textContent=new Date().toLocaleTimeString([], {hour12:false})+" LOCAL"}
document.addEventListener("click",e=>{if(e.target.closest("#menu"))$("#mobileNav")?.classList.toggle("open")});

function byId(id){return new URLSearchParams(location.search).get(id)}
function link(path,id,label){return '<a class="detailLink" href="'+path+'?id='+encodeURIComponent(id)+'">'+esc(label)+'</a>'}
function renderDetail(){
  const id=byId("id"), page=location.pathname.split("/").pop();
  const d=SportsState.data;
  const game=d.games.find(x=>x.id===id), t=d.teams.find(x=>x.id===id), p=d.players.find(x=>x.id===id), v=d.videos.find(x=>x.id===id), l=d.leagues.find(x=>x.id===(new URLSearchParams(location.search).get("league")||id));
  const card=(title,body)=>'<article class="detailCard"><small>'+esc(title)+'</small>'+body+'</article>';
  if(page==="game.html"){
    if(!game){$("#gameDetail").innerHTML=card("GAME","<h2>GAME NOT FOUND</h2>");return}
    const a=team(game.awayTeamId),h=team(game.homeTeamId);
    $("#detailIntro").textContent=leagueName(game.leagueId)+" • "+(game.status||"SCHEDULED");
    $("#gameDetail").innerHTML=card("MATCHUP",'<h2>'+link("team.html",game.awayTeamId,a?.name||"Away Team")+' <span class="versus">@</span> '+link("team.html",game.homeTeamId,h?.name||"Home Team")+'</h2><p>'+esc(game.time||"TBD")+' • '+esc(game.status||"")+'</p><div class="detailActions"><a class="btn primary" href="pickem.html?league='+encodeURIComponent(game.leagueId)+'">PICK ’EM</a><a class="btn" href="schedule.html?league='+encodeURIComponent(game.leagueId)+'">LEAGUE SCHEDULE</a></div>');
  } else if(page==="team.html"){
    if(!t){$("#teamDetail").innerHTML=card("TEAM","<h2>TEAM NOT FOUND</h2>");return}
    const roster=d.players.filter(x=>x.teamId===t.id), games=d.games.filter(x=>x.homeTeamId===t.id||x.awayTeamId===t.id), s=d.standings.find(x=>x.teamId===t.id);
    $("#detailIntro").textContent=leagueName(t.leagueId)+" • "+(t.short||"TEAM");
    $("#teamDetail").innerHTML=card("TEAM PROFILE",'<h2>'+esc(t.name)+'</h2><p>'+esc(leagueName(t.leagueId))+(s?' • Record '+esc(s.wins)+'-'+esc(s.losses):"")+'</p><h3>ROSTER</h3>'+ (roster.map(x=>link("player.html",x.id,x.name)).join(" • ")||"Roster data pending.")+'<h3>GAMES</h3>'+games.map(x=>link("game.html",x.id,(x.status||"Game")+" • "+(x.time||"TBD"))).join("<br>"));
  } else if(page==="player.html"){
    if(!p){$("#playerDetail").innerHTML=card("PLAYER","<h2>PLAYER NOT FOUND</h2>");return}
    const pt=team(p.teamId);
    $("#detailIntro").textContent=leagueName(p.leagueId)+" • "+(p.position||"PLAYER");
    $("#playerDetail").innerHTML=card("PLAYER PROFILE",'<h2>'+esc(p.name)+'</h2><p>'+esc(p.position||"PLAYER")+' • '+(pt?link("team.html",pt.id,pt.name):"Team pending")+'</p><div class="statBlock"><b>'+esc(p.statValue||"—")+'</b><span>LEADER STAT</span></div>');
  } else if(page==="video.html"){
    if(!v){$("#videoDetail").innerHTML=card("VIDEO","<h2>VIDEO NOT FOUND</h2>");return}
    $("#detailIntro").textContent=leagueName(v.leagueId)+" • "+(v.type||"VIDEO");
    $("#videoDetail").innerHTML=card("SPORTS MEDIA",'<h2>'+esc(v.title)+'</h2><p>'+esc(v.type||"VIDEO")+' • '+esc(leagueName(v.leagueId))+'</p><div class="videoStage">VIDEO PLAYER / MEDIA STREAM READY</div><a class="btn" href="leagues.html?league='+encodeURIComponent(v.leagueId)+'">MORE '+esc(leagueName(v.leagueId))+' MEDIA</a>');
  } else if(page==="league.html"){
    if(!l){$("#leagueDetail").innerHTML=card("LEAGUE","<h2>LEAGUE NOT FOUND</h2>");return}
    const gs=d.games.filter(x=>x.leagueId===l.id), ts=d.teams.filter(x=>x.leagueId===l.id), ps=d.players.filter(x=>x.leagueId===l.id), vs=d.videos.filter(x=>x.leagueId===l.id);
    $("#detailIntro").textContent=l.name+" • "+l.level;
    $("#leagueDetail").innerHTML=card("LEAGUE DASHBOARD",'<h2>'+esc(l.name)+'</h2><p>'+esc(l.level)+' • '+gs.length+' games • '+ts.length+' teams • '+ps.length+' players</p><div class="detailLinks"><a class="btn" href="scores.html?league='+encodeURIComponent(l.id)+'">SCORES</a><a class="btn" href="schedule.html?league='+encodeURIComponent(l.id)+'">SCHEDULE</a><a class="btn" href="standings.html?league='+encodeURIComponent(l.id)+'">STANDINGS</a><a class="btn" href="teams.html?league='+encodeURIComponent(l.id)+'">TEAMS</a><a class="btn" href="players.html?league='+encodeURIComponent(l.id)+'">PLAYERS</a><a class="btn" href="videos.html?league='+encodeURIComponent(l.id)+'">MEDIA</a></div>');
  }
}

clock();setInterval(clock,1000);loadData().catch(err=>{console.error(err);document.querySelectorAll("[data-error]").forEach(x=>x.textContent="DATA LAYER ERROR — "+err.message)});
