import {startFlowPlayback} from './flow-playback.js?v=speed-20261005';
import {buildNetworkLab,networkLabSpecs,networkLabDefaults} from './network-lab-models.js?v=speed-20261005';
import {incidentReady,incidentRequirements,incidentPrompts} from './incident-evidence.js';
import {telecomLessons} from './telecom-labs.js?v=speed-20261005';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function wireEvidence(frame) {
  if(!frame.wire)return '';
  const w=frame.wire;
  const rows=[['Ethernet source MAC',w.srcMAC],['Ethernet destination MAC',w.dstMAC],...(w.srcIP?[['IPv4 source',w.srcIP],['IPv4 destination',w.dstIP],['IP TTL',w.ttl]]:[['ARP target IP',w.targetIP],['IP header / TTL','ไม่มี — ARP ไม่ใช่ IPv4 packet']])];
  return `<section class="wire-inspector" aria-label="แกะข้อมูลบน link"><h4>แกะ Frame บน link นี้</h4><p>${esc(w.protocol)}</p><dl>${rows.map(([k,v])=>`<div><dt>${esc(k)}</dt><dd><code>${esc(v)}</code></dd></div>`).join('')}</dl><p class="wire-envelope">Ethernet header → ${w.srcIP?'IPv4 header → ICMP':'ARP message'} → Ethernet FCS</p><p>ภาพย่อ header ที่เกี่ยวข้อง ไม่ใช่ข้อมูลจาก Packet capture จริง</p>${frame.cli?`<h4>เทียบกับสิ่งที่เห็นใน CLI</h4><pre>${esc(frame.cli)}</pre><p>ผล CLI จำลองเพื่ออธิบายขั้นนี้ ไม่ใช่คำสั่งที่รันบนเครื่องหรืออุปกรณ์ของคุณ</p>`:''}</section>`;
}
export function mechanismSurface(l){
  const spec=networkLabSpecs[l.id];if(!spec)return '';
  return `<section class="mechanism-lab" aria-label="ห้องทดลองกลไก ${esc(l.title)}"><header><span>${spec.mode==='3d'?'3D INTERACTIVE':spec.mode==='tool'?'INTERACTIVE SANDBOX':'INTERACTIVE SEQUENCE'}</span><h2>${esc(spec.title)}</h2></header><p class="mechanism-disclaimer">แบบจำลองเฉพาะกลไกของบทนี้ · ไม่ใช่ Network emulator และไม่เรียกใช้ระบบจริง</p>${spec.controls.length?`<form class="mechanism-inputs">${spec.controls.map(c=>`<label>${esc(c.label)}${c.type==='select'?`<select name="${c.key}">${c.options.map(([v,t])=>`<option value="${esc(v)}">${esc(t)}</option>`).join('')}</select>`:c.type==='textarea'?`<textarea name="${c.key}" maxlength="300">${esc(c.value)}</textarea>`:`<input name="${c.key}" type="${c.type}" value="${esc(c.value)}" ${c.type==='number'?`min="${c.min}" max="${c.max}" step="1"`:'maxlength="160"'} required>`}</label>`).join('')}<button class="button" type="submit">ทดลองด้วยค่าของฉัน</button></form>`:''}<div class="mechanism-error" role="alert"></div><div class="mechanism-stage ${spec.mode==='3d'?'is-3d':''}" data-mechanism-stage><div class="mechanism-topology"></div></div><div class="mechanism-controls"><button type="button" data-mechanism-action="previous">‹ ขั้นก่อน</button><button type="button" data-mechanism-action="play">▶ เล่นขั้นตอน</button><button type="button" data-mechanism-action="next">ขั้นถัดไป ›</button><label>ขั้นตอน<input type="range" min="0" value="0" aria-label="ขั้นตอนแบบจำลอง Network"></label><button type="button" data-mechanism-action="reset">เริ่มใหม่</button>${spec.mode==='3d'?'<button type="button" data-mechanism-action="view">รีเซ็ตมุมมอง 3D</button>':''}</div><ol class="mechanism-step-list" aria-label="ลำดับกลไก"></ol><div class="mechanism-evidence" aria-live="polite"></div><div class="mechanism-special"></div><p class="mechanism-note">เปลี่ยนสถานการณ์ด้านล่างเพื่อเปรียบเทียบ · ปุ่มขั้นตอนแสดงการเปลี่ยนสถานะ ไม่ใช่เวลาหรือความเร็วจริง</p></section>`;
}
export function initMechanism(l,addScene){
  const root=document.querySelector('.mechanism-lab');if(!root)return null;
  const stage=root.querySelector('[data-mechanism-stage]'),topology=root.querySelector('.mechanism-topology'),evidence=root.querySelector('.mechanism-evidence'),list=root.querySelector('.mechanism-step-list'),special=root.querySelector('.mechanism-special'),error=root.querySelector('.mechanism-error'),range=root.querySelector('input[type="range"]'),form=root.querySelector('form');
  let model,index=0,scenario=0,timer=null,scene=null,disposed=false;
  const notebook=new Map();
  const solved=new Set();
  const observedProvider=new Set();
  const observations=new Set();
  if(l.id==='troubleshooting')special.insertAdjacentHTML('afterend','<section class="cli-notebook"><h3>ภารกิจ: วิเคราะห์สาม Incident</h3><p>เลือกเครื่องมือ กดทดลอง แล้วอ่านถึงขั้นสุดท้ายเพื่อเก็บหลักฐาน เลือกแนวทางตรวจต่อด้านล่างให้ถูกทั้งสามเคส ก่อนตอบคำถามท้ายบท</p><div data-incident-evidence aria-live="polite"></div><div class="choices"><button type="button" data-diagnosis="0">ตรวจสาย / NIC / interface</button><button type="button" data-diagnosis="1">ตรวจ Resolver / DNS record</button><button type="button" data-diagnosis="2">ตรวจ Listening service / Firewall policy</button></div><p data-incident-feedback role="status"></p></section>');
  if(l.id==='network-commands')special.insertAdjacentHTML('afterend','<section class="cli-notebook"><h3>ภารกิจ: เก็บหลักฐานก่อนสรุป</h3><p>เลือกสถานการณ์ แล้วใช้ ip, ping และ nslookup อ่านถึงขั้น “อ่านผลอย่างระวัง” ทั้งสามคำสั่ง จากนั้นเปรียบเทียบสิ่งที่ยืนยันได้กับสิ่งที่ยังต้องตรวจ ไม่ใช่การรัน CLI จริง</p><div data-cli-notebook aria-live="polite">ยังไม่มีหลักฐาน</div></section>');
  const stop=()=>{timer?.stop();timer=null;root.querySelector('[data-mechanism-action="play"]').textContent='▶ เล่นขั้นตอน';};
  function topologyHTML(frame){
    return `<div class="mechanism-actors">${model.nodes.map(n=>`<div class="mechanism-actor ${frame.active.includes(n.id)?frame.status==='blocked'?'blocked':'active':''}"><span>${esc(n.name)}</span><code>${esc(frame.nodeUpdates[n.id]||n.address)}</code></div>`).join('')}</div>${frame.transfers.length?`<div class="mechanism-messages ${frame.status==='blocked'?'blocked':''}">${frame.transfers.map(t=>`<div class="mechanism-message"><strong>${esc(model.nodes.find(n=>n.id===t.from).name)}</strong><span><code>${esc(t.message)}</code><svg viewBox="0 0 200 14" aria-hidden="true"><path d="M0 7 H190 M183 1 L190 7 L183 13" fill="none" stroke="currentColor" stroke-width="2"/></svg></span><strong>${esc(model.nodes.find(n=>n.id===t.to).name)}</strong></div>`).join('')}</div>`:''}<div class="mechanism-connections">${model.links.map(e=>`<span class="${frame.edges.includes(e.id)?frame.status==='blocked'?'blocked':'active':''}">${esc(model.nodes.find(n=>n.id===e.from).name)} ↔ ${esc(model.nodes.find(n=>n.id===e.to).name)}${e.label?' · '+esc(e.label):''}</span>`).join('')}</div>`;
  }
  function extra(){
    if(l.id==='vlsm'){
      const allocations=model.steps.filter(s=>s.fields.some(([k])=>k==='Block size'));let start=0;
      special.innerHTML=`<h3>แผนที่ 256 Addresses · 192.168.10.0/24</h3><div class="mechanism-ip-pool">${allocations.map(s=>{const size=Number(s.fields.find(([k])=>k==='Block size')[1]),from=start;start+=size;return `<div style="width:${size/256*100}%" title="${esc(s.title)}"><b>${esc(s.fields.find(([k])=>k==='Subnet')[1])}</b><span>.${from}–.${start-1}</span></div>`;}).join('')}${start<256?`<div class="unallocated" style="width:${(256-start)/256*100}%">เหลือ ${256-start}</div>`:''}</div>`;
    }else if(l.id==='ipv6-address'){
      const full=model.steps[0].fields[0][1];special.innerHTML=`<h3>128 บิต = 8 × 16 บิต</h3><div class="mechanism-ipv6">${full.split(':').map((g,i)=>`<div><span>กลุ่ม ${i+1} · 16 bits</span><code>${g}</code></div>`).join('')}</div>`;
    }else if(l.id==='wireless-radio'){
      const channels=model.parameters.channels.split(',').map(Number);special.innerHTML=`<h3>Spectrum · ภาพเชิงแนวคิด (ไม่ใช่ Site survey)</h3><div class="mechanism-spectrum">${channels.map((c,i)=>`<div class="spectrum-band" style="left:${(c-1)*5}%;width:24%;top:${i*34}px">AP${i+1} · Channel ${c}</div>`).join('')}</div>`;
    }else if(l.id==='mtu-pmtud'){
      special.innerHTML='<h3>อ่านภาพขนาด</h3><p>แท่งสีในฉากยาวตามจำนวน Bytes ของ IP packet; เส้นตั้งคือ MTU ของ link แคบ ความยาวเทียบกันจากผลคำนวณเดียวกับหลักฐานด้านบน ไม่ใช่ภาพว่า packet มีขนาดเป็นวัตถุจริงบนสาย</p>';
    }else if(l.id==='tcp-handshake'){
      special.innerHTML='<h3>อ่านภาพ Byte stream</h3><p>ในโหมดส่งข้อมูล กล่องสองช่องแทนช่วง byte ที่ผู้รับต้องเรียง: สีเข้มยังไม่พร้อม สีเหลืองรับช่วงหลังแล้วแต่รอช่องว่าง สีเขียวพร้อมให้ application อ่าน เป็นภาพเชิงตรรกะ ไม่ใช่ผัง RAM จริง</p>';
    }else special.replaceChildren();
  }
  function draw(){
    if(disposed||!model)return;const frame=model.steps[index];range.max=String(model.steps.length-1);range.value=String(index);
    list.innerHTML=model.steps.map((s,i)=>`<li><button type="button" data-mechanism-step="${i}" ${i===index?'aria-current="step"':''}>${i+1}. ${esc(s.title)}</button></li>`).join('');
    evidence.className='mechanism-evidence'+(frame.status==='blocked'?' problem':'');evidence.innerHTML=`<p class="state-count">${index+1} / ${model.steps.length} · ${esc(l.states[scenario].label)}${form?' · ค่าที่เลือกใน Sandbox':''}</p><h3>${esc(frame.title)}</h3><p>${esc(frame.detail)}</p><dl>${frame.fields.map(([k,v])=>`<div><dt>${esc(k)}</dt><dd><code>${esc(v)}</code></dd></div>`).join('')}</dl>`;
    evidence.insertAdjacentHTML('beforeend',wireEvidence(frame));
    if(telecomLessons.some(t=>t.id===l.id)&&index===model.steps.length-1){observedProvider.add(scenario);root.dataset.providerReady=String(observedProvider.size>=2);}
    if(l.observationRequired&&index===model.steps.length-1){observations.add(scenario);root.dataset.observationReady=String(observations.size>=2);}
    if(l.id==='troubleshooting'){
      if(index===model.steps.length-1)notebook.set(model.parameters.command,model.steps[1].fields);
      root.querySelector('[data-incident-evidence]').innerHTML=`<p>${esc(incidentPrompts[scenario])}</p><p>วิเคราะห์แล้ว ${solved.size} / 3 เคส · หลักฐานที่ยังต้องอ่าน: ${esc(incidentRequirements[scenario].filter(c=>!notebook.has(c)).join(', ')||'ครบแล้ว')}</p>`+[...notebook].map(([cmd,rows])=>`<h4>${esc(cmd)}</h4><dl>${rows.map(([k,v])=>`<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`).join('');
      root.dataset.incidentReady=String(solved.size===3);
    }
    if(l.id==='network-commands'&&index===model.steps.length-1){
      notebook.set(model.parameters.command,frame.fields);
      root.querySelector('[data-cli-notebook]').innerHTML=`<p>${['ip','ping','nslookup'].every(c=>notebook.has(c))?'✓ อ่านหลักฐานครบสามประเภทแล้ว — ใช้ตอบภารกิจด้านล่าง':'ยังต้องอ่าน: '+['ip','ping','nslookup'].filter(c=>!notebook.has(c)).join(', ')}</p>`+[...notebook].map(([cmd,rows])=>`<h4>${esc(cmd)}</h4><dl>${rows.map(([k,v])=>`<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`).join('');
    }
    root.querySelector('[data-mechanism-action="previous"]').disabled=index===0;root.querySelector('[data-mechanism-action="next"]').disabled=index===model.steps.length-1;
    root.querySelector('[data-mechanism-action="play"]').disabled=model.steps.length<2;
    topology.innerHTML=topologyHTML(frame);scene?.showStep(index);
  }
  function rebuild(parameters){
    stop();error.textContent='';
    try{model=buildNetworkLab(l,scenario,parameters);index=0;scene?.setModel(model);extra();draw();}catch(e){error.textContent=e.message+' · ยังแสดงผลค่าที่ถูกต้องครั้งล่าสุด กรุณาแก้ค่าแล้วทดลองใหม่';}
  }
  function selectScenario(i){scenario=i;notebook.clear();const note=root.querySelector('[data-cli-notebook]');if(note)note.textContent='ยังไม่มีหลักฐานของสถานการณ์นี้';const defaults=networkLabDefaults(l,i);if(form)for(const [k,v]of Object.entries(defaults))if(form.elements.namedItem(k))form.elements.namedItem(k).value=v;rebuild(defaults);}
  root.addEventListener('click',e=>{
    const target=e.target.closest('button');if(!target)return;
    if(target.dataset.diagnosis!==undefined){
      const output=root.querySelector('[data-incident-feedback]');
      if(!incidentReady(scenario,[...notebook.keys()])){output.textContent='ยังมีหลักฐานไม่ครบ อ่านผลของเครื่องมือที่ระบุไว้ก่อนสรุป';return;}
      if(Number(target.dataset.diagnosis)!==scenario){output.textContent='แนวทางนี้ยังไม่ตรงกับหลักฐาน ลองเปรียบเทียบผลแต่ละเครื่องมืออีกครั้ง';return;}
      solved.add(scenario);draw();output.textContent='✓ แนวทางตรวจต่อสอดคล้องกับหลักฐาน ไม่ใช่การยืนยัน root cause ทุกกรณีในระบบจริง';return;
    }
    if(target.dataset.mechanismStep!==undefined){stop();index=Number(target.dataset.mechanismStep);draw();return;}
    const action=target.dataset.mechanismAction;if(!action)return;
    if(action==='view'){scene?.resetView();return;}
    if(action==='play'){if(timer){stop();return;}if(!model||model.steps.length<2)return;if(index===model.steps.length-1)index=0;target.textContent='Ⅱ หยุด';draw();timer=startFlowPlayback({scene:()=>scene,advance:()=>{index++;draw();},atEnd:()=>index===model.steps.length-1,onEnd:stop,connected:()=>!disposed&&root.isConnected});return;}
    stop();index=action==='reset'?0:Math.max(0,Math.min(model.steps.length-1,index+(action==='next'?1:-1)));draw();if(action==='reset')scene?.replay?.();
  });
  range.addEventListener('input',()=>{stop();index=Number(range.value);draw();});
  form?.addEventListener('submit',e=>{e.preventDefault();rebuild(Object.fromEntries(new FormData(form)));});
  const scenarioChanged=e=>selectScenario(e.detail.index);root.closest('.workarea').addEventListener('network-scenario',scenarioChanged);
  stage.addEventListener('mechanism-pick',e=>{const found=model.steps.findIndex(s=>s.active.includes(e.detail));if(found>=0){stop();index=found;draw();}});
  selectScenario(0);
  if(networkLabSpecs[l.id].mode==='3d')addScene(stage,{mechanism:true,lesson:l}).then(s=>{if(disposed){s?.dispose();return;}scene=s;if(scene){stage.classList.add('has-webgl');scene.setModel(model);scene.showStep(index);}else stage.classList.add('fallback-2d');});
  return {dispose(){disposed=true;stop();root.closest('.workarea')?.removeEventListener('network-scenario',scenarioChanged);}};
}
