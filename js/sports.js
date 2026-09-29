
/* SPORTS 77.0 — UNIVERSAL SPORTS DOCUMENTARY & TIMELINE ENGINE */
function renderDocumentaryTimeline77(){
 const box=$("#documentaryTimeline77");if(!box||!SportsState.ready)return;
 const d=SportsState.data,seasons=d.seasons||d.season_history||[],mom=d.iconic_moments||d.iconicMoments||d.moments||[],news=d.news||[],records=d.records||[],games=d.games||[],players=d.players||[],teams=d.teams||[];
 const q=new URLSearchParams(location.search),search=(q.get("q")||"").trim().toLowerCase(),league=q.get("league")||"";
 const all=[...seasons.map(x=>({...x,timelineType:"SEASON",title:x.name||x.title||"Season"})),...mom.map(x=>({...x,timelineType:"ICONIC MOMENT",title:x.title||x.name||"Iconic Moment"})),...news.map(x=>({...x,timelineType:"NEWS",title:x.title||"Sports Story"})),...records.map(x=>({...x,timelineType:"RECORD",title:x.title||x.name||x.record||"Record"})),...games.map(x=>({...x,timelineType:"GAME",title:x.title||x.name||((x.awayTeam||x.away||"Away")+" vs "+(x.homeTeam||x.home||"Home"))}))];
 const unique=all.filter((x,i,a)=>i===a.findIndex(y=>String(y.id||y.title)===String(x.id||x.title)));
 const rows=unique.filter(x=>(!search||JSON.stringify(x).toLowerCase().includes(search))&&(!league||String(x.leagueId||x.league)===String(league)));
 const pname=id=>(players.find(x=>String(x.id)===String(id))||{}).name||"";
 const tname=id=>(teams.find(x=>String(x.id)===String(id))||{}).name||"";
 const dateKey=x=>String(x.date||x.datetime||x.startDate||x.year||x.season||"").replace(/[^0-9-]/g,"").slice(0,10)||"CONNECTED";
 const cards=rows.slice(0,120).sort((a,b)=>dateKey(a).localeCompare(dateKey(b))).map(x=>'<article class="dt77Item"><div class="dt77Date">'+esc(dateKey(x))+'</div><div class="dt77Dot"></div><div class="dt77Body"><span>'+esc(x.timelineType)+'</span><h2>'+esc(x.title)+'</h2><small>'+esc(x.leagueName||x.league||"SPORTS")+'</small><p>'+esc(x.description||x.story||x.summary||"Connected historical sports event in the CrowRules Sports timeline.")+'</p><div>'+esc(pname(x.playerId||x.athleteId))+' '+esc(tname(x.teamId))+'</div>'+(x.gameId?'<a href="game-intelligence.html?id='+encodeURIComponent(x.gameId)+'">OPEN GAME INTELLIGENCE</a>':"")+'</div></article>').join("");
 box.innerHTML='<section class="dt77Hero"><small>SPORTS 77.0 • UNIVERSAL DOCUMENTARY & TIMELINE ENGINE</small><h1>SPORTS THROUGH TIME</h1><p>SEASONS • GAMES • PEOPLE • RECORDS • CHAMPIONSHIPS • ICONIC MOMENTS</p></section><form class="dt77Search"><input name="q" value="'+esc(q.get("q")||"")+'" placeholder="SEARCH THE SPORTS TIMELINE"><select name="league"><option value="">ALL LEAGUES</option>'+((d.leagues||[]).map(l=>'<option value="'+esc(l.id)+'" '+(String(l.id)===String(league)?"selected":"")+'>'+esc(l.name||l.id)+'</option>').join(""))+'</select><button>EXPLORE TIMELINE</button></form><div class="dt77Metrics"><article><b>'+rows.length+'</b><small>TIMELINE EVENTS</small></article><article><b>'+new Set(rows.map(x=>x.timelineType)).size+'</b><small>EVENT TYPES</small></article><article><b>'+new Set(rows.map(x=>x.leagueId||x.league).filter(Boolean)).size+'</b><small>LEAGUES</small></article><article><b>'+new Set(rows.map(dateKey).filter(x=>x!=="CONNECTED")).size+'</b><small>DATED EVENTS</small></article></div><section class="dt77Timeline">'+(cards||'<div class="dt77Empty"><h2>TIMELINE READY</h2><p>No connected historical timeline data is available for this selection yet.</p></div>')+'</section><nav class="dt77Links"><a href="stories.html">STORIES</a><a href="iconic-moments.html">ICONIC MOMENTS</a><a href="history.html">HISTORY</a><a href="legacy.html">LEGACY</a><a href="tournaments.html">CHAMPIONSHIPS</a></nav>';
}


/* SPORTS 76.0 — UNIVERSAL SPORTS STORYTELLING ENGINE */
function renderSportsStorytelling76(){
 const box=$("#sportsStorytelling76");if(!box||!SportsState.ready)return;
 const d=SportsState.data,mom=d.iconic_moments||d.iconicMoments||d.moments||[],games=d.games||[],players=d.players||[],teams=d.teams||[],news=d.news||[],records=d.records||[],videos=d.videos||[];
 const q=new URLSearchParams(location.search),search=(q.get("q")||"").trim().toLowerCase(),league=q.get("league")||"";
 const source=[...mom.map(x=>({...x,storyType:"ICONIC MOMENT"})),...news.map(x=>({...x,storyType:"NEWS STORY"})),...records.filter(x=>x.story||x.description).map(x=>({...x,storyType:"RECORD"}))];
 const unique=source.filter((x,i,a)=>i===a.findIndex(y=>String(y.id||y.title)===String(x.id||x.title)));
 const rows=unique.filter(x=>(!search||JSON.stringify(x).toLowerCase().includes(search))&&(!league||String(x.leagueId||x.league)===league));
 const pname=id=>(players.find(x=>String(x.id)===String(id))||{}).name||"";
 const tname=id=>(teams.find(x=>String(x.id)===String(id))||{}).name||"";
 const linked=x=>games.find(g=>String(g.id)===String(x.gameId||x.eventId));
 const cards=rows.slice(0,100).map(x=>{const g=linked(x),video=x.videoId||x.videoUrl||videos.find(v=>String(v.gameId)===String(x.gameId));return '<article class="st76Card"><span>'+esc(x.storyType)+'</span><h2>'+esc(x.title||x.name||"Sports Story")+'</h2><small>'+esc(x.date||x.year||x.season||"CONNECTED")+' • '+esc(x.leagueName||x.league||"SPORTS")+'</small><p>'+esc(x.story||x.description||x.summary||"A connected sports story assembled from the CrowRules Sports data layer.")+'</p><div>'+esc(pname(x.playerId||x.athleteId))+' '+esc(tname(x.teamId||x.teamIdHome))+'</div><footer>'+(g?'<a href="game-intelligence.html?id='+encodeURIComponent(g.id)+'">GAME INTELLIGENCE</a>':"")+(video?'<a href="video.html?id='+encodeURIComponent(video.id||"")+'">MEDIA</a>':"")+'</footer></article>'}).join("");
 box.innerHTML='<section class="st76Hero"><small>SPORTS 76.0 • UNIVERSAL SPORTS STORYTELLING ENGINE</small><h1>THE SPORTS STORY ARCHIVE</h1><p>GAMES • PEOPLE • CHAMPIONSHIPS • RECORDS • MOMENTS • STORIES</p></section><form class="st76Search"><input name="q" value="'+esc(q.get("q")||"")+'" placeholder="SEARCH SPORTS STORIES"><select name="league"><option value="">ALL LEAGUES</option>'+((d.leagues||[]).map(l=>'<option value="'+esc(l.id)+'" '+(String(l.id)===String(league)?"selected":"")+'>'+esc(l.name||l.id)+'</option>').join(""))+'</select><button>EXPLORE STORIES</button></form><div class="st76Metrics"><article><b>'+rows.length+'</b><small>CONNECTED STORIES</small></article><article><b>'+rows.filter(x=>x.storyType==="ICONIC MOMENT").length+'</b><small>ICONIC MOMENTS</small></article><article><b>'+rows.filter(x=>x.storyType==="NEWS STORY").length+'</b><small>NEWS STORIES</small></article><article><b>'+new Set(rows.map(x=>x.leagueId||x.league).filter(Boolean)).size+'</b><small>LEAGUES</small></article></div><section class="st76Grid">'+(cards||'<div class="st76Empty"><h2>STORY ARCHIVE READY</h2><p>No connected sports stories are available for this selection yet.</p></div>')+'</section><nav class="st76Links"><a href="iconic-moments.html">ICONIC MOMENTS</a><a href="news.html">NEWS</a><a href="history.html">HISTORY</a><a href="legacy.html">LEGACY</a><a href="media.html">MEDIA</a></nav>';
}


// SPORTS 75.0 — UNIVERSAL SPORTS ICONIC MOMENTS CENTER
function renderIconicMoments75(){
 const box=$("#iconicMoments75");if(!box||!SportsState.ready)return;
 const d=SportsState.data,games=d.games||[],players=d.players||[],teams=d.teams||[],moments=d.iconic_moments||d.iconicMoments||d.moments||[],news=d.news||[],videos=d.videos||[];
 const q=new URLSearchParams(location.search),search=(q.get("q")||"").trim().toLowerCase(),league=q.get("league")||"";
 const source=moments.length?moments:games.filter(x=>x.iconic||x.historic||x.moment).map(x=>({...x,title:x.moment||x.title||"Historic Game",type:"GAME"}));
 const rows=source.filter(x=>(!search||JSON.stringify(x).toLowerCase().includes(search))&&(!league||String(x.leagueId||x.league)===league));
 const name=id=>(players.find(p=>String(p.id)===String(id))||teams.find(t=>String(t.id)===String(id)))?.name||id||"";
 const cards=rows.slice(0,100).map(x=>'<article class="im75Card"><div class="im75Tag">'+esc(x.type||x.category||"ICONIC MOMENT")+'</div><h2>'+esc(x.title||x.name||"Iconic Moment")+'</h2><small>'+esc(x.date||x.season||x.year||"DATE TBD")+' • '+esc(x.leagueName||x.league||"SPORTS")+'</small><p>'+esc(x.description||x.story||x.summary||"Historic moment connected to the CrowRules Sports data layer.")+'</p><div class="im75People">'+esc(name(x.playerId||x.athleteId))+' '+esc(x.playerId||x.athleteId?"":"")+' '+esc(name(x.teamId))+'</div><div class="im75Media">'+(x.videoId||x.videoUrl||videos.some(v=>String(v.gameId)===String(x.gameId||x.id))?"MEDIA CONNECTED":"MEDIA READY")+'</div></article>').join("");
 box.innerHTML='<div class="im75Hero"><small>SPORTS 75.0 • UNIVERSAL ICONIC MOMENTS CENTER</small><h1>ICONIC MOMENTS</h1><p>LEGENDARY GAMES • CHAMPIONSHIP MOMENTS • RECORDS • STORIES • MEDIA</p></div><form class="im75Search"><input name="q" value="'+esc(q.get("q")||"")+'" placeholder="SEARCH ICONIC MOMENTS"><select name="league"><option value="">ALL LEAGUES</option>'+((d.leagues||[]).map(l=>'<option value="'+esc(l.id)+'" '+(String(l.id)===String(league)?"selected":"")+'>'+esc(l.name||l.id)+'</option>').join(""))+'</select><button>EXPLORE</button></form><div class="im75Metrics"><article><b>'+rows.length+'</b><span>CONNECTED MOMENTS</span></article><article><b>'+new Set(rows.map(x=>x.leagueId||x.league).filter(Boolean)).size+'</b><span>SPORTS / LEAGUES</span></article><article><b>'+rows.filter(x=>x.videoId||x.videoUrl).length+'</b><span>MEDIA LINKS</span></article><article><b>'+rows.filter(x=>x.gameId).length+'</b><span>GAME LINKS</span></article></div><section class="im75Grid">'+(cards||'<div class="im75Empty">No iconic moments match the current search.</div>')+'</section><div class="im75Links"><a href="legacy.html">LEGACY</a><a href="hall-of-fame.html">HALL OF FAME</a><a href="history.html">HISTORY</a><a href="game-intelligence.html">GAME INTELLIGENCE</a><a href="media.html">MEDIA</a></div>';
}


// SPORTS 74.0 — UNIVERSAL SPORTS LEGACY CENTER
function renderLegacyCenter74(){
 const box=$("#legacyCenter74");if(!box||!SportsState.ready)return;
 const d=SportsState.data,players=d.players||[],teams=d.teams||[],stats=d.statistics||d.stats||[],records=d.records||[],awards=d.awards||d.honors||[],hof=d.hall_of_fame||d.hallOfFame||d.legends||[];
 const q=new URLSearchParams(location.search),id=q.get("id")||"",type=q.get("type")||"PLAYER";
 const pool=type==="TEAM"?teams:players,e=pool.find(x=>String(x.id)===String(id))||pool[0];
 if(!e){box.innerHTML='<div class="lg74Empty"><h1>LEGACY CENTER</h1><p>No connected player or team data is available yet.</p></div>';return}
 const eid=String(e.id),name=e.name||e.fullName||e.short||eid,owned=x=>String(x.playerId||x.teamId||x.entityId)===eid;
 const s=stats.filter(owned),r=records.filter(owned),a=awards.filter(owned),h=hof.filter(owned);
 const highlights=[...h.map(x=>({k:"HALL OF FAME",t:x.title||x.name||"Inducted",d:x.inductionYear||x.inducted||x.year||"CONNECTED"})),...a.map(x=>({k:"HONOR",t:x.title||x.name||"Award",d:x.season||x.year||x.date||"CONNECTED"})),...r.map(x=>({k:"RECORD",t:x.title||x.name||x.record||"Record",d:x.value??x.season??x.year??"CONNECTED"}))].slice(0,12);
 const teamsLinked=teams.filter(t=>String(t.id)===String(e.teamId||e.team_id));
 const metrics=[["STAT LINES",s.length],["RECORDS",r.length],["HONORS",a.length],["LEGACY MARKERS",highlights.length]];
 const opts=pool.map(x=>'<option value="'+esc(x.id)+'" '+(String(x.id)===eid?"selected":"")+'>'+esc(x.name||x.fullName||x.short||x.id)+'</option>').join("");
 box.innerHTML='<div class="lg74Hero"><small>SPORTS 74.0 • UNIVERSAL SPORTS LEGACY CENTER</small><h1>'+esc(name)+'</h1><p>'+esc(type)+' • CAREER • CHAMPIONSHIPS • RECORDS • HONORS • LEGACY</p></div><form class="lg74Pick"><select name="type"><option value="PLAYER" '+(type!=="TEAM"?"selected":"")+'>PLAYERS</option><option value="TEAM" '+(type==="TEAM"?"selected":"")+'>TEAMS</option></select><select name="id">'+opts+'</select><button>OPEN LEGACY</button></form><div class="lg74Metrics">'+metrics.map(x=>'<article><b>'+x[1]+'</b><span>'+x[0]+'</span></article>').join("")+'</div><section class="lg74Panel"><h2>LEGACY PROFILE</h2><div class="lg74Profile"><div><small>IDENTITY</small><h3>'+esc(name)+'</h3><p>'+esc(e.biography||e.bio||e.description||"Historical profile connected to the CrowRules Sports universal data layer.")+'</p></div><div><small>CONNECTED TEAM</small><strong>'+esc(teamsLinked[0]?.name||e.teamName||"—")+'</strong><small>SPORT / LEAGUE</small><strong>'+esc(e.leagueName||e.league||e.sport||"—")+'</strong></div></div></section><section class="lg74Panel"><h2>LEGACY HIGHLIGHTS</h2><div class="lg74Highlights">'+(highlights.length?highlights.map(x=>'<article><small>'+esc(x.k)+'</small><h3>'+esc(x.t)+'</h3><span>'+esc(String(x.d))+'</span></article>').join(""):'<div class="lg74Empty">No connected legacy highlights are available.</div>')+'</div></section><div class="lg74Links"><a href="career.html?type='+encodeURIComponent(type)+'&id='+encodeURIComponent(eid)+'">CAREER</a><a href="milestones.html?type='+encodeURIComponent(type)+'&id='+encodeURIComponent(eid)+'">MILESTONES</a><a href="awards.html">AWARDS</a><a href="hall-of-fame.html">HALL OF FAME</a><a href="records.html">RECORDS</a><a href="history.html">HISTORY</a></div>';
}


// SPORTS 73.0 — UNIVERSAL SPORTS HALL OF FAME & LEGENDS CENTER
function renderHallOfFame73(){
 const box=$("#hallOfFame73");if(!box||!SportsState.ready)return;
 const d=SportsState.data, players=d.players||[],teams=d.teams||[],hof=d.hall_of_fame||d.hallOfFame||d.legends||d.hall_of_fame_members||[];
 const awards=d.awards||d.honors||[], records=d.records||[];
 const all=hof.length?hof:players.filter(x=>x.hallOfFame||x.hof||x.legend).map(x=>({...x,type:"PLAYER",name:x.name||x.fullName}));
 const q=new URLSearchParams(location.search),search=(q.get("q")||"").trim().toLowerCase(),league=q.get("league")||"";
 const rows=all.filter(x=>(!search||JSON.stringify(x).toLowerCase().includes(search))&&(!league||String(x.leagueId||x.league)===league));
 const personName=x=>x.name||x.fullName||x.title||x.id||"LEGEND";
 const honors=x=>awards.filter(a=>String(a.playerId||a.teamId||a.entityId)===String(x.id)).slice(0,5);
 const recs=x=>records.filter(a=>String(a.playerId||a.teamId||a.entityId)===String(x.id)).length;
 const cards=rows.slice(0,100).map(x=>{const hs=honors(x);return '<article class="hof73Card"><div class="hof73Badge">HALL OF FAME</div><h2>'+esc(personName(x))+'</h2><small>'+esc(x.type||"PLAYER")+' • '+esc(x.inductionYear||x.inducted||x.year||"YEAR TBD")+'</small><span>'+esc(x.leagueName||x.league||x.sport||"SPORTS")+'</span><p>'+esc(x.biography||x.bio||x.description||"Historical profile connected to the CrowRules Sports data layer.")+'</p><div class="hof73Stats"><b>'+recs(x)+'</b><em>RECORDS</em><b>'+hs.length+'</b><em>HONORS</em></div></article>'}).join("");
 box.innerHTML='<div class="hof73Hero"><small>SPORTS 73.0 • UNIVERSAL HALL OF FAME & LEGENDS CENTER</small><h1>HALL OF FAME</h1><p>LEGENDS • INDUCTEES • CAREERS • CHAMPIONSHIPS • HISTORY</p></div><form class="hof73Search"><input name="q" value="'+esc(q.get("q")||"")+'" placeholder="SEARCH LEGENDS"><select name="league"><option value="">ALL LEAGUES</option>'+((d.leagues||[]).map(l=>'<option value="'+esc(l.id)+'" '+(String(l.id)===String(league)?"selected":"")+'>'+esc(l.name||l.id)+'</option>').join(""))+'</select><button>SEARCH</button></form><div class="hof73Metrics"><article><b>'+rows.length+'</b><span>CONNECTED LEGENDS</span></article><article><b>'+new Set(rows.map(x=>x.inductionYear||x.inducted||x.year).filter(Boolean)).size+'</b><span>INDUCTION YEARS</span></article><article><b>'+new Set(rows.map(x=>x.leagueId||x.league||x.sport).filter(Boolean)).size+'</b><span>SPORTS / LEAGUES</span></article><article><b>'+rows.filter(x=>x.type==="TEAM"||x.team).length+'</b><span>TEAM HONORS</span></article></div><section class="hof73Grid">'+(cards||'<div class="hof73Empty">No Hall of Fame records match the current search.</div>')+'</section><div class="hof73Links"><a href="awards.html">AWARDS</a><a href="milestones.html">MILESTONES</a><a href="records.html">RECORDS</a><a href="history.html">HISTORY</a><a href="career.html">CAREERS</a></div>';
}


