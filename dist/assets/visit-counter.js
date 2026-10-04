export async function initVisitCounter(){
  const count=document.querySelector('#visit-count');if(!count)return;
  // Production only. Local previews never add to the real public total.
  let token;
  if(location.hostname==='techatlas-aoh.pages.dev'){
    try {token=sessionStorage.getItem('techatlas-visit-session');if(!token){token=crypto.randomUUID();sessionStorage.setItem('techatlas-visit-session',token);}}catch{/* Read only when storage is disabled. */}
  }
  try{
    const response=await fetch('/api/visits',{method:token?'POST':'GET',headers:token?{'Content-Type':'application/json'}:{},body:token?JSON.stringify({token}):undefined,cache:'no-store',signal:AbortSignal.timeout(6000)});
    if(!response.ok)throw Error('counter unavailable');const data=await response.json();
    if(!Number.isSafeInteger(data.total)||data.total<0)throw Error('invalid total');
    count.textContent=data.total.toLocaleString('th-TH');
  }catch{count.textContent='ยังไม่พร้อม';}
}
