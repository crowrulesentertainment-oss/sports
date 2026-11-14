// CrowRules Sports V4 — secure, read-only SportsDataIO Global API proxy.
// Keep SPORTSDATAIO_GLOBAL_API_KEY in Supabase Edge Function secrets only.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const API_BASE = "https://global.sportsdata.io";
const ALLOWED_ORIGINS = new Set([
  "https://crowrulesentertainment-oss.github.io",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
]);
const SCORE_SPORTS = new Set(["soccer", "basketball", "baseball", "am-football", "ice-hockey", "tennis"]);
const cache = new Map<string, { until: number; body: string; status: number }>();
const hits = new Map<string, number[]>();

function json(body: unknown, status = 200, origin = "") {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "GET, OPTIONS",
      "access-control-allow-headers": "apikey, content-type, x-client-info, authorization",
      "vary": "Origin",
      "x-content-type-options": "nosniff",
    },
  });
}
function validSlug(v: string | null): v is string {
  return !!v && /^[a-z0-9-]{1,64}$/.test(v);
}
function validDate(v: string | null): v is string {
  if (!v || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(v + "T00:00:00Z");
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < 60_000);
  if (recent.length >= 30) { hits.set(ip, recent); return true; }
  recent.push(now); hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (!times.some(t => now - t < 60_000)) hits.delete(key);
  }
  return false;
}
Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  if (req.method === "OPTIONS") {
    if (!ALLOWED_ORIGINS.has(origin)) return new Response(null, { status: 403 });
    return new Response(null, { status: 204, headers: {
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "GET, OPTIONS",
      "access-control-allow-headers": "apikey, content-type, x-client-info, authorization",
      "access-control-max-age": "86400",
      "vary": "Origin",
    }});
  }
  if (req.method !== "GET") return json({ error: "method_not_allowed" }, 405, origin);
  if (!ALLOWED_ORIGINS.has(origin)) return json({ error: "origin_not_allowed" }, 403, origin);
  const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return json({ error: "rate_limited", retryAfterSeconds: 60 }, 429, origin);

  const key = Deno.env.get("SPORTSDATAIO_GLOBAL_API_KEY");
  if (!key) return json({ error: "provider_not_configured", message: "SportsDataIO Global API credentials have not been configured on the server." }, 503, origin);

  const incoming = new URL(req.url);
  const resource = incoming.searchParams.get("resource") || "sports";
  const sport = incoming.searchParams.get("sport");
  const competition = incoming.searchParams.get("competition");
  const date = incoming.searchParams.get("date");
  let path = "";
  let ttl = 30_000;

  if (resource === "sports") { path = "/sports"; ttl = 3_600_000; }
  else if (resource === "competitions" && validSlug(sport)) { path = `/${sport}/competitions`; ttl = 3_600_000; }
  else if (resource === "schedule" && validSlug(sport) && validSlug(competition) && validDate(date)) {
    path = `/${sport}/${competition}/event-schedules/by-date/${date}`; ttl = 60_000;
  } else if ((resource === "live" || resource === "final") && validSlug(sport) && validSlug(competition) && validDate(date)) {
    if (!SCORE_SPORTS.has(sport)) return json({ error: "scores_not_available_for_sport", message: "SportsDataIO Global API currently documents live/final score feeds for soccer, basketball, baseball, American football, ice hockey, and tennis. Schedules may still be available for this sport." }, 422, origin);
    path = resource === "live"
      ? `/${sport}/${competition}/event-results/live/by-date/${date}`
      : `/${sport}/${competition}/event-results/by-date/${date}`;
    ttl = resource === "live" ? 5_000 : 300_000;
  } else return json({ error: "invalid_request", message: "Use resource=sports, competitions, schedule, live, or final with the required sport, competition, and date parameters." }, 400, origin);

  const cacheKey = path;
  const cached = cache.get(cacheKey);
  if (cached && cached.until > Date.now()) {
    return new Response(cached.body, { status: cached.status, headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": `public, max-age=${Math.max(1, Math.floor((cached.until-Date.now())/1000))}`,
      "access-control-allow-origin": origin, "vary": "Origin",
      "x-crowrules-cache": "HIT",
    }});
  }

  try {
    const upstream = await fetch(API_BASE + path, {
      method: "GET",
      headers: { "Ocp-Apim-Subscription-Key": key, "Accept": "application/json" },
      signal: AbortSignal.timeout(12_000),
    });
    if (!upstream.ok) {
      const status = upstream.status === 401 || upstream.status === 403 ? 424 : upstream.status === 429 ? 429 : 502;
      return json({ error: "provider_request_failed", providerStatus: upstream.status,
        message: status === 424 ? "SportsDataIO credentials or subscription do not authorize this feed." : "SportsDataIO did not return a successful response." }, status, origin);
    }
    const payload = await upstream.json();
    if (!Array.isArray(payload)) return json({ error: "invalid_provider_payload" }, 502, origin);
    const body = JSON.stringify({ provider: "SportsDataIO Global API", resource, sport, competition, date, retrievedAt: new Date().toISOString(), data: payload });
    cache.set(cacheKey, { until: Date.now() + ttl, body, status: 200 });
    if (cache.size > 1000) for (const [k, v] of cache) if (v.until < Date.now()) cache.delete(k);
    return new Response(body, { status: 200, headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": `public, max-age=${Math.max(1, Math.floor(ttl/1000))}`,
      "access-control-allow-origin": origin, "vary": "Origin",
      "x-crowrules-cache": "MISS",
    }});
  } catch (error) {
    console.error("SportsDataIO upstream failure", error);
    return json({ error: "provider_unavailable", message: "The sports data provider could not be reached. Please retry shortly." }, 502, origin);
  }
});