// SPORTS 72.0 — UNIVERSAL SPORTS AWARDS & HONORS CENTER
function renderAwardsCenter72(){
 const box=$("#awardsCenter72");if(!box||!SportsState.ready)return;
 const d=SportsState.data, players=d.players||[],teams=d.teams||[],awards=d.awards||d.honors||d.achievements||[],records=d.records||[];
 const q=new URLSearchParams(location.search),league=q.get("league")||"",entity=q.get("id")||"";
 const all=[...awards,...records.filter(x=>x.award||x.honor||x.honors).map(x=>({...x,title:x.award||x.honor||x.honors}))];
 const filtered=all.filter(x=>(!league||String(x.leagueId||x.league)===league)&&(!entity||String(x.playerId||x.teamId||x.entityId)===entity));
 const leagueName=id=>{const x=(d.leagues||[]).find(l=>String(l.id)===String(id));return x?.name||id||"UNSPECIFIED"};
 const recipient=x=>{const id=x.playerId||x.teamId||x.entityId;return (players.find(p=>String(p.id)===String(id))||teams.find(t=>String(t.id)===String(id)))?.name||x.recipient||id||"UNSPECIFIED"};
 const grouped={};filtered.forEach(x=>{const k=x.year||x.season||x.date||"HISTORY";(grouped[k]??=[]).push(x)});
 const cards=Object.entries(grouped).slice(0,40).map(([year,items])=>'<section class="aw72Year"><h2>'+esc(year)+'</h2>'+items.map(x=>'<article><small>'+esc(x.category||x.type||"HONOR")+'</small><h3>'+esc(x.title||x.name||"AWARD")+'</h3><b>'+esc(recipient(x))+'</b><span>'+esc(leagueName(x.leagueId||x.league))+'</span><p>'+esc(x.description||x.value||x.result||"CONNECTED HONOR")+'</p></article>').join("")+'</section>').join("");
 box.innerHTML='<div class="aw72Hero"><small>SPORTS 72.0 • UNIVERSAL AWARDS & HONORS CENTER</small><h1>AWARDS & HONORS</h1><p>CHAMPIONSHIPS • MVP • ALL-STAR • LEAGUE AWARDS • HALL OF FAME</p></div><div class="aw72Metrics"><article><b>'+filtered.length+'</b><span>CONNECTED HONORS</span></article><article><b>'+new Set(filtered.map(x=>x.year||x.season||x.date)).size+'</b><span>YEARS / SEASONS</span></article><article><b>'+new Set(filtered.map(x=>x.playerId||x.teamId||x.entityId).filter(Boolean)).size+'</b><span>RECIPIENTS</span></article><article><b>'+new Set(filtered.map(x=>x.category||x.type).filter(Boolean)).size+'</b><span>CATEGORIES</span></article></div><div class="aw72Filters"><select id="aw72League"><option value="">ALL LEAGUES</option>'+((d.leagues||[]).map(l=>'<option value="'+esc(l.id)+'" '+(String(l.id)===String(league)?"selected":"")+'>'+esc(l.name||l.id)+'</option>').join(""))+'</select></div><main class="aw72Timeline">'+(cards||'<div class="aw72Empty">No connected awards or honors match the current filters.</div>')+'</main><div class="aw72Links"><a href="milestones.html">MILESTONES</a><a href="records.html">RECORDS</a><a href="history.html">HISTORY</a><a href="leaders.html">LEADERS</a><a href="career.html">CAREER</a></div>';
 const sel=$("#aw72League");if(sel)sel.onchange=()=>{const u=new URL(location.href);u.searchParams.set("league",sel.value);if(!sel.value)u.searchParams.delete("league");location.href=u.href};
}


// SPORTS 71.0 — UNIVERSAL SPORTS MILESTONES & ACHIEVEMENTS ENGINE
function renderMilestonesEngine71(){
 const box=$("#milestonesEngine71");if(!box||!SportsState.ready)return;
 const d=SportsState.data, players=d.players||[], teams=d.teams||[], records=d.records||[], stats=d.statistics||d.stats||[], awards=d.awards||d.achievements||d.milestones||[];
 const q=new URLSearchParams(location.search),id=q.get("id")||"",type=q.get("type")||"PLAYER";
 const pool=type==="TEAM"?teams:players,e=pool.find(x=>String(x.id)===String(id))||pool[0];
 if(!e){box.innerHTML='<div class="ms71Empty"><h1>MILESTONES ENGINE</h1><p>No connected player or team data is available yet.</p></div>';return}
 const eid=String(e.id),name=e.name||e.fullName||e.short||eid;
 const owned=x=>String(x.playerId||x.teamId||x.entityId)===eid;
 const items=[...awards.filter(owned).map(x=>({kind:"ACHIEVEMENT",title:x.title||x.name||"Achievement",detail:x.description||x.season||x.year||"CONNECTED"})),...records.filter(owned).map(x=>({kind:"RECORD",title:x.title||x.name||x.record||"Record",detail:x.description||x.value||x.season||"CONNECTED"})),...stats.filter(owned).filter(x=>x.milestone||x.achievement).map(x=>({kind:"MILESTONE",title:x.milestone||x.achievement,detail:x.value??x.season??"CONNECTED"}))];
 const years=[...new Set(items.map(x=>x.detail).filter(x=>/^(19|20)\d{2}/.test(String(x))))].sort();
 const opts=pool.map(x=>'<option value="'+esc(x.id)+'" '+(String(x.id)===eid?"selected":"")+'>'+esc(x.name||x.fullName||x.short||x.id)+'</option>').join("");
 box.innerHTML='<div class="ms71Hero"><small>SPORTS 71.0 • UNIVERSAL MILESTONES & ACHIEVEMENTS ENGINE</small><h1>'+esc(name)+'</h1><p>'+esc(type)+' • MILESTONES • AWARDS • RECORDS • CHAMPIONSHIPS</p></div><form class="ms71Pick"><select name="type"><option value="PLAYER" '+(type!=="TEAM"?"selected":"")+'>PLAYERS</option><option value="TEAM" '+(type==="TEAM"?"selected":"")+'>TEAMS</option></select><select name="id">'+opts+'</select><button>LOAD ACHIEVEMENTS</button></form><div class="ms71Metrics"><article><b>'+items.length+'</b><span>CONNECTED ACHIEVEMENTS</span></article><article><b>'+records.filter(owned).length+'</b><span>RECORDS</span></article><article><b>'+awards.filter(owned).length+'</b><span>AWARDS</span></article><article><b>'+years.length+'</b><span>ACTIVE YEARS</span></article></div><section class="ms71Panel"><h2>ACHIEVEMENT TIMELINE</h2><div class="ms71Timeline">'+(items.length?items.slice(0,50).map((x,i)=>'<article><i>'+String(i+1).padStart(2,"0")+'</i><div><small>'+esc(x.kind)+'</small><h3>'+esc(x.title)+'</h3><p>'+esc(String(x.detail))+'</p></div></article>').join(""):'<div class="ms71Empty">No connected milestones, awards, or records are available for this entity.</div>')+'</div></section><div class="ms71Links"><a href="career.html?type='+encodeURIComponent(type)+'&id='+encodeURIComponent(eid)+'">CAREER</a><a href="records.html">RECORDS</a><a href="history.html">HISTORY</a><a href="stats-explorer.html?'+(type==="TEAM"?"team":"player")+'='+encodeURIComponent(eid)+'">STATISTICS</a><a href="compare.html">COMPARE</a></div>';
}


// SPORTS 70.0 — UNIVERSAL SPORTS CAREER & SEASON ENGINE
function renderCareerSeasonEngine70(){
 const box=$("#careerSeasonEngine70");if(!box||!SportsState.ready)return;
 const d=SportsState.data, players=d.players||[], teams=d.teams||[], stats=d.statistics||d.stats||d.player_stats||[], seasons=d.seasons||d.season_history||d.history||[], records=d.records||[];
 const q=new URLSearchParams(location.search),id=q.get("id")||"",type=q.get("type")||"PLAYER";
 const pool=type==="TEAM"?teams:players, e=pool.find(x=>String(x.id)===String(id))||pool[0];
 if(!e){box.innerHTML='<div class="cs70Empty"><h1>CAREER & SEASON ENGINE</h1><p>No connected player or team data is available yet.</p></div>';return}
 const eid=String(e.id), name=e.name||e.fullName||e.short||eid;
 const rows=stats.filter(x=>String(x.playerId||x.teamId||x.entityId)===eid);
 const seasonKey=x=>x.season||x.seasonId||x.year||x.seasonYear||"UNKNOWN";
 const bySeason={};rows.forEach(x=>{const k=seasonKey(x);(bySeason[k]??=[]).push(x)});
 const seasonRows=Object.entries(bySeason).map(([season,rs])=>{const metrics=[...new Set(rs.map(x=>x.metric||x.stat).filter(Boolean))].slice(0,8);return '<tr><th>'+esc(season)+'</th>'+metrics.map(m=>{const z=rs.find(x=>(x.metric||x.stat)===m);return '<td>'+esc(z?.value??z?.total??z?.average??"—")+'</td>'}).join("")+'</tr>'});
 const metricList=[...new Set(rows.map(x=>x.metric||x.stat).filter(Boolean))].slice(0,12);
 const career=metricList.map(m=>{const vals=rows.map(x=>Number(x.value??x.total??x.average)).filter(Number.isFinite);if(!vals.length)return "";const total=vals.reduce((a,b)=>a+b,0);return '<article><small>'+esc(m)+'</small><b>'+esc(String(Math.round(total*100)/100))+'</b><span>CONNECTED TOTAL</span></article>'}).join("");
 const milestones=records.filter(x=>String(x.playerId||x.teamId||x.entityId)===eid).slice(0,12);
 const opts=pool.map(x=>'<option value="'+esc(x.id)+'" '+(String(x.id)===eid?"selected":"")+'>'+esc(x.name||x.fullName||x.short||x.id)+'</option>').join("");
 box.innerHTML='<div class="cs70Hero"><small>SPORTS 70.0 • UNIVERSAL CAREER & SEASON ENGINE</small><h1>'+esc(name)+'</h1><p>'+esc(type)+' • CAREER • SEASONS • MILESTONES • RECORDS</p></div><form class="cs70Pick"><select name="type"><option value="PLAYER" '+(type!=="TEAM"?"selected":"")+'>PLAYERS</option><option value="TEAM" '+(type==="TEAM"?"selected":"")+'>TEAMS</option></select><select name="id">'+opts+'</select><button>LOAD CAREER</button></form><section class="cs70Panel"><h2>CAREER SNAPSHOT</h2><div class="cs70Metrics">'+(career||'<article><b>—</b><span>NO CONNECTED CAREER TOTALS</span></article>')+'</div></section><section class="cs70Panel"><h2>SEASON-BY-SEASON</h2><div class="cs70Table">'+(seasonRows.length?'<table><thead><tr><th>SEASON</th>'+metricList.map(m=>'<th>'+esc(m)+'</th>').join("")+'</tr></thead><tbody>'+seasonRows.join("")+'</tbody></table>':'<div class="cs70Empty">Season-level statistics will appear when supplied by the Sports data feed.</div>')+'</div></section><section class="cs70Panel"><h2>MILESTONES & RECORDS</h2><div class="cs70Milestones">'+(milestones.length?milestones.map(x=>'<article><b>'+esc(x.title||x.name||x.record||"RECORD")+'</b><span>'+esc(x.value??x.description??x.season??"CONNECTED RECORD")+'</span></article>').join(""):'<div class="cs70Empty">No connected milestones or records for this entity.</div>')+'</div></section><div class="cs70Links"><a href="player.html?id='+encodeURIComponent(eid)+'">PROFILE</a><a href="stats-explorer.html?'+(type==="TEAM"?"team":"player")+'='+encodeURIComponent(eid)+'">STATISTICS</a><a href="records.html">RECORDS</a><a href="history.html">HISTORY</a><a href="compare.html">COMPARE</a></div>';
}


// SPORTS 69.0 — UNIVERSAL SPORTS HEAD-TO-HEAD ENGINE
function renderHeadToHeadEngine69(){
 const box=$("#headToHeadEngine69");if(!box||!SportsState.ready)return;
 const d=SportsState.data,teams=d.teams||[],players=d.players||[],games=d.games||[],stats=d.statistics||d.stats||[];
 const q=new URLSearchParams(location.search),a=q.get("a")||"",b=q.get("b")||"";
 const entities=[...players.map(x=>({id:x.id,name:x.name||x.fullName||x.id,type:"PLAYER",teamId:x.teamId||x.team_id})),...teams.map(x=>({id:x.id,name:x.name||x.fullName||x.id,type:"TEAM"}))];
 const A=entities.find(x=>String(x.id)===String(a)),B=entities.find(x=>String(x.id)===String(b));
 const teamIds=e=>e?.type==="TEAM"?e.id:e?.teamId;
 const relevant=games.filter(g=>{
   const ids=[g.homeTeamId,g.awayTeamId,g.home_team_id,g.away_team_id,g.home,g.away].filter(Boolean).map(String);
   const x=String(teamIds(A)||""),y=String(teamIds(B)||"");
   return x&&y&&ids.includes(x)&&ids.includes(y);
 });
 const playerGames=(e)=>e?.type==="PLAYER"?games.filter(g=>JSON.stringify(g).includes(String(e.id))):[];
 const meetings=A&&B&&A.type==="PLAYER"&&B.type==="PLAYER"?games.filter(g=>JSON.stringify(g).includes(String(A.id))&&JSON.stringify(g).includes(String(B.id))):relevant;
 const options=sel=>'<option value="">SELECT '+sel+'</option>'+entities.map(x=>'<option value="'+esc(x.id)+'" '+(String(x.id)===String(sel==="A"?a:b)?"selected":"")+'>'+esc(x.name)+' • '+x.type+'</option>').join("");
 const gameCard=g=>'<article class="h269Game"><b>'+esc(g.date||g.startTime||"DATE TBD")+'</b><strong>'+esc(g.awayTeam||g.away||g.awayTeamId||"AWAY")+' <span>'+esc(g.score??g.awayScore??"—")+'</span></strong><strong>'+esc(g.homeTeam||g.home||g.homeTeamId||"HOME")+' <span>'+esc(g.scoreHome??g.homeScore??"—")+'</span></strong><small>'+esc(g.status||"GAME")+'</small><a href="game-intelligence.html?id='+encodeURIComponent(g.id||"")+'">GAME INTELLIGENCE</a></article>';
 const statRows=[...new Set(stats.filter(x=>[A?.id,B?.id].includes(x.playerId||x.teamId||x.entityId)).map(x=>x.metric||x.stat).filter(Boolean))].slice(0,20).map(m=>{const v=e=>stats.find(x=>String(x.playerId||x.teamId||x.entityId)===String(e?.id)&&(x.metric||x.stat)===m);return '<tr><th>'+esc(m)+'</th><td>'+esc(v(A)?.value??v(A)?.total??"—")+'</td><td>'+esc(v(B)?.value??v(B)?.total??"—")+'</td></tr>'}).join("");
 box.innerHTML='<div class="h269Hero"><small>SPORTS 69.0 • UNIVERSAL HEAD-TO-HEAD ENGINE</small><h1>HEAD TO HEAD</h1><p>MEETINGS • MATCHUPS • RESULTS • SHARED STATISTICS</p></div><form class="h269Pick" id="h2hForm69"><select name="a">'+options("A")+'</select><select name="b">'+options("B")+'</select><button>LOAD MATCHUP</button></form><div class="h269Summary"><article><small>SUBJECT A</small><h2>'+esc(A?.name||"NOT SELECTED")+'</h2><span>'+esc(A?.type||"—")+'</span></article><article><small>SUBJECT B</small><h2>'+esc(B?.name||"NOT SELECTED")+'</h2><span>'+esc(B?.type||"—")+'</span></article><article><small>CONNECTED MEETINGS</small><h2>'+meetings.length+'</h2><span>SUPPLIED GAMES</span></article></div><section class="h269Panel"><h2>MATCHUP HISTORY</h2><div class="h269Games">'+(meetings.length?meetings.slice(0,30).map(gameCard).join(""):'<div class="h269Empty">No connected head-to-head games were found for the selected entities.</div>')+'</div></section><section class="h269Panel"><h2>SHARED STATISTICS</h2><div class="h269Table">'+(statRows?'<table><thead><tr><th>METRIC</th><th>'+esc(A?.name||"A")+'</th><th>'+esc(B?.name||"B")+'</th></tr></thead><tbody>'+statRows+'</tbody></table>':'<div class="h269Empty">No shared statistics are connected for this matchup.</div>')+'</div></section><div class="h269Links"><a href="compare.html?a='+encodeURIComponent(a)+'&b='+encodeURIComponent(b)+'">COMPARISON</a><a href="game-day.html">GAME DAY</a><a href="event-center.html">EVENT CENTER</a><a href="stats-explorer.html">STATISTICS</a></div>';
}


