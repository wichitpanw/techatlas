import { highlightPythonLine, clearPythonHighlights } from './python-editor.js';
import { visualFor } from './python-visuals.js';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function createPythonInteractive(lesson, addScene) {
  const spec = visualFor(lesson);
  const area = document.createElement('section');
  area.className = 'python-monitor-wrap';
  area.innerHTML = `<div class="editor-bar"><span>${escape(spec.title)}</span><span>3D INTERACTIVE</span></div><div class="python-monitor" id="python-monitor"></div><div class="python-trace-controls"><button class="hint" data-step="prev" disabled>ขั้นก่อน</button><button class="hint" data-step="play" disabled>เล่นย้อนหลัง</button><button class="hint" data-step="next" disabled>ขั้นถัดไป</button><label>ขั้นตอน <input type="range" min="0" max="0" value="0" disabled aria-label="เลือกขั้นตอนการทำงาน"></label><button class="hint" data-step="final" disabled>ผลสุดท้าย</button></div><p class="trace-position" aria-live="polite">รันโค้ดเพื่อดูผล · กดเล่นย้อนหลังเพื่อไฮไลต์บรรทัดในช่องโค้ด</p><p>${escape(spec.explanation)}</p><p class="trace-note">ลากหมุน · เลื่อนซูม · ภาพเป็นเครื่องมืออธิบาย ไม่ใช่ตำแหน่งหน่วยความจำจริง</p></section>`;
  document.querySelector('.editor-wrap').before(area);
  const viewButton=document.createElement('button');viewButton.className='hint';viewButton.textContent='มองหน้าจอตรง ๆ';
  area.querySelector('.python-trace-controls').append(viewButton);
  viewButton.addEventListener('click',()=>scene?.resetView());
  const position = area.querySelector('.trace-position'), slider = area.querySelector('input');
  let scene, events = [], index = 0, timer, disposed = false, state = ['กดรันโค้ด แล้วดูผลบนจอนี้', 'idle'], context = {}, final = null;
  function stop() { clearInterval(timer); timer = null; area.querySelector('[data-step="play"]').textContent = 'เล่นย้อนหลัง'; }
  function enable(value) { area.querySelectorAll('[data-step], input').forEach(el => el.disabled = !value); }
  function show(finalView = false) {
    if (!events.length) return;
    const event = events[index]; slider.value = index;

    const words = {line:'กำลังจะทำบรรทัดนี้', call:'เข้าสู่ฟังก์ชัน', return:'ออกจากฟังก์ชันหรือไฟล์', exception:'เกิดข้อผิดพลาด · อาจมี except รับไว้'};
    position.textContent = `${index + 1}/${events.length} · ${event.file} · L${event.line} · ${words[event.event] || event.event}${event.function === '<module>' ? '' : ' · ' + event.function}`;
    if(!highlightPythonLine(event,context)) position.textContent += ' · โค้ดถูกแก้แล้ว รันใหม่เพื่อให้ไฮไลต์ตรงกับโค้ด';



    scene?.displayFrame(event, {...context, index, history:events.slice(0,index + 1)});
    scene?.update(finalView ? final.text : event.output || '(ยังไม่มีข้อความที่แสดงครบบรรทัด)', finalView ? final.kind : event.event === 'exception' ? 'error' : 'step');
    area.querySelector('[data-step="prev"]').disabled = index === 0;
    area.querySelector('[data-step="next"]').disabled = index === events.length - 1;
  }
  slider.addEventListener('input', () => { stop(); index = Number(slider.value); show(); });
  area.addEventListener('click', event => {
    const action = event.target.closest('[data-step]')?.dataset.step;
    if (!action || !events.length) return;
    if (action === 'play') {
      if (timer) { stop(); return; }
      if (index === events.length - 1) index = 0;
      show(); area.querySelector('[data-step="play"]').textContent = 'หยุดย้อนหลัง';
      timer = setInterval(() => { if (index >= events.length - 1) {stop(); show(true);} else {index++;show();} }, 700);
      return;
    }
    stop(); index = action === 'final' ? events.length - 1 : Math.max(0,Math.min(events.length - 1,index + (action === 'next' ? 1 : -1))); show(action === 'final');
  });
  addScene(area.querySelector('#python-monitor'), {python:true, lesson}).then(value => {
    if (disposed) return;
    scene = value; scene?.update(...state);
    if (events.length) show(true);
  });
  return {
    update(text, kind='result') {
      state = [text,kind]; scene?.update(text,kind);
      if (['running','idle'].includes(kind)) {
        clearPythonHighlights(); stop(); events=[]; final=null; enable(false); slider.max=0; slider.value=0;
        position.textContent=kind==='running'?'กำลังรัน Python จริง…':'รันโค้ดเพื่อดูสถานะจริง'; scene?.displayFrame(null,context);
      }
    },
    record(data, runContext) {
      stop(); context=runContext; events=data.trace || []; final={text:data.type==='error'?data.message:data.output || '(โปรแกรมจบโดยไม่แสดงข้อความ)',kind:data.type==='error'?'error':'result'};
      state=[final.text,final.kind];enable(!!events.length);slider.max=Math.max(0,events.length-1);index=events.length-1;
      area.querySelector('.trace-note').textContent = data.traceTruncated ? 'ประวัติจำกัด 180 เหตุการณ์ แสดงสถานะถึงขีดจำกัด ไม่ใช่สถานะสุดท้าย · ผลเต็มอยู่บนจอด้านบน' : 'ย้อนหลังจากการรันจริงครั้งล่าสุด · ไม่รวมการรันชุดตรวจโจทย์ · คอลเลกชัน 3D แสดงไม่เกิน 4 สมาชิกต่อชุด';
      if(events.length) show(true);
      else {position.textContent=data.type==='error'?'โค้ดเริ่มรันไม่ได้ · อ่านข้อผิดพลาดบนจอด้านบน':'ไม่มีเหตุการณ์ที่ติดตามได้';scene?.displayFrame(null,context);scene?.update(...state);}
    },
    dispose(){ disposed=true;stop();clearPythonHighlights(); },
  };
}
