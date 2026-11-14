import { assertEquals } from "jsr:@std/assert@1";
import { normalizeGames, SPORTS } from "./normalizers.ts";

Deno.test("normalizes a SportsDataIO-style game", () => {
  const result=normalizeGames([{GameID:123,DateTime:"2026-11-14T20:00:00Z",Status:"InProgress",HomeTeam:"SEA",AwayTeam:"SF",HomeTeamScore:17,AwayTeamScore:14,Stadium:{Name:"Lumen Field"},GameCenterURL:"https://example.com/game"}],"nfl");
  assertEquals(result.rejected,0);
  assertEquals(result.games[0].provider_event_id,"123");
  assertEquals(result.games[0].status,"live");
  assertEquals(result.games[0].home_score,17);
  assertEquals(result.games[0].venue,"Lumen Field");
});
Deno.test("rejects records without stable IDs or both team names", () => {
  const result=normalizeGames([{HomeTeam:"SEA",AwayTeam:"SF"},{GameID:2,HomeTeam:"SEA"}],"nfl");
  assertEquals(result.games.length,0); assertEquals(result.rejected,2);
});
Deno.test("supports every configured sport code and wrapped payloads", () => {
  for (const sport of SPORTS) {
    const result=normalizeGames({Games:[{GameID:sport+"-1",HomeTeam:"Home",AwayTeam:"Away",Status:"Scheduled"}]},sport);
    assertEquals(result.games[0].sport,sport);
  }
});
Deno.test("does not invent scores, times, or status", () => {
  const result=normalizeGames([{GameID:9,HomeTeam:"Home",AwayTeam:"Away"}],"nba");
  assertEquals(result.games[0].home_score,null);
  assertEquals(result.games[0].away_score,null);
  assertEquals(result.games[0].starts_at,null);
  assertEquals(result.games[0].status,"unknown");
});
Deno.test("supports nested Home and Away objects", () => {
  const result=normalizeGames([{EventId:"x",Home:{Name:"Home"},Away:{Name:"Away"}}],"soccer");
  assertEquals(result.games[0].home_team,"Home");
  assertEquals(result.games[0].away_team,"Away");
});