// SPORTS 68.0 — UNIVERSAL SPORTS COMPARISON ENGINE
function renderComparisonEngine68(){
 const box=$("#comparisonEngine68");if(!box||!SportsState.ready)return;
 const d=SportsState.data, teams=d.teams||[], players=d.players||[], stats=d.statistics||d.stats||[], records=d.records||[];
 const q=new URLSearchParams(location.search), a=q.get("a")||"", b=q.get("b")||"";
 const entities=[...players.map(x=>({id:x.id,name:x.name||x.fullName||x.id,type:"PLAYER"})),...teams.map(x=>({id:x.id,name:x.name||x.fullName||x.id,type:"TEAM"}))];
 const A=entities.find(x=>String(x.id)===String(a)),B=entities.find(x=>String(x.id)===String(b));
 const metrics=[...new Set(stats.map(x=>x.metric||x.stat).filter(Boolean))].slice(0,40);
 const value=(e,m)=>{if(!e)return"—";const rows=stats.filter(x=>String(x.playerId||x.teamId||x.entityId)===String(e.id)&&(x.metric||x.stat)===m);return rows[0]?.value??rows[0]?.total??rows[0]?.average??"—"};
 const recordCount=e=>e?records.filter(x=>String(x.playerId||x.teamId||x.entityId)===String(e.id)).length:0;
 const options=sel=>'<option value="">SELECT '+sel+'</option>'+entities.map(x=>'<option value="'+esc(x.id)+'" '+(String(x.id)===String(sel==="A"?a:b)?"selected":"")+'>'+esc(x.name)+' • '+x.type+'</option>').join("");
 const rows=metrics.map(m=>'<tr><th>'+esc(m)+'</th><td>'+esc(value(A,m))+'</td><td>'+esc(value(B,m))+'</td></tr>').join("");
 box.innerHTML='<div class="cmp68Hero"><small>SPORTS 68.0 • UNIVERSAL SPORTS COMPARISON ENGINE</small><h1>COMPARE SPORTS</h1><p>PLAYERS • TEAMS • METRICS • RECORDS • HISTORY</p></div><form class="cmp68Pick" id="compareForm68"><select name="a">'+options("A")+'</select><select name="b">'+options("B")+'</select><button>COMPARE</button></form><div class="cmp68Cards"><article><small>SUBJECT A</small><h2>'+esc(A?.name||"SELECT AN ENTITY")+'</h2><span>'+esc(A?.type||"—")+'</span><b>'+recordCount(A)+'</b><em>RECORDS</em></article><article><small>SUBJECT B</small><h2>'+esc(B?.name||"SELECT AN ENTITY")+'</h2><span>'+esc(B?.type||"—")+'</span><b>'+recordCount(B)+'</b><em>RECORDS</em></article></div><section class="cmp68Panel"><h2>STATISTICAL COMPARISON</h2><div class="cmp68TableWrap">'+(A||B?'<table><thead><tr><th>METRIC</th><th>'+esc(A?.name||"A")+'</th><th>'+esc(B?.name||"B")+'</th></tr></thead><tbody>'+(rows||'<tr><td colspan="3">No connected statistics.</td></tr>')+'</tbody></table>':'<div class="cmp68Empty"><h3>COMPARISON READY</h3><p>Select two players or teams to compare connected statistics.</p></div>')+'</div></section><div class="cmp68Links"><a href="stats-explorer.html">STATISTICS</a><a href="leaders.html">LEADERS</a><a href="records.html">RECORDS</a><a href="history.html">HISTORY</a></div>';
}


// SPORTS 67.0 — UNIVERSAL SPORTS STATISTICS EXPLORER
function renderStatsExplorer67(){
 const box=$("#statsExplorer67");if(!box||!SportsState.ready)return;
 const d=SportsState.data, stats=d.statistics||d.stats||d.player_stats||[];
 const leagues=d.leagues||[], teams=d.teams||[], players=d.players||[];
 const q=new URLSearchParams(location.search), league=q.get("league")||"", team=q.get("team")||"", player=q.get("player")||"", metric=q.get("metric")||"";
 const filtered=stats.filter(x=>(!league||String(x.leagueId||x.league)===league)&&(!team||String(x.teamId||x.team)===team)&&(!player||String(x.playerId||x.player)===player)&&(!metric||String(x.metric||x.stat)===metric)).slice(0,100);
 const opts=(arr,val,label)=>'<option value="">ALL '+label+'</option>'+arr.map(x=>'<option value="'+esc(x.id)+'" '+(String(x.id)===String(val)?"selected":"")+'>'+esc(x.name||x.fullName||x.title||x.id)+'</option>').join("");
 const row=x=>'<tr><td>'+esc(x.playerName||x.player||x.teamName||x.team||"—")+'</td><td>'+esc(x.teamName||x.team||"—")+'</td><td>'+esc(x.metric||x.stat||"—")+'</td><td>'+esc(x.value??x.total??x.average??"—")+'</td><td>'+esc(x.season||x.year||"—")+'</td></tr>';
 const metrics=[...new Set(stats.map(x=>x.metric||x.stat).filter(Boolean))];
 box.innerHTML='<div class="sx67Hero"><small>SPORTS 67.0 • UNIVERSAL STATISTICS EXPLORER</small><h1>STATISTICS EXPLORER</h1><p>LEAGUE • TEAM • PLAYER • SEASON • METRIC</p></div><form class="sx67Filters" id="statsFilters67"><select name="league">'+opts(leagues,league,"LEAGUES")+'</select><select name="team">'+opts(teams,team,"TEAMS")+'</select><select name="player">'+opts(players,player,"PLAYERS")+'</select><select name="metric"><option value="">ALL METRICS</option>'+metrics.map(x=>'<option '+(x===metric?"selected":"")+'>'+esc(x)+'</option>').join("")+'</select><button>EXPLORE</button></form><div class="sx67Metrics"><div><b>'+stats.length+'</b><span>STAT ROWS</span></div><div><b>'+filtered.length+'</b><span>RESULTS</span></div><div><b>'+metrics.length+'</b><span>METRICS</span></div><div><b>'+leagues.length+'</b><span>LEAGUES</span></div></div><section class="sx67Panel"><h2>STATISTICS</h2><div class="sx67TableWrap">'+(filtered.length?'<table><thead><tr><th>ATHLETE</th><th>TEAM</th><th>METRIC</th><th>VALUE</th><th>SEASON</th></tr></thead><tbody>'+filtered.map(row).join("")+'</tbody></table>':'<div class="sx67Empty"><h3>STATISTICS FEED READY</h3><p>No statistics match the selected filters, or a statistics feed has not been connected yet.</p></div>')+'</div></section><div class="sx67Links"><a href="leaders.html">LEADERS</a><a href="records.html">RECORDS</a><a href="players.html">PLAYERS</a><a href="history.html">HISTORY</a></div>';
}


// SPORTS 66.0 — UNIVERSAL SPORTS LEADERBOARD & STAT LEADERS ENGINE
function renderLeadersCenter66(){
 const box=$("#leadersCenter66");if(!box||!SportsState.ready)return;
 const d=SportsState.data, rows=d.leaders||d.stat_leaders||d.player_leaders||[];
 const q=(new URLSearchParams(location.search).get("q")||"").trim().toLowerCase();
 const filtered=rows.filter(x=>!q||JSON.stringify(x).toLowerCase().includes(q)).slice(0,100);
 const card=(x,i)=>'<article><div class="ld66Rank">#'+(i+1)+'</div><small>'+esc(x.leagueId||x.league||x.category||"SPORTS")+'</small><h2>'+esc(x.metric||x.stat||x.title||"STAT LEADER")+'</h2><b>'+esc(x.value??x.total??"—")+'</b><strong>'+esc(x.playerName||x.player||x.teamName||x.holder||"LEADER")+'</strong><span>'+esc(x.teamName||x.team||x.season||x.year||"CURRENT")+'</span></article>';
 box.innerHTML='<div class="ld66Hero"><small>SPORTS 66.0 • UNIVERSAL LEADERBOARD & STAT LEADERS ENGINE</small><h1>STAT LEADERS</h1><p>PLAYER • TEAM • LEAGUE • SPORT • CATEGORY • METRIC</p></div><div class="ld66Search"><input id="leaderSearch66" value="'+esc(q)+'" placeholder="SEARCH LEADERS OR STATISTICS"><button id="leaderSearchBtn66">SEARCH</button></div><div class="ld66Metrics"><div><b>'+rows.length+'</b><span>LEADERS</span></div><div><b>'+new Set(rows.map(x=>x.leagueId||x.league)).size+'</b><span>LEAGUES</span></div><div><b>'+new Set(rows.map(x=>x.metric||x.stat)).size+'</b><span>METRICS</span></div><div><b>'+filtered.length+'</b><span>VISIBLE</span></div></div><section class="ld66Panel"><h2>LEADERBOARD</h2><div class="ld66Grid">'+(filtered.length?filtered.map(card).join(""):'<div class="ld66Empty"><h3>LEADER FEED READY</h3><p>No statistical leader dataset is connected yet. Current or historical leaders can be supplied by the Sports data layer.</p></div>')+'</div></section><div class="ld66Links"><a href="records.html">RECORDS</a><a href="stats.html">STATISTICS</a><a href="players.html">PLAYERS</a><a href="history.html">HISTORY</a></div>';
 const input=$("#leaderSearch66"),btn=$("#leaderSearchBtn66"),go=()=>{const v=input?.value.trim();location.href=v?"leaders.html?q="+encodeURIComponent(v):"leaders.html"};
 btn?.addEventListener("click",go);input?.addEventListener("keydown",e=>{if(e.key==="Enter")go()});
}


// SPORTS 65.0 — UNIVERSAL SPORTS RECORDS & STATISTICS HISTORY
function renderRecordsCenter65(){
 const box=$("#recordsCenter65");if(!box||!SportsState.ready)return;
 const d=SportsState.data, records=d.records||d.statistics_history||d.stat_records||[];
 const games=d.games||[], players=d.players||[], teams=d.teams||[], leagues=d.leagues||[];
 const q=(new URLSearchParams(location.search).get("q")||"").trim().toLowerCase();
 const filtered=records.filter(x=>!q||JSON.stringify(x).toLowerCase().includes(q));
 const rows=filtered.slice(0,60);
 const card=x=>'<article><small>'+esc(x.category||x.type||"RECORD")+'</small><h2>'+esc(x.title||x.name||"Sports Record")+'</h2><b>'+esc(x.value??x.stat??"—")+'</b><p>'+esc(x.holder||x.playerName||x.teamName||x.description||"Record holder and context supplied by connected data.")+'</p><span>'+esc(x.season||x.year||x.date||"HISTORICAL")+'</span></article>';
 box.innerHTML='<div class="rc65Hero"><small>SPORTS 65.0 • UNIVERSAL RECORDS & STATISTICS HISTORY</small><h1>RECORDS CENTER</h1><p>PLAYER • TEAM • LEAGUE • SEASON • GAME • CHAMPIONSHIP RECORDS</p></div><div class="rc65Search"><input id="recordSearch65" value="'+esc(q)+'" placeholder="SEARCH RECORDS, PLAYERS, TEAMS OR SEASONS"><button id="recordSearchBtn65">SEARCH</button></div><div class="rc65Metrics"><div><b>'+records.length+'</b><span>RECORDS</span></div><div><b>'+players.length+'</b><span>PLAYERS</span></div><div><b>'+teams.length+'</b><span>TEAMS</span></div><div><b>'+leagues.length+'</b><span>LEAGUES</span></div></div><section class="rc65Panel"><h2>HISTORICAL RECORDS</h2><div class="rc65Grid">'+(rows.length?rows.map(card).join(""):'<div class="rc65Empty"><h3>RECORDS FEED READY</h3><p>No historical records are connected yet. Record data can be added without fabricating historical statistics.</p></div>')+'</div></section><div class="rc65Links"><a href="history.html">SPORTS HISTORY</a><a href="stats.html">STATISTICS</a><a href="standings.html">STANDINGS</a><a href="season.html">SEASONS</a></div>';
 const input=$("#recordSearch65"),btn=$("#recordSearchBtn65");
 const go=()=>{const v=input?.value.trim();location.href=v?"records.html?q="+encodeURIComponent(v):"records.html"};
 btn?.addEventListener("click",go);input?.addEventListener("keydown",e=>{if(e.key==="Enter")go()});
}


// SPORTS 64.0 — UNIVERSAL SPORTS SEASON ARCHIVE & HISTORY
function renderSeasonArchive64(){
 const box=$("#seasonArchive64");if(!box||!SportsState.ready)return;
 const d=SportsState.data, seasons=d.seasons||d.season_history||d.history||[];
 const current=(d.seasons||[])[0];
 const rows=seasons.length?seasons:current?[current]:[];
 const games=d.games||[], standings=d.standings||[], tournaments=d.tournaments||d.championships||[];
 const card=s=>{const id=s.id||s.seasonId||s.year, champ=s.champion||s.winner||"—";return '<article><div><small>'+esc(s.year||s.season||s.name||"SEASON")+'</small><h2>'+esc(s.name||s.title||("SEASON "+(s.year||id||"")))+'</h2></div><span>'+esc(s.status||"ARCHIVED")+'</span><b>CHAMPION: '+esc(champ)+'</b><p>'+esc(s.summary||s.description||"Historical season data is available when supplied by the connected archive feed.")+'</p>'+(id?'<a href="season.html?id='+encodeURIComponent(id)+'">OPEN SEASON</a>':"")+'</article>'};
 box.innerHTML='<div class="sa64Hero"><small>SPORTS 64.0 • UNIVERSAL SEASON ARCHIVE & HISTORY</small><h1>SPORTS HISTORY</h1><p>SEASONS • CHAMPIONS • RECORDS • PLAYOFFS • HISTORICAL DATA</p></div><div class="sa64Metrics"><div><b>'+rows.length+'</b><span>SEASONS</span></div><div><b>'+tournaments.length+'</b><span>CHAMPIONSHIPS</span></div><div><b>'+standings.length+'</b><span>STANDING RECORDS</span></div><div><b>'+games.length+'</b><span>GAME RECORDS</span></div></div><section class="sa64Panel"><h2>SEASON ARCHIVE</h2><div class="sa64Grid">'+(rows.length?rows.map(card).join(""):'<div class="sa64Empty"><h3>ARCHIVE READY</h3><p>No historical season dataset is connected yet. Completed seasons can be preserved here without replacing current data.</p></div>')+'</div></section><div class="sa64Links"><a href="season.html">CURRENT SEASON</a><a href="playoffs.html">PLAYOFFS</a><a href="tournaments.html">CHAMPIONSHIPS</a><a href="event-center.html">EVENT CENTER</a></div>';
}


// SPORTS 63.0 — UNIVERSAL SPORTS SEASON ENGINE
function renderSeasonEngine63(){
 const box=$("#seasonEngine63");if(!box||!SportsState.ready)return;
 const d=SportsState.data, seasons=d.seasons||d.season||[], s=seasons[0]||{};
 const games=d.games||[], standings=d.standings||[], tournaments=d.tournaments||d.championships||[], schedule=d.schedule||[];
 const phase=(s.phases||s.stages||[
  {name:"REGULAR SEASON",status:games.length?"ACTIVE":"READY",count:games.length},
  {name:"STANDINGS",status:standings.length?"CONNECTED":"READY",count:standings.length},
  {name:"PLAYOFF QUALIFICATION",status:tournaments.length?"CONNECTED":"READY",count:tournaments.length},
  {name:"CHAMPIONSHIP",status:tournaments.length?"CONNECTED":"READY",count:tournaments.length}
 ]);
 const selected=s.name||s.title||s.season||"CURRENT SPORTS SEASON";
 const links=[["REGULAR SEASON","scores.html"],["STANDINGS","standings.html"],["PLAYOFFS","playoffs.html"],["CHAMPIONSHIP","tournaments.html"]];
 box.innerHTML='<div class="se63Hero"><small>SPORTS 63.0 • UNIVERSAL SPORTS SEASON ENGINE</small><h1>'+esc(selected)+'</h1><p>'+esc(s.status||"SEASON LIFECYCLE")+'</p></div><div class="se63Timeline">'+phase.map((x,i)=>'<article class="'+(i===0?"active":"")+'"><div class="se63Node">'+(i+1)+'</div><h2>'+esc(x.name||x.stage||"PHASE")+'</h2><b>'+esc(x.status||"READY")+'</b><span>'+esc(x.count??"—")+'</span></article>').join("")+'</div><section class="se63Panel"><h2>SEASON SNAPSHOT</h2><div class="se63Stats"><div><b>'+games.length+'</b><span>GAMES</span></div><div><b>'+standings.length+'</b><span>STANDING ROWS</span></div><div><b>'+schedule.length+'</b><span>SCHEDULE ITEMS</span></div><div><b>'+tournaments.length+'</b><span>CHAMPIONSHIPS</span></div></div></section><section class="se63Panel"><h2>SEASON CONTROL</h2><div class="se63Links">'+links.map(x=>'<a href="'+x[1]+'"><b>'+x[0]+'</b><span>OPEN CENTER →</span></a>').join("")+'</div></section><p class="se63Note">The season lifecycle is driven by connected Sports data. No standings, playoff qualification, or championship results are invented when the corresponding feed is absent.</p>';
}


// SPORTS 62.0 — UNIVERSAL PLAYOFF & CHAMPIONSHIP ENGINE
function renderPlayoffEngine62(){
 const box=$("#playoffEngine62");if(!box||!SportsState.ready)return;
 const t=(SportsState.data.tournaments||SportsState.data.championships||[])[0];
 const standings=SportsState.data.standings||[], teams=SportsState.data.teams||[], games=SportsState.data.games||[];
 if(!t){box.innerHTML='<div class="po62Empty"><h1>PLAYOFF ENGINE</h1><p>Connect tournament, standings, seeding and playoff data to activate championship qualification.</p><a href="bracket.html">BRACKET ENGINE</a></div>';return}
 const seed=x=>x.seed??x.rank??x.position??"—";
 const eligible=(standings.length?standings.slice(0,12):teams.slice(0,12));
 const rounds=t.rounds||t.bracket||[];
 const status=x=>x.eliminated?"ELIMINATED":x.qualified?"QUALIFIED":x.status||"IN CONTENTION";
 box.innerHTML='<div class="po62Hero"><small>SPORTS 62.0 • UNIVERSAL PLAYOFF & CHAMPIONSHIP ENGINE</small><h1>'+esc(t.name||t.title||"CHAMPIONSHIP PLAYOFFS")+'</h1><p>'+esc(t.status||"QUALIFICATION • SEEDING • ELIMINATION • CHAMPIONSHIP")+'</p></div><div class="po62Metrics"><div><b>'+eligible.length+'</b><span>SEEDING POOL</span></div><div><b>'+rounds.length+'</b><span>ROUNDS</span></div><div><b>'+games.length+'</b><span>GAMES</span></div><div><b>'+esc(t.champion||"TBD")+'</b><span>CHAMPION</span></div></div><section class="po62Panel"><h2>QUALIFICATION & SEEDING</h2><div class="po62Seeds">'+eligible.map((x,i)=>{const team=teams.find(z=>String(z.id)===String(x.teamId||x.id));return '<a href="team.html?id='+encodeURIComponent(team?.id||x.teamId||x.id)+'"><b>#'+esc(seed(x)===undefined?i+1:seed(x))+'</b><strong>'+esc(team?.name||x.teamName||x.name||"TEAM")+'</strong><span>'+esc(status(x))+'</span></a>'}).join("")+'</div></section><section class="po62Panel"><h2>CHAMPIONSHIP PATH</h2><div class="po62Rounds">'+(rounds.length?rounds.map((x,i)=>'<article><b>'+esc(x.name||x.round||"ROUND "+(i+1))+'</b><span>'+esc(x.status||"READY")+'</span><p>'+esc(x.description||"Matchups and advancement will be determined by connected playoff data.")+'</p></article>').join(""):'<p>No playoff rounds connected yet.</p>')+'</div></section><div class="po62Actions"><a href="bracket.html">BRACKET</a><a href="tournaments.html">TOURNAMENTS</a><a href="standings.html">STANDINGS</a><a href="event-center.html">EVENT CENTER</a></div>';
}


