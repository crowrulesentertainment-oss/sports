import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.119.0";
const ORIGINS=new Set(["https://crowrulesentertainment-oss.github.io","http://localhost:4173","http://127.0.0.1:4173"]);
const SPORTS=new Set(["nfl","nba","mlb","nhl","cfb","cbb","wcb","wnba","soccer","golf","nascar","mma","f1"]);
const FEEDS=new Set(["scores","stats","odds","fantasy","projections","pbp","news"]);
const ENDPOINT=/^[A-Za-z][A-Za-z0-9]{0,79}(?:\/[A-Za-z0-9._-]{1,64}){0,3}$/;
const PARAMS=new Set(["date","season","week","team","player","game","seasonType","month","competition"]);
const hdr=(o:string)=>({"content-type":"application/json","access-control-allow-origin":o,"access-control-allow-methods":"POST, OPTIONS","access-control-allow-headers":"authorization, apikey, content-type, x-client-info","vary":"Origin"});
const out=(v:unknown,s:number,o:string)=>new Response(JSON.stringify(v),{status:s,headers:hdr(o)});
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
 let body:{action?:string};try{body=await req.json()}catch{return out({error:"invalid_json"},400,origin)}
 if(!["status","run"].includes(body.action||""))return out({error:"unsupported_action"},400,origin);
 const {data:jobs,error:jobError}=await db.from("cr_sports_sync_jobs").select("id,sport,feed,endpoint,parameters,is_enabled,interval_seconds").order("sport").order("feed");
 if(jobError)return out({error:"admin_access_required_or_sync_schema_missing"},403,origin);
 if(body.action==="status"){
  const {data:runs}=await db.from("cr_sports_sync_runs").select("id,job_id,status,data_mode,records_received,error_code,error_message,started_at,finished_at").order("started_at",{ascending:false}).limit(25);
  return out({ok:true,enabledJobs:(jobs||[]).filter(j=>j.is_enabled).length,jobs:jobs||[],recentRuns:runs||[],productionReady:Deno.env.get("SPORTSDATAIO_DATA_MODE")==="production"&&!!Deno.env.get("SPORTSDATAIO_API_KEY")},200,origin)
 }
 const key=Deno.env.get("SPORTSDATAIO_API_KEY")||"",production=Deno.env.get("SPORTSDATAIO_DATA_MODE")==="production";
 if(!production||!key){
  const {error}=await db.from("cr_sports_sync_runs").insert({status:"blocked",data_mode:"FREE_TRIAL_BLOCKED",triggered_by:user.user.id,error_code:"PRODUCTION_FEED_NOT_CONFIGURED",error_message:"Free Trial responses are scrambled and excluded from production synchronization.",details:{enabled_jobs:(jobs||[]).filter(j=>j.is_enabled).length,provider:"SportsDataIO"}});
  if(error)return out({error:"admin_access_required_or_audit_write_failed"},403,origin);
  return out({ok:false,blocked:true,trialDataBlocked:true,error:"production_feed_not_configured",message:"No provider calls were made. Configure a licensed production entitlement and server-side secrets before enabling sync."},409,origin)
 }
 const enabled=(jobs||[]).filter(j=>j.is_enabled);if(!enabled.length)return out({ok:true,message:"No sync jobs are enabled.",processed:0},200,origin);
 let processed=0,failed=0;
 for(const job of enabled){
  const started=new Date().toISOString();
  const {data:run,error:runError}=await db.from("cr_sports_sync_runs").insert({job_id:job.id,status:"running",data_mode:"PRODUCTION",triggered_by:user.user.id}).select("id").single();
  if(runError||!run){failed++;continue}
  try{
   if(!SPORTS.has(job.sport)||!FEEDS.has(job.feed)||!ENDPOINT.test(job.endpoint)||job.endpoint.includes(".."))throw Error("Invalid provider job configuration.");
   const q=new URLSearchParams(),p=job.parameters&&typeof job.parameters==="object"?job.parameters:{};
   for(const [k,v] of Object.entries(p)){if(!PARAMS.has(k)||v===null||v===undefined)continue;const s=String(v);if(s.length>48||!/^[A-Za-z0-9._-]+$/.test(s)||(k==="date"&&!/^\d{4}-\d{2}-\d{2}$/.test(s)))throw Error("Invalid provider parameter: "+k);q.set(k,s)}
   const endpoint="https://api.sportsdata.io/v3/"+job.sport+"/"+job.feed+"/json/"+job.endpoint+(q.size?"?"+q.toString():"");
   const response=await fetch(endpoint,{headers:{"Ocp-Apim-Subscription-Key":key,"Accept":"application/json"},signal:AbortSignal.timeout(15000)});
   if(!response.ok)throw Error("Provider returned HTTP "+response.status);
   const payload=await response.json(),canonical=JSON.stringify(payload);
   const hash=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(canonical)).then(x=>Array.from(new Uint8Array(x)).map(v=>v.toString(16).padStart(2,"0")).join(""));
   const {error:snapshotError}=await db.from("cr_sports_provider_snapshots").upsert({sport:job.sport,feed:job.feed,endpoint:job.endpoint,payload,data_mode:"PRODUCTION",retrieved_at:started,source_hash:hash},{onConflict:"sport,feed,endpoint"});
   if(snapshotError)throw Error("Private provider snapshot write failed.");
   await db.from("cr_sports_sync_runs").update({status:"success",records_received:Array.isArray(payload)?payload.length:1,finished_at:new Date().toISOString(),details:{sport:job.sport,feed:job.feed,endpoint:job.endpoint}}).eq("id",run.id);
   await db.from("cr_sports_sync_jobs").update({last_started_at:started,last_completed_at:new Date().toISOString(),last_status:"success"}).eq("id",job.id);processed++
  }catch(e){const message=e instanceof Error?e.message:"Unknown sync error";await db.from("cr_sports_sync_runs").update({status:"error",error_code:"SYNC_FAILED",error_message:message,finished_at:new Date().toISOString()}).eq("id",run.id);await db.from("cr_sports_sync_jobs").update({last_started_at:started,last_completed_at:new Date().toISOString(),last_status:"error"}).eq("id",job.id);failed++}
 }
 return out({ok:failed===0,processed,failed,publicPublishing:false,message:"Provider payloads remain private. Reviewed sport-specific normalizers are required before publication to scores, schedules, standings or statistics."},failed?207:200,origin)
});