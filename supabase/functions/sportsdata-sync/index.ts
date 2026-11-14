import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.119.0";
import { normalizeGames, SPORTS } from "./normalizers.ts";
const ORIGINS=new Set(["https://crowrulesentertainment-oss.github.io","http://localhost:4173","http://127.0.0.1:4173"]);
const FEEDS=new Set(["scores","stats","odds","fantasy","projections","pbp","news"]);
const ENDPOINT=/^[A-Za-z][A-Za-z0-9]{0,79}(?:\/[A-Za-z0-9._-]{1,64}){0,3}$/;
const PARAMS=new Set(["date","season","week","team","player","game","seasonType","month","competition"]);
const hdr=(o:string)=>({"content-type":"application/json","access-control-allow-origin":o,"access-control-allow-methods":"POST, OPTIONS","access-control-allow-headers":"authorization, apikey, content-type, x-client-info","vary":"Origin"});
const out=(v:unknown,s:number,o:string)=>new Response(JSON.stringify(v),{status:s,headers:hdr(o)});
const hash=async(v:unknown)=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(JSON.stringify(v))))).map(x=>x.toString(16).padStart(2,"0")).join("");
Deno.serve(async(req:Request)=>{
 const origin=req.headers.get("origin")||"";
 if(req.method==="OPTIONS")return ORIGINS.has(origin)?new Response(null,{status:204,headers:hdr(origin)}):new Response(null,{status:403});
 if(!ORIGINS.has(origin))return new Response("origin_not_allowed",{status:403});
 if(req.method!=="POST")return out({error:"method_not_allowed"},405,origin);
 const authorization=req.headers.get("authorization")||"";
 if(!authorization.startsWith("Bearer "))return out({error:"user_session_required"},401,origin);
 const url=Deno.env.get("SUPABASE_URL")||"",anon=Deno.env.get("SUPABASE_ANON_KEY")||Deno.env.get("SUPABASE_PUBLISHABLE_KEY")||"";
 if(!url||!anon)return out({error:"supabase_configuration_missing"},503,origin);
 const db=createClient(url,anon,{global:{headers:{Authorization:authorization}},auth:{persistSession:false,autoRefreshToken:false}});
 const {data:user,error:userError}=await db.auth.getUser();
 if(userError||!user.user)return out({error:"invalid_user_session"},401,origin);
 let body:{action?:string;dueOnly?:boolean};try{body=await req.json()}catch{return out({error:"invalid_json"},400,origin)}
 if(!["status","run"].includes(body.action||""))return out({error:"unsupported_action"},400,origin);
 const {data:jobs,error:jobError}=await db.from("cr_sports_sync_jobs").select("id,sport,feed,endpoint,parameters,is_enabled,interval_seconds,schedule_enabled,next_run_at,consecutive_failures").order("sport").order("feed");
 if(jobError)return out({error:"admin_access_required_or_sync_schema_missing"},403,origin);
 const production=Deno.env.get("SPORTSDATAIO_DATA_MODE")==="production"&&!!Deno.env.get("SPORTSDATAIO_API_KEY");
 if(body.action==="status"){
  const {data:runs}=await db.from("cr_sports_sync_runs").select("id,job_id,status,data_mode,records_received,records_normalized,records_rejected,error_code,error_message,started_at,finished_at").order("started_at",{ascending:false}).limit(25);
  return out({ok:true,enabledJobs:(jobs||[]).filter(j=>j.is_enabled).length,jobs:jobs||[],recentRuns:runs||[],productionReady:production,schedulerReady:false,normalizationReady:true},200,origin);
 }
 const now=Date.now(),enabled=(jobs||[]).filter(j=>j.is_enabled&&(!body.dueOnly||(j.schedule_enabled&&(!j.next_run_at||new Date(j.next_run_at).getTime()<=now))));
 if(!enabled.length)return out({ok:true,processed:0,message:body.dueOnly?"No scheduled jobs are due.":"No sync jobs are enabled.",schedulerReady:false},200,origin);
 const key=Deno.env.get("SPORTSDATAIO_API_KEY")||"";
 if(!production){
  let auditFailed=false;
  for(const job of enabled){
   const attemptedAt=new Date().toISOString(),nextRun=job.schedule_enabled?new Date(now+Math.max(300,Number(job.interval_seconds)||900)*1000).toISOString():null;
   const {error}=await db.from("cr_sports_sync_runs").insert({job_id:job.id,status:"blocked",data_mode:"FREE_TRIAL_BLOCKED",triggered_by:user.user.id,error_code:"PRODUCTION_FEED_NOT_CONFIGURED",error_message:"Free Trial responses are scrambled and excluded from production synchronization.",details:{sport:job.sport,feed:job.feed,provider:"SportsDataIO",provider_calls:0}});
   if(error)auditFailed=true;
   await db.from("cr_sports_sync_jobs").update({last_attempt_at:attemptedAt,last_status:"blocked",next_run_at:nextRun}).eq("id",job.id);
  }
  if(auditFailed)return out({error:"admin_access_required_or_audit_write_failed"},403,origin);
  return out({ok:false,blocked:true,trialDataBlocked:true,error:"production_feed_not_configured",processed:0,blockedJobs:enabled.length,message:"No provider calls were made. Free Trial data remains blocked."},409,origin);
 }
 let processed=0,failed=0,totalNormalized=0,totalRejected=0;
 for(const job of enabled){
  const started=new Date().toISOString();
  const {data:run,error:runError}=await db.from("cr_sports_sync_runs").insert({job_id:job.id,status:"running",data_mode:"PRODUCTION",triggered_by:user.user.id}).select("id").single();
  if(runError||!run){failed++;continue}
  let normalizedCount=0,rejectedCount=0;
  try{
   if(!(SPORTS as readonly string[]).includes(job.sport)||!FEEDS.has(job.feed)||!ENDPOINT.test(job.endpoint)||job.endpoint.includes(".."))throw Error("Invalid provider job configuration.");
   const q=new URLSearchParams(),p=job.parameters&&typeof job.parameters==="object"?job.parameters:{};
   for(const [k,v] of Object.entries(p)){if(!PARAMS.has(k)||v===null||v===undefined)continue;const s=String(v);if(s.length>48||!/^[A-Za-z0-9._-]+$/.test(s)||(k==="date"&&!/^\d{4}-\d{2}-\d{2}$/.test(s)))throw Error("Invalid provider parameter: "+k);q.set(k,s)}
   const endpoint="https://api.sportsdata.io/v3/"+job.sport+"/"+job.feed+"/json/"+job.endpoint+(q.size?"?"+q.toString():"");
   const response=await fetch(endpoint,{headers:{"Ocp-Apim-Subscription-Key":key,"Accept":"application/json"},signal:AbortSignal.timeout(15000)});
   if(!response.ok)throw Error("Provider returned HTTP "+response.status);
   const payload=await response.json(),retrievedAt=new Date().toISOString(),sourceHash=await hash(payload);
   const {error:snapshotError}=await db.from("cr_sports_provider_snapshots").upsert({sport:job.sport,feed:job.feed,endpoint:job.endpoint,payload,data_mode:"PRODUCTION",retrieved_at:retrievedAt,source_hash:sourceHash},{onConflict:"sport,feed,endpoint"});
   if(snapshotError)throw Error("Private provider snapshot write failed.");
   if(job.feed==="scores"){
    const result=normalizeGames(payload,job.sport as typeof SPORTS[number]);rejectedCount=result.rejected;
    const ids=result.games.map(g=>g.provider_event_id);
    let existing=new Map<string,string>();
    if(ids.length){
     const found=await db.from("cr_sports_events").select("id,provider_event_id").eq("source_provider","sportsdataio").eq("sport",job.sport).in("provider_event_id",ids);
     if(found.error)throw Error("Could not inspect existing provider events: "+found.error.message);
     existing=new Map((found.data||[]).map((r:any)=>[r.provider_event_id,r.id]));
    }
    for(const game of result.games){
     const values={sport:game.sport,league:game.league,event_name:game.event_name,home_team:game.home_team,away_team:game.away_team,starts_at:game.starts_at,status:game.status,home_score:game.home_score,away_score:game.away_score,venue:game.venue,source_url:game.source_url,notes:game.notes,source_provider:"sportsdataio",provider_event_id:game.provider_event_id,provider_updated_at:game.provider_updated_at,last_synced_at:retrievedAt};
     const existingId=existing.get(game.provider_event_id);
     const write=existingId
      ? await db.from("cr_sports_events").update(values).eq("id",existingId)
      : await db.from("cr_sports_events").insert({...values,is_published:false});
     if(write.error)throw Error("Event write failed for provider event "+game.provider_event_id+": "+write.error.message);
     normalizedCount++;
    }
   }
   const finished=new Date().toISOString();
   const {error:runUpdateError}=await db.from("cr_sports_sync_runs").update({status:"success",records_received:Array.isArray(payload)?payload.length:1,records_normalized:normalizedCount,records_rejected:rejectedCount,finished_at:finished,details:{sport:job.sport,feed:job.feed,endpoint:job.endpoint,publicPublishing:false,normalized:normalizedCount,rejected:rejectedCount}}).eq("id",run.id);
   if(runUpdateError)throw Error("Could not finalize sync audit record.");
   await db.from("cr_sports_sync_jobs").update({last_started_at:started,last_attempt_at:started,last_completed_at:finished,last_status:"success",consecutive_failures:0,last_error_at:null,next_run_at:job.schedule_enabled?new Date(Date.now()+Math.max(300,Number(job.interval_seconds)||900)*1000).toISOString():null}).eq("id",job.id);
   processed++;totalNormalized+=normalizedCount;totalRejected+=rejectedCount;
  }catch(e){
   const message=e instanceof Error?e.message:"Unknown sync error";
   await db.from("cr_sports_sync_runs").update({status:"error",error_code:"SYNC_FAILED",error_message:message,records_normalized:normalizedCount,records_rejected:rejectedCount,finished_at:new Date().toISOString()}).eq("id",run.id);
   const failures=Math.min(100,Number(job.consecutive_failures||0)+1),backoff=Math.min(86400,300*Math.pow(2,Math.min(failures-1,8)));
   await db.from("cr_sports_sync_jobs").update({last_started_at:started,last_attempt_at:started,last_completed_at:new Date().toISOString(),last_status:"error",consecutive_failures:failures,last_error_at:new Date().toISOString(),next_run_at:job.schedule_enabled?new Date(Date.now()+backoff*1000).toISOString():null}).eq("id",job.id);
   failed++;
  }
 }
 return out({ok:failed===0,processed,failed,recordsNormalized:totalNormalized,recordsRejected:totalRejected,publicPublishing:false,schedulerReady:false,message:"Scores-feed records are normalized into unpublished CrowRules events. An authorized admin must review and publish them. A trusted server-side timer is still required for unattended runs."},failed?207:200,origin);
});