// SPORTS 61.0 — UNIVERSAL SPORTS BRACKET ENGINE
function renderBracketEngine61(){
 const box=$("#bracketEngine61");if(!box||!SportsState.ready)return;
 const data=SportsState.data.tournaments||SportsState.data.championships||[], q=new URLSearchParams(location.search), id=q.get("id");
 const t=data.find(x=>String(x.id)===String(id))||data[0];
 if(!t){box.innerHTML='<div class="br61Empty"><h1>BRACKET ENGINE</h1><p>No tournament bracket is connected yet. Add tournament rounds/matchups to activate the interactive championship path.</p><a href="tournaments.html">TOURNAMENT CENTER</a></div>';return}
 const rounds=t.rounds||t.bracket||[], games=SportsState.data.games||[];
 const getName=id=>{const x=getTeam(id);return x?.short||x?.name||id||"TBD"};
 const match=(m,i)=>{const g=games.find(x=>String(x.id)===String(m.gameId||m.id));const a=m.awayTeamId?getName(m.awayTeamId):(m.away||"TBD"),h=m.homeTeamId?getName(m.homeTeamId):(m.home||"TBD");return '<div class="br61Match"><a href="'+(g?'game-intelligence.html?id='+encodeURIComponent(g.id):'#')+'"><b>'+esc(a)+'</b><span>'+esc(g?.score||m.awayScore??"—")+'</span></a><a href="'+(g?'game-intelligence.html?id='+encodeURIComponent(g.id):'#')+'"><b>'+esc(h)+'</b><span>'+esc(g?.scoreHome||m.homeScore??"—")+'</span></a><small>'+esc(m.status||g?.status||"MATCHUP")+'</small></div>'};
 box.innerHTML='<div class="br61Hero"><small>SPORTS 61.0 • UNIVERSAL BRACKET ENGINE</small><h1>'+esc(t.name||t.title||"CHAMPIONSHIP")+'</h1><p>'+esc(t.status||"TOURNAMENT PATH")+'</p></div><div class="br61Path">'+(rounds.length?rounds.map((r,i)=>'<section><h2>'+esc(r.name||r.round||"ROUND "+(i+1))+'</h2>'+(r.matches||r.matchups||[]).map(match).join("")+'</section>').join(""):'<section class="br61Empty"><h2>BRACKET DATA</h2><p>Rounds and matchups will appear when supplied by the tournament feed.</p></section>')+'</div><div class="br61Actions"><a href="tournaments.html?id='+encodeURIComponent(t.id)+'">TOURNAMENT CENTER</a><a href="event-center.html">EVENT CENTER</a><a href="game-day.html">GAME DAY</a></div>';
}


// SPORTS 60.0 — UNIVERSAL SPORTS TOURNAMENT & CHAMPIONSHIP CENTER
function renderTournamentCenter60(){
  const box=$("#tournamentCenter60");if(!box||!SportsState.ready)return;
  const p=new URLSearchParams(location.search), tid=p.get("id");
  const source=SportsState.data.tournaments||SportsState.data.championships||[];
  const tournament=source.find(x=>String(x.id)===String(tid))||source[0];
  const games=SportsState.data.games||[];
  const selectedGames=tournament?games.filter(g=>!tournament.leagueId||g.leagueId===tournament.leagueId).slice(0,12):games.slice(0,12);
  if(!tournament){box.innerHTML='<div class="tour60Empty"><h1>TOURNAMENT CENTER</h1><p>No tournament dataset is connected yet. The center is ready for tournament and championship feeds.</p><a href="event-center.html">EVENT CENTER</a></div>';return}
  const teams=(SportsState.data.teams||[]).filter(t=>(tournament.teamIds||[]).includes(t.id)).slice(0,16);
  const rounds=tournament.rounds||tournament.bracket||[];
  const game=g=>'<a href="game-intelligence.html?id='+encodeURIComponent(g.id)+'"><span>'+esc(g.status||"MATCHUP")+'</span><b>'+esc(getTeam(g.awayTeamId)?.short||"AWY")+' @ '+esc(getTeam(g.homeTeamId)?.short||"HME")+'</b><em>'+esc(g.score||g.time||g.date||"SCHEDULED")+'</em></a>';
  box.innerHTML='<div class="tour60Hero"><small>SPORTS 60.0 • TOURNAMENT & CHAMPIONSHIP CENTER</small><h1>'+esc(tournament.name||tournament.title||"TOURNAMENT")+'</h1><p>'+esc(tournament.leagueId||"SPORTS").toUpperCase()+' • '+esc(tournament.status||"CHAMPIONSHIP EVENT")+'</p></div><div class="tour60Stats"><div><b>'+teams.length+'</b><span>TEAMS</span></div><div><b>'+rounds.length+'</b><span>ROUNDS</span></div><div><b>'+selectedGames.length+'</b><span>MATCHUPS</span></div><div><b>'+esc(tournament.venue||"—")+'</b><span>VENUE</span></div></div><div class="tour60Grid"><section><h2>BRACKET / ROUNDS</h2>'+(rounds.length?rounds.map((x,i)=>'<div class="tour60Round"><b>'+esc(x.name||x.round||("ROUND "+(i+1)))+'</b><span>'+esc(x.status||x.date||"ROUND")+'</span></div>').join(""):'<p>Bracket data will appear when supplied by the tournament feed.</p>')+'</section><section><h2>CHAMPIONSHIP MATCHUPS</h2>'+(selectedGames.length?selectedGames.map(game).join(""):'<p>No matchups are connected yet.</p>')+'</section><section><h2>PARTICIPATING TEAMS</h2>'+(teams.length?teams.map(t=>'<a href="team.html?id='+encodeURIComponent(t.id)+'"><b>'+esc(t.name||"TEAM")+'</b><span>'+esc(t.short||"")+'</span></a>').join(""):'<p>Team entries will appear from the tournament dataset.</p>')+'</section><section><h2>CHAMPIONSHIP INFO</h2><p>'+esc(tournament.description||"Tournament details, championship rounds and event information will appear from the connected data feed.")+'</p></section></div>';
}


// SPORTS 59.0 — UNIVERSAL SPORTS EVENT CENTER 2.0
function renderEventCenter59(){
  const box=$("#eventCenter59");if(!box||!SportsState.ready)return;
  const games=SportsState.data.games||[], events=SportsState.data.live_events||SportsState.data.events||[], schedule=SportsState.data.schedule||[];
  const selected=SportsState.selectedLeague;
  const leagueOk=x=>selected==="all"||x.leagueId===selected;
  const combined=[...games.filter(leagueOk).map(g=>({type:"GAME",id:g.id,title:(getTeam(g.awayTeamId)?.short||"AWY")+" @ "+(getTeam(g.homeTeamId)?.short||"HME"),status:g.status,time:g.time||g.date,href:"game-intelligence.html?id="+encodeURIComponent(g.id)})),...events.filter(leagueOk).map(e=>({type:"EVENT",id:e.id,title:e.title||e.name||"Live Event",status:e.status,time:e.time||e.date,href:"event-center.html?id="+encodeURIComponent(e.id)})),...schedule.filter(leagueOk).map(e=>({type:"SCHEDULE",id:e.id,title:e.title||e.name||"Scheduled Event",status:e.status,time:e.time||e.date,href:"event-center.html?id="+encodeURIComponent(e.id)}))].slice(0,18);
  const card=e=>'<a href="'+e.href+'"><span>'+esc(e.type)+'</span><b>'+esc(e.title)+'</b><em>'+esc(e.status||"SCHEDULED")+' • '+esc(e.time||"TIME TBD")+'</em></a>';
  box.innerHTML='<div class="event59Hero"><small>SPORTS 59.0 • UNIVERSAL EVENT CENTER 2.0</small><h1>THE EVENT CENTER</h1><p>Games, live events and scheduled activity connected through one Sports event system.</p><a href="game-day.html">GAME DAY</a></div><div class="event59Stats"><div><b>'+games.filter(leagueOk).length+'</b><span>GAMES</span></div><div><b>'+events.filter(leagueOk).length+'</b><span>LIVE EVENTS</span></div><div><b>'+schedule.filter(leagueOk).length+'</b><span>SCHEDULED</span></div><div><b>'+combined.length+'</b><span>DISCOVERABLE</span></div></div><section class="event59List"><h2>EVENT DISCOVERY</h2>'+(combined.length?combined.map(card).join(""):'<p>No events are available in the current data feed.</p>')+'</section>';
}


// SPORTS 58.0 — UNIVERSAL SPORTS GAME INTELLIGENCE CENTER
function renderGameIntelligence58(){
  const box=$("#gameIntelligence58");if(!box||!SportsState.ready)return;
  const p=new URLSearchParams(location.search), id=p.get("id"), games=SportsState.data.games||[], g=games.find(x=>String(x.id)===String(id))||games[0];
  if(!g){box.innerHTML='<div class="intel58Empty"><h1>GAME NOT FOUND</h1><a href="scores.html">BACK TO SCORES</a></div>';return}
  const away=getTeam(g.awayTeamId),home=getTeam(g.homeTeamId), players=(SportsState.data.players||[]).filter(x=>x.teamId===g.homeTeamId||x.teamId===g.awayTeamId);
  const standings=(SportsState.data.standings||[]).filter(x=>x.leagueId===g.leagueId).slice(0,6), news=(SportsState.data.news||[]).filter(x=>x.leagueId===g.leagueId).slice(0,5), media=(SportsState.data.videos||[]).filter(x=>x.leagueId===g.leagueId).slice(0,4);
  const row=a=>'<a href="player.html?id='+encodeURIComponent(a.id)+'"><b>'+esc(a.name||"Player")+'</b><span>'+esc(a.position||"")+'</span></a>';
  const teamRows=t=>'<a href="team.html?id='+encodeURIComponent(t?.id||"")+'"><b>'+esc(t?.name||"TEAM")+'</b><span>'+esc(t?.short||"")+'</span></a>';
  box.innerHTML='<div class="intel58Hero"><small>SPORTS 58.0 • UNIVERSAL GAME INTELLIGENCE</small><h1>'+esc(away?.name||"AWAY")+' <strong>'+esc(g.score||"VS")+'</strong> '+esc(home?.name||"HOME")+'</h1><p>'+esc(g.status||"SCHEDULED")+' • '+esc(g.time||g.date||"")+' • '+esc(g.leagueId||"SPORTS").toUpperCase()+'</p></div><div class="intel58Grid"><section><h2>GAME SNAPSHOT</h2><div class="intel58Facts"><b>'+esc(g.status||"SCHEDULED")+'</b><span>'+esc(g.score||"Score pending")+'</span><span>'+esc(g.venue||"Venue pending")+'</span></div></section><section><h2>TEAMS</h2>'+teamRows(away)+teamRows(home)+'</section><section><h2>KEY PLAYERS</h2>'+((players.slice(0,8).map(row).join(""))||'<p>No player data available.</p>')+'</section><section><h2>STANDINGS CONTEXT</h2>'+(standings.length?standings.map(x=>'<div class="intel58Stand"><b>'+esc(x.teamName||getTeam(x.teamId)?.name||"TEAM")+'</b><span>'+esc(x.wins!=null?x.wins+"-"+(x.losses??0):x.record||"Record pending")+'</span></div>').join(""):'<p>No standings context in the current data feed.</p>')+'</section><section><h2>GAME TIMELINE</h2>'+((g.events||g.timeline||[]).map(e=>'<div class="intel58Event"><b>'+esc(e.time||e.clock||"")+'</b><span>'+esc(e.text||e.description||e.event||"Game event")+'</span></div>').join("")||'<p>Timeline events will appear from the connected live feed.</p>')+'</section><section><h2>RELATED NEWS</h2>'+(news.length?news.map(n=>'<a href="news-story.html?id='+encodeURIComponent(n.id)+'"><b>'+esc(n.title||"Sports Story")+'</b><span>'+esc(n.date||"LATEST")+'</span></a>').join(""):'<p>No related news available.</p>')+'</section><section><h2>RELATED MEDIA</h2>'+(media.length?media.map(v=>'<a href="video.html?id='+encodeURIComponent(v.id)+'"><b>'+esc(v.title||v.name||"Sports Video")+'</b><span>VIDEO</span></a>').join(""):'<p>No related media available.</p>')+'</section></div><div class="intel58Actions"><a href="live-game.html?id='+encodeURIComponent(g.id)+'">LIVE GAME</a><a href="team-game.html?id='+encodeURIComponent(g.id)+'">TEAM GAME HUB</a><a href="game.html?id='+encodeURIComponent(g.id)+'">GAME DETAILS</a></div>';
}


// SPORTS 57.0 — UNIVERSAL PLAYER GAME CENTER
function renderPlayerGameCenter57(){
  const box=$("#playerGameCenter57");if(!box||!SportsState.ready)return;
  const p=new URLSearchParams(location.search), gid=p.get("game"), pid=p.get("player");
  const games=SportsState.data.games||[], players=SportsState.data.players||[];
  const g=games.find(x=>String(x.id)===String(gid))||games[0];
  if(!g){box.innerHTML='<div class="player57Empty"><h1>GAME NOT FOUND</h1><a href="scores.html">BACK TO SCORES</a></div>';return}
  const participants=players.filter(x=>x.teamId===g.homeTeamId||x.teamId===g.awayTeamId);
  const selected=participants.find(x=>String(x.id)===String(pid))||participants[0];
  const team=getTeam(selected?.teamId), teamGames=games.filter(x=>x.homeTeamId===selected?.teamId||x.awayTeamId===selected?.teamId).slice(0,5);
  const news=(SportsState.data.news||[]).filter(n=>n.playerId===selected?.id||n.teamId===selected?.teamId||n.leagueId===g.leagueId).slice(0,5);
  const media=(SportsState.data.videos||[]).filter(v=>v.playerId===selected?.id||v.teamId===selected?.teamId||v.leagueId===g.leagueId).slice(0,4);
  const playerLink=x=>'<a href="player.html?id='+encodeURIComponent(x.id)+'"><b>'+esc(x.name||"Player")+'</b><span>'+esc(x.position||"")+'</span></a>';
  box.innerHTML='<div class="player57Hero"><small>SPORTS 57.0 • UNIVERSAL PLAYER GAME CENTER</small><h1>'+esc(selected?.name||"PLAYER")+'</h1><p>'+esc(team?.name||"TEAM")+' • '+esc(selected?.position||"PLAYER")+'</p><div class="player57Game">'+esc(getTeam(g.awayTeamId)?.short||"AWY")+' '+esc(g.score||"VS")+' '+esc(getTeam(g.homeTeamId)?.short||"HME")+' • '+esc(g.status||"GAME")+'</div></div><div class="player57Picker">'+(participants.length?participants.map(playerLink).join(""):'<p>No player data available.</p>')+'</div><div class="player57Grid"><section><h2>GAME ROLE</h2><p>'+esc(selected?.role||selected?.position||"Player participation details will appear when supplied by the data feed.")+'</p></section><section><h2>PLAYER STATS</h2><p>'+esc(selected?.stats?JSON.stringify(selected.stats):"Player statistics will appear when supplied by the data feed.")+'</p></section><section><h2>TEAM GAMES</h2>'+teamGames.map(x=>'<a href="live-game.html?id='+encodeURIComponent(x.id)+'"><b>'+esc(getTeam(x.awayTeamId)?.short||"AWY")+' @ '+esc(getTeam(x.homeTeamId)?.short||"HME")+'</b><span>'+esc(x.score||x.status||x.date||"GAME")+'</span></a>').join("")+'</section><section><h2>PLAYER NEWS</h2>'+(news.length?news.map(n=>'<a href="news-story.html?id='+encodeURIComponent(n.id)+'"><b>'+esc(n.title||"Sports Story")+'</b><span>'+esc(n.date||"LATEST")+'</span></a>').join(""):'<p>No related news in the current feed.</p>')+'</section><section><h2>PLAYER MEDIA</h2>'+(media.length?media.map(v=>'<a href="video.html?id='+encodeURIComponent(v.id)+'"><b>'+esc(v.title||v.name||"Sports Video")+'</b><span>VIDEO</span></a>').join(""):'<p>No related media in the current feed.</p>')+'</section></div>';
}


// SPORTS 56.0 — UNIVERSAL TEAM GAME HUB
function renderTeamGameHub56(){
  const box=$("#teamGameHub56");if(!box||!SportsState.ready)return;
  const p=new URLSearchParams(location.search), id=p.get("id"), games=SportsState.data.games||[];
  const g=games.find(x=>String(x.id)===String(id))||games[0];
  if(!g){box.innerHTML='<div class="team56Empty"><h1>GAME NOT FOUND</h1><a href="scores.html">BACK TO SCORES</a></div>';return}
  const away=getTeam(g.awayTeamId), home=getTeam(g.homeTeamId), teams=[away,home].filter(Boolean);
  const teamGames=t=>games.filter(x=>x.homeTeamId===t?.id||x.awayTeamId===t?.id).slice(0,4);
  const roster=(SportsState.data.players||[]).filter(p=>teams.some(t=>t.id===p.teamId)).slice(0,8);
  const news=(SportsState.data.news||[]).filter(n=>teams.some(t=>t.id===n.teamId)||n.leagueId===g.leagueId).slice(0,6);
  const media=(SportsState.data.videos||[]).filter(v=>v.leagueId===g.leagueId).slice(0,4);
  const team=t=>'<div class="team56Card"><h2>'+esc(t?.name||"TEAM")+'</h2><span>'+esc(t?.short||"")+'</span><a href="team.html?id='+encodeURIComponent(t?.id||"")+'">TEAM HUB</a></div>';
  const game=x=>'<a href="live-game.html?id='+encodeURIComponent(x.id)+'"><span>'+esc(x.status||"GAME")+'</span><b>'+esc(getTeam(x.awayTeamId)?.short||"AWY")+' @ '+esc(getTeam(x.homeTeamId)?.short||"HME")+'</b><em>'+esc(x.score||x.time||x.date||"SCHEDULED")+'</em></a>';
  box.innerHTML='<div class="team56Hero"><small>SPORTS 56.0 • UNIVERSAL TEAM GAME HUB</small><h1>'+esc(away?.name||"AWAY")+' <strong>'+esc(g.score||"VS")+'</strong> '+esc(home?.name||"HOME")+'</h1><p>'+esc(g.status||"SCHEDULED")+' • '+esc(g.time||g.date||"")+'</p></div><div class="team56Teams">'+teams.map(team).join("")+'</div><div class="team56Grid"><section><h2>RECENT & UPCOMING</h2>'+teams.flatMap(teamGames).slice(0,8).map(game).join("")+'</section><section><h2>ROSTER</h2>'+(roster.length?roster.map(x=>'<a href="player.html?id='+encodeURIComponent(x.id)+'"><b>'+esc(x.name||"Player")+'</b><span>'+esc(x.position||"")+'</span></a>').join(""):'<p>No roster data available.</p>')+'</section><section><h2>TEAM NEWS</h2>'+(news.length?news.map(n=>'<a href="news-story.html?id='+encodeURIComponent(n.id)+'"><b>'+esc(n.title||"Sports Story")+'</b><span>'+esc(n.date||"LATEST")+'</span></a>').join(""):'<p>No team news in the current feed.</p>')+'</section><section><h2>TEAM MEDIA</h2>'+(media.length?media.map(v=>'<a href="video.html?id='+encodeURIComponent(v.id)+'"><b>'+esc(v.title||v.name||"Sports Video")+'</b><span>VIDEO</span></a>').join(""):'<p>No team media in the current feed.</p>')+'</section></div>';
}


