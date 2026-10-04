const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export async function onRequest({request,env}) {
  if(!['GET','POST'].includes(request.method))return json({error:'method_not_allowed'},405);
  if(!env.VISITS_DB)return json({error:'counter_not_configured'},503);
  try {
    if(request.method==='GET'){
      const row=await env.VISITS_DB.prepare('SELECT total FROM visit_totals WHERE id = 1').first();
      return json({total:row?.total??0,metric:'sessions'});
    }
    const origin=new URL(request.url).origin;
    if(request.headers.get('Origin')!==origin)return json({error:'same_origin_required'},403);
    if(!request.headers.get('Content-Type')?.startsWith('application/json'))return json({error:'json_required'},415);
    if(Number(request.headers.get('Content-Length')||0)>512)return json({error:'too_large'},413);
    const body=await request.text();if(body.length>512)return json({error:'too_large'},413);
    let data;try{data=JSON.parse(body);}catch{return json({error:'invalid_json'},400);}
    if(typeof data?.token!=='string'||!/^\w{8}-\w{4}-4\w{3}-[89ab]\w{3}-\w{12}$/i.test(data.token)||!/^[0-9a-f-]+$/i.test(data.token))return json({error:'invalid_token'},400);
    const results=await env.VISITS_DB.batch([
      env.VISITS_DB.prepare("DELETE FROM visit_sessions WHERE created_at < datetime('now', '-30 days')"),
      env.VISITS_DB.prepare('INSERT INTO visit_sessions (token) VALUES (?) ON CONFLICT(token) DO NOTHING').bind(data.token),
      env.VISITS_DB.prepare('SELECT total FROM visit_totals WHERE id = 1'),
    ]);
    return json({total:results[2].results[0].total,metric:'sessions'});
  }catch{return json({error:'counter_unavailable'},503);}
}
