import {startFlowPlayback} from './flow-playback.js?v=flow-20261005';
export const osiLayers = ['Physical','Data Link','Network','Transport','Session','Presentation','Application'];
export const osiDefinitions = [
  'ส่งบิตเป็นสัญญาณผ่านสาย ใยแก้ว หรือคลื่นวิทยุ',
  'ส่ง Frame ภายใน Link ใช้ MAC และตรวจข้อผิดพลาด เช่น Ethernet FCS',
  'ใช้ IP ระบุปลายทางและเลือกเส้นทาง Packet ข้ามเครือข่าย',
  'สื่อสารระหว่างโปรแกรมด้วย Port: TCP ยืนยันและจัดลำดับข้อมูล ส่วน UDP ไม่รับประกันการส่ง',
  'จัดการบริบทการสนทนา เริ่ม รักษา และจบ Session ในแบบจำลอง OSI',
  'จัดรูปแบบข้อมูล เช่น encoding บีบอัด และเข้ารหัส; ระบบจริงอาจรวมหน้าที่ไว้ในชั้นอื่น',
  'บริการเครือข่ายที่โปรแกรมใช้งาน เช่น HTTP และ DNS ไม่ใช่ตัวโปรแกรมทั้งหมด',
];
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function buildOSI(message='Hello from TechAtlas', fault='none') {
  const bytes=new TextEncoder().encode(message).length;
  const parts = depth => [
    ...(depth>=3?[{name:'Ethernet',size:14}]:[]),
    ...(depth>=2?[{name:'IPv4',size:20}]:[]),
    ...(depth>=1?[{name:'TCP',size:20}]:[]),
    {name:'Data',size:bytes},
    ...(depth>=3?[{name:'FCS',size:4}]:[]),
  ];
  const descriptions=[
    'Application สร้างข้อความสำหรับส่งให้โปรแกรมปลายทาง',
    'Presentation: เข้ารหัสตัวอักษรเป็น UTF-8 ตัวอย่างนี้ไม่ได้ใช้ TLS และไม่ได้เพิ่ม Header ที่ L6',
    'Session: แสดงบริบทการสนทนาที่มีอยู่แล้ว ไม่ได้สร้าง session protocol หรือทำ TCP handshake ในขั้นนี้',
    'Transport: เพิ่ม TCP header ระบุ port 51514 → 8080 สมมติ connection พร้อมแล้ว',
    'Network: เพิ่ม IPv4 header ระบุ IP 192.168.10.25 → 192.168.10.80',
    'Data Link: เพิ่ม Ethernet header และ FCS สำหรับ link เดียวกัน MAC 02:00:00:00:00:25 → 02:00:00:00:00:80',
    'Physical: ส่งบิตด้วยสัญญาณบนสาย บิตที่แสดงเป็นเพียงตัวอย่าง ไม่ใช่ waveform หรือ Frame bytes จริง',
  ];
  const steps=[];
  for(let i=0;i<7;i++)steps.push({side:'sender',layer:7-i,depth:Math.max(0,Math.min(3,i-2)),description:descriptions[i]});
  steps.push({side:'wire',layer:1,depth:3,description:'สัญญาณผ่าน link โดยตรงไปเครื่องรับ ไม่มี Router/NAT สมมติ ARP พร้อม และข้อมูลใส่ TCP segment เดียวได้'});
  const receives=[
    'Physical: รับสัญญาณและกู้ลำดับบิตกลับมา',
    fault==='fcs'?'Data Link: พบ FCS ไม่ตรง จึงทิ้ง Frame ยังส่งข้อมูลขึ้น L3 ไม่ได้':'Data Link: สมมติ FCS ถูกต้องและ MAC เป็นของผู้รับ เอา Ethernet header/FCS ออก',
    'Network: IP ตรงกับเครื่องรับ เอา IPv4 header ออก และส่ง TCP payload ไป L4',
    'Transport: ส่งข้อมูลไป endpoint port 8080 เอา TCP header ออก (ย่อการจัดลำดับและ ACK)',
    'Session: จับข้อมูลเข้าบริบทการสนทนาเดิม ไม่ได้แสดง session header แยก',
    'Presentation: อ่าน UTF-8 bytes กลับเป็นข้อความ ไม่ใช่ถอด TLS เพราะตัวอย่างนี้ไม่ได้เข้ารหัส',
    'Application: โปรแกรมผู้รับได้ข้อความเดิมครบ เนื้อหาไม่เปลี่ยนเพราะเพิ่ม/ถอด Header',
  ];
  for(let i=0;i<7;i++) {
    steps.push({side:'receiver',layer:i+1,depth:i===0?3:i===1?2:i===2?1:0,description:receives[i],dropped:fault==='fcs'&&i===1});
    if(fault==='fcs'&&i===1) {steps.at(-1).depth=3;break;}
  }
  return steps.map((step,index)=>({...step,index,parts:parts(step.depth),bytes:parts(step.depth).reduce((n,p)=>n+p.size,0),pdu:step.layer===1?'Bits / Signal':step.depth===3?'Frame':step.depth===2?'Packet':step.depth===1?'Segment':'Data',message}));
}
function tower(side) {
  return `<div class="osi-tower" data-osi-side="${side}"><h3>${side==='sender'?'เครื่องส่ง · Sender':'เครื่องรับ · Receiver'}</h3><p>${side==='sender'?'192.168.10.25 · ↓ ห่อข้อมูล':'192.168.10.80 · ↑ แกะข้อมูล'}</p>${[...osiLayers].reverse().map((name,i)=>`<button class="osi-layer" data-osi-layer="${7-i}" style="--layer-color:${['#75e5c8','#7ad5de','#89bce9','#b6a0ef','#eec46b','#efa274','#df868b'][i]}"><b>L${7-i}</b><span>${name}</span><small>${i<3?'Application':i===3?'Transport':i===4?'Internet':'Link'}</small></button>`).join('')}</div>`;
}
export function osiPreview() {
  return `<div class="osi-preview"><span>Sender ↓</span><strong>Data → Segment → Packet → Frame</strong><span>Bits → Receiver ↑</span><small>ห่อ Header แล้วแกะกลับทีละชั้น</small></div>`;
}
export function osiSurface() {
  return `<section class="osi-lab"><p class="eyebrow">OSI · SENDER TO RECEIVER · INTERACTIVE SEQUENCE</p><h2>ข้อความเดียว เดินผ่าน 7 Layer อย่างไร?</h2><div class="osi-options"><label>ข้อความที่จะส่ง<input id="osi-message" maxlength="80" value="Hello from TechAtlas"></label><label>สภาพ Link<select id="osi-fault"><option value="none">ปกติ</option><option value="fcs">Frame เสีย: FCS ไม่ตรง</option></select></label><button class="button light" data-osi-action="reset">เริ่มใหม่</button></div><div class="osi-journey">${tower('sender')}<div class="osi-center"><span id="osi-direction"></span><div class="osi-capsule"><strong id="osi-pdu"></strong><div id="osi-parts"></div><span id="osi-size"></span></div><div class="osi-wire">Physical link <span>→</span></div></div>${tower('receiver')}</div><div class="osi-controls"><button class="button light" data-osi-action="prev">ขั้นก่อน</button><button class="button" data-osi-action="play">เล่นการส่งข้อมูล</button><button class="button light" data-osi-action="next">ขั้นถัดไป</button><label>ขั้นตอน<input type="range" id="osi-step" min="0" max="14" value="0"></label></div><div class="osi-evidence" aria-live="polite"><strong id="osi-step-title"></strong><p id="osi-description"></p><pre id="osi-payload"></pre></div><p class="notice">แบบจำลองเฉพาะกลไก: TCP/IPv4 บน Ethernet LAN เดียว ไม่ใช้ TLS · TCP/IP รวมหน้าที่ OSI L5–7 ไว้ใน Application · Header ไม่มี options; ไม่จำลอง TCP handshake/ACK/segmentation, padding, preamble หรือ inter-frame gap · จำนวนไบต์คำนวณจาก UTF-8 และ Header ตัวอย่าง ไม่ใช่ Packet capture จริง</p><div class="question-box"><p>ภารกิจ: เดินผ่านฝั่งส่งจนถึงฝั่งรับ แล้วเลือก Frame เสียเพื่อดูว่าหยุดชั้นไหน</p><h3>ถ้า FCS ไม่ตรง ข้อมูลควรถูกทิ้งก่อนขึ้นชั้นใด?</h3><button class="choice" data-osi-answer="wrong">L7 Application</button><button class="choice" data-osi-answer="correct">L3 Network — ทิ้งที่ L2 ก่อน</button><div id="osi-feedback" aria-live="polite"></div></div></section>`;
}
export function initOSI(onComplete) {
  const root=document.querySelector('.osi-lab'), q=s=>root.querySelector(s);
  let model=buildOSI(),index=0,timer=null,normalSeen=false,dropSeen=false,scene=null,disposed=false;
  const stage=document.createElement('div');stage.className='osi-stage';stage.innerHTML='<div class="osi-stage-heading"><span>Sender · 192.168.10.25</span><span>Receiver · 192.168.10.80</span></div><p class="osi-stage-help">ลากเพื่อหมุน · เลื่อนเพื่อซูม · ใช้ปุ่มด้านล่างเดินผ่านแต่ละชั้น</p>';
  q('.osi-journey').before(stage);
  stage.after(q('.osi-controls'),q('.osi-evidence'));
  // Keep only the useful header inspector beside the explanation, not a second stack.
  q('.osi-evidence').append(q('.osi-center'));
  q('.osi-wire').remove();
  const definition=document.createElement('p');definition.id='osi-definition';q('#osi-description').before(definition);
  const visualNote=document.createElement('p');visualNote.className='notice';visualNote.textContent='Stack 3D เป็นภาพแทนหน้าที่ ไม่ใช่ชั้นอุปกรณ์จริง · ก้อนข้อมูลโตเมื่อเพิ่ม Header; ดูชนิดและไบต์จริงของแบบจำลองในแถบ Header ด้านล่าง';
  stage.before(visualNote);
  const guide=document.createElement('section');guide.className='osi-layer-guide';guide.innerHTML='<h3>แต่ละ Layer ทำหน้าที่อะไร?</h3>'+[...osiLayers].reverse().map((name,i)=>`<article><strong>L${7-i} · ${name}</strong><p>${osiDefinitions[6-i]}</p></article>`).join('');
  q('.question-box').before(guide);
  import('./osi-scene.js?v=flow-20261005').then(({mountOSI})=>{if(disposed)return;try{scene=mountOSI(stage);scene.showStep(model[index]);stage.classList.add('ready');}catch{stage.querySelector('.osi-stage-help').textContent='เปิด 3D ไม่ได้: ใช้ Stack และขั้นตอนด้านล่างได้เหมือนเดิม';}}).catch(()=>{if(!disposed)stage.querySelector('.osi-stage-help').textContent='โหลด 3D ไม่ได้: ใช้ Stack และขั้นตอนด้านล่างได้เหมือนเดิม';});
  const stop=()=>{timer?.stop();timer=null;q('[data-osi-action="play"]').textContent='เล่นการส่งข้อมูล';};
  function draw(){
    const step=model[index];q('#osi-step').max=model.length-1;q('#osi-step').value=index;
    scene?.showStep(step);
    definition.textContent=`L${step.layer} ${osiLayers[step.layer-1]}: ${osiDefinitions[step.layer-1]}`;
    guide.querySelectorAll('article').forEach((article,i)=>article.classList.toggle('active',7-i===step.layer));
    root.querySelectorAll('.osi-layer').forEach(button=>button.classList.toggle('active',button.closest('[data-osi-side]').dataset.osiSide===step.side&&Number(button.dataset.osiLayer)===step.layer));
    q('#osi-direction').textContent=step.side==='sender'?'ฝั่งส่ง ↓ Encapsulation':step.side==='receiver'?'ฝั่งรับ ↑ De-encapsulation':'ผ่าน Physical link →';
    q('#osi-pdu').textContent=step.dropped?'FRAME DROP':step.pdu;
    q('#osi-parts').innerHTML=step.parts.map(part=>`<span class="osi-part part-${part.name.toLowerCase()}" style="flex-grow:${part.size}">${part.name}<small>${part.size} B</small></span>`).join('');
    q('#osi-size').textContent=`${step.bytes} bytes${step.layer===1?' · '+step.bytes*8+' bits (เฉพาะ Frame)':''}`;
    q('#osi-step-title').textContent=`${index+1}/${model.length} · ${step.side==='wire'?'Link':'L'+step.layer+' '+osiLayers[step.layer-1]}`;
    q('#osi-description').textContent=step.description;
    q('#osi-payload').textContent=step.layer===1?'ตัวอย่างบิตของข้อความ (ไม่รวม Header): '+[...new TextEncoder().encode(step.message)].slice(0,8).map(n=>n.toString(2).padStart(8,'0')).join(' '):'Payload เดิม: '+step.message;
    q('[data-osi-action="prev"]').disabled=index===0;q('[data-osi-action="next"]').disabled=index===model.length-1;
    root.classList.toggle('osi-dropped',Boolean(step.dropped));
    if(index===model.length-1){if(step.dropped)dropSeen=true;else normalSeen=true;}
  }
  const reset=()=>{stop();index=0;model=buildOSI(q('#osi-message').value,q('#osi-fault').value);q('#osi-feedback').textContent='';draw();scene?.replay?.();};
  root.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.osiAnswer){q('#osi-feedback').textContent=button.dataset.osiAnswer!=='correct'?'ยังไม่ตรง: ดูจุดที่ Frame ถูกทิ้ง':!normalSeen||!dropSeen?'คำตอบถูก ลองดูทั้งส่งสำเร็จและ Frame เสียก่อน':'✓ ผ่าน: L2 ทิ้ง Frame เสีย ไม่ส่งต่อให้ L3';if(button.dataset.osiAnswer==='correct'&&normalSeen&&dropSeen)onComplete();return;}
    if(button.dataset.osiLayer){stop();const side=button.closest('[data-osi-side]').dataset.osiSide;const found=model.findIndex(step=>step.side===side&&step.layer===Number(button.dataset.osiLayer));if(found>=0){index=found;draw();}else q('#osi-feedback').textContent='ขึ้นชั้นนี้ไม่ได้: Frame ถูกทิ้งที่ L2 ก่อนแล้ว';return;}
    const action=button.dataset.osiAction;
    if(action==='reset'){normalSeen=false;dropSeen=false;scene?.resetView();reset();}
    else if(action==='prev'||action==='next'){stop();index=Math.max(0,Math.min(model.length-1,index+(action==='next'?1:-1)));draw();}
    else if(action==='play'){if(timer){stop();return;}if(index===model.length-1)index=0;q('[data-osi-action="play"]').textContent='หยุดชั่วคราว';draw();timer=startFlowPlayback({scene:()=>scene,advance:()=>{index++;draw();},atEnd:()=>index===model.length-1,onEnd:stop,connected:()=>!disposed&&root.isConnected});}
  });
  q('#osi-step').addEventListener('input',()=>{stop();index=Number(q('#osi-step').value);draw();});
  q('#osi-message').addEventListener('input',()=>{normalSeen=false;dropSeen=false;reset();});
  q('#osi-fault').addEventListener('change',reset);
  draw();return {dispose(){disposed=true;stop();scene?.dispose();}};
}