// SPORTS 55.0 — UNIVERSAL SPORTS LIVE GAME EXPERIENCE
function renderLiveGameExperience55(){
  const box=$("#liveGameExperience55");if(!box||!SportsState.ready)return;
  const params=new URLSearchParams(location.search), id=params.get("id");
  const games=SportsState.data.games||[], g=games.find(x=>String(x.id)===String(id))||games.find(x=>["LIVE","IN PROGRESS","HALFTIME"].includes(String(x.status||"").toUpperCase()));
  if(!g){box.innerHTML='<div class="live55Empty"><h1>GAME NOT FOUND</h1><p>Select a game from Scores or Game Day.</p><a href="scores.html">BACK TO SCORES</a></div>';return}
  const away=getTeam(g.awayTeamId), home=getTeam(g.homeTeamId), live=["LIVE","IN PROGRESS","HALFTIME"].includes(String(g.status||"").toUpperCase());
  const news=(SportsState.data.news||[]).filter(n=>n.leagueId===g.leagueId).slice(0,4), media=(SportsState.data.videos||[]).filter(v=>v.leagueId===g.leagueId).slice(0,4);
  const players=(SportsState.data.players||[]).filter(p=>p.teamId===g.homeTeamId||p.teamId===g.awayTeamId).slice(0,6);
  const teamName=t=>t?.name||t?.short||"TEAM";
  const links=arr=>arr.map(n=>'<a href="news-story.html?id='+encodeURIComponent(n.id)+'"><span>'+esc(n.category||"NEWS")+'</span><b>'+esc(n.title||"Sports Story")+'</b></a>').join("");
  box.innerHTML='<div class="live55Hero"><small>SPORTS 55.0 • LIVE GAME EXPERIENCE</small><div class="live55Status">'+(live?"● LIVE":"GAME CENTER")+'</div><h1>'+esc(teamName(away))+' <strong>'+esc(g.score||"VS")+'</strong> '+esc(teamName(home))+'</h1><p>'+esc(g.status||"SCHEDULED")+' • '+esc(g.time||g.date||"")+'</p></div><div class="live55Actions"><a href="game.html?id='+encodeURIComponent(g.id)+'">GAME DETAILS</a><a href="scores.html">SCORES</a><a href="game-day.html">GAME DAY</a></div><div class="live55Grid"><section><h2>GAME TIMELINE</h2><div class="live55Timeline">'+(g.events||g.timeline||[]).map(e=>'<div><b>'+esc(e.time||e.clock||"")+'</b><span>'+esc(e.text||e.description||e.event||"Game event")+'</span></div>').join("")||'<p>Live event timeline will appear when the connected live feed provides events.</p>'+'</div></section><section><h2>KEY PLAYERS</h2>'+(players.length?players.map(p=>'<a href="player.html?id='+encodeURIComponent(p.id)+'"><b>'+esc(p.name||"Player")+'</b><span>'+esc(p.position||"")+'</span></a>').join(""):'<p>No player data available for this game.</p>')+'</section><section><h2>RELATED NEWS</h2>'+(news.length?links(news):'<p>No related stories in the current feed.</p>')+'</section><section><h2>RELATED MEDIA</h2>'+(media.length?media.map(v=>'<a href="video.html?id='+encodeURIComponent(v.id)+'"><b>'+esc(v.title||v.name||"Sports Video")+'</b><span>VIDEO</span></a>').join(""):'<p>No related media in the current feed.</p>')+'</section></div>';
}


// SPORTS 54.0 — UNIVERSAL SPORTS GAME DAY COMMAND CENTER
function renderGameDayCommandCenter54(){
  const box=$("#gameDayCommand54");if(!box||!SportsState.ready)return;
  const f=Favorites.get(), games=SportsState.data.games||[], news=SportsState.data.news||[], videos=SportsState.data.videos||[];
  const teams=new Set(f.teams||[]), leagueOk=x=>SportsState.selectedLeague==="all"||x.leagueId===SportsState.selectedLeague;
  const relevant=g=>leagueOk(g)&&(!teams.size||teams.has(g.homeTeamId)||teams.has(g.awayTeamId));
  const live=games.filter(g=>relevant(g)&&["LIVE","IN PROGRESS","HALFTIME"].includes(String(g.status||"").toUpperCase())).slice(0,6);
  const upcoming=games.filter(g=>relevant(g)&&!["FINAL","COMPLETED"].includes(String(g.status||"").toUpperCase())&&!["LIVE","IN PROGRESS","HALFTIME"].includes(String(g.status||"").toUpperCase())).slice(0,6);
  const stories=news.filter(leagueOk).slice(0,4), media=videos.filter(leagueOk).slice(0,4);
  const game=g=>'<a href="game.html?id='+encodeURIComponent(g.id)+'"><span>'+esc(g.status||"GAME")+'</span><b>'+esc(getTeam(g.awayTeamId)?.short||"AWY")+' @ '+esc(getTeam(g.homeTeamId)?.short||"HME")+'</b><em>'+esc(g.score||g.time||g.date||"SCHEDULED")+'</em></a>';
  const story=n=>'<a href="news-story.html?id='+encodeURIComponent(n.id)+'"><span>'+esc(n.category||"NEWS")+'</span><b>'+esc(n.title||"Sports Story")+'</b><em>'+esc(n.date||"LATEST")+'</em></a>';
  const vid=v=>'<a href="video.html?id='+encodeURIComponent(v.id)+'"><span>VIDEO</span><b>'+esc(v.title||v.name||"Sports Video")+'</b><em>'+esc(v.date||"MEDIA")+'</em></a>';
  box.innerHTML='<div class="gameday54Hero"><div><small>SPORTS 54.0 • GAME DAY COMMAND CENTER</small><h1>GAME DAY CONTROL</h1><p>One command center for live action, upcoming games, news and media connected to your Sports universe.</p></div><a href="scores.html">SCORES</a></div><div class="gameday54Stats"><div><b>'+live.length+'</b><span>LIVE</span></div><div><b>'+upcoming.length+'</b><span>UP NEXT</span></div><div><b>'+teams.size+'</b><span>FOLLOWED TEAMS</span></div><div><b>'+stories.length+'</b><span>STORIES</span></div></div><div class="gameday54Grid"><section><h2>LIVE NOW</h2>'+(live.length?live.map(game).join(""):'<p>No live games in the current data feed.</p>')+'</section><section><h2>UP NEXT</h2>'+(upcoming.length?upcoming.map(game).join(""):'<p>No upcoming games in the current data feed.</p>')+'</section><section><h2>GAME DAY NEWS</h2>'+(stories.length?stories.map(story).join(""):'<p>No current stories in the selected league.</p>')+'</section><section><h2>GAME DAY MEDIA</h2>'+(media.length?media.map(vid).join(""):'<p>No videos in the current data feed.</p>')+'</section></div>';
}


// SPORTS 53.0 — UNIVERSAL SPORTS HOME SECTIONS ENGINE
function renderSportsHomeSections53(){
  const box=$("#sportsHomeSections53");if(!box||!SportsState.ready)return;
  const f=Favorites.get(), all=SportsState.data.news||[], games=SportsState.data.games||[], videos=SportsState.data.videos||[];
  const followedLeagues=new Set(f.leagues||[]), followedTeams=new Set(f.teams||[]), followedPlayers=new Set(f.players||[]);
  const leagueOk=x=>SportsState.selectedLeague==="all"||x.leagueId===SportsState.selectedLeague;
  const live=games.filter(g=>leagueOk(g)&&["LIVE","IN PROGRESS","HALFTIME"].includes(String(g.status||"").toUpperCase())).slice(0,4);
  const upcoming=games.filter(g=>leagueOk(g)&&!["FINAL","COMPLETED"].includes(String(g.status||"").toUpperCase())).slice(0,4);
  const mine=all.filter(n=>followedLeagues.has(n.leagueId)||followedTeams.has(n.teamId)||followedPlayers.has(n.playerId)).slice(0,4);
  const trend=all.filter(leagueOk).slice(0,4);
  const media=videos.filter(v=>leagueOk(v)).slice(0,4);
  const storyCard=n=>'<a href="news-story.html?id='+encodeURIComponent(n.id)+'"><span>'+esc(n.category||"SPORTS")+'</span><b>'+esc(n.title||"Sports Story")+'</b><em>'+esc(n.date||"LATEST")+'</em></a>';
  const gameCard=g=>'<a href="game.html?id='+encodeURIComponent(g.id)+'"><span>'+esc(g.status||"UP NEXT")+'</span><b>'+esc(getTeam(g.awayTeamId)?.short||"AWY")+' @ '+esc(getTeam(g.homeTeamId)?.short||"HME")+'</b><em>'+esc(g.time||g.date||"SCHEDULED")+'</em></a>';
  const videoCard=v=>'<a href="video.html?id='+encodeURIComponent(v.id)+'"><span>VIDEO</span><b>'+esc(v.title||v.name||"Sports Video")+'</b><em>'+esc(v.date||"MEDIA")+'</em></a>';
  const section=(title,items,empty)=>'<section><h2>'+title+'</h2>'+(items.length?items.join(""):'<p>'+empty+'</p>')+'</section>';
  box.innerHTML='<div class="home53Header"><small>SPORTS 53.0 • UNIVERSAL HOME SECTIONS</small><h1>YOUR SPORTS UNIVERSE</h1><p>One connected home, organized around the Sports content that matters to you.</p></div><div class="home53Grid">'+section("FOR YOU",mine.map(storyCard),"Follow teams, players or leagues to personalize this section.")+section("LIVE NOW",live.map(gameCard),"No live games in the current data feed.")+section("UP NEXT",upcoming.map(gameCard),"No upcoming games in the current data feed.")+section("TRENDING",trend.map(storyCard),"No current stories in the selected league.")+section("MEDIA",media.map(videoCard),"No videos in the current data feed.")+'</div>';
}


// SPORTS 52.0 — UNIVERSAL SPORTS HOME PERSONALIZATION 2.0
function renderHomePersonalization52(){
  const box=$("#sportsHomePersonalization52");if(!box||!SportsState.ready)return;
  const f=Favorites.get(), history=NewsHistory.get(), saved=NewsWatchlist.get(), engagement=NewsEngagement.get();
  const leagues=new Set(f.leagues||[]), teams=new Set(f.teams||[]), players=new Set(f.players||[]);
  const all=SportsState.data.news||[];
  const score=n=>(leagues.has(n.leagueId)?7:0)+(teams.has(n.teamId)?7:0)+(players.has(n.playerId)?7:0)+(saved.includes(n.id)?3:0)+(history.some(x=>x.id===n.id)?2:0)+((engagement[n.id]?.reads||0)*2);
  const feed=all.map(n=>({n,s:score(n)})).sort((a,b)=>b.s-a.s).slice(0,8).map(x=>x.n);
  const focus=feed.slice(0,4);
  box.innerHTML='<div class="home52Hero"><div><small>SPORTS 52.0 • HOME PERSONALIZATION 2.0</small><h2>YOUR SPORTS FOCUS</h2><p>Your front page now prioritizes the strongest signals from follows, saved stories, reading history and engagement.</p></div><a href="sports-profile.html">PROFILE</a></div><div class="home52Metrics"><div><b>'+leagues.size+'</b><span>LEAGUES</span></div><div><b>'+teams.size+'</b><span>TEAMS</span></div><div><b>'+players.size+'</b><span>PLAYERS</span></div><div><b>'+history.length+'</b><span>READ</span></div></div><div class="home52Grid">'+(focus.length?focus.map(n=>'<a href="news-story.html?id='+encodeURIComponent(n.id)+'"><span>'+esc(n.category||"SPORTS")+'</span><b>'+esc(n.title||"Sports Story")+'</b><em>'+esc(n.date||"LATEST")+'</em></a>').join(""):'<p class="home52Empty">Follow Sports content to build your personalized focus.</p>')+'</div>';
}


// SPORTS 51.0 — UNIVERSAL SPORTS NEWS HOME
function renderSportsNewsHome51(){
  const box=$("#sportsNewsHome51");if(!box||!SportsState.ready)return;
  const f=Favorites.get(), saved=NewsWatchlist.get(), history=NewsHistory.get(), engagement=NewsEngagement.get(), all=SportsState.data.news||[];
  const selected=all.filter(n=>SportsState.selectedLeague==="all"||n.leagueId===SportsState.selectedLeague);
  const personal=selected.filter(n=>(f.leagues||[]).includes(n.leagueId)||(f.teams||[]).includes(n.teamId)||(f.players||[]).includes(n.playerId));
  const top=(personal.length?personal:selected).slice(0,6);
  const live=SportsState.data.games.filter(g=>["LIVE","IN PROGRESS","HALFTIME"].includes(String(g.status||"").toUpperCase())).filter(g=>SportsState.selectedLeague==="all"||g.leagueId===SportsState.selectedLeague).slice(0,4);
  const trend=selected.map(n=>({n,s:(engagement[n.id]?.opens||0)*2+(engagement[n.id]?.reads||0)*3+(saved.includes(n.id)?2:0)})).sort((a,b)=>b.s-a.s).slice(0,4).map(x=>x.n);
  const card=n=>'<a href="news-story.html?id='+encodeURIComponent(n.id)+'"><span>'+esc(n.category||"SPORTS")+'</span><b>'+esc(n.title||"Sports Story")+'</b><em>'+esc(n.date||"LATEST")+'</em></a>';
  box.innerHTML='<div class="newsHome51Hero"><div><small>SPORTS 51.0 • UNIVERSAL SPORTS HOME</small><h1>YOUR SPORTS FRONT PAGE</h1><p>News, live games, trending coverage and your personalized Sports universe in one connected home.</p></div><a href="news-command.html">NEWS DESK</a></div><div class="newsHome51Actions"><a href="scores.html">LIVE SCORES</a><a href="news.html">NEWS</a><a href="your-topics.html">YOUR TOPICS</a><a href="sports-profile.html">PROFILE</a></div><div class="newsHome51Grid"><section><h2>YOUR NEWS</h2>'+(top.length?top.map(card).join(""):'<p>Follow teams, players or leagues to personalize your front page.</p>')+'</section><section><h2>LIVE SPORTS</h2>'+(live.length?live.map(g=>'<a href="game.html?id='+encodeURIComponent(g.id)+'"><span>'+esc(g.status||"LIVE")+'</span><b>'+esc(getTeam(g.awayTeamId)?.short||"AWY")+' @ '+esc(getTeam(g.homeTeamId)?.short||"HME")+'</b><em>'+esc(g.time||"NOW")+'</em></a>').join(""):'<p>No live games in the current data feed.</p>')+'</section><section><h2>TRENDING NEWS</h2>'+(trend.length?trend.map(card).join(""):'<p>Trending coverage will grow with story activity.</p>')+'</section></div>';
}


// SPORTS 50.0 — UNIVERSAL SPORTS NEWS COMMAND CENTER
function renderNewsCommandCenter50(){
  const box=$("#sportsNewsCommand50");if(!box||!SportsState.ready)return;
  const f=Favorites.get(), saved=NewsWatchlist.get(), history=NewsHistory.get(), all=SportsState.data.news||[], engagement=NewsEngagement.get();
  const selected=all.filter(n=>SportsState.selectedLeague==="all"||n.leagueId===SportsState.selectedLeague);
  const trending=selected.map(n=>({n,s:((engagement[n.id]?.opens||0)*2)+((engagement[n.id]?.reads||0)*3)+(saved.includes(n.id)?2:0)})).sort((a,b)=>b.s-a.s).slice(0,5).map(x=>x.n);
  const recent=history.map(x=>all.find(n=>n.id===x.id)).filter(Boolean).slice(0,5);
  const personal=selected.filter(n=>(f.leagues||[]).includes(n.leagueId)||(f.teams||[]).includes(n.teamId)||(f.players||[]).includes(n.playerId)).slice(0,5);
  const card=n=>'<a href="news-story.html?id='+encodeURIComponent(n.id)+'"><span>'+esc(n.category||"SPORTS")+'</span><b>'+esc(n.title||"Sports Story")+'</b><em>'+esc(n.date||"LATEST")+'</em></a>';
  box.innerHTML='<div class="cmd50Hero"><div><small>SPORTS 50.0 • NEWS COMMAND CENTER</small><h1>THE SPORTS NEWS DESK</h1><p>One command center connecting discovery, personalization, topics, trending stories, history and saved coverage.</p></div><a href="home.html">SPORTS HOME</a></div><div class="cmd50Actions"><a href="news.html">DISCOVER</a><a href="your-topics.html">YOUR TOPICS</a><a href="topic-feed.html">TOPIC FEED</a><a href="trending-news.html">TRENDING</a><a href="news-history.html">HISTORY</a><a href="news-watchlist.html">WATCHLIST • '+saved.length+'</a></div><div class="cmd50Metrics"><div><b>'+selected.length+'</b><span>SELECTED STORIES</span></div><div><b>'+personal.length+'</b><span>PERSONAL</span></div><div><b>'+trending.length+'</b><span>TRENDING</span></div><div><b>'+history.length+'</b><span>READ</span></div></div><div class="cmd50Grid"><section><h2>PERSONALIZED</h2>'+(personal.length?personal.map(card).join(""):'<p>Follow teams, players or leagues to personalize coverage.</p>')+'</section><section><h2>TRENDING</h2>'+(trending.length?trending.map(card).join(""):'<p>Trending stories will appear as engagement grows.</p>')+'</section><section><h2>RECENTLY READ</h2>'+(recent.length?recent.map(card).join(""):'<p>Your reading history will appear here.</p>')+'</section></div>';
}


// SPORTS 49.0 — UNIVERSAL SPORTS NEWS TOPIC FEEDS
function renderTopicFeed49(){
  const box=$("#sportsTopicFeed49");if(!box||!SportsState.ready)return;
  const params=new URLSearchParams(location.search), topic=(params.get("topic")||"ALL").toUpperCase();
  const f=Favorites.get(), leagues=new Set(f.leagues||[]), teams=new Set(f.teams||[]), players=new Set(f.players||[]), read=new Set(NewsHistory.get().map(x=>x.id)), saved=new Set(NewsWatchlist.get());
  const all=SportsState.data.news||[];
  const base=all.filter(n=>topic==="ALL"||String(n.category||"SPORTS").toUpperCase()===topic);
  const feed=base.map(n=>({n,s:(leagues.has(n.leagueId)?5:0)+(teams.has(n.teamId)?5:0)+(players.has(n.playerId)?5:0)+(saved.has(n.id)?2:0)+(read.has(n.id)?1:0)})).sort((a,b)=>b.s-a.s).map(x=>x.n);
  const topics=[...new Set(all.map(n=>String(n.category||"SPORTS").toUpperCase()))];
  box.innerHTML='<div class="feed49Hero"><div><small>SPORTS 49.0 • TOPIC FEED</small><h2>'+esc(topic==="ALL"?"SPORTS TOPIC FEED":topic+" FEED")+'</h2><p>A connected story stream prioritized by your Sports personalization.</p></div><a href="your-topics.html">YOUR TOPICS</a></div><div class="feed49Topics"><a class="'+(topic==="ALL"?"active":"")+'" href="topic-feed.html?topic=ALL">ALL</a>'+topics.map(t=>'<a class="'+(t===topic?"active":"")+'" href="topic-feed.html?topic='+encodeURIComponent(t)+'">'+esc(t)+'</a>').join("")+'</div><div class="feed49Grid">'+(feed.length?feed.slice(0,15).map((n,i)=>'<a href="news-story.html?id='+encodeURIComponent(n.id||"")+'"><span>'+esc(n.category||"SPORTS")+' • '+(i+1)+'</span><b>'+esc(n.title||"Sports Story")+'</b><p>'+esc(n.summary||"Sports story")+'</p><em>'+esc(n.date||"LATEST")+'</em></a>').join(""):'<p class="feed49Empty">NO STORIES IN THIS TOPIC.</p>')+'</div>';
}


