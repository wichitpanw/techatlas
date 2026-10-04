// Opaque-origin frame: learner code cannot access the host DOM or localStorage.
// Network/resource requests are blocked by its CSP. Pure JS runs in a timed worker.
function sandboxRuntime(payload) {
  const send=data=>parent.postMessage({type:'programming-result',token:payload.token,...data},'*');
  const app=document.querySelector('#app'), info=document.querySelector('#measure');
  let logs=[];
  const check=(name,pass)=>({name,pass});
  const report=checks=>send({checks,logs});
  window.addEventListener('error',event=>send({error:event.message,checks:[],logs}));
  try {
    if(payload.mode==='html') {
      app.innerHTML=payload.code;
      const headings=app.querySelectorAll('h1'),items=[...app.querySelectorAll('ul > li')];
      report([check('หัวเรื่อง h1: งานของฉัน',headings.length===1&&headings[0].textContent.trim()==='งานของฉัน'),check('รายการสองข้อเรียงตามโจทย์',items.length===2&&items[0].textContent.trim()==='อ่านหนังสือ'&&items[1].textContent.trim()==='ฝึกเขียนเว็บ')]);
    } else if(payload.mode==='css') {
      app.innerHTML='<article class="task-card"><h1>งานของฉัน</h1><p>อ่านหนังสือ</p><button>ยังไม่เสร็จ</button></article>';
      const style=document.createElement('style');style.textContent=payload.code;document.head.append(style);
      const card=app.querySelector('.task-card');
      const measure=()=>{
        const s=getComputedStyle(card),width=card.getBoundingClientRect().width;
        if(width===0)return; // A newly attached iframe can be laid out after its script runs.
        info.textContent=`กว้างรวม Border ${width}px · ${s.boxSizing} · padding ${s.paddingTop} · border ${s.borderTopWidth} · margin ${s.marginTop}`;
        report([check('Border box กว้าง 240px',s.boxSizing==='border-box'&&Math.abs(width-240)<.5),check('Padding ทุกด้าน 16px',['paddingTop','paddingRight','paddingBottom','paddingLeft'].every(k=>s[k]==='16px')),check('Border ทุกด้าน 2px และ Margin ทุกด้าน 12px',['borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth'].every(k=>s[k]==='2px')&&['marginTop','marginRight','marginBottom','marginLeft'].every(k=>s[k]==='12px'))]);
      };
      new ResizeObserver(measure).observe(card);
      requestAnimationFrame(measure);
      card.addEventListener('pointerenter',()=>card.style.outline='3px dashed #f2ac46');card.addEventListener('pointerleave',()=>card.style.outline='');
    } else if(payload.mode==='dom') {
      app.innerHTML='<h1>งานของฉัน</h1><p>อ่านหนังสือ</p><p id="status">ยังไม่เสร็จ</p><button id="done">เสร็จแล้ว</button>';
      const consoleProxy={log:(...values)=>{logs.push(values.map(String).join(' '));send({logs,checks:[],waiting:true});}};
      new Function('document','console',payload.code)(document,consoleProxy);
      const button=app.querySelector('#done');
      button.addEventListener('click',()=>{setTimeout(()=>{logs.push('click → #status: '+app.querySelector('#status').textContent);report([check('หลังคลิกสถานะเป็น ทำเสร็จแล้ว',app.querySelector('#status').textContent.trim()==='ทำเสร็จแล้ว')]);},0);});
      send({logs:['ติดตั้งโค้ดแล้ว · คลิกปุ่ม เสร็จแล้ว ในหน้าแอป'],checks:[],waiting:true});
    } else {
      const workerCode=`onmessage=({data})=>{try{const runs=data.scores.map(score=>{const logs=[];const console={log:(...v)=>logs.push(v.map(String).join(' '))};const values=new Function('console','score',data.code+'\\n;return {taskName:typeof taskName===\"undefined\"?null:taskName,taskCount:typeof taskCount===\"undefined\"?null:taskCount,done:typeof done===\"undefined\"?null:done};')(console,score);return {score,logs,values};});postMessage({runs});}catch(e){postMessage({error:e.name+': '+e.message});}}`;
      const url=URL.createObjectURL(new Blob([workerCode],{type:'text/javascript'})),worker=new Worker(url);
      const timeout=setTimeout(()=>{worker.terminate();URL.revokeObjectURL(url);send({error:'หยุดหลัง 2 วินาที ตรวจลูปหรือคำสั่งที่ไม่จบ',checks:[],logs:[]});},2000);
      worker.onerror=event=>{clearTimeout(timeout);worker.terminate();URL.revokeObjectURL(url);send({error:event.message,checks:[],logs:[]});};
      worker.onmessage=({data})=>{
        clearTimeout(timeout);worker.terminate();URL.revokeObjectURL(url);
        if(data.error){send({error:data.error,checks:[],logs:[]});return;}
        const sample=data.runs[0];logs=sample.logs;
        app.textContent='Console จากโค้ดที่รันจริง';
        if(payload.mode==='variables'){
          const cards=document.createElement('div');cards.className='values';
          for(const [name,value]of Object.entries(sample.values)){const box=document.createElement('article');box.textContent=name+' → '+String(value)+' · '+typeof value;cards.append(box);}app.append(cards);
          report([check('ข้อความและชนิดตามโจทย์',logs.join('\n')==='อ่านหนังสือ 3 false\nnumber'),check('ค่าตัวแปร taskCount เป็น number 3',sample.values.taskCount===3)]);
        }else report(data.runs.map(run=>check('คะแนน '+run.score+' → '+(run.score>=80?'A':run.score>=70?'B':'C'),run.logs.join('\n')===(run.score>=80?'A':run.score>=70?'B':'C'))));
      };
      worker.postMessage({code:payload.code,scores:payload.mode==='conditions'?[payload.score,69,70,79,80]:[0]});
    }
  }catch(error){send({error:error.name+': '+error.message,checks:[],logs});}
}
export function sandboxDocument({mode,code,score=75,token}) {
  const payload=JSON.stringify({mode,code,score,token}).replace(/</g,'\\u003c');
  return `<!doctype html><html lang="th"><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline'; worker-src blob:; img-src data:; connect-src 'none'; form-action 'none'; base-uri 'none'"><style>body{font:16px/1.7 system-ui;color:#183340;background:#f7fafb;padding:20px;margin:0}h1{font-size:24px}button{padding:10px 16px;background:#168b79;color:white;border:0;border-radius:6px;cursor:pointer}.task-card{background:#e5f4ef}.values{display:flex;flex-wrap:wrap;gap:12px}.values article{padding:16px;border:1px solid #168b79;border-radius:8px;background:#e5f4ef}#measure{font-size:13px;margin-top:16px;overflow-wrap:anywhere}</style><main id="app"></main><p id="measure"></p><script>(${sandboxRuntime.toString()})(${payload})<\/script></html>`;
}
