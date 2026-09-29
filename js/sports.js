/* CrowRules Sports 9.0 — Live Game Intelligence + Universal Event Center
   Static JSON now; structured for future Supabase/live feeds.
*/
const SportsState={
  data:{leagues:[],teams:[],players:[],games:[],standings:[],schedule:[],videos:[],pickem:{games:[],leaderboard:[]}},
  selectedLeague:new URLSearchParams(location.search).get("league")||localStorage.getItem("crowrulesSportsLeague")||"all",
  search:new URLSearchParams(location.search).get("q")||"",
  ready:false
};
const $=s=>document.querySelector(s);
const esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));


// SPORTS 24.0 — UNIVERSAL SPORTS API GATEWAY
const SportsAPI={
  mode:"STATIC",
  endpoint:null,
  provider:"NONE",
  async configure(){
    const cfg=window.CROW_CONFIG?.sportsLive||window.CROWRULES_SPORTS_API||null;
    if(typeof cfg==="string") this.endpoint=cfg;
    else if(cfg&&typeof cfg==="object"){this.endpoint=cfg.endpoint||null;this.provider=cfg.provider||"CUSTOM";}
    this.mode=this.endpoint?"READY":"STATIC";
    updateApiStatus();
  },
  async fetchGames(){
    if(!this.endpoint)return null;
    const res=await fetch(this.endpoint,{cache:"no-store",headers:{"Accept":"application/json"}});
    if(!res.ok)throw new Error("Sports API "+res.status);
    const data=await res.json();
    return Array.isArray(data)?data:(Array.isArray(data.games)?data.games:null);
  },
  async sync(){
    try{
      const games=await this.fetchGames();
      if(!games)return;
      const map=new Map(SportsState.data.games.map(g=>[g.id,g]));
      games.forEach(g=>{if(g?.id)map.set(g.id,{...map.get(g.id),...g});});
      SportsState.data.games=[...map.values()];
      this.mode="LIVE"; this.lastSync=new Date();
      LiveEngine.connected=true;
      refreshUniversalLayer();
    }catch(e){this.mode=this.endpoint?"ERROR":"STATIC";LiveEngine.connected=false}
    updateApiStatus(); updateLiveStatus();
  },
  lastSync:null
};
function updateApiStatus(){
  const el=$("#sportsApiStatus");if(!el)return;
  el.textContent="API GATEWAY "+SportsAPI.mode;
  el.className="apiStatus api-"+SportsAPI.mode.toLowerCase();
  const src=$("#sportsApiSource");if(src)src.textContent=SportsAPI.provider||"STATIC JSON";
}

// SPORTS 23.0 — UNIVERSAL LIVE SPORTS ENGINE
const LiveEngine={
  enabled:false,connected:false,lastSync:null,timer:null,interval:30000,
  start(){
    this.enabled=true; this.refresh();
    clearInterval(this.timer); this.timer=setInterval(()=>this.refresh(),this.interval);
  },
  async refresh(){
    try{
      const provider=window.CROWRULES_SPORTS_LIVE_FEED;
      if(typeof provider!=="function"){this.connected=false;updateLiveStatus();return}
      const payload=await provider({league:SportsState.selectedLeague});
      if(payload&&Array.isArray(payload.games)){
        const byId=new Map(SportsState.data.games.map(g=>[g.id,g]));
        payload.games.forEach(g=>{if(!g?.id)return;byId.set(g.id,{...byId.get(g.id),...g});});
        SportsState.data.games=[...byId.values()];
        this.connected=true;this.lastSync=new Date();
        refreshUniversalLayer();
      }
    }catch(e){this.connected=false;updateLiveStatus()}
    updateLiveStatus();
  }
};
function updateLiveStatus(){
  const el=$("#liveEngineStatus"); if(!el)return;
  el.textContent=LiveEngine.connected?"● LIVE FEED CONNECTED":"○ LIVE FEED READY";
  el.classList.toggle("liveConnected",LiveEngine.connected);
  const sync=$("#liveEngineSync"); if(sync)sync.textContent=LiveEngine.lastSync?"SYNC "+LiveEngine.lastSync.toLocaleTimeString():"WAITING FOR LIVE PROVIDER";
}

const loadJSON=async path=>{const r=await fetch(path+"?v=23.0",{cache:"no-store"});if(!r.ok)throw new Error(path+" "+r.status);return r.json();};