// SPORTS 48.0 — UNIVERSAL SPORTS NEWS TOPIC PERSONALIZATION
function renderTopicPersonalization48(){
  const box=$("#sportsTopicPersonalization48");if(!box||!SportsState.ready)return;
  const f=Favorites.get(), history=NewsHistory.get(), saved=new Set(NewsWatchlist.get()), engagement=NewsEngagement.get();
  const leagues=new Set(f.leagues||[]), teams=new Set(f.teams||[]), players=new Set(f.players||[]), read=new Set(history.map(x=>x.id));
  const all=SportsState.data.news||[], scores={};
  all.forEach(n=>{
    const c=String(n.category||"SPORTS").toUpperCase();
    const e=engagement[n.id]||{};
    scores[c]=(scores[c]||0)+(leagues.has(n.leagueId)?6:0)+(teams.has(n.teamId)?6:0)+(players.has(n.playerId)?6:0)+(saved.has(n.id)?2:0)+(read.has(n.id)?1:0)+(e.reads||0);
  });
  const topics=Object.entries(scores).sort((a,b)=>b[1]-a[1]);
  const top=topics.slice(0,8);
  box.innerHTML='<div class="topic48Hero"><div><small>SPORTS 48.0 • TOPIC PERSONALIZATION</small><h2>YOUR TOPICS</h2><p>Topic priority is shaped by your follows, saved stories, reading history and local engagement.</p></div><a href="topics.html">TOPIC CENTER</a></div><div class="topic48Grid">'+(top.length?top.map((x,i)=>'<a href="topics.html?topic='+encodeURIComponent(x[0])+'"><span>#'+(i+1)+'</span><b>'+esc(x[0])+'</b><em>'+x[1]+' relevance</em></a>').join(""):'<p class="topic48Empty">READ OR FOLLOW Sports stories to build topic personalization.</p>')+'</div>';
}


// SPORTS 47.0 — UNIVERSAL SPORTS NEWS TOPICS & CATEGORIES
function renderNewsTopics47(){
  const box=$("#sportsNewsTopics47");if(!box||!SportsState.ready)return;
  const all=SportsState.data.news||[], counts={};
  all.forEach(n=>{const c=String(n.category||"SPORTS").toUpperCase();counts[c]=(counts[c]||0)+1});
  const cats=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  const q=(new URLSearchParams(location.search).get("topic")||"ALL").toUpperCase();
  const feed=all.filter(n=>q==="ALL"||String(n.category||"SPORTS").toUpperCase()===q).slice(0,12);
  box.innerHTML='<div class="topic47Hero"><div><small>SPORTS 47.0 • TOPICS & CATEGORIES</small><h2>SPORTS TOPICS</h2><p>Explore Sports coverage through connected story categories and topic views.</p></div><a href="news.html">DISCOVER</a></div><div class="topic47Cats"><a class="'+(q==="ALL"?"active":"")+'" href="topics.html?topic=ALL">ALL</a>'+cats.map(c=>'<a class="'+(q===c[0]?"active":"")+'" href="topics.html?topic='+encodeURIComponent(c[0])+'">'+esc(c[0])+' <b>'+c[1]+'</b></a>').join("")+'</div><div class="topic47Grid">'+(feed.length?feed.map(n=>'<a href="news-story.html?id='+encodeURIComponent(n.id||"")+'"><span>'+esc(n.category||"SPORTS")+'</span><b>'+esc(n.title||"Sports Story")+'</b><em>'+esc(n.date||"LATEST")+'</em></a>').join(""):'<p class="topic47Empty">NO STORIES IN THIS TOPIC.</p>')+'</div>';
}


// SPORTS 46.0 — UNIVERSAL SPORTS NEWS TRENDING ENGINE
function renderNewsTrending46(){
  const box=$("#sportsNewsTrending46");if(!box||!SportsState.ready)return;
  const engagement=NewsEngagement.get(), news=SportsState.data.news||[];
  const score=n=>{const e=engagement[n.id]||{};return (e.opens||0)*2+(e.reads||0)*3+(NewsWatchlist.has(n.id)?2:0)};
  const ranked=news.map(n=>({n,s:score(n)})).sort((a,b)=>b.s-a.s||String(b.n.date||"").localeCompare(String(a.n.date||""))).slice(0,8).map(x=>x.n);
  box.innerHTML='<div class="trend46Hero"><div><small>SPORTS 46.0 • TRENDING ENGINE</small><h2>WHAT’S TRENDING</h2><p>Stories rise through local engagement signals such as opens, reads and saves.</p></div><a href="news.html">ALL NEWS</a></div><div class="trend46Grid">'+(ranked.length?ranked.map((n,i)=>'<a href="news-story.html?id='+encodeURIComponent(n.id)+'"><span>#'+(i+1)+' • '+esc(n.category||"SPORTS")+'</span><b>'+esc(n.title||"Sports Story")+'</b><em>'+((engagement[n.id]?.opens||0)+(engagement[n.id]?.reads||0))+' activity events</em></a>').join(""):'<p class="trend46Empty">TRENDING DATA WILL APPEAR AS STORIES RECEIVE ACTIVITY.</p>')+'</div>';
}


// SPORTS 45.0 — UNIVERSAL SPORTS NEWS ENGAGEMENT
const NewsEngagement={
  key:"crowrulesSportsNewsEngagement",
  get(){try{return JSON.parse(localStorage.getItem(this.key))||{}}catch(e){return{}}},
  save(v){localStorage.setItem(this.key,JSON.stringify(v))},
  record(id,type){if(!id)return;const v=this.get();v[id]=v[id]||{opens:0,saves:0,reads:0};v[id][type]=(v[id][type]||0)+1;v[id].last=new Date().toISOString();this.save(v)},
  data(id){return this.get()[id]||{opens:0,saves:0,reads:0}}
};
function recordNewsOpen45(){
  const id=new URLSearchParams(location.search).get("id");if(id){NewsEngagement.record(id,"opens");NewsEngagement.record(id,"reads")}
}
function renderNewsEngagement45(){
  const box=$("#sportsNewsEngagement");if(!box||!SportsState.ready)return;
  const id=new URLSearchParams(location.search).get("id");const e=NewsEngagement.data(id);
  box.innerHTML='<div class="eng45Head"><small>SPORTS 45.0 • ENGAGEMENT</small><b>YOUR STORY ACTIVITY</b></div><div class="eng45Metrics"><div><strong>'+e.opens+'</strong><span>OPENS</span></div><div><strong>'+e.reads+'</strong><span>READS</span></div><div><strong>'+NewsWatchlist.get().filter(x=>x===id).length+'</strong><span>SAVED</span></div></div>';
}


// SPORTS 44.0 — UNIVERSAL SPORTS NEWS PERSONALIZATION 2.0
function renderNewsPersonalization44(){
  const box=$("#sportsNewsPersonalization44");if(!box||!SportsState.ready)return;
  const f=Favorites.get(), history=NewsHistory.get(), saved=new Set(NewsWatchlist.get());
  const leagueIds=new Set(f.leagues||[]), teamIds=new Set(f.teams||[]), playerIds=new Set(f.players||[]);
  const all=SportsState.data.news||[];
  const readIds=new Set(history.map(x=>x.id));
  const score=n=>(leagueIds.has(n.leagueId)?6:0)+(teamIds.has(n.teamId)?6:0)+(playerIds.has(n.playerId)?6:0)+(saved.has(n.id)?3:0)+(readIds.has(n.id)?1:0);
  const ranked=all.map(n=>({n,s:score(n)})).sort((a,b)=>b.s-a.s||String(b.n.date||"").localeCompare(String(a.n.date||""))).slice(0,12).map(x=>x.n);
  const top=ranked.length?ranked:all.slice(0,12);
  box.innerHTML='<div class="personal44Hero"><div><small>SPORTS 44.0 • PERSONALIZATION 2.0</small><h2>YOUR NEWS SIGNAL</h2><p>Follows, saved stories, reading history and league selection now shape your Sports News priority.</p></div><a href="news-hub.html">NEWS HUB</a></div><div class="personal44Metrics"><div><b>'+top.length+'</b><span>RECOMMENDED</span></div><div><b>'+saved.size+'</b><span>SAVED</span></div><div><b>'+history.length+'</b><span>READ</span></div><div><b>'+(leagueIds.size+teamIds.size+playerIds.size)+'</b><span>FOLLOWS</span></div></div><div class="personal44Grid">'+(top.length?top.map(n=>'<a href="news-story.html?id='+encodeURIComponent(n.id||"")+'"><span>'+esc(n.category||"SPORTS")+'</span><b>'+esc(n.title||"Sports Story")+'</b><em>'+esc(n.date||"LATEST")+'</em></a>').join(""):'<p class="personal44Empty">Follow Sports content to build your personalized signal.</p>')+'</div>';
}


// SPORTS 43.0 — UNIVERSAL SPORTS NEWS READING HISTORY
const NewsHistory={
  key:"crowrulesSportsNewsHistory",
  get(){try{return JSON.parse(localStorage.getItem(this.key))||[]}catch(e){return[]}},
  save(v){localStorage.setItem(this.key,JSON.stringify(v))},
  record(id){if(!id)return;const v=this.get().filter(x=>x.id!==id);v.unshift({id,time:new Date().toISOString()});this.save(v.slice(0,50));refreshUniversalLayer();renderNewsHistory43()},
  stories(){return this.get().map(x=>(SportsState.data.news||[]).find(n=>n.id===x.id)).filter(Boolean)}
};
function renderNewsHistory43(){
  const box=$("#sportsNewsHistory");if(!box||!SportsState.ready)return;
  const stories=NewsHistory.stories().slice(0,12);
  box.innerHTML='<div class="history43Hero"><div><small>SPORTS 43.0 • READING HISTORY</small><h2>RECENTLY READ</h2><p>Your recent Sports stories, stored locally in this browser.</p></div><a href="news.html">DISCOVER NEWS</a></div><div class="history43Grid">'+(stories.length?stories.map(n=>'<a href="news-story.html?id='+encodeURIComponent(n.id)+'"><span>'+esc(n.category||"SPORTS")+'</span><b>'+esc(n.title||"Sports Story")+'</b><em>'+esc(n.date||"LATEST")+'</em></a>').join(""):'<p class="history43Empty">NO READING HISTORY YET.</p>')+'</div>';
}
function recordNewsStory43(){
  const id=new URLSearchParams(location.search).get("id");if(id)NewsHistory.record(id);
}


