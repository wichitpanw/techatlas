const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
// No IP/user-agent identifiers. A global admission cap limits new-session churn,
// not all HTTP requests; an edge WAF is still needed for volumetric attacks.
export async function onRequest({request,env,waitUntil}) {
  if(!['GET','POST'].includes(request.method))return json({error:'method_not_allowed'},405);
  if(!env.VISITS_DB)return json({error:'counter_not_configured'},503);
  try {
    if(request.method==='GET'){
      const cache=globalThis.caches?.default;
      const key=new Request(new URL('/api/visits',request.url),{method:'GET'});
      const cached=await cache?.match(key);
      if(cached)return cached;
      const row=await env.VISITS_DB.prepare('SELECT total FROM visit_totals WHERE id = 1').first();
      const response=json({total:row?.total??0,metric:'sessions'});
      response.headers.set('Cache-Control','public, max-age=30');
      if(cache&&waitUntil)waitUntil(cache.put(key,response.clone()));
      return response;
    }
    const origin=new URL(request.url).origin;
    if(request.headers.get('Origin')!==origin)return json({error:'same_origin_required'},403);
    if(!request.headers.get('Content-Type')?.startsWith('application/json'))return json({error:'json_required'},415);
    if(Number(request.headers.get('Content-Length')||0)>512)return json({error:'too_large'},413);
    const reader=request.body?.getReader();let bytes=0,body='';
    if(reader){const decoder=new TextDecoder();for(;;){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>512){await reader.cancel();return json({error:'too_large'},413);}body+=decoder.decode(value,{stream:true});}body+=decoder.decode();}
    let data;try{data=JSON.parse(body);}catch{return json({error:'invalid_json'},400);}
    if(typeof data?.token!=='string'||!/^\w{8}-\w{4}-4\w{3}-[89ab]\w{3}-\w{12}$/i.test(data.token)||!/^[0-9a-f-]+$/i.test(data.token))return json({error:'invalid_token'},400);
    const known=await env.VISITS_DB.prepare("SELECT token FROM visit_sessions WHERE token = ? AND created_at >= datetime('now', '-30 days')").bind(data.token).first();
    if(known){const row=await env.VISITS_DB.prepare('SELECT total FROM visit_totals WHERE id = 1').first();return json({total:row?.total??0,metric:'sessions'});}
    const results=await env.VISITS_DB.batch([
      env.VISITS_DB.prepare("DELETE FROM visit_sessions WHERE token IN (SELECT token FROM visit_sessions WHERE created_at < datetime('now', '-30 days') ORDER BY created_at LIMIT CASE WHEN (SELECT cleaned_at FROM visit_maintenance WHERE id = 1) < datetime('now', '-1 day') THEN 1000 ELSE 0 END)"),
      env.VISITS_DB.prepare("UPDATE visit_maintenance SET cleaned_at = datetime('now') WHERE id = 1 AND cleaned_at < datetime('now', '-1 day')"),
      env.VISITS_DB.prepare("DELETE FROM visit_sessions WHERE token = ? AND created_at < datetime('now', '-30 days')").bind(data.token),
      env.VISITS_DB.prepare("INSERT INTO visit_sessions (token) SELECT ? WHERE (SELECT count(*) FROM visit_sessions WHERE created_at >= datetime('now', '-1 minute')) < 60 AND (SELECT CASE WHEN admission_day = date('now') THEN admitted_today ELSE 0 END FROM visit_maintenance WHERE id = 1) < 2000 ON CONFLICT(token) DO NOTHING").bind(data.token),
      env.VISITS_DB.prepare('SELECT total FROM visit_totals WHERE id = 1'),
      env.VISITS_DB.prepare('SELECT token FROM visit_sessions WHERE token = ?').bind(data.token),
    ]);
    if(!results[5].results.length){const response=json({error:'new_session_limit'},429);response.headers.set('Retry-After','60');return response;}
    return json({total:results[4].results[0].total,metric:'sessions'});
  }catch{return json({error:'counter_unavailable'},503);}
}
