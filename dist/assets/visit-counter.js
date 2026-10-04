export async function initVisitCounter(){
  const count=document.querySelector('#visit-count');if(!count)return;
  // Production only. Local previews never add to the real public total.
  let token,registered=false;
  if(location.hostname==='techatlas-aoh.pages.dev'){
    try {token=sessionStorage.getItem('techatlas-visit-session');if(!token){token=crypto.randomUUID();sessionStorage.setItem('techatlas-visit-session',token);}const accepted=JSON.parse(sessionStorage.getItem('techatlas-visit-accepted')||'null');registered=accepted?.token===token&&Date.now()-accepted.time>=0&&Date.now()-accepted.time<30*86400000;}catch{/* Read only when storage is disabled. */}
  }
  try{
    const registering=!!token&&!registered;
    let response=await fetch('/api/visits',{method:registering?'POST':'GET',headers:registering?{'Content-Type':'application/json'}:{},body:registering?JSON.stringify({token}):undefined,signal:AbortSignal.timeout(6000)});
    const accepted=registering&&response.ok;
    if(registering&&response.status===429)response=await fetch('/api/visits',{signal:AbortSignal.timeout(6000)});
    if(!response.ok)throw Error('counter unavailable');const data=await response.json();
    if(!Number.isSafeInteger(data.total)||data.total<0)throw Error('invalid total');
    if(accepted){try{sessionStorage.setItem('techatlas-visit-accepted',JSON.stringify({token,time:Date.now()}));}catch{}}
    count.textContent=data.total.toLocaleString('th-TH');
  }catch{count.textContent='ยังไม่พร้อม';}
}