async function loadData(){
  await SportsAPI.configure();
  const [leagues,teams,players,games,standings,schedule,videos,pickem]=await Promise.all([
    loadJSON("data/leagues.json"),loadJSON("data/teams.json"),loadJSON("data/players.json"),loadJSON("data/games.json"),
    loadJSON("data/standings.json"),loadJSON("data/schedule.json"),loadJSON("data/videos.json"),loadJSON("data/pickem.json")
  ]);
  SportsState.data={leagues:leagues.leagues||[],teams:teams.teams||[],players:players.players||[],games:games.games||[],standings:standings.standings||[],schedule:schedule.schedule||[],videos:videos.videos||[],pickem};
  SportsState.ready=true; buildShell(); render(); renderGameDayDashboard(); renderRankings(); renderScheduleCenter(); renderScoreboardCenter(); renderStatsCenter(); renderDetail(); renderPickDetail(); renderDiscoverySearch();
}
function league(){return SportsState.data.leagues.find(x=>x.id===SportsState.selectedLeague)||null}
function selected(arr){return SportsState.selectedLeague==="all"?arr:arr.filter(x=>x.leagueId===SportsState.selectedLeague)}
function team(id){return SportsState.data.teams.find(x=>x.id===id)}
function leagueName(id){return SportsState.data.leagues.find(x=>x.id===id)?.name||id}
function setLeague(id){
  SportsState.selectedLeague=id||"all"; localStorage.setItem("crowrulesSportsLeague",SportsState.selectedLeague);
  const u=new URL(location.href); if(id&&id!=="all")u.searchParams.set("league",id);else u.searchParams.delete("league");
  history.replaceState({}, "", u); buildShell(); render(); renderGameDayDashboard(); renderRankings(); renderScheduleCenter(); renderScoreboardCenter(); renderStatsCenter(); renderDetail(); renderPickDetail(); renderDiscoverySearch();
}
function renderDiscoverySearch(){
  const q=SportsState.search.trim().toLowerCase();
  let box=$("#sportsDiscovery");
  if(!box){
    box=document.createElement("div"); box.id="sportsDiscovery"; box.className="sportsDiscovery";
    document.body.appendChild(box);
  }
  if(!q){box.classList.remove("open");box.innerHTML="";return}
  const d=SportsState.data;
  const match=(x,fields)=>fields.some(k=>String(x?.[k]??"").toLowerCase().includes(q));
  const leagues=d.leagues.filter(x=>match(x,["name","sport","level"])).slice(0,6);
  const teams=d.teams.filter(x=>match(x,["name","short","id"])).slice(0,6);
  const players=d.players.filter(x=>match(x,["name","position","statLabel"])).slice(0,6);
  const games=d.games.filter(x=>match(x,["id","status","time"])).slice(0,6);
  const videos=d.videos.filter(x=>match(x,["title","type"])).slice(0,6);
  const section=(title,items,render)=>items.length?'<div class="discoverySection"><small>'+esc(title)+'</small>'+items.map(render).join("")+'</div>':"";
  box.innerHTML='<div class="discoveryPanel"><div class="discoveryHead"><span>UNIVERSAL SPORTS SEARCH</span><button type="button" id="closeDiscovery">×</button></div>'+
    section("LEAGUES",leagues,x=>'<a href="league.html?league='+encodeURIComponent(x.id)+'"><b>'+esc(x.name)+'</b><span>'+esc(x.sport||"SPORT")+' • '+esc(x.level||"LEVEL")+'</span></a>')+
    section("TEAMS",teams,x=>'<a href="team.html?id='+encodeURIComponent(x.id)+'"><b>'+esc(x.name)+'</b><span>'+esc(leagueName(x.leagueId))+'</span></a>')+
    section("PLAYERS",players,x=>'<a href="player.html?id='+encodeURIComponent(x.id)+'"><b>'+esc(x.name)+'</b><span>'+esc(x.position||"PLAYER")+' • '+esc(leagueName(x.leagueId))+'</span></a>')+
    section("GAMES",games,x=>'<a href="game.html?id='+encodeURIComponent(x.id)+'"><b>'+esc(getTeam(x.awayTeamId)?.short||"AWY")+' @ '+esc(getTeam(x.homeTeamId)?.short||"HME")+'</b><span>'+esc(leagueName(x.leagueId))+' • '+esc(x.status||"GAME")+'</span></a>')+
    section("MEDIA",videos,x=>'<a href="video.html?id='+encodeURIComponent(x.id)+'"><b>'+esc(x.title)+'</b><span>'+esc(leagueName(x.leagueId))+' • '+esc(x.type||"VIDEO")+'</span></a>')+
    ((leagues.length+teams.length+players.length+games.length+videos.length)===0?'<div class="discoveryEmpty">NO SPORTS RESULTS FOUND</div>':"")+
    '</div>';
  box.classList.add("open");
  $("#closeDiscovery")?.addEventListener("click",()=>{box.classList.remove("open");const s=$("#sportsSearch");if(s){s.value="";SportsState.search="";render()}});
  box.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>box.classList.remove("open")));
}
function renderRankings(){
  const teamBox=$("#teamRankings"),playerBox=$("#playerRankings"); if(!teamBox&&!playerBox)return;
  const d=SportsState.data, ts=selected(d.teams), ps=selected(d.players);
  const standings=selected(d.standings).sort((a,b)=>a.rank-b.rank);
  if(teamBox) teamBox.innerHTML=standings.map(s=>{const t=getTeam(s.teamId);return '<a class="rankingRow" href="team.html?id='+encodeURIComponent(s.teamId)+'"><strong>#'+esc(s.rank)+'</strong><b>'+esc(t?.name||"TEAM")+'</b><span>'+esc(leagueName(s.leagueId))+'</span><em>'+recordLabel(s)+'</em></a>'}).join("")||'<div class="emptyState">NO TEAM RANKINGS IN SELECTION</div>';
  const rankedPlayers=ps.filter(p=>p.statValue&&p.statValue!=="—").slice(0,20);
  if(playerBox) playerBox.innerHTML=(rankedPlayers.length?rankedPlayers.map((p,i)=>'<a class="rankingRow playerRank" href="player.html?id='+encodeURIComponent(p.id)+'"><strong>#'+String(i+1).padStart(2,"0")+'</strong><b>'+esc(p.name)+'</b><span>'+esc(p.position||"PLAYER")+' • '+esc(leagueName(p.leagueId))+'</span><em>'+esc(p.statValue)+' '+esc(p.statLabel||"")+'</em></a>').join(""):'<div class="emptyState">PLAYER RANKING DATA PENDING</div>');
}
function renderScheduleCenter(){
  const box=$("#calendarData"),idx=$("#calendarIndex"); if(!box&&!idx)return;
  const d=SportsState.data, rows=selected(d.schedule).map(s=>({...s,game:getGame(s.gameId)})).filter(x=>x.game);
  rows.sort((a,b)=>String(a.date).localeCompare(String(b.date))||String(a.time).localeCompare(String(b.time)));
  if(box) box.innerHTML=rows.map(x=>{const g=x.game,a=getTeam(g.awayTeamId),h=getTeam(g.homeTeamId);return '<a class="calendarEvent" href="game.html?id='+encodeURIComponent(g.id)+'"><div class="calendarDate"><b>'+esc(x.date||"TBD")+'</b><span>'+esc(x.time||"TBD")+'</span></div><div><small>'+esc(leagueName(x.leagueId))+' • '+esc(g.status||"SCHEDULED")+'</small><strong>'+esc(a?.short||"AWY")+' <em>@</em> '+esc(h?.short||"HME")+'</strong><span>'+esc(a?.name||"Away Team")+' vs '+esc(h?.name||"Home Team")+'</span></div><div class="calendarVenue">'+esc(x.venue||"VENUE TBD")+'</div></a>').join("")||'<div class="emptyState">NO SCHEDULE ITEMS IN SELECTION</div>';
  const venues={}; rows.forEach(x=>{const k=x.venue||"VENUE TBD";venues[k]=(venues[k]||0)+1});
  if(idx) idx.innerHTML=Object.entries(venues).map(([v,n])=>'<div class="scheduleIndex"><b>'+esc(v)+'</b><span>'+n+' EVENT'+(n===1?"":"S")+'</span></div>').join("")||'<div class="emptyState">NO VENUE DATA</div>';
}
function renderScoreboardCenter(){
  const box=$("#scoreboardData"),sum=$("#scoreSummary"); if(!box&&!sum)return;
  const rows=selected(SportsState.data.games);
  const status=(g)=>String(g.status||"SCHEDULED").toUpperCase();
  const live=rows.filter(g=>["LIVE","IN PROGRESS","HALFTIME","FINAL"].includes(status(g)));
  if(box) box.innerHTML=rows.map(g=>{const a=getTeam(g.awayTeamId),h=getTeam(g.homeTeamId),sc=g.score||{};return '<a class="scoreboardGame" href="game.html?id='+encodeURIComponent(g.id)+'"><div class="scoreLeague"><b>'+esc(leagueName(g.leagueId))+'</b><span>'+esc(status(g))+'</span></div><div class="scoreTeams"><strong>'+esc(a?.short||"AWY")+'</strong><span>'+esc(sc.away??"—")+'</span><em>@</em><strong>'+esc(h?.short||"HME")+'</strong><span>'+esc(sc.home??"—")+'</span></div><div class="scoreTime"><b>'+esc(g.period||g.time||"TBD")+'</b><span>EVENT CENTER ›</span></div></a>').join("")||'<div class="emptyState">NO GAMES IN SELECTION</div>';
  if(sum) sum.innerHTML='<div class="scoreSummary"><strong>'+live.length+'</strong><span>ACTIVE / RECENT EVENTS</span></div><div class="scoreSummary"><strong>'+rows.length+'</strong><span>TOTAL GAMES</span></div><p class="scoreFeedNote">Scores appear only when supplied by the current data layer. No live results are fabricated.</p>';
}
function renderStatsCenter(){
  const box=$("#statsData"); if(!box)return;
  const d=SportsState.data, ps=selected(d.players), ts=selected(d.teams);
  const numeric=ps.filter(p=>p.statValue!==undefined&&p.statValue!==null&&p.statValue!==""&&!Number.isNaN(Number(p.statValue)))
    .sort((a,b)=>Number(b.statValue)-Number(a.statValue)).slice(0,25);
  box.innerHTML='<div class="statsOverview"><div><strong>'+ts.length+'</strong><span>TEAMS</span></div><div><strong>'+ps.length+'</strong><span>PLAYERS</span></div><div><strong>'+numeric.length+'</strong><span>STAT LEADERS</span></div></div>'+
    '<div class="statsSplit"><div class="statsBlock"><small>PLAYER PERFORMANCE</small>'+(numeric.length?numeric.map((p,i)=>'<a class="statRow" href="player.html?id='+encodeURIComponent(p.id)+'"><strong>#'+String(i+1).padStart(2,"0")+'</strong><b>'+esc(p.name)+'</b><span>'+esc(p.position||"PLAYER")+' • '+esc(leagueName(p.leagueId))+'</span><em>'+esc(p.statValue)+' '+esc(p.statLabel||"")+'</em></a>').join(""):'<div class="emptyState">PLAYER STATISTICS PENDING</div>')+'</div><div class="statsBlock"><small>TEAM PERFORMANCE</small>'+ts.map(t=>{const s=d.standings.find(x=>x.teamId===t.id);return '<a class="statRow" href="team.html?id='+encodeURIComponent(t.id)+'"><strong>#'+esc(s?.rank||"—")+'</strong><b>'+esc(t.name)+'</b><span>'+esc(leagueName(t.leagueId))+'</span><em>'+esc(s?recordLabel(s):"RECORD PENDING")+'</em></a>'}).join("")||'<div class="emptyState">TEAM DATA PENDING</div>'+'</div></div>';
}
function refreshUniversalLayer(){
  if(!SportsState.ready)return;
  render(); renderGameDayDashboard(); renderRankings(); renderScheduleCenter(); renderScoreboardCenter(); renderStatsCenter(); renderDetail(); renderPickDetail(); renderDiscoverySearch(); buildShell();
  const state=document.querySelector("#sportsDataState");
  if(state){
    const leagueText=SportsState.selectedLeague==="all"?"ALL LEAGUES":(league()?.name||"SELECTED LEAGUE");
    state.querySelector("[data-layer-league]").textContent=leagueText;
    state.querySelector("[data-layer-query]").textContent=SportsState.search?'"'+esc(SportsState.search)+'"':"NO ACTIVE SEARCH";
  }
}
function buildShell(){
  const top=document.querySelector(".topbar"); if(!top)return;
  if(!document.querySelector("#sportsControls")){
    const controls=document.createElement("div"); controls.id="sportsControls"; controls.className="sportsControls";
    controls.innerHTML='<button class="commandButton" id="sportsCommand" type="button" aria-expanded="false">COMMAND <span>⌄</span></button><label class="srOnly" for="leagueSelect">League</label><select id="leagueSelect" aria-label="Global league selector"></select><label class="srOnly" for="sportsSearch">Search sports</label><input id="sportsSearch" type="search" placeholder="SEARCH SPORTS" autocomplete="off"><button class="notificationButton" id="sportsNotifications" type="button" aria-label="Sports notifications"><span>◉</span><b>0</b></button><a class="accountChip" href="https://crowrulesentertainment-oss.github.io/crowspace/login.html" aria-label="Universal CrowRules account"><i></i><span>ACCOUNT</span><b>GUEST</b></a><div class="commandMenu" id="commandMenu"><div class="commandTitle">SPORTS COMMAND</div><a href="home.html">SPORTS HOME</a><a href="scores.html">LIVE SCORES</a><a href="schedule.html">SCHEDULE</a><a href="standings.html">STANDINGS</a><a href="rankings.html">RANKINGS</a><a href="stats.html">STATISTICS</a><a href="teams.html">TEAMS</a><a href="players.html">PLAYERS</a><a href="videos.html">MEDIA</a><a href="pickem.html">PICK ’EM</a></div>';
    top.appendChild(controls);
  }
  const select=$("#leagueSelect"); if(select){
    select.innerHTML='<option value="all">ALL LEAGUES</option>'+SportsState.data.leagues.map(l=>'<option value="'+esc(l.id)+'">'+esc(l.name)+' • '+esc(l.level)+'</option>').join("");
    select.value=SportsState.selectedLeague; select.onchange=e=>setLeague(e.target.value);
  }
  const search=$("#sportsSearch"); if(search){search.value=SportsState.search; search.oninput=e=>{SportsState.search=e.target.value;refreshUniversalLayer()};}
  const command=$("#sportsCommand"), menu=$("#commandMenu");
  if(command&&menu){command.onclick=e=>{e.stopPropagation();menu.classList.toggle("open");command.setAttribute("aria-expanded",menu.classList.contains("open"))}}
  const notification=$("#sportsNotifications");
  SportsAPI.sync(); LiveEngine.start();
  if(notification){
    const live=SportsState.data.games.filter(g=>["LIVE","IN PROGRESS","HALFTIME"].includes(String(g.status||"").toUpperCase())).filter(g=>SportsState.selectedLeague==="all"||g.leagueId===SportsState.selectedLeague).length;
    notification.querySelector("b").textContent=String(live);
    notification.classList.toggle("hasAlert",live>0);
    notification.onclick=()=>{window.location.href="scores.html";};
  }
  if(!document.querySelector("#sportsDataState")){
    const state=document.createElement("div"); state.id="sportsDataState"; state.className="sportsDataState";
    state.innerHTML='<span>SPORTS 24.0 API GATEWAY</span><b id="sportsApiStatus" class="apiStatus">API GATEWAY STATIC</b><i></i><span id="sportsApiSource">STATIC JSON</span><i></i><b id="liveEngineStatus">○ LIVE FEED READY</b><span id="liveEngineSync">WAITING FOR LIVE PROVIDER</span>';
    top.insertAdjacentElement("afterend",state);
  }
  if(false){
    const state=document.createElement("div"); state.id="sportsDataState"; state.className="sportsDataState";
    state.innerHTML='<span>SPORTS 22.0 DATA LAYER</span><b data-layer-league>ALL LEAGUES</b><i></i><span>SEARCH</span><b data-layer-query>NO ACTIVE SEARCH</b><i></i><span>STATUS</span><b>CONNECTED</b>';
    top.insertAdjacentElement("afterend",state);
  }
  const current=(location.pathname.split("/").pop()||"home.html").toLowerCase();
  document.querySelectorAll(".topbar nav a,.mobileNav a").forEach(a=>{const href=(a.getAttribute("href")||"").split("?")[0].toLowerCase();a.classList.toggle("active",href===current);});
}
function renderGameDayDashboard(){
  const box=$("#gameDayDashboard"); if(!box||!SportsState.ready)return;
  const games=selected(SportsState.data.games), teams=selected(SportsState.data.teams), players=selected(SportsState.data.players);
  const active=games.filter(g=>["LIVE","IN PROGRESS","HALFTIME"].includes(String(g.status||"").toUpperCase()));
  const upcoming=games.filter(g=>!["FINAL","LIVE","IN PROGRESS","HALFTIME"].includes(String(g.status||"").toUpperCase())).slice(0,6);
  const leaders=players.filter(p=>p.statValue!==undefined&&p.statValue!==null&&p.statValue!=="").sort((a,b)=>(Number(b.statValue)||0)-(Number(a.statValue)||0)).slice(0,5);
  const cards='<div class="dayMetrics"><div><strong>'+games.length+'</strong><span>GAMES</span></div><div><strong>'+active.length+'</strong><span>LIVE NOW</span></div><div><strong>'+teams.length+'</strong><span>TEAMS</span></div><div><strong>'+players.length+'</strong><span>PLAYERS</span></div></div>'+
  '<div class="dayGrid"><div class="panel dayPanel"><div class="panelHead"><span>GAME DAY FEED</span><a href="scores.html">ALL SCORES →</a></div>'+(active.length?active.map(g=>dayGame(g,"LIVE")).join(""):upcoming.map(g=>dayGame(g,"UP NEXT")).join("")||'<div class="emptyState">NO GAME DAY EVENTS</div>')+'</div>'+
  '<div class="panel dayPanel"><div class="panelHead"><span>TOP PERFORMERS</span><a href="players.html">ALL PLAYERS →</a></div>'+(leaders.length?leaders.map((p,i)=>'<a class="dayLeader" href="player.html?id='+encodeURIComponent(p.id)+'"><strong>#'+String(i+1).padStart(2,"0")+'</strong><b>'+esc(p.name)+'</b><span>'+esc(p.statValue)+' '+esc(p.statLabel||"")+'</span></a>').join(""):'<div class="emptyState">PLAYER DATA PENDING</div>')+'</div></div>';
  box.innerHTML=cards;
}
function dayGame(g,label){
  const a=team(g.awayTeamId),h=team(g.homeTeamId),sc=g.score||{};
  return '<a class="dayGame" href="game.html?id='+encodeURIComponent(g.id)+'"><div><small>'+esc(leagueName(g.leagueId))+'</small><b>'+esc(a?.short||"AWY")+' <em>@</em> '+esc(h?.short||"HME")+'</b></div><span>'+esc(sc.away??"—")+' — '+esc(sc.home??"—")+'</span><i>'+esc(label)+'</i></a>';
}
function render(){
  if(!SportsState.ready)return;
  const q=SportsState.search.trim().toLowerCase();
  const leagues=SportsState.data.leagues.filter(l=>SportsState.selectedLeague==="all"||l.id===SportsState.selectedLeague).filter(l=>!q||JSON.stringify(l).toLowerCase().includes(q));
  const games=selected(SportsState.data.games).filter(g=>!q||JSON.stringify(g).toLowerCase().includes(q));
  const players=selected(SportsState.data.players).filter(p=>!q||JSON.stringify(p).toLowerCase().includes(q));
  if($("#leagues"))$("#leagues").innerHTML=leagues.map(l=>'<a class="league" href="leagues.html?league='+encodeURIComponent(l.id)+'"><b>'+esc(l.name)+'</b><span>'+esc(l.level)+'</span></a>').join("")||'<div class="emptyState">NO MATCHES</div>';
  if($("#games"))$("#games").innerHTML=games.map(g=>{const a=team(g.awayTeamId),h=team(g.homeTeamId);return '<a class="game" href="game.html?id='+encodeURIComponent(g.id)+'"><div><small>'+esc(leagueName(g.leagueId))+'</small><br><span class="live">'+esc(g.status)+'</span></div><div><b>'+esc(a?.name||"AWAY TEAM")+'</b><br><small>@</small><br><b>'+esc(h?.name||"HOME TEAM")+'</b></div><div><small>'+esc(g.time||"TBD")+'</small></div></div>'}).join("")||'<div class="emptyState">NO GAMES IN SELECTION</div>';
  if($("#players"))$("#players").innerHTML=players.map((p,i)=>'<div class="player"><div class="rank">'+String(i+1).padStart(2,"0")+'</div><div><b>'+esc(p.name)+'</b><br><small>'+esc(p.position||"PLAYER")+' • '+esc(leagueName(p.leagueId))+'</small></div><div class="stat">'+esc(p.statValue||"—")+'</div></div>').join("")||'<div class="emptyState">NO PLAYERS IN SELECTION</div>';
  document.querySelectorAll("[data-sports-selection]").forEach(el=>el.textContent=SportsState.selectedLeague==="all"?"ALL LEAGUES":(league()?.name||"ALL LEAGUES"));
  document.querySelectorAll("[data-sports-count]").forEach(el=>el.textContent=selected(SportsState.data.games).length);
  document.querySelectorAll("[data-sports-module]").forEach(el=>{el.classList.add("dataReady");});
  const schedule=selected(SportsState.data.schedule);
  if($("#scheduleData"))$("#scheduleData").innerHTML=schedule.map(x=>'<div class="dataRow"><b>'+esc(leagueName(x.leagueId))+'</b><span>'+esc(x.date)+' • '+esc(x.time)+'</span><span>'+esc(x.venue)+'</span></a>').join("")||'<div class="emptyState">NO SCHEDULE ITEMS IN SELECTION</div>';
  const standings=selected(SportsState.data.standings).sort((a,b)=>a.rank-b.rank);
  if($("#standingsData"))$("#standingsData").innerHTML=standings.map(x=>{const t=team(x.teamId);return '<a class="dataRow" href="team.html?id='+encodeURIComponent(x.teamId)+'"><b>#'+esc(x.rank)+' '+esc(t?.name||"TEAM")+'</b><span>'+esc(leagueName(x.leagueId))+'</span><span>'+esc(x.wins)+'-'+esc(x.losses)+'</span></a>'}).join("")||'<div class="emptyState">NO STANDINGS IN SELECTION</div>';
  const teams=SportsState.data.teams.filter(t=>SportsState.selectedLeague==="all"||t.leagueId===SportsState.selectedLeague).filter(t=>!q||JSON.stringify(t).toLowerCase().includes(q));
  if($("#teamsData"))$("#teamsData").innerHTML=teams.map(t=>'<div class="dataRow"><b>'+esc(t.name)+'</b><span>'+esc(t.short)+'</span><span>'+esc(leagueName(t.leagueId))+'</span></a>').join("")||'<div class="emptyState">NO TEAMS IN SELECTION</div>';
  const videos=selected(SportsState.data.videos).filter(v=>!q||JSON.stringify(v).toLowerCase().includes(q));
  if($("#videosData"))$("#videosData").innerHTML=videos.map(v=>'<div class="dataRow"><b>'+esc(v.title)+'</b><span>'+esc(leagueName(v.leagueId))+'</span><span>'+esc(v.type||"VIDEO")+'</span></a>').join("")||'<div class="emptyState">NO VIDEOS IN SELECTION</div>';
  const picks=(SportsState.data.pickem?.games||[]).filter(x=>SportsState.selectedLeague==="all"||x.leagueId===SportsState.selectedLeague);
  if($("#pickemData"))$("#pickemData").innerHTML=picks.map(x=>'<div class="dataRow pickRow"><b>'+esc(leagueName(x.leagueId))+'</b><span>'+esc(x.question)+'</span><span>'+esc(x.options.join(" / "))+' • '+esc(x.points)+' PTS</span></a>').join("")||'<div class="emptyState">NO PICK ’EM GAMES IN SELECTION</div>';
}
function clock(){if($("#clock"))$("#clock").textContent=new Date().toLocaleTimeString([], {hour12:false})+" LOCAL"}
document.addEventListener("click",e=>{if(e.target.closest("#menu"))$("#mobileNav")?.classList.toggle("open");if(!e.target.closest("#sportsCommand")&&!e.target.closest("#commandMenu"))$("#commandMenu")?.classList.remove("open")});

function byId(id){return new URLSearchParams(location.search).get(id)}
function link(path,id,label){return '<a class="detailLink" href="'+path+'?id='+encodeURIComponent(id)+'">'+esc(label)+'</a>'}
function renderPickDetail(){
  const gid=byId("game"), box=$("#pickemData"); if(!gid||!box)return;
  const x=(SportsState.data.pickem?.games||[]).find(y=>y.id===gid); if(!x)return;
  box.innerHTML='<div class="detailCard"><small>PICK ’EM CHALLENGE • '+esc(leagueName(x.leagueId))+'</small><h2>'+esc(x.question)+'</h2><div class="pickOptions">'+x.options.map((o,i)=>'<button class="btn pickOption" data-pick="'+i+'">'+esc(o)+'</button>').join("")+'</div><p>VALUE: '+esc(x.points)+' POINTS</p></div>';
  box.querySelectorAll(".pickOption").forEach(b=>b.onclick=()=>{box.querySelectorAll(".pickOption").forEach(q=>q.classList.remove("primary"));b.classList.add("primary")});
}

function getGame(id){return SportsState.data.games.find(x=>x.id===id)||null}
function getTeam(id){return SportsState.data.teams.find(x=>x.id===id)||null}
function getPlayer(id){return SportsState.data.players.find(x=>x.id===id)||null}
function getVideo(id){return SportsState.data.videos.find(x=>x.id===id)||null}
function gamesForTeam(id){return SportsState.data.games.filter(x=>x.homeTeamId===id||x.awayTeamId===id)}
function videosForLeague(id){return SportsState.data.videos.filter(x=>x.leagueId===id)}
function standingsForTeam(id){return SportsState.data.standings.find(x=>x.teamId===id)||null}
function pickemForGame(id){return (SportsState.data.pickem?.games||[]).filter(x=>x.gameId===id)}

function recordLabel(s){return s?esc(s.wins)+"-"+esc(s.losses):"RECORD PENDING"}
function teamForm(id){
  const gs=gamesForTeam(id).slice(-5);
  if(!gs.length)return '<span class="contextPending">RECENT FORM PENDING</span>';
  return gs.map(g=>'<a class="miniGame" href="game.html?id='+encodeURIComponent(g.id)+'"><span>'+esc(g.status||"GAME")+'</span><b>'+esc((getTeam(g.awayTeamId)?.short||"AWY"))+' @ '+esc((getTeam(g.homeTeamId)?.short||"HME"))+'</b></a>').join("");
}
function renderEventCenter(game){
  const box=$("#gameDetail"); if(!box)return;
  if(!game){box.innerHTML='<article class="detailCard"><small>GAME CENTER</small><h2>GAME NOT FOUND</h2><p>The requested event is not available in the current data layer.</p></article>';$("#detailIntro").textContent="EVENT UNAVAILABLE";return}
  const a=getTeam(game.awayTeamId),h=getTeam(game.homeTeamId),as=standingsForTeam(game.awayTeamId),hs=standingsForTeam(game.homeTeamId);
  const sch=SportsState.data.schedule.find(x=>x.gameId===game.id);
  const picks=pickemForGame(game.id);
  const vids=videosForLeague(game.leagueId).slice(0,4);
  const ap=SportsState.data.players.filter(x=>x.teamId===game.awayTeamId).slice(0,5);
  const hp=SportsState.data.players.filter(x=>x.teamId===game.homeTeamId).slice(0,5);
  $("#detailIntro").textContent=leagueName(game.leagueId)+" • "+(game.status||"SCHEDULED");
  box.innerHTML=
    '<div class="eventHero">'+
      '<div class="eventMeta"><span>'+esc(leagueName(game.leagueId))+'</span><b>'+esc(game.status||"SCHEDULED")+'</b></div>'+
      '<div class="eventTeams">'+
        '<a class="eventTeam" href="team.html?id='+encodeURIComponent(game.awayTeamId)+'"><small>AWAY</small><strong>'+esc(a?.short||"AWY")+'</strong><b>'+esc(a?.name||"Away Team")+'</b><span>'+recordLabel(as)+'</span></a>'+
        '<div class="eventScore"><small>'+esc(sch?.date||"DATE TBD")+'</small><strong>'+esc(game.time||"TBD")+'</strong><b>VS</b><small>'+esc(sch?.venue||"VENUE TBD")+'</small></div>'+
        '<a class="eventTeam" href="team.html?id='+encodeURIComponent(game.homeTeamId)+'"><small>HOME</small><strong>'+esc(h?.short||"HME")+'</strong><b>'+esc(h?.name||"Home Team")+'</b><span>'+recordLabel(hs)+'</span></a>'+
      '</div>'+
      '<div class="detailActions"><a class="btn" href="schedule.html?league='+encodeURIComponent(game.leagueId)+'">SCHEDULE</a><a class="btn" href="standings.html?league='+encodeURIComponent(game.leagueId)+'">STANDINGS</a><a class="btn" href="league.html?league='+encodeURIComponent(game.leagueId)+'">LEAGUE HUB</a></div>'+
    '</div>'+
    '<div class="eventGrid">'+
      '<article class="contextCard"><small>STANDINGS CONTEXT</small><h3>'+esc(a?.name||"Away Team")+'</h3><div class="contextStat"><b>'+recordLabel(as)+'</b><span>'+(as?'RANK #'+esc(as.rank):'STANDING PENDING')+'</span></div><h3>'+esc(h?.name||"Home Team")+'</h3><div class="contextStat"><b>'+recordLabel(hs)+'</b><span>'+(hs?'RANK #'+esc(hs.rank):'STANDING PENDING')+'</span></div></article>'+
      '<article class="contextCard"><small>RECENT GAME HISTORY</small><h3>'+esc(a?.name||"Away Team")+'</h3>'+teamForm(game.awayTeamId)+'<h3>'+esc(h?.name||"Home Team")+'</h3>'+teamForm(game.homeTeamId)+'</article>'+
      '<article class="contextCard"><small>PLAYER CONTEXT</small><div class="rosterSplit"><div><h3>'+esc(a?.short||"AWY")+'</h3>'+ (ap.map(p=>link("player.html",p.id,p.name+" • "+(p.position||"PLAYER"))).join("<br>")||'<span class="contextPending">ROSTER DATA PENDING</span>')+'</div><div><h3>'+esc(h?.short||"HME")+'</h3>'+ (hp.map(p=>link("player.html",p.id,p.name+" • "+(p.position||"PLAYER"))).join("<br>")||'<span class="contextPending">ROSTER DATA PENDING</span>')+'</div></div></article>'+
      '<article class="contextCard"><small>PICK ’EM</small>'+ (picks.map(x=>'<div class="pickEvent"><h3>'+esc(x.question)+'</h3><div class="pickOptions">'+x.options.map(o=>'<button class="btn pickOption" type="button">'+esc(o)+'</button>').join("")+'</div><span>'+esc(x.points)+' POINTS</span></div>').join("")||'<span class="contextPending">NO PICK ’EM CHALLENGE FOR THIS EVENT</span>')+'</article>'+
      '<article class="contextCard eventMedia"><small>RELATED MEDIA</small>'+ (vids.map(v=>'<a class="miniVideo" href="video.html?id='+encodeURIComponent(v.id)+'"><b>'+esc(v.title)+'</b><span>'+esc(v.type||"VIDEO")+'</span></a>').join("")||'<span class="contextPending">RELATED VIDEO DATA PENDING</span>')+'</article>'+
      '<article class="contextCard timelineCard"><small>LIVE GAME TIMELINE</small>'+renderLiveTimeline(game)+'</article>'+
      '<article class="contextCard"><small>EVENT HISTORY</small><p>This Event Center is powered by the CrowRules Sports Universal Data Layer. Live score, venue, player, media and historical fields can be added without changing the event architecture.</p><div class="detailLinks"><a class="btn" href="teams.html?league='+encodeURIComponent(game.leagueId)+'">TEAMS</a><a class="btn" href="players.html?league='+encodeURIComponent(game.leagueId)+'">PLAYERS</a><a class="btn" href="videos.html?league='+encodeURIComponent(game.leagueId)+'">MEDIA</a></div></article>'+
    '</div>';
  box.querySelectorAll(".pickOption").forEach(b=>b.onclick=()=>{b.parentElement.querySelectorAll(".pickOption").forEach(q=>q.classList.remove("primary"));b.classList.add("primary")});
}

function teamGames(id){return SportsState.data.games.filter(g=>g.homeTeamId===id||g.awayTeamId===id)}
function renderLeagueCenter(l){
  const box=$("#leagueDetail"); if(!box)return;
  if(!l){box.innerHTML='<article class="detailCard"><small>LEAGUE CENTER</small><h2>LEAGUE NOT FOUND</h2><p>The requested league is not available in the current data layer.</p></article>';$("#detailIntro").textContent="LEAGUE UNAVAILABLE";return}
  const d=SportsState.data,gs=d.games.filter(x=>x.leagueId===l.id),ts=d.teams.filter(x=>x.leagueId===l.id),ps=d.players.filter(x=>x.leagueId===l.id),ss=d.standings.filter(x=>x.leagueId===l.id).sort((a,b)=>a.rank-b.rank),vs=d.videos.filter(x=>x.leagueId===l.id),sch=d.schedule.filter(x=>x.leagueId===l.id),picks=(d.pickem?.games||[]).filter(x=>x.leagueId===l.id);
  const teamCard=t=>{const s=ss.find(x=>x.teamId===t.id);return '<a class="leagueTeam" href="team.html?id='+encodeURIComponent(t.id)+'"><b>'+esc(t.name)+'</b><span>'+esc(t.short)+'</span><em>'+(s?'#'+esc(s.rank)+' • '+recordLabel(s):'STANDING PENDING')+'</em></a>'};
  const gameCard=g=>'<a class="leagueGame" href="game.html?id='+encodeURIComponent(g.id)+'"><span>'+esc(g.status||"GAME")+'</span><b>'+esc(getTeam(g.awayTeamId)?.short||"AWY")+' @ '+esc(getTeam(g.homeTeamId)?.short||"HME")+'</b><em>'+esc(g.time||"TBD")+'</em></a>';
  $("#detailIntro").textContent=esc(l.name)+" • "+esc(l.sport||"SPORT")+" • "+esc(l.level);
  box.innerHTML='<div class="leagueHero"><div><small>LEAGUE INTELLIGENCE CENTER</small><h2>'+esc(l.name)+'</h2><p>'+esc(l.sport||"SPORT")+' • '+esc(l.level)+' • '+esc(l.status||"ACTIVE")+'</p></div><div class="leagueCounts"><b>'+gs.length+'</b><span>GAMES</span><b>'+ts.length+'</b><span>TEAMS</span><b>'+ps.length+'</b><span>PLAYERS</span></div></div>'+
  '<div class="leagueCenterGrid"><article class="contextCard"><small>LEAGUE SNAPSHOT</small><div class="leagueMetrics"><div><b>'+gs.length+'</b><span>GAMES</span></div><div><b>'+ts.length+'</b><span>TEAMS</span></div><div><b>'+ps.length+'</b><span>PLAYERS</span></div><div><b>'+ss.length+'</b><span>STANDINGS</span></div></div></article>'+
  '<article class="contextCard"><small>TOP STANDINGS</small>'+(ss.slice(0,6).map(s=>'<a class="leagueRank" href="team.html?id='+encodeURIComponent(s.teamId)+'"><b>#'+esc(s.rank)+' '+esc(getTeam(s.teamId)?.name||"TEAM")+'</b><span>'+recordLabel(s)+'</span></a>').join("")||'<span class="contextPending">STANDINGS DATA PENDING</span>')+'</article>'+
  '<article class="contextCard"><small>TEAMS</small><div class="leagueTeams">'+(ts.map(teamCard).join("")||'<span class="contextPending">TEAM DATA PENDING</span>')+'</div></article>'+
  '<article class="contextCard"><small>SCORES & SCHEDULE</small>'+(gs.slice(0,8).map(gameCard).join("")||'<span class="contextPending">GAME DATA PENDING</span>')+(sch.length?'<div class="detailLinks"><a class="btn" href="schedule.html?league='+encodeURIComponent(l.id)+'">FULL SCHEDULE</a></div>':"")+'</article>'+
  '<article class="contextCard"><small>PLAYERS</small><div class="leaguePlayers">'+(ps.slice(0,8).map(p=>'<a href="player.html?id='+encodeURIComponent(p.id)+'"><b>'+esc(p.name)+'</b><span>'+esc(p.position||"PLAYER")+' • '+esc(getTeam(p.teamId)?.short||"TEAM")+'</span></a>').join("")||'<span class="contextPending">PLAYER DATA PENDING</span>')+'</div></article>'+
  '<article class="contextCard"><small>PICK ’EM</small>'+(picks.map(x=>'<a class="leaguePick" href="pickem.html?game='+encodeURIComponent(x.id)+'"><b>'+esc(x.question)+'</b><span>'+esc(x.points)+' POINTS • '+esc(x.options.join(" / "))+'</span></a>').join("")||'<span class="contextPending">PICK ’EM DATA PENDING</span>')+'</article>'+
  '<article class="contextCard leagueMedia"><small>MEDIA</small>'+(vs.map(v=>'<a class="miniVideo" href="video.html?id='+encodeURIComponent(v.id)+'"><b>'+esc(v.title)+'</b><span>'+esc(v.type||"VIDEO")+'</span></a>').join("")||'<span class="contextPending">LEAGUE MEDIA PENDING</span>')+'</article>'+
  '<article class="contextCard"><small>LEAGUE COMMAND LINKS</small><div class="detailLinks"><a class="btn primary" href="scores.html?league='+encodeURIComponent(l.id)+'">SCORES</a><a class="btn" href="schedule.html?league='+encodeURIComponent(l.id)+'">SCHEDULE</a><a class="btn" href="standings.html?league='+encodeURIComponent(l.id)+'">STANDINGS</a><a class="btn" href="teams.html?league='+encodeURIComponent(l.id)+'">TEAMS</a><a class="btn" href="players.html?league='+encodeURIComponent(l.id)+'">PLAYERS</a><a class="btn" href="videos.html?league='+encodeURIComponent(l.id)+'">MEDIA</a><a class="btn" href="pickem.html?league='+encodeURIComponent(l.id)+'">PICK ’EM</a></div></article></div>';
}
function renderPlayerCenter(p){
  const box=$("#playerDetail");
  if(!box)return;
  if(!p){box.innerHTML='<article class="detailCard"><small>PLAYER CENTER</small><h2>PLAYER NOT FOUND</h2><p>The requested player is not available in the current data layer.</p></article>';$("#detailIntro").textContent="PLAYER UNAVAILABLE";return}
  const d=SportsState.data,pt=getTeam(p.teamId),s=standingsForTeam(p.teamId),games=teamGames(p.teamId).filter(g=>g.homeTeamId===p.teamId||g.awayTeamId===p.teamId),media=d.videos.filter(v=>v.leagueId===p.leagueId).slice(0,4);
  const gameCard=g=>'<a class="playerGame" href="game.html?id='+encodeURIComponent(g.id)+'"><span>'+esc(g.status||"GAME")+'</span><b>'+esc(getTeam(g.awayTeamId)?.short||"AWY")+' @ '+esc(getTeam(g.homeTeamId)?.short||"HME")+'</b><em>'+esc(g.time||"TBD")+'</em></a>';
  $("#detailIntro").textContent=leagueName(p.leagueId)+" • "+(p.position||"PLAYER")+" • PLAYER INTELLIGENCE";
  box.innerHTML='<div class="playerHero"><div><small>PLAYER INTELLIGENCE CENTER</small><h2>'+esc(p.name)+'</h2><p>'+esc(p.position||"PLAYER")+' • '+(pt?link("team.html",pt.id,pt.name):"TEAM DATA PENDING")+'</p></div><div class="playerStat"><span>'+esc(p.statLabel||"PRIMARY STAT")+'</span><strong>'+esc(p.statValue||"—")+'</strong></div></div>'+
  '<div class="playerCenterGrid"><article class="contextCard"><small>PLAYER PROFILE</small><div class="playerFacts"><b>'+esc(p.position||"—")+'</b><span>POSITION</span><b>'+esc(pt?.short||"—")+'</b><span>TEAM</span><b>'+esc(leagueName(p.leagueId))+'</b><span>LEAGUE</span></div></article>'+
  '<article class="contextCard"><small>TEAM CONTEXT</small><h3>'+esc(pt?.name||"TEAM PENDING")+'</h3><div class="contextStat"><b>'+recordLabel(s)+'</b><span>'+(s?"RANK #"+esc(s.rank):"STANDING PENDING")+'</span></div><div class="detailLinks">'+(pt?'<a class="btn" href="team.html?id='+encodeURIComponent(pt.id)+'">TEAM CENTER</a>':"")+'<a class="btn" href="standings.html?league='+encodeURIComponent(p.leagueId)+'">STANDINGS</a></div></article>'+
  '<article class="contextCard"><small>GAME APPEARANCES</small>'+(games.slice(-6).reverse().map(gameCard).join("")||'<span class="contextPending">GAME HISTORY PENDING</span>')+'</article>'+
  '<article class="contextCard"><small>PERFORMANCE</small><div class="statBlock"><b>'+esc(p.statValue||"—")+'</b><span>'+esc(p.statLabel||"PRIMARY STAT")+'</span></div><p>Additional statistics can be supplied by the future live sports data layer without changing this player profile.</p></article>'+
  '<article class="contextCard playerMedia"><small>RELATED MEDIA</small>'+(media.map(v=>'<a class="miniVideo" href="video.html?id='+encodeURIComponent(v.id)+'"><b>'+esc(v.title)+'</b><span>'+esc(v.type||"VIDEO")+'</span></a>').join("")||'<span class="contextPending">PLAYER MEDIA PENDING</span>')+'</article>'+
  '<article class="contextCard"><small>PLAYER COMMAND LINKS</small><div class="detailLinks"><a class="btn primary" href="players.html?league='+encodeURIComponent(p.leagueId)+'">ALL PLAYERS</a><a class="btn" href="scores.html?league='+encodeURIComponent(p.leagueId)+'">SCORES</a><a class="btn" href="schedule.html?league='+encodeURIComponent(p.leagueId)+'">SCHEDULE</a><a class="btn" href="videos.html?league='+encodeURIComponent(p.leagueId)+'">MEDIA</a></div></article></div>';
}
function renderTeamCenter(t){
  const box=$("#teamDetail");
  if(!box)return;
  if(!t){box.innerHTML='<article class="detailCard"><small>TEAM CENTER</small><h2>TEAM NOT FOUND</h2><p>The requested team is not available in the current data layer.</p></article>';$("#detailIntro").textContent="TEAM UNAVAILABLE";return}
  const d=SportsState.data,s=d.standings.find(x=>x.teamId===t.id),roster=d.players.filter(x=>x.teamId===t.id),games=teamGames(t.id),upcoming=games.filter(g=>g.status!=="FINAL").slice(0,5),past=games.filter(g=>g.status==="FINAL").slice(-5).reverse(),media=d.videos.filter(v=>v.leagueId===t.leagueId).slice(0,4);
  $("#detailIntro").textContent=leagueName(t.leagueId)+" • "+(t.short||"TEAM")+" • TEAM INTELLIGENCE";
  const gameCard=g=>{const a=getTeam(g.awayTeamId),h=getTeam(g.homeTeamId);return '<a class="teamGame" href="game.html?id='+encodeURIComponent(g.id)+'"><span>'+esc(g.status||"GAME")+'</span><b>'+esc(a?.short||"AWY")+' @ '+esc(h?.short||"HME")+'</b><em>'+esc(g.time||"TBD")+'</em></a>'};
  box.innerHTML='<div class="teamHero">'+
    '<div><small>TEAM INTELLIGENCE CENTER</small><h2>'+esc(t.name)+'</h2><p>'+esc(leagueName(t.leagueId))+' • '+esc(t.short||"TEAM")+'</p></div>'+
    '<div class="teamRecord"><span>RECORD</span><strong>'+recordLabel(s)+'</strong><em>'+(s?'RANK #'+esc(s.rank):'RANK PENDING')+'</em></div>'+
    '</div>'+
    '<div class="teamCenterGrid">'+
      '<article class="contextCard"><small>UPCOMING GAMES</small>'+ (upcoming.map(gameCard).join("")||'<span class="contextPending">UPCOMING SCHEDULE PENDING</span>') +'</article>'+
      '<article class="contextCard"><small>RECENT RESULTS</small>'+ (past.map(gameCard).join("")||'<span class="contextPending">RESULT HISTORY PENDING</span>') +'</article>'+
      '<article class="contextCard"><small>ROSTER</small><div class="teamRoster">'+(roster.map(p=>'<a href="player.html?id='+encodeURIComponent(p.id)+'"><b>'+esc(p.name)+'</b><span>'+esc(p.position||"PLAYER")+'</span><em>'+esc(p.statValue||"—")+'</em></a>').join("")||'<span class="contextPending">ROSTER DATA PENDING</span>')+'</div></article>'+
      '<article class="contextCard"><small>STANDINGS POSITION</small><div class="teamStandings"><strong>'+esc(s?.rank||"—")+'</strong><span>LEAGUE RANK</span><b>'+recordLabel(s)+'</b></div><div class="detailLinks"><a class="btn" href="standings.html?league='+encodeURIComponent(t.leagueId)+'">FULL STANDINGS</a><a class="btn" href="league.html?league='+encodeURIComponent(t.leagueId)+'">LEAGUE HUB</a></div></article>'+
      '<article class="contextCard teamMedia"><small>TEAM MEDIA</small>'+ (media.map(v=>'<a class="miniVideo" href="video.html?id='+encodeURIComponent(v.id)+'"><b>'+esc(v.title)+'</b><span>'+esc(v.type||"VIDEO")+'</span></a>').join("")||'<span class="contextPending">TEAM MEDIA PENDING</span>') +'</article>'+
      '<article class="contextCard"><small>TEAM COMMAND LINKS</small><p>Every team is connected to its league, games, players, standings, media and Event Center through the Universal Data Layer.</p><div class="detailLinks"><a class="btn primary" href="scores.html?league='+encodeURIComponent(t.leagueId)+'">LIVE SCORES</a><a class="btn" href="schedule.html?league='+encodeURIComponent(t.leagueId)+'">SCHEDULE</a><a class="btn" href="players.html?league='+encodeURIComponent(t.leagueId)+'">PLAYERS</a></div></article>'+
    '</div>';
}
function renderLiveTimeline(game){
  const items=Array.isArray(game?.timeline)?game.timeline:[];
  if(!items.length)return '<div class="timelinePending">LIVE TIMELINE WILL APPEAR WHEN EVENT DATA IS AVAILABLE.</div>';
  return items.slice().reverse().map((x,i)=>'<div class="timelineItem"><span>'+esc(x.time||"")+"</span><b>"+esc(x.team||"GAME")+"</b><p>"+esc(x.text||x.description||"EVENT")+"</p></div>").join("");
}
function renderLiveScore(game){
  const s=game?.score;
  if(!s||typeof s!=="object")return '<div class="scorePending">SCORE DATA PENDING</div>';
  return '<div class="liveScore"><div><span>AWAY</span><strong>'+esc(s.away??"—")+"</strong></div><b>"+esc(game.period||"LIVE")+"</b><div><span>HOME</span><strong>"+esc(s.home??"—")+"</strong></div></div>";
}
function renderDetail(){
  const id=byId("id"), page=location.pathname.split("/").pop();
  const d=SportsState.data;
  const game=d.games.find(x=>x.id===id), t=d.teams.find(x=>x.id===id), p=d.players.find(x=>x.id===id), v=d.videos.find(x=>x.id===id), l=d.leagues.find(x=>x.id===(new URLSearchParams(location.search).get("league")||id));
  const card=(title,body)=>'<article class="detailCard"><small>'+esc(title)+'</small>'+body+'</article>';
  if(page==="game.html"){
    renderEventCenter(game);
    return;
  } else if(page==="team.html"){
    renderTeamCenter(t);
    return;
  } else if(page==="player.html"){
    renderPlayerCenter(p);
    return;
  } else if(page==="video.html"){
    if(!v){$("#videoDetail").innerHTML=card("VIDEO","<h2>VIDEO NOT FOUND</h2>");return}
    $("#detailIntro").textContent=leagueName(v.leagueId)+" • "+(v.type||"VIDEO");
    $("#videoDetail").innerHTML=card("SPORTS MEDIA",'<h2>'+esc(v.title)+'</h2><p>'+esc(v.type||"VIDEO")+' • '+esc(leagueName(v.leagueId))+'</p><div class="videoStage">VIDEO PLAYER / MEDIA STREAM READY</div><a class="btn" href="leagues.html?league='+encodeURIComponent(v.leagueId)+'">MORE '+esc(leagueName(v.leagueId))+' MEDIA</a>');
  } else if(page==="league.html"){
    renderLeagueCenter(l);
    return;

}

clock();setInterval(clock,1000);loadData().catch(err=>{console.error(err);document.querySelectorAll("[data-error]").forEach(x=>x.textContent="DATA LAYER ERROR — "+err.message)});
