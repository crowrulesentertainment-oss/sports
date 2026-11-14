/* CrowRules Sports V8 public team and league directories */
(async()=>{
"use strict";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const cfg=window.CROWRULES_SUPABASE||{},api=window.supabase;
if(!api?.createClient||!cfg.url||!cfg.publishableKey)return;
const db=api.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const page=document.body.dataset.page||"",params=new URLSearchParams(location.search);
const [tr,lr,mr]=await Promise.all([
db.from("cr_sports_teams").select("id,name,slug,sport,level,abbreviation,nickname,city,region,country,logo_url,website_url,description,primary_color,secondary_color").eq("is_active",true).eq("is_published",true).order("name").limit(1000),
db.from("cr_sports_leagues").select("id,name,slug,sport,level,region,country,season_label,logo_url,website_url,description").eq("is_active",true).eq("is_published",true).order("name").limit(1000),
db.from("cr_sports_league_teams").select("id,team_id,league_id,season_label,division,conference").eq("is_active",true).limit(3000)
]);
const teams=tr.data||[],leagues=lr.data||[],members=mr.data||[];
const img=(url)=>url?'<img loading="lazy" src="'+esc(url)+'" alt="">':"";
const empty=(s)=>'<div class="v8-empty">'+esc(s)+'</div>';
const teamCard=t=>'<a class="v8-directory-card" href="teams.html?team='+encodeURIComponent(t.slug)+'">'+img(t.logo_url)+'<small>'+esc(t.sport)+' · '+esc(t.level.replaceAll("_"," "))+'</small><h3>'+esc(t.name)+'</h3><p>'+esc([t.city,t.region,t.country].filter(Boolean).join(", "))+'</p><small>VIEW TEAM PROFILE ↗</small></a>';
const leagueCard=l=>'<a class="v8-directory-card" href="leagues.html?league='+encodeURIComponent(l.slug)+'">'+img(l.logo_url)+'<small>'+esc(l.sport)+' · '+esc(l.level.replaceAll("_"," "))+'</small><h3>'+esc(l.name)+'</h3><p>'+esc([l.region,l.country,l.season_label].filter(Boolean).join(" · "))+'</p><small>VIEW COMPETITION ↗</small></a>';
function addLeagueNav(){const nav=document.querySelector("#nav");if(nav&&!nav.querySelector('[href="leagues.html"]')){const a=document.createElement("a");a.href="leagues.html";a.textContent="Leagues";nav.insertBefore(a,nav.querySelector('[href="teams.html"]')?.nextSibling||null);}}
addLeagueNav();
if(page==="teams"||page==="pnw"){
const container=document.querySelector(".teamgrid");
if(container){const selected=params.get("team");if(selected){const t=teams.find(x=>x.slug===selected);const related=members.filter(m=>m.team_id===t?.id).map(m=>({m,l:leagues.find(l=>l.id===m.league_id)})).filter(x=>x.l);container.outerHTML=t?'<article class="v8-detail">'+img(t.logo_url)+'<small>'+esc(t.sport)+' · '+esc(t.level.replaceAll("_"," "))+'</small><h2>'+esc(t.name)+'</h2><p>'+esc([t.city,t.region,t.country].filter(Boolean).join(", "))+'</p><p>'+esc(t.description)+'</p>'+(t.website_url?'<p><a href="'+esc(t.website_url)+'" target="_blank" rel="noopener">Official website ↗</a></p>':"")+'<h3>League participation</h3>'+ (related.length?related.map(x=>'<p><a href="leagues.html?league='+encodeURIComponent(x.l.slug)+'">'+esc(x.l.name)+'</a> · '+esc(x.m.season_label||"Season not specified")+'</p>').join(""):empty("No published league participation yet"))+'<p><a href="teams.html">← All teams</a></p></article>':empty("This team profile is not currently published.");}
else{container.innerHTML=teams.length?teams.map(teamCard).join(""):empty(tr.error?"Team directory is temporarily unavailable.":"No published teams yet. Check back as CrowRules adds teams.");const input=document.querySelector("#teamSearch");if(input)input.oninput=()=>{const q=input.value.toLowerCase();container.innerHTML=teams.filter(t=>[t.name,t.sport,t.level,t.city,t.region,t.country].join(" ").toLowerCase().includes(q)).map(teamCard).join("")||empty("No teams match your search.");};}}
}
if(page==="leagues"){
const main=document.querySelector("main"),selected=params.get("league"),league=leagues.find(x=>x.slug===selected);
if(main){main.innerHTML='<section class="section"><div class="wrap v8-public"><header class="v8-public-head"><small>CROWRULES SPORTS · COMPETITION DIRECTORY</small><h2>'+(selected?"LEAGUE PROFILE":"LEAGUES & COMPETITIONS")+'</h2><p>Explore published professional, college, high-school, amateur and international competitions.</p></header>'+(selected?(league?img(league.logo_url)+'<article class="v8-detail"><small>'+esc(league.sport)+' · '+esc(league.level.replaceAll("_"," "))+'</small><h2>'+esc(league.name)+'</h2><p>'+esc([league.region,league.country,league.season_label].filter(Boolean).join(" · "))+'</p><p>'+esc(league.description)+'</p>'+(league.website_url?'<p><a href="'+esc(league.website_url)+'" target="_blank" rel="noopener">Official website ↗</a></p>':"")+'<h3>Participating teams</h3>'+(()=>{const a=members.filter(m=>m.league_id===league.id).map(m=>({m,t:teams.find(t=>t.id===m.team_id)})).filter(x=>x.t);return a.length?a.map(x=>'<p><a href="teams.html?team='+encodeURIComponent(x.t.slug)+'">'+esc(x.t.name)+'</a> · '+esc(x.m.season_label||"Season not specified")+'</p>').join(""):empty("No published teams for this competition yet")})()+'<p><a href="leagues.html">← All leagues</a></p></article>':empty("This competition is not currently published.")):'<input id="v8-league-search" class="v8-public-search" placeholder="Search leagues, sports, regions or seasons…"><div id="v8-league-grid" class="v8-directory-grid">'+(leagues.length?leagues.map(leagueCard).join(""):empty(lr.error?"League directory is temporarily unavailable.":"No published leagues yet."))+'</div>')+'</div></section>';const input=document.querySelector("#v8-league-search"),grid=document.querySelector("#v8-league-grid");if(input&&grid)input.oninput=()=>{const q=input.value.toLowerCase();grid.innerHTML=leagues.filter(l=>[l.name,l.sport,l.level,l.region,l.country,l.season_label].join(" ").toLowerCase().includes(q)).map(leagueCard).join("")||empty("No leagues match your search.");};}
}
})();
