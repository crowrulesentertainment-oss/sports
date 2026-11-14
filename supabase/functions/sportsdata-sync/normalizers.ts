export const SPORTS = ["nfl","nba","mlb","nhl","cfb","cbb","wcb","wnba","soccer","golf","nascar","mma","f1"] as const;
export type Sport = typeof SPORTS[number];
export type NormalizedGame = {
  sport: Sport; provider_event_id: string; league: string; event_name: string;
  home_team: string; away_team: string; starts_at: string | null; status: string;
  home_score: number | null; away_score: number | null; venue: string;
  source_url: string | null; provider_updated_at: string | null; notes: string;
};
export type NormalizeResult = { games: NormalizedGame[]; rejected: number };
const key = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g,"");
function get(obj: any, names: string[]): unknown {
  if (!obj || typeof obj !== "object") return undefined;
  const entries = Object.entries(obj);
  for (const name of names) {
    const found = entries.find(([k]) => key(k) === key(name));
    if (found && found[1] !== null && found[1] !== undefined && found[1] !== "") return found[1];
  }
  return undefined;
}
function nested(obj:any, paths:string[]): unknown {
  for (const path of paths) {
    let value: any = obj;
    for (const part of path.split(".")) value = value && typeof value === "object" ? get(value,[part]) : undefined;
    if ((typeof value === "string" || typeof value === "number") && value !== "") return value;
  }
  return undefined;
}
function text(v:unknown):string { return typeof v === "string" || typeof v === "number" ? String(v).trim() : ""; }
function score(v:unknown):number|null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v); return Number.isFinite(n) && Number.isInteger(n) && n >= 0 ? n : null;
}
function date(v:unknown):string|null {
  if (!v) return null; const d = new Date(String(v)); return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
function status(v:unknown):string {
  const raw=text(v); if (!raw) return "unknown";
  const s=raw.toLowerCase().replace(/[\s_-]+/g,"");
  if (["inprogress","live","halftime","half","overtime","extratime","period1","period2","period3","period4","quarter1","quarter2","quarter3","quarter4","shootout"].includes(s)) return "live";
  if (["final","complete","completed","closed","gameover"].includes(s) || /^final/.test(s)) return "final";
  if (["scheduled","pregame","notstarted","upcoming"].includes(s)) return "scheduled";
  if (s.includes("postpon")) return "postponed";
  if (s.includes("cancel")) return "cancelled";
  if (s.includes("suspend")) return "suspended";
  if (s.includes("delay")) return "delayed";
  return raw.slice(0,48);
}
function unwrap(payload:any):any[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  for (const k of ["Games","Events","games","events","Data","data","Results","results"]) {
    const v=get(payload,[k]); if (Array.isArray(v)) return v;
  }
  return [payload];
}
function safeUrl(v:unknown):string|null {
  const s=text(v); if (!s) return null;
  try { const u=new URL(s); return ["https:","http:"].includes(u.protocol) ? u.toString() : null; } catch { return null; }
}
export function normalizeGames(payload:unknown, sport:Sport):NormalizeResult {
  const seen=new Set<string>(), games:NormalizedGame[]=[]; let rejected=0;
  for (const raw of unwrap(payload)) {
    if (!raw || typeof raw !== "object") { rejected++; continue; }
    const id=text(nested(raw,["GameID","GlobalGameID","GameKey","EventID","EventId","Id","id"]));
    const home=text(nested(raw,["HomeTeamName","HomeTeam","Home.Name","HomeTeamDisplayName","Home"]));
    const away=text(nested(raw,["AwayTeamName","AwayTeam","Away.Name","AwayTeamDisplayName","Away"]));
    if (!id || !home || !away || seen.has(id)) { rejected++; continue; }
    seen.add(id);
    const start=date(nested(raw,["DateTime","DateTimeUTC","StartTime","StartDate","Date"]));
    const rawStatus=nested(raw,["Status","GameStatus","EventStatus","State"]);
    const homeScore=score(nested(raw,["HomeTeamScore","HomeScore","ScoreHome","Home.Points"]));
    const awayScore=score(nested(raw,["AwayTeamScore","AwayScore","ScoreAway","Away.Points"]));
    const league=text(nested(raw,["League","LeagueName","Competition","Tournament"])) || sport.toUpperCase();
    const venue=text(nested(raw,["Stadium.Name","Venue.Name","Venue","Stadium","Location"])) || "Venue not listed";
    const updated=date(nested(raw,["Updated","UpdatedAt","LastUpdated","LastUpdatedUtc"]));
    const source=safeUrl(nested(raw,["GameCenterURL","GameUrl","URL","Url","EventURL"]));
    const normalizedStatus=status(rawStatus);
    games.push({
      sport,provider_event_id:id,league,event_name:away+" at "+home,home_team:home,away_team:away,
      starts_at:start,status:normalizedStatus,home_score:homeScore,away_score:awayScore,venue,
      source_url:source,provider_updated_at:updated,
      notes:"Imported from SportsDataIO. Provider status: "+(text(rawStatus)||"not supplied")+"."
    });
  }
  return {games,rejected};
}
