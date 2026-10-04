import {sandboxDocument} from './programming-sandbox.js';
import {bindPythonEditor} from './python-editor.js';
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const journey=[
 ['Browser ขอหน้าเว็บ','GET /tasks → Server · เป็นเหตุการณ์จำลอง ไม่ได้เรียกเว็บภายนอก'],
 ['Server ส่ง HTML','200 OK · Browser สร้างโครงสร้างหัวเรื่อง รายการ และปุ่มจาก HTML'],
 ['Browser อ่าน CSS','ตกแต่งสี ช่องว่าง และขนาดของการ์ดงาน จากไฟล์ที่ HTML อ้างถึง'],
 ['Browser รัน JavaScript','ผูกเหตุการณ์ click กับปุ่ม · ในเว็บจริงเวลารันขึ้นกับตำแหน่ง script และ async/defer'],
 ['หน้าแอปพร้อมใช้งาน','โครงสร้าง + หน้าตา + พฤติกรรม · ทุกบทถัดไปมีโค้ดเริ่มต้นให้ ไม่ต้องเรียน Network/Python ก่อน'],
];
export function programmingPreview(l){
  const views={
    journey:'<div class="mini-flow"><i>Browser</i><b>⇄ HTTP</b><i>Server</i></div><small>200 OK · HTML → CSS → JS</small>',
    html:'<div class="mini-page"><b>งานของฉัน <em>h1</em></b><span>• อ่านหนังสือ <em>li</em></span><span>• ฝึกเขียนเว็บ <em>li</em></span></div>',
    css:'<div class="mini-margin">MARGIN<div class="mini-border">BORDER<div class="mini-padding">PADDING<div class="mini-content">CONTENT · 240px รวม Border</div></div></div></div>',
    dom:'<div class="mini-page"><b>งานของฉัน</b><span>ยังไม่เสร็จ → <em>ทำเสร็จแล้ว</em></span><i class="mini-button">click · เสร็จแล้ว</i></div>',
    variables:'<div class="mini-flow"><i>taskCount<br><b>2 → 3</b><small>number</small></i><i>done<br><b>false</b><small>boolean</small></i></div>',
    conditions:'<div class="mini-flow"><i>score<br><b>75</b></i><b>→</b><i>A / <strong>B</strong> / C<br><small>70 ≤ score &lt; 80</small></i></div>',
  };
  return `<div class="programming-preview preview-${l.mode}" role="img" aria-label="${escape(l.title)} · ตัวอย่างภาพประกอบจากโจทย์">${views[l.mode]}</div>`;
}
export function programmingSurface(l,draft={}){
  const mission=`<section class="python-mission"><p class="eyebrow">ภารกิจที่ต้องทำ</p><h3>${escape(l.goal)}</h3><ol>${l.steps.map(s=>`<li>${escape(s)}</li>`).join('')}</ol><details><summary>สิ่งที่ต้องเห็นเมื่อทำครบ</summary><pre>${escape(l.expected)}</pre></details></section>`;
  const feedback='<div class="question-box"><button class="hint" id="hint">ขอคำใบ้</button><button class="hint" id="program-solution">ดูตัวอย่างเฉลย</button><div class="feedback" id="feedback" aria-live="polite"></div><div id="program-checks"></div><pre id="program-answer" hidden></pre></div>';
  if(l.mode==='journey')return `${mission}<section class="program-journey"><p class="eyebrow">WEB REQUEST · แบบจำลอง</p><div class="journey-actors"><span>Browser</span><span>⇄ HTTP</span><span>Server</span></div><label>ไฟล์ที่ขอ <select id="program-path"><option>/tasks</option><option>/missing</option></select></label><button class="button small" id="program-open">เปิดหน้าเว็บจำลอง</button><button class="button light small" id="program-next" disabled>ขั้นถัดไป</button><div id="journey-result" aria-live="polite">กดเปิดหน้าเว็บ แล้วสังเกต Request และ Response</div><p>ไฟล์ไหนทำให้ปุ่มตอบสนองต่อการคลิก?</p><div class="choices">${['HTML','CSS','JavaScript'].map((x,i)=>`<button class="choice" data-web-answer="${i}">${x}</button>`).join('')}</div></section>${feedback}`;
  return `${mission}<section class="editor-wrap programming-editor"><div class="editor-bar"><span>${l.mode==='html'?'index.html':l.mode==='css'?'style.css':'app.js'}</span><span>LIVE WEB LAB</span></div><textarea class="editor" id="program-code" spellcheck="false" aria-label="โค้ด Programming ที่แก้ไขได้">${escape(draft.code??l.starter)}</textarea><div class="editor-actions"><button class="button small" id="program-run">▶ รันโค้ด</button><button class="button light small" id="program-reset">เริ่มโค้ดใหม่</button>${l.mode==='conditions'?'<label>คะแนน score <input id="program-score" type="number" min="0" max="100" value="75"></label>':''}</div></section><section class="program-browser"><div class="editor-bar"><span>หน้าต่างทดลอง · แยกจากเว็บไซต์หลัก</span><span>${l.mode==='dom'?'คลิกปุ่มในหน้านี้หลังรัน':'LIVE PREVIEW'}</span></div><div id="program-frame-slot"></div><pre id="program-console" aria-live="polite">กดรันโค้ดเพื่อดูผลจริง</pre><p class="notice">HTML/CSS แสดงผลจริง · JavaScript รันใน Sandbox · ไม่เชื่อมต่อระบบภายนอก บทนี้ยังไม่มีการไล่บรรทัด JavaScript อัตโนมัติ</p></section>${feedback}`;
}
export function initProgramming(l,{complete,saveDraft}){
  const feedback=document.querySelector('#feedback');let disposed=false,frame,token;
  document.querySelector('#program-solution').onclick=()=>{const block=document.querySelector('#program-answer');block.hidden=false;block.textContent=l.solution||'เปิด /tasks ดูให้ครบทุกขั้น แล้วเลือก JavaScript';};
  if(l.mode==='journey'){
    let index=-1,visited=false;
    const result=document.querySelector('#journey-result'),next=document.querySelector('#program-next');
    const draw=()=>{const [title,detail]=journey[index];result.innerHTML=`<strong>${index+1}/5 · ${escape(title)}</strong><p>${escape(detail)}</p>${index===4?'<article class="journey-task"><h3>งานของฉัน</h3><p>อ่านหนังสือ</p><button id="journey-done" class="button small">เสร็จแล้ว</button><span id="journey-status"> ยังไม่เสร็จ</span></article>':''}`;next.disabled=index===4;if(index===4){visited=true;result.querySelector('#journey-done').onclick=()=>result.querySelector('#journey-status').textContent=' ทำเสร็จแล้ว';}};
    document.querySelector('#program-open').onclick=()=>{visited=false;feedback.textContent='';if(document.querySelector('#program-path').value==='/missing'){index=-1;next.disabled=true;result.textContent='GET /missing → 404 Not Found · Server ไม่มีไฟล์นี้ เปลี่ยนเป็น /tasks แล้วลองใหม่';}else{index=0;draw();}};
    next.onclick=()=>{if(index>=0&&index<4){index++;draw();}};
    document.querySelectorAll('[data-web-answer]').forEach(button=>button.onclick=()=>{const pass=visited&&button.dataset.webAnswer==='2';feedback.className=pass?'feedback':'feedback bad';feedback.textContent=pass?'✓ ผ่าน · JavaScript ผูกเหตุการณ์กับปุ่ม ส่วน HTML/CSS จัดโครงสร้างและหน้าตา':!visited?'เปิด /tasks และดูให้ครบ 5 ขั้นก่อนตอบ':'ยังไม่ถูก ลองแยกโครงสร้าง หน้าตา และพฤติกรรม';if(pass)complete(l.id);});
    return {dispose(){disposed=true;}};
  }
  const code=document.querySelector('#program-code'),run=document.querySelector('#program-run'),consoleOut=document.querySelector('#program-console');
  bindPythonEditor(code);code.previousElementSibling.querySelector('span').textContent='Tab 4 ช่องว่าง · Enter เยื้องต่อ · Esc แล้ว Tab เพื่อออกจากช่องโค้ด';
  code.addEventListener('input',()=>{token=null;saveDraft(l.id,{code:code.value});feedback.textContent='โค้ดเปลี่ยนแล้ว กดรันใหม่เพื่ออัปเดตหน้าเว็บและผลตรวจ';document.querySelector('#program-checks').textContent='';});
  const receive=event=>{
    if(disposed||event.source!==frame?.contentWindow||event.data?.type!=='programming-result'||event.data.token!==token)return;
    const data=event.data;run.disabled=false;
    consoleOut.textContent=data.error||data.logs?.join('\n')||'ไม่มีข้อความจาก console.log() · ดูผลในหน้าเว็บด้านบน';
    const checks=Array.isArray(data.checks)?data.checks:[],passed=!data.error&&!data.waiting&&checks.length>0&&checks.every(x=>x.pass);
    document.querySelector('#program-checks').innerHTML=checks.map(x=>`<p>${x.pass?'✓':'✕'} ${escape(x.name)}</p>`).join('');
    feedback.className=passed?'feedback':'feedback bad';feedback.textContent=passed?'✓ ผ่านภารกิจ · ลองอธิบายสิ่งที่เปลี่ยนก่อนทดลองต่อ':data.error?'พบข้อผิดพลาด อ่าน Console แล้วแก้โค้ดก่อนรันใหม่':data.waiting?'รันแล้ว ให้คลิกปุ่ม เสร็จแล้ว ในหน้าต่างทดลอง':'ยังไม่ครบเงื่อนไข ดูรายการตรวจและเปรียบเทียบกับภารกิจ';if(passed)complete(l.id);
  };
  window.addEventListener('message',receive);
  run.onclick=()=>{
    if(code.value.length>20000){feedback.textContent='โค้ดต้องไม่เกิน 20,000 ตัวอักษร';return;}
    const score=Number(document.querySelector('#program-score')?.value??75);if(!Number.isFinite(score)||score<0||score>100){feedback.textContent='กรอกคะแนนตั้งแต่ 0 ถึง 100';return;}
    token=crypto.randomUUID();frame?.remove();frame=document.createElement('iframe');frame.title='หน้าแอปที่สร้างจากโค้ดของคุณ';frame.setAttribute('sandbox','allow-scripts');frame.srcdoc=sandboxDocument({mode:l.mode,code:code.value,score,token});document.querySelector('#program-frame-slot').replaceChildren(frame);consoleOut.textContent='กำลังรัน…';feedback.textContent='';document.querySelector('#program-checks').textContent='';
  };
  document.querySelector('#program-reset').onclick=()=>{code.value=l.starter;saveDraft(l.id,{code:l.starter});token=null;frame?.remove();consoleOut.textContent='เริ่มโค้ดใหม่แล้ว กดรันเพื่อแสดงผล';feedback.textContent='';document.querySelector('#program-checks').textContent='';};
  return {dispose(){disposed=true;window.removeEventListener('message',receive);frame?.remove();}};
}