// SPORTS 42.0 — UNIVERSAL SPORTS NEWS RECOMMENDATIONS
function renderNewsRecommendations42(){
  const box=$("#sportsNewsRecommendations");if(!box||!SportsState.ready)return;
  const id=new URLSearchParams(location.search).get("id");
  const story=(SportsState.data.news||[]).find(n=>n.id===id);
  const f=Favorites.get(), teamIds=new Set(f.teams||[]), leagueIds=new Set(f.leagues||[]), playerIds=new Set(f.players||[]);
  const all=(SportsState.data.news||[]).filter(n=>n.id!==id);
  const score=n=>(n.leagueId===story?.leagueId?4:0)+(n.teamId&&teamIds.has(n.teamId)?4:0)+(n.playerId&&playerIds.has(n.playerId)?4:0)+(leagueIds.has(n.leagueId)?3:0);
  const recs=all.map(n=>({n,s:score(n)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,6).map(x=>x.n);
  const fallback=all.filter(n=>n.leagueId===story?.leagueId).slice(0,6);
  const feed=(recs.length?recs:fallback);
  box.innerHTML='<div class="rec42Head"><small>SPORTS 42.0 • RECOMMENDATIONS</small><h2>MORE LIKE THIS</h2><p>Related coverage based on this story and your Sports follows.</p></div><div class="rec42Grid">'+(feed.length?feed.map(n=>'<a href="news-story.html?id='+encodeURIComponent(n.id||"")+'"><span>'+esc(n.category||"SPORTS")+'</span><b>'+esc(n.title||"Sports Story")+'</b><em>'+esc(n.date||"LATEST")+'</em></a>').join(""):'<p class="rec42Empty">More related coverage will appear as the News library grows.</p>')+'</div>';
}


// SPORTS 41.0 — UNIVERSAL SPORTS NEWS HUB
function renderNewsHub41(){
  const box=$("#sportsNewsHub");if(!box||!SportsState.ready)return;
  const f=Favorites.get(), saved=NewsWatchlist.get(), leagueIds=new Set(f.leagues||[]), teamIds=new Set(f.teams||[]), playerIds=new Set(f.players||[]);
  const all=SportsState.data.news||[];
  const selected=all.filter(n=>SportsState.selectedLeague==="all"||n.leagueId===SportsState.selectedLeague);
  const personal=selected.filter(n=>leagueIds.has(n.leagueId)||teamIds.has(n.teamId)||playerIds.has(n.playerId));
  const categories=[...new Set(all.map(n=>String(n.category||"SPORTS").toUpperCase()))];
  const card=n=>'<a class="hub41Card" href="news-story.html?id='+encodeURIComponent(n.id||"")+'"><span>'+esc(n.category||"SPORTS")+'</span><h3>'+esc(n.title||"Sports Story")+'</h3><p>'+esc(n.summary||"Sports story")+'</p><em>'+esc(n.date||"LATEST")+'</em></a>';
  box.innerHTML='<div class="hub41Hero"><div><small>SPORTS 41.0 • NEWS COMMAND CENTER</small><h1>SPORTS NEWS HUB</h1><p>One destination for discovery, personalized coverage, saved stories and connected Sports data.</p></div><a href="sports-profile.html">PROFILE</a></div><div class="hub41Actions"><a href="news.html">DISCOVER</a><a href="personalized-news.html">PERSONALIZED</a><a href="news-watchlist.html">WATCHLIST • '+saved.length+'</a><a href="home.html">SPORTS HOME</a></div><div class="hub41Metrics"><div><b>'+selected.length+'</b><span>SELECTED STORIES</span></div><div><b>'+personal.length+'</b><span>PERSONAL STORIES</span></div><div><b>'+saved.length+'</b><span>SAVED</span></div><div><b>'+categories.length+'</b><span>CATEGORIES</span></div></div><div class="hub41Section"><h2>PERSONALIZED COVERAGE</h2><div class="hub41Grid">'+(personal.length?personal.slice(0,6).map(card).join(""):'<p class="hub41Empty">Follow teams, players or leagues to personalize your News Hub.</p>')+'</div></div><div class="hub41Section"><h2>LATEST SELECTED-LEAGUE STORIES</h2><div class="hub41Grid">'+(selected.length?selected.slice(0,9).map(card).join(""):'<p class="hub41Empty">No stories available for this selection.</p>')+'</div></div>';
}


// SPORTS 40.0 — UNIVERSAL NEWS WATCHLIST & ALERTS
const NewsWatchlist={
  key:"crowrulesSportsNewsWatchlist",
  get(){try{return JSON.parse(localStorage.getItem(this.key))||[]}catch(e){return[]}},
  save(v){localStorage.setItem(this.key,JSON.stringify(v))},
  has(id){return this.get().includes(id)},
  toggle(id){const v=this.get(),i=v.indexOf(id);i>=0?v.splice(i,1):v.push(id);this.save(v);refreshUniversalLayer();renderNewsWatchlist40();renderNewsStory40Button()},
  stories(){return this.get().map(id=>(SportsState.data.news||[]).find(n=>n.id===id)).filter(Boolean)}
};
function newsWatchButton(id){return '<button type="button" class="newsWatch40 '+(NewsWatchlist.has(id)?"saved":"")+'" onclick="NewsWatchlist.toggle(\''+esc(id)+'\')">'+(NewsWatchlist.has(id)?"★ SAVED":"☆ SAVE STORY")+'</button>'}
function renderNewsStory40Button(){
  const box=$("#newsStoryWatchButton");if(!box||!SportsState.ready)return;
  const id=new URLSearchParams(location.search).get("id"); if(id)box.innerHTML=newsWatchButton(id);
}
function renderNewsWatchlist40(){
  const box=$("#sportsNewsWatchlist");if(!box||!SportsState.ready)return;
  const stories=NewsWatchlist.stories();
  box.innerHTML='<div class="watch40Hero"><div><small>SPORTS 40.0 • NEWS WATCHLIST</small><h2>YOUR SAVED STORIES</h2><p>Save stories and keep them in one personal Sports watchlist.</p></div><a href="news.html">DISCOVER NEWS</a></div><div class="watch40Grid">'+(stories.length?stories.map(n=>'<article class="watch40Card"><a href="news-story.html?id='+encodeURIComponent(n.id)+'"><span>'+esc(n.category||"SPORTS")+'</span><h3>'+esc(n.title||"Sports Story")+'</h3><p>'+esc(n.summary||"Sports story")+'</p></a><div>'+newsWatchButton(n.id)+'</div></article>').join(""):'<div class="watch40Empty">NO SAVED STORIES YET — SAVE STORIES FROM THEIR STORY PAGES.</div>')+'</div>';
}


// SPORTS 39.0 — UNIVERSAL SPORTS NEWS PERSONALIZATION
function renderNewsPersonalization39(){
  const box=$("#sportsNewsPersonalization");if(!box||!SportsState.ready)return;
  const f=Favorites.get(), leagues=new Set(f.leagues||[]), teams=new Set(f.teams||[]), players=new Set(f.players||[]);
  const all=(SportsState.data.news||[]).filter(n=>SportsState.selectedLeague==="all"||n.leagueId===SportsState.selectedLeague);
  const personalized=all.filter(n=>leagues.has(n.leagueId)||teams.has(n.teamId)||players.has(n.playerId));
  const feed=(personalized.length?personalized:all).slice(0,8);
  box.innerHTML='<div class="news39Hero"><div><small>SPORTS 39.0 • PERSONALIZED NEWS</small><h2>NEWS FOR YOUR SPORTS UNIVERSE</h2><p>Stories connected to the leagues, teams and players you follow are surfaced first.</p></div><a href="sports-profile.html">PROFILE</a></div><div class="news39Metrics"><div><b>'+personalized.length+'</b><span>PERSONAL STORIES</span></div><div><b>'+leagues.size+'</b><span>LEAGUES</span></div><div><b>'+teams.size+'</b><span>TEAMS</span></div><div><b>'+players.size+'</b><span>PLAYERS</span></div></div><div class="news39Grid">'+(feed.length?feed.map(n=>'<a class="news39Card" href="news-story.html?id='+encodeURIComponent(n.id||"")+'"><span>'+esc(n.category||"SPORTS")+'</span><h3>'+esc(n.title||"Sports Story")+'</h3><p>'+esc(n.summary||"Sports story")+'</p><em>'+esc(n.date||"LATEST")+'</em></a>').join(""):'<p class="news39Empty">Follow teams, players or leagues to personalize Sports News.</p>')+'</div>';
}


// SPORTS 38.0 — UNIVERSAL NEWS DISCOVERY CENTER
function renderNewsDiscovery38(){
  const box=$("#sportsNewsDiscovery");if(!box||!SportsState.ready)return;
  const q=(new URLSearchParams(location.search).get("q")||"").trim().toLowerCase();
  const cat=(new URLSearchParams(location.search).get("category")||"ALL").toUpperCase();
  const news=(SportsState.data.news||[]).filter(n=>SportsState.selectedLeague==="all"||n.leagueId===SportsState.selectedLeague)
    .filter(n=>cat==="ALL"||String(n.category||"SPORTS").toUpperCase()===cat)
    .filter(n=>!q||[n.title,n.summary,n.category].some(v=>String(v||"").toLowerCase().includes(q)));
  const cats=["ALL",...new Set((SportsState.data.news||[]).map(n=>String(n.category||"SPORTS").toUpperCase()))];
  box.innerHTML='<div class="news38Hero"><div><small>SPORTS 38.0 • NEWS DISCOVERY</small><h1>DISCOVER SPORTS STORIES</h1><p>Browse stories by league, category and search — connected to the universal Sports data layer.</p></div><a href="home.html">SPORTS HOME</a></div><div class="news38Tools"><input id="news38Search" value="'+esc(q)+'" placeholder="SEARCH SPORTS STORIES…">'+cats.map(c=>'<a class="'+(c===cat?"active":"")+'" href="news.html?category='+encodeURIComponent(c)+'">'+esc(c)+'</a>').join("")+'</div><div class="news38Grid">'+(news.length?news.map(n=>'<a class="news38Card" href="news-story.html?id='+encodeURIComponent(n.id||"")+'"><span>'+esc(n.category||"SPORTS")+'</span><h2>'+esc(n.title||"Untitled Story")+'</h2><p>'+esc(n.summary||"Sports story")+'</p><em>'+esc(n.date||"LATEST")+'</em></a>').join(""):'<div class="news38Empty">NO STORIES FOUND FOR THIS SELECTION.</div>')+'</div>';
  const input=$("#news38Search");if(input)input.oninput=()=>{const u=new URL(location.href);u.searchParams.set("q",input.value);if(!input.value)u.searchParams.delete("q");history.replaceState({}, "",u);renderNewsDiscovery38();};
}


// SPORTS 37.0 — UNIVERSAL SPORTS STORY PAGES
function renderNewsStory37(){
  const box=$("#sportsNewsStory");if(!box||!SportsState.ready)return;
  const id=new URLSearchParams(location.search).get("id");
  const story=(SportsState.data.news||[]).find(n=>n.id===id);
  if(!story){box.innerHTML='<div class="story37Empty">STORY NOT FOUND</div>';return;}
  const league=SportsState.data.leagues.find(l=>l.id===story.leagueId);
  const team=story.teamId?getTeam(story.teamId):null;
  const player=story.playerId?getPlayer(story.playerId):null;
  const related=(SportsState.data.news||[]).filter(n=>n.id!==story.id&&(n.leagueId===story.leagueId||n.teamId===story.teamId)).slice(0,5);
  box.innerHTML='<article class="story37"><header><small>SPORTS 37.0 • '+esc(story.category||"SPORTS STORY")+'</small><h1>'+esc(story.title||"Untitled Story")+'</h1><p class="story37Summary">'+esc(story.summary||"Sports story")+'</p><div class="story37Meta">'+esc(league?.name||"Sports")+' • '+esc(story.date||"LATEST")+'</div></header><div class="story37Grid"><section><div class="story37Body">'+esc(story.body||story.summary||"This story is ready for expanded editorial content.")+'</div><div class="story37Links">'+(team?'<a href="team.html?id='+encodeURIComponent(team.id)+'">TEAM • '+esc(team.name)+'</a>':"")+(player?'<a href="player.html?id='+encodeURIComponent(player.id)+'">PLAYER • '+esc(player.name)+'</a>':"")+(league?'<a href="league.html?league='+encodeURIComponent(league.id)+'">LEAGUE • '+esc(league.name)+'</a>':"")+'</div></section><aside><h3>RELATED STORIES</h3>'+(related.length?related.map(n=>'<a href="news-story.html?id='+encodeURIComponent(n.id)+'"><b>'+esc(n.title)+'</b><span>'+esc(n.category||"SPORTS")+'</span></a>').join(""):'<p>No related stories yet.</p>')+'</aside></div></article>';
}


// SPORTS 36.0 — UNIVERSAL SPORTS SEARCH 2.0
function renderUniversalSearch36(){
  const input=$("#globalSearch");if(!input||!SportsState.ready)return;
  let panel=$("#sportsSearch36");
  if(!panel){panel=document.createElement("div");panel.id="sportsSearch36";panel.className="sportsSearch36";document.body.appendChild(panel);}
  const q=SportsState.search.trim().toLowerCase();
  if(!q){panel.classList.remove("open");panel.innerHTML="";return;}
  const match=(x,fields)=>fields.some(k=>String(x?.[k]??"").toLowerCase().includes(q));
  const groups=[
    ["LEAGUES",SportsState.data.leagues.filter(x=>match(x,["name","sport","level"])),x=>"league.html?league="+encodeURIComponent(x.id),x=>x.name],
    ["TEAMS",SportsState.data.teams.filter(x=>match(x,["name","short","id"])),x=>"team.html?id="+encodeURIComponent(x.id),x=>x.name],
    ["PLAYERS",SportsState.data.players.filter(x=>match(x,["name","position","statLabel"])),x=>"player.html?id="+encodeURIComponent(x.id),x=>x.name],
    ["GAMES",SportsState.data.games.filter(x=>match(x,["id","status","time"])),x=>"game.html?id="+encodeURIComponent(x.id),x=>((getTeam(x.awayTeamId)?.short||"AWY")+" @ "+(getTeam(x.homeTeamId)?.short||"HME"))],
    ["NEWS", (SportsState.data.news||[]).filter(x=>match(x,["title","summary","category"])),x=>x.url||"news.html?id="+encodeURIComponent(x.id||""),x=>x.title],
    ["MEDIA",SportsState.data.videos.filter(x=>match(x,["title","type"])),x=>"video.html?id="+encodeURIComponent(x.id),x=>x.title]
  ];
  const found=groups.reduce((a,g)=>a+g[1].length,0);
  panel.innerHTML='<div class="search36Panel"><div class="search36Head"><b>SPORTS 36.0 • UNIVERSAL SEARCH</b><button type="button" id="search36Close">×</button></div>'+
  (found?groups.filter(g=>g[1].length).map(g=>'<section><h3>'+g[0]+'</h3>'+g[1].slice(0,6).map(x=>'<a href="'+esc(g[2](x))+'"><span>'+esc(g[0])+'</span><b>'+esc(g[3](x))+'</b></a>').join("")+'</section>').join(""):'<div class="search36Empty">NO SPORTS RESULTS FOR “'+esc(SportsState.search)+'”</div>')+'</div>';
  panel.classList.add("open");$("#search36Close").onclick=()=>{SportsState.search="";input.value="";panel.classList.remove("open");};
}


// SPORTS 35.0 — UNIVERSAL NEWS INTEGRATION
function renderIntegratedSportsFeed(){
  const box=$("#sportsIntegratedFeed");if(!box||!SportsState.ready)return;
  const f=Favorites.get(), teamIds=new Set(f.teams||[]), leagueIds=new Set(f.leagues||[]), playerIds=new Set(f.players||[]);
  const games=SportsState.data.games.filter(g=>SportsState.selectedLeague==="all"||g.leagueId===SportsState.selectedLeague).filter(g=>leagueIds.has(g.leagueId)||teamIds.has(g.homeTeamId)||teamIds.has(g.awayTeamId));
  const news=(SportsState.data.news||[]).filter(n=>SportsState.selectedLeague==="all"||n.leagueId===SportsState.selectedLeague).filter(n=>leagueIds.has(n.leagueId)||teamIds.has(n.teamId)||playerIds.has(n.playerId));
  const videos=selected(SportsState.data.videos).slice(0,4);
  const items=[];
  games.slice(0,5).forEach(g=>items.push({type:"GAME",title:(getTeam(g.awayTeamId)?.short||"AWY")+" @ "+(getTeam(g.homeTeamId)?.short||"HME"),meta:g.status||"UP NEXT",href:"game.html?id="+encodeURIComponent(g.id)}));
  news.slice(0,5).forEach(n=>items.push({type:"STORY",title:n.title||"Sports Story",meta:n.category||"NEWS",href:n.url||"news.html?id="+encodeURIComponent(n.id||"")}));
  videos.forEach(v=>items.push({type:"MEDIA",title:v.title||"Sports Video",meta:v.type||"VIDEO",href:"video.html?id="+encodeURIComponent(v.id)}));
  box.innerHTML='<div class="integrated35Hero"><div><small>SPORTS 35.0 • UNIVERSAL STREAM</small><h2>EVERYTHING SPORTS. ONE FEED.</h2><p>Games, stories and media connected to your Sports personalization.</p></div><a href="sports-profile.html">PROFILE</a></div><div class="integrated35List">'+(items.length?items.map(x=>'<a href="'+esc(x.href)+'" class="integrated35Item"><span>'+esc(x.type)+'</span><b>'+esc(x.title)+'</b><em>'+esc(x.meta)+'</em></a>').join(""):'<p class="integrated35Empty">Follow teams or leagues to build your universal Sports stream.</p>')+'</div>';
}


// SPORTS 34.0 — UNIVERSAL SPORTS NEWS & STORY CENTER
function renderSportsNewsCenter(){
  const box=$("#sportsNewsCenter");if(!box||!SportsState.ready)return;
  const f=Favorites.get(), teamIds=new Set(f.teams||[]), playerIds=new Set(f.players||[]), leagueIds=new Set(f.leagues||[]);
  const all=(SportsState.data.news||[]);
  const selectedNews=all.filter(n=>SportsState.selectedLeague==="all"||n.leagueId===SportsState.selectedLeague);
  const personalized=selectedNews.filter(n=>leagueIds.has(n.leagueId)||teamIds.has(n.teamId)||playerIds.has(n.playerId));
  const feed=(personalized.length?personalized:selectedNews).slice(0,10);
  box.innerHTML='<div class="news34Hero"><div><small>SPORTS 34.0 • NEWS & STORIES</small><h2>SPORTS NEWS CENTER</h2><p>Headlines and stories connected to your leagues, teams and players.</p></div><a href="home.html">SPORTS HOME</a></div>'+
  '<div class="news34Grid">'+(feed.length?feed.map(n=>'<a class="news34Card" href="'+(n.url?esc(n.url):"news.html?id="+encodeURIComponent(n.id||""))+'"><span>'+esc(n.category||"SPORTS")+'</span><h3>'+esc(n.title||"Untitled Story")+'</h3><p>'+esc(n.summary||"Sports story")+'</p><em>'+esc(n.date||"LATEST")+'</em></a>').join(""):'<div class="news34Empty">NEWS FEED READY — Connect a live news source or add stories to data/news.json.</div>')+'</div>';
}


// SPORTS 33.0 — UNIVERSAL SPORTS FEED
function renderUniversalSportsFeed(){
  const box=$("#sportsUniversalFeed");if(!box||!SportsState.ready)return;
  const f=Favorites.get(), followedTeams=new Set(f.teams||[]), followedLeagues=new Set(f.leagues||[]), followedPlayers=new Set(f.players||[]);
  const games=SportsState.data.games.filter(g=>SportsState.selectedLeague==="all"||g.leagueId===SportsState.selectedLeague).filter(g=>followedLeagues.has(g.leagueId)||followedTeams.has(g.homeTeamId)||followedTeams.has(g.awayTeamId));
  const live=games.filter(g=>["LIVE","IN PROGRESS","HALFTIME"].includes(String(g.status||"").toUpperCase()));
  const upcoming=games.filter(g=>!["FINAL","LIVE","IN PROGRESS","HALFTIME"].includes(String(g.status||"").toUpperCase())).slice(0,5);
  const players=SportsState.data.players.filter(p=>followedPlayers.has(p.id)).slice(0,5);
  const videos=selected(SportsState.data.videos).slice(0,5);
  const game=g=>'<a class="feed33Game" href="game.html?id='+encodeURIComponent(g.id)+'"><span>'+esc(g.status||"GAME")+'</span><b>'+esc(getTeam(g.awayTeamId)?.short||"AWY")+' @ '+esc(getTeam(g.homeTeamId)?.short||"HME")+'</b><em>'+esc(g.time||"TBD")+'</em></a>';
  box.innerHTML='<div class="feed33Hero"><div><small>SPORTS 33.0 • UNIVERSAL FEED</small><h2>YOUR SPORTS FEED</h2><p>One stream for the games, players, teams, leagues and media you follow.</p></div><a href="sports-profile.html">PROFILE</a></div>'+
  '<div class="feed33Stream"><section><h3>LIVE NOW</h3>'+(live.length?live.map(game).join(""):'<p>No followed games are live right now.</p>')+'</section>'+
  '<section><h3>UP NEXT</h3>'+(upcoming.length?upcoming.map(game).join(""):'<p>Follow teams or leagues to build your feed.</p>')+'</section>'+
  '<section><h3>FOLLOWED PLAYERS</h3>'+(players.length?players.map(p=>'<a class="feed33Player" href="player.html?id='+encodeURIComponent(p.id)+'"><b>'+esc(p.name)+'</b><span>'+esc(p.position||"PLAYER")+' • '+esc(leagueName(p.leagueId))+'</span></a>').join(""):'<p>No followed players yet.</p>')+'</section>'+
  '<section><h3>MEDIA</h3>'+(videos.length?videos.map(v=>'<a class="feed33Video" href="video.html?id='+encodeURIComponent(v.id)+'"><b>'+esc(v.title)+'</b><span>'+esc(v.type||"VIDEO")+'</span></a>').join(""):'<p>No media available for this selection.</p>')+'</section></div>';
}


// SPORTS 32.0 — UNIVERSAL SPORTS HOME INTELLIGENCE
function renderHomeIntelligence(){
  const box=$("#sportsHomeIntelligence");if(!box||!SportsState.ready)return;
  const f=Favorites.get(), games=SportsState.data.games, league=SportsState.selectedLeague;
  const followedTeams=new Set(f.teams||[]), followedPlayers=(f.players||[]).map(id=>getPlayer(id)).filter(Boolean);
  const followedLeagues=new Set(f.leagues||[]);
  const relevant=g=>{
    if(league!=="all"&&g.leagueId===league)return true;
    if(followedLeagues.has(g.leagueId))return true;
    return followedTeams.has(g.homeTeamId)||followedTeams.has(g.awayTeamId);
  };
  const pool=games.filter(relevant), live=pool.filter(g=>["LIVE","IN PROGRESS","HALFTIME"].includes(String(g.status||"").toUpperCase()));
  const upcoming=pool.filter(g=>!["FINAL","LIVE","IN PROGRESS","HALFTIME"].includes(String(g.status||"").toUpperCase())).slice(0,6);
  const media=selected(SportsState.data.videos).slice(0,4);
  const card=g=>'<a class="homeIntelGame" href="game.html?id='+encodeURIComponent(g.id)+'"><span>'+esc(g.status||"UP NEXT")+'</span><b>'+esc(getTeam(g.awayTeamId)?.short||"AWY")+' @ '+esc(getTeam(g.homeTeamId)?.short||"HME")+'</b><em>'+esc(g.time||"TBD")+'</em></a>';
  box.innerHTML='<div class="homeIntelHero"><div><small>SPORTS 32.0 • HOME INTELLIGENCE</small><h2>BUILT AROUND YOUR SPORTS</h2><p>Your followed teams, players and leagues now shape the information surfaced on Sports Home.</p></div><a href="sports-profile.html">OPEN PROFILE</a></div>'+
  '<div class="homeIntelMetrics"><div><b>'+pool.length+'</b><span>PERSONAL GAMES</span></div><div><b>'+live.length+'</b><span>LIVE</span></div><div><b>'+followedPlayers.length+'</b><span>FOLLOWED PLAYERS</span></div><div><b>'+media.length+'</b><span>MEDIA</span></div></div>'+
  '<div class="homeIntelGrid"><section><h3>LIVE & UP NEXT</h3>'+(live.concat(upcoming).length?live.concat(upcoming).map(card).join(""):'<p>No personalized games yet. Follow teams or leagues to build your feed.</p>')+'</section>'+
  '<section><h3>YOUR PLAYERS</h3>'+(followedPlayers.length?followedPlayers.slice(0,6).map(p=>'<a class="homeIntelPlayer" href="player.html?id='+encodeURIComponent(p.id)+'"><b>'+esc(p.name)+'</b><span>'+esc(p.position||"PLAYER")+' • '+esc(leagueName(p.leagueId))+'</span></a>').join(""):'<p>Follow players to personalize this space.</p>')+'</section></div>';
}

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



// SPORTS 25.0 — UNIVERSAL FAVORITES & FOLLOWING
const Favorites={
  key:"crowrulesSportsFavorites",
  get(){try{return JSON.parse(localStorage.getItem(this.key))||{leagues:[],teams:[],players:[]}}catch(e){return{leagues:[],teams:[],players:[]}}},
  save(v){localStorage.setItem(this.key,JSON.stringify(v));},
  toggle(type,id){const v=this.get();v[type]=v[type]||[];const i=v[type].indexOf(id);i>=0?v[type].splice(i,1):v[type].push(id);this.save(v);refreshUniversalLayer();renderFavorites();}
};
function isFav(type,id){return Favorites.get()[type]?.includes(id)}
function renderFavorites(){
  const box=$("#sportsFavorites");if(!box||!SportsState.ready)return;
  const f=Favorites.get(),items=[];
  f.leagues.forEach(id=>{const x=SportsState.data.leagues.find(v=>v.id===id);if(x)items.push({type:"leagues",id,label:x.name})});
  f.teams.forEach(id=>{const x=team(id);if(x)items.push({type:"teams",id,label:x.name})});
  f.players.forEach(id=>{const x=SportsState.data.players.find(v=>v.id===id);if(x)items.push({type:"players",id,label:x.name})});
  box.innerHTML=items.length?'<span>FOLLOWING</span>'+items.map(x=>'<button type="button" data-fav-type="'+esc(x.type)+'" data-fav-id="'+esc(x.id)+'">★ '+esc(x.label)+'</button>').join(""):'<span>FOLLOWING</span><em>No favorites yet — follow teams, players or leagues from their pages.</em>';
  box.querySelectorAll("button").forEach(b=>b.onclick=()=>{const t=b.dataset.favType,id=b.dataset.favId;window.location.href=t==="teams"?"team.html?id="+encodeURIComponent(id):t==="players"?"player.html?id="+encodeURIComponent(id):"league.html?league="+encodeURIComponent(id)});
}
function favoriteButton(type,id,label){
  return '<button type="button" class="favoriteButton '+(isFav(type,id)?"isFavorite":"")+'" onclick="Favorites.toggle(\''+type+'\',\''+esc(id)+'\')">'+(isFav(type,id)?"★ FOLLOWING":"☆ FOLLOW "+esc(label).toUpperCase())+'</button>';
}







// SPORTS 31.0 — UNIVERSAL SPORTS PERSONALIZATION ENGINE
const Personalization={
  apply(){
    const f=Favorites.get(), league=SportsState.selectedLeague;
    document.body.dataset.personalized="true";
    const favLeague=f.leagues?.[0];
    const target=league==="all"&&favLeague?favLeague:league;
    if(target&&target!=="all"){
      const sel=$("#leagueSelector"); if(sel&&sel.value!==target){sel.value=target;SportsState.selectedLeague=target;}
    }
    renderPersonalizationBar();
  }
};
function renderPersonalizationBar(){
  const box=$("#sportsPersonalization");if(!box||!SportsState.ready)return;
  const f=Favorites.get(), favTeams=(f.teams||[]).map(id=>getTeam(id)).filter(Boolean);
  const favPlayers=(f.players||[]).map(id=>getPlayer(id)).filter(Boolean);
  const favLeague=(f.leagues||[]).map(id=>SportsState.data.leagues.find(x=>x.id===id)).filter(Boolean)[0];
  box.innerHTML='<span>SPORTS 31.0 • PERSONALIZED</span><b>'+esc(favLeague?.name||"ALL SPORTS")+'</b><i></i><em>'+favTeams.length+' TEAMS</em><em>'+favPlayers.length+' PLAYERS</em><a href="sports-profile.html">PROFILE</a>';
}

// SPORTS 30.0 — UNIVERSAL SPORTS PROFILE
function renderSportsProfile(){
  const box=$("#sportsProfile"); if(!box||!SportsState.ready)return;
  const f=Favorites.get(), n=SportsNotifications.get();
  const user=SportsIdentity.state.user, member=SportsIdentity.state.status==="MEMBER";
  const leagues=f.leagues.map(id=>SportsState.data.leagues.find(x=>x.id===id)).filter(Boolean);
  const teams=f.teams.map(id=>getTeam(id)).filter(Boolean);
  const players=f.players.map(id=>getPlayer(id)).filter(Boolean);
  box.innerHTML='<div class="profile30Hero"><div class="profile30Avatar">'+esc(member?(user.email||"C").charAt(0).toUpperCase():"G")+'</div><div><small>SPORTS 30.0 • UNIVERSAL PROFILE</small><h1>'+esc(member?(user.email||"CROW MEMBER"):"CROW GUEST")+'</h1><p>'+esc(member?"Connected to the Universal CrowRules identity.":"Sign in to connect your Sports experience to your CrowRules account.")+'</p></div><a class="profile30Button" href="https://crowrulesentertainment-oss.github.io/crowspace/'+(member?"profile.html":"login.html")+'">'+(member?"OPEN CROWSPACE PROFILE":"SIGN IN")+'</a></div>'+
  '<div class="profile30Metrics"><div><b>'+f.leagues.length+'</b><span>LEAGUES</span></div><div><b>'+f.teams.length+'</b><span>TEAMS</span></div><div><b>'+f.players.length+'</b><span>PLAYERS</span></div><div><b>'+ (n.enabled?"ON":"OFF")+'</b><span>NOTIFICATIONS</span></div></div>'+
  '<div class="profile30Grid"><section><h2>FOLLOWED LEAGUES</h2>'+(leagues.length?leagues.map(x=>'<a href="league.html?league='+encodeURIComponent(x.id)+'">'+esc(x.name)+'</a>').join(""):'<em>No followed leagues yet.</em>')+'</section>'+
  '<section><h2>FOLLOWED TEAMS</h2>'+(teams.length?teams.map(x=>'<a href="team.html?id='+encodeURIComponent(x.id)+'">'+esc(x.name)+'</a>').join(""):'<em>No followed teams yet.</em>')+'</section>'+
  '<section><h2>FOLLOWED PLAYERS</h2>'+(players.length?players.map(x=>'<a href="player.html?id='+encodeURIComponent(x.id)+'">'+esc(x.name)+'</a>').join(""):'<em>No followed players yet.</em>')+'</section>'+
  '<section><h2>SPORTS COMMAND</h2><div class="profile30Actions"><a href="home.html">DASHBOARD</a><a href="scores.html">LIVE SCORES</a><a href="stats.html">STATISTICS</a><a href="videos.html">MEDIA</a><a href="pickem.html">PICK ’EM</a></div></section></div>';
}

// SPORTS 29.0 — UNIVERSAL SPORTS IDENTITY & PROFILE
const SportsIdentity={
  key:"crowrulesSportsIdentity",
  state:{status:"GUEST",user:null},
  async init(){
    try{
      const supabase=window.supabase;
      const client=window.supabaseClient||window.CROW_SUPABASE_CLIENT||null;
      if(client?.auth?.getUser){
        const {data}=await client.auth.getUser();
        if(data?.user)this.state={status:"MEMBER",user:data.user};
      }
    }catch(e){}
    renderIdentity();
  }
};
function renderIdentity(){
  const chip=$("#sportsIdentity");if(!chip)return;
  chip.innerHTML=SportsIdentity.state.status==="MEMBER"
    ? '<i></i><span>MEMBER</span><b>'+esc(SportsIdentity.state.user?.email||"CROW MEMBER")+'</b>'
    : '<i></i><span>ACCOUNT</span><b>GUEST</b>';
}

// SPORTS 28.0 — UNIVERSAL SPORTS MEMBER DASHBOARD
function renderMemberDashboard(){
  const box=$("#sportsMemberDashboard");if(!box||!SportsState.ready)return;
  const f=Favorites.get(), n=SportsNotifications.get(), games=SportsState.data.games;
  const followed=games.filter(g=>(f.teams||[]).includes(g.homeTeamId)||(f.teams||[]).includes(g.awayTeamId));
  const live=followed.filter(g=>["LIVE","IN PROGRESS","HALFTIME"].includes(String(g.status||"").toUpperCase()));
  const players=(f.players||[]).map(id=>SportsState.data.players.find(p=>p.id===id)).filter(Boolean);
  const media=selected(SportsState.data.videos).slice(0,4);
  box.innerHTML='<div class="memberHero"><div><small>SPORTS 28.0 • MEMBER COMMAND CENTER</small><h2>YOUR SPORTS UNIVERSE</h2><p>Favorites, activity, notifications, stats and media in one connected dashboard.</p></div><a class="memberAccount" href="https://crowrulesentertainment-oss.github.io/crowspace/login.html">ACCOUNT • GUEST</a></div>'+
  '<div class="memberMetrics"><div><b>'+f.teams.length+'</b><span>FOLLOWED TEAMS</span></div><div><b>'+f.players.length+'</b><span>FOLLOWED PLAYERS</span></div><div><b>'+f.leagues.length+'</b><span>FOLLOWED LEAGUES</span></div><div><b>'+live.length+'</b><span>LIVE NOW</span></div></div>'+
  '<div class="memberGrid"><a href="#sportsActivityCenter"><b>ACTIVITY</b><span>'+followed.length+' followed games</span></a><a href="scores.html"><b>LIVE SCORES</b><span>'+live.length+' live games</span></a><a href="#sportsNotificationsCenter"><b>NOTIFICATIONS</b><span>'+(n.enabled?"ENABLED":"DISABLED")+'</span></a><a href="stats.html"><b>STATISTICS</b><span>'+players.length+' followed players</span></a><a href="videos.html"><b>MEDIA</b><span>'+media.length+' selected-league videos</span></a><a href="pickem.html"><b>PICK ’EM</b><span>Enter the challenge</span></a></div>';
}

// SPORTS 27.0 — UNIVERSAL SPORTS ACTIVITY CENTER
function renderActivityCenter(){
  const box=$("#sportsActivityCenter");if(!box||!SportsState.ready)return;
  const f=Favorites.get(), games=SportsState.data.games.filter(g=>
    (SportsState.selectedLeague==="all"||g.leagueId===SportsState.selectedLeague) &&
    ((f.teams||[]).includes(g.homeTeamId)||(f.teams||[]).includes(g.awayTeamId)));
  const live=games.filter(g=>["LIVE","IN PROGRESS","HALFTIME"].includes(String(g.status||"").toUpperCase()));
  const upcoming=games.filter(g=>!["FINAL","LIVE","IN PROGRESS","HALFTIME"].includes(String(g.status||"").toUpperCase())).slice(0,5);
  const finished=games.filter(g=>String(g.status||"").toUpperCase()==="FINAL").slice(-5).reverse();
  const favPlayers=(f.players||[]).map(id=>SportsState.data.players.find(p=>p.id===id)).filter(Boolean).slice(0,5);
  const gameCard=g=>'<a class="activityGame" href="game.html?id='+encodeURIComponent(g.id)+'"><span>'+esc(g.status||"GAME")+'</span><b>'+esc(getTeam(g.awayTeamId)?.short||"AWY")+' @ '+esc(getTeam(g.homeTeamId)?.short||"HME")+'</b><em>'+esc(g.time||"TBD")+'</em></a>';
  box.innerHTML='<div class="activityMetrics"><div><b>'+games.length+'</b><span>FOLLOWED GAMES</span></div><div><b>'+live.length+'</b><span>LIVE</span></div><div><b>'+favPlayers.length+'</b><span>FOLLOWED PLAYERS</span></div></div>'+
    '<div class="activityGrid">'+
    '<section class="activityPanel"><h3>LIVE & UPCOMING</h3>'+((live.concat(upcoming)).length?(live.concat(upcoming)).map(gameCard).join(""):'<p class="activityEmpty">No followed games currently available.</p>')+'</section>'+
    '<section class="activityPanel"><h3>RECENT RESULTS</h3>'+(finished.length?finished.map(gameCard).join(""):'<p class="activityEmpty">No recent followed results.</p>')+'</section>'+
    '<section class="activityPanel"><h3>FOLLOWED PLAYERS</h3>'+(favPlayers.length?favPlayers.map(p=>'<a class="activityPlayer" href="player.html?id='+encodeURIComponent(p.id)+'"><b>'+esc(p.name)+'</b><span>'+esc(p.position||"PLAYER")+' • '+esc(leagueName(p.leagueId))+'</span></a>').join(""):'<p class="activityEmpty">Follow players to build your personal Sports activity.</p>')+'</section>'+
    '</div>';
}

// SPORTS 26.0 — UNIVERSAL SPORTS NOTIFICATIONS CENTER
const SportsNotifications={
  key:"crowrulesSportsNotifications",
  get(){try{return JSON.parse(localStorage.getItem(this.key))||{enabled:true,scoreChanges:true,upcoming:true,live:true}}catch(e){return{enabled:true,scoreChanges:true,upcoming:true,live:true}}},
  save(v){localStorage.setItem(this.key,JSON.stringify(v));},
  relevantGames(){
    const f=Favorites.get(),ids=new Set([...(f.teams||[])]);
    return SportsState.data.games.filter(g=>SportsState.selectedLeague==="all"||g.leagueId===SportsState.selectedLeague).filter(g=>ids.has(g.homeTeamId)||ids.has(g.awayTeamId));
  },
  toggle(k){const v=this.get();v[k]=!v[k];this.save(v);renderNotificationCenter();}
};
function renderNotificationCenter(){
  const box=$("#sportsNotificationsCenter");if(!box||!SportsState.ready)return;
  const n=SportsNotifications.get(), games=SportsNotifications.relevantGames();
  const live=games.filter(g=>["LIVE","IN PROGRESS","HALFTIME"].includes(String(g.status||"").toUpperCase()));
  const upcoming=games.filter(g=>!["FINAL","LIVE","IN PROGRESS","HALFTIME"].includes(String(g.status||"").toUpperCase())).slice(0,8);
  box.innerHTML='<div class="notificationSettings"><b>NOTIFICATION PREFERENCES</b><button type="button" onclick="SportsNotifications.toggle(\'enabled\')">'+(n.enabled?"● ENABLED":"○ DISABLED")+'</button><button type="button" onclick="SportsNotifications.toggle(\'live\')">'+(n.live?"● LIVE":"○ LIVE")+'</button><button type="button" onclick="SportsNotifications.toggle(\'upcoming\')">'+(n.upcoming?"● UPCOMING":"○ UPCOMING")+'</button></div>'+
    '<div class="notificationSummary"><span>FOLLOWED GAMES</span><b>'+games.length+'</b><span>LIVE</span><b>'+live.length+'</b></div>'+
    (n.enabled&&n.live&&live.length?'<div class="notificationList"><h3>LIVE NOW</h3>'+live.map(g=>notificationGame(g)).join("")+'</div>':'')+
    (n.enabled&&n.upcoming&&upcoming.length?'<div class="notificationList"><h3>UP NEXT</h3>'+upcoming.map(g=>notificationGame(g)).join("")+'</div>':'')+
    (!games.length?'<div class="notificationEmpty">Follow teams to receive personalized Sports notifications.</div>':'');
}
function notificationGame(g){
  const a=getTeam(g.awayTeamId),h=getTeam(g.homeTeamId);
  return '<a class="notificationGame" href="game.html?id='+encodeURIComponent(g.id)+'"><span>'+esc(g.status||"UP NEXT")+'</span><b>'+esc(a?.short||"AWY")+' @ '+esc(h?.short||"HME")+'</b><em>'+esc(g.time||"TBD")+'</em></a>';
}

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
  const [leagues,teams,players,games,standings,schedule,videos,pickem,news]=await Promise.all([
    loadJSON("data/leagues.json"),loadJSON("data/teams.json"),loadJSON("data/players.json"),loadJSON("data/games.json"),
    loadJSON("data/standings.json"),loadJSON("data/schedule.json"),loadJSON("data/videos.json"),loadJSON("data/pickem.json"),loadJSON("data/news.json").catch(()=>({news:[]}))
  ]);
  SportsState.data={leagues:leagues.leagues||[],teams:teams.teams||[],players:players.players||[],games:games.games||[],standings:standings.standings||[],schedule:schedule.schedule||[],videos:videos.videos||[],pickem,news:news.news||[]};
  SportsState.ready=true; SportsIdentity.init(); buildShell(); Personalization.apply(); render(); renderFavorites(); renderNotificationCenter(); renderActivityCenter(); renderMemberDashboard(); renderIdentity(); renderSportsProfile(); renderPersonalizationBar(); renderHomeIntelligence(); renderUniversalSportsFeed(); renderSportsNewsCenter(); renderActivityCenter(); renderGameDayDashboard(); renderRankings(); renderScheduleCenter(); renderScoreboardCenter(); renderStatsCenter(); renderDetail(); renderPickDetail(); renderDiscoverySearch(); renderUniversalSearch36();
}
function league(){return SportsState.data.leagues.find(x=>x.id===SportsState.selectedLeague)||null}
function selected(arr){return SportsState.selectedLeague==="all"?arr:arr.filter(x=>x.leagueId===SportsState.selectedLeague)}
function team(id){return SportsState.data.teams.find(x=>x.id===id)}
function leagueName(id){return SportsState.data.leagues.find(x=>x.id===id)?.name||id}
function setLeague(id){
  SportsState.selectedLeague=id||"all"; localStorage.setItem("crowrulesSportsLeague",SportsState.selectedLeague);
  const u=new URL(location.href); if(id&&id!=="all")u.searchParams.set("league",id);else u.searchParams.delete("league");
  history.replaceState({}, "", u); buildShell(); render(); renderFavorites(); renderGameDayDashboard(); renderRankings(); renderScheduleCenter(); renderScoreboardCenter(); renderStatsCenter(); renderDetail(); renderPickDetail(); renderDiscoverySearch(); renderNotificationCenter(); renderActivityCenter(); renderMemberDashboard(); renderPersonalizationBar();
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
  if(!document.querySelector("#sportsFavorites")){
    const fav=document.createElement("div"); fav.id="sportsFavorites"; fav.className="sportsFavorites";
    top.insertAdjacentElement("afterend",fav);
  }
  if(!document.querySelector("#sportsControls")){
    const controls=document.createElement("div"); controls.id="sportsControls"; controls.className="sportsControls";
    controls.innerHTML='<button class="commandButton" id="sportsCommand" type="button" aria-expanded="false">COMMAND <span>⌄</span></button><label class="srOnly" for="leagueSelect">League</label><select id="leagueSelect" aria-label="Global league selector"></select><label class="srOnly" for="sportsSearch">Search sports</label><input id="sportsSearch" type="search" placeholder="SEARCH SPORTS" autocomplete="off"><button class="notificationButton" id="sportsNotifications" type="button" aria-label="Sports notifications"><span>◉</span><b>0</b></button><a class="accountChip" id="sportsIdentity" href="https://crowrulesentertainment-oss.github.io/crowspace/login.html" aria-label="Universal CrowRules account"><i></i><span>ACCOUNT</span><b>GUEST</b></a><div class="commandMenu" id="commandMenu"><div class="commandTitle">SPORTS COMMAND</div><a href="home.html">SPORTS HOME</a><a href="scores.html">LIVE SCORES</a><a href="schedule.html">SCHEDULE</a><a href="standings.html">STANDINGS</a><a href="rankings.html">RANKINGS</a><a href="stats.html">STATISTICS</a><a href="teams.html">TEAMS</a><a href="players.html">PLAYERS</a><a href="videos.html">MEDIA</a><a href="pickem.html">PICK ’EM</a></div>';
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
  renderFavorites(); renderNotificationCenter();
  if(!document.querySelector("#sportsDataState")){
    const state=document.createElement("div"); state.id="sportsDataState"; state.className="sportsDataState";
    state.innerHTML='<span>SPORTS 24.0 API GATEWAY</span><b id="sportsApiStatus" class="apiStatus">API GATEWAY STATIC</b><i></i><span id="sportsApiSource">STATIC JSON</span><i></i><b id="liveEngineStatus">○ LIVE FEED READY</b><span id="liveEngineSync">WAITING FOR LIVE PROVIDER</span>';
    top.insertAdjacentElement("afterend",state);
  }
  if(!document.querySelector("#sportsPersonalization")){
    const bar=document.createElement("div"); bar.id="sportsPersonalization"; bar.className="sportsPersonalization";
    top.insertAdjacentElement("afterend",bar);
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
  box.innerHTML='<div class="leagueHero"><div><small>LEAGUE INTELLIGENCE CENTER</small><h2>'+esc(l.name)+'</h2>'+favoriteButton('leagues',l.id,l.name)<p>'+esc(l.sport||"SPORT")+' • '+esc(l.level)+' • '+esc(l.status||"ACTIVE")+'</p></div><div class="leagueCounts"><b>'+gs.length+'</b><span>GAMES</span><b>'+ts.length+'</b><span>TEAMS</span><b>'+ps.length+'</b><span>PLAYERS</span></div></div>'+
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
  box.innerHTML='<div class="playerHero"><div><small>PLAYER INTELLIGENCE CENTER</small><h2>'+esc(p.name)+'</h2>'+favoriteButton('players',p.id,p.name)<p>'+esc(p.position||"PLAYER")+' • '+(pt?link("team.html",pt.id,pt.name):"TEAM DATA PENDING")+'</p></div><div class="playerStat"><span>'+esc(p.statLabel||"PRIMARY STAT")+'</span><strong>'+esc(p.statValue||"—")+'</strong></div></div>'+
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
    '<div><small>TEAM INTELLIGENCE CENTER</small><h2>'+esc(t.name)+'</h2>'+favoriteButton('teams',t.id,t.short||t.name)<p>'+esc(leagueName(t.leagueId))+' • '+esc(t.short||"TEAM")+'</p></div>'+
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
