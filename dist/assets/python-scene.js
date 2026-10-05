import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { box, material } from './scene.js?v=speed-20261005';
import { visualFor } from './python-visuals.js';

export function mountScene(el, { preview = false, lesson } = {}) {
  const spec = lesson ? (lesson.visualSpec || visualFor(lesson)) : { mode: 'monitor', title: 'Python' };
  // Source code already has an editor and a step-by-step panel outside the scene.
  // Give these lessons one large output screen instead of a second code board.
  const outputOnly = ['monitor', 'source', 'branch', 'exception'].includes(spec.mode);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#112633');
  const camera = new THREE.PerspectiveCamera(40, 1, .1, 50);
  camera.position.set(0, outputOnly ? 1.65 : 2, outputOnly ? 4 : 7);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  el.append(renderer.domElement);
  renderer.domElement.setAttribute('aria-label', spec.title + ' · ภาพสามมิติประกอบสถานะ Python');
  renderer.domElement.dataset.visualMode = spec.mode;
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, outputOnly ? 1.65 : 2, 0);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 2.5;
  controls.maxDistance = 16;
  controls.enabled = !preview;
  let initialDistance = outputOnly ? 4 : 7;
  function resetView() {
    camera.position.set(0, outputOnly ? 1.65 : 2, initialDistance);
    controls.target.set(0, outputOnly ? 1.65 : 2, 0);
    controls.update();
  }
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(2, 5, 4); scene.add(light, new THREE.AmbientLight(0x91bdd5, 1.5));
  const computer = new THREE.Group(); scene.add(computer);
  if (!outputOnly) { computer.scale.setScalar(.75); computer.position.x = 2.4; }
  if(lesson?.section==='extensions'&&!outputOnly)computer.scale.setScalar(1.15);
  if (spec.mode === 'references') { computer.scale.setScalar(1); computer.position.x = 2.6; }
  const shell = material(0x273c4a);
  box(computer, 0, 1.65, 0, 3.5, 2.15, .18, shell);
  const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 640;
  const ctx = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.24, 1.89), new THREE.MeshBasicMaterial(preview ? {map:texture,toneMapped:false} : {color:0x07151e}));
  screen.position.set(0, 1.65, .101); computer.add(screen);
  let glow = 0, state = { text: 'กดรันโค้ด แล้วดูผลบนจอนี้', kind: 'idle' };
  const concepts = new THREE.Group(); scene.add(concepts);
  const overlay=document.createElement('div');overlay.className='python-crisp-overlay';el.append(overlay);
  const monitorText=document.createElement('div');monitorText.className='python-screen-text';overlay.append(monitorText);
  let labels=[];
  const project=(x,y,z)=>new THREE.Vector3(x,y,z).project(camera);
  let conceptTextures = [];
  function clearConcepts() {
    concepts.traverse(obj => { obj.geometry?.dispose(); obj.material?.dispose(); });
    concepts.clear(); conceptTextures.forEach(t => t.dispose()); conceptTextures = [];
    for(const entry of labels)entry.label.remove();labels=[];
  }
  function tile(title, value, x, y, z = 0, active = false, width = 1.8, height = .82) {
    const face = document.createElement('canvas'); face.width = 512; face.height = 220;
    const paint = face.getContext('2d');
    paint.fillStyle = active ? '#23695e' : '#233e50'; paint.fillRect(0, 0, 512, 220);
    paint.fillStyle = '#82e9d1'; paint.font = '38px sans-serif'; paint.fillText(String(title).slice(0, 22), 20, 48);
    paint.fillStyle = '#ffffff'; paint.font = '42px monospace';
    String(value).match(/.{1,18}/gu)?.slice(0, 3).forEach((line, i) => paint.fillText(line, 20, 104 + 46 * i));
    box(concepts, x, y, z, width, height, .22, material(active ? 0x4cbea6 : 0x435b76));
    if(preview){const tex=new THREE.CanvasTexture(face);tex.colorSpace=THREE.SRGBColorSpace;conceptTextures.push(tex);const plane=new THREE.Mesh(new THREE.PlaneGeometry(width*.96,height*.94),new THREE.MeshBasicMaterial({map:tex,toneMapped:false}));plane.position.set(x,y,z+.12);concepts.add(plane);}
    const label=document.createElement('div');label.className='python-tile-text'+(active?' active':'');
    const heading=document.createElement('span'),content=document.createElement('code');heading.textContent=title;content.textContent=value;label.append(heading,content);overlay.append(label);
    labels.push({label,x,y,z:z+.12,width,height});
  }
  function displayFrame(frame, context = {}) {
    clearConcepts();
    if (outputOnly) return;
    const variables = frame?.variables || [];
    const source = (context.files?.[frame?.file] || context.code || lesson?.starter || '').split('\n');
    const row = (title, value, i, active = false) => tile(title, value, -2.5 + (i % 2) * 1.95, 2.8 - Math.floor(i / 2) * .94, 0, active);
    if (['source', 'branch', 'exception'].includes(spec.mode)) {
      const start = Math.max(0, (frame?.line || 1) - 3);
      source.slice(start, start + 6).forEach((line, i) => {
        const indent = Math.min(12, line.length - line.trimStart().length);
        tile('L' + (start + i + 1), line.trim() || '(บรรทัดว่าง)', -1.7 + indent * .035, 3.4 - i * .59, 0, start + i + 1 === frame?.line, 3.7, .5);
      });
    } else if (spec.mode === 'references') {
      const names = variables.filter(v => v.objectId).slice(0, 4);
      const objects = [...new Map(names.map(v => [v.objectId, v])).values()];
      if (!names.length) row('ชื่อ → ออบเจ็กต์', 'รันโค้ดเพื่อดูการอ้างถึงจริง', 0);
      objects.forEach((v, i) => tile(v.objectId, v.value, -.4, 3.2 - i * 1.05, 0, true, 1.8));
      names.forEach((v, i) => {
        const y = 3.2 - i * .8;
        tile(v.name, '→ ' + v.objectId, -3, y, 0, false, 1.4, .62);
        const target = objects.findIndex(o => o.objectId === v.objectId);
        const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2.25, y, .15), new THREE.Vector3(-1.35, 3.2 - target * 1.05, .15)]);
        concepts.add(new THREE.Line(geometry, new THREE.LineBasicMaterial({color:0x82e9d1})));
      });
    } else if (['sequence', 'sets', 'dictionary'].includes(spec.mode)) {
      const collections = variables.filter(v => v.items && (lesson?.section!=='extensions'||v.type!=='str')).slice(0, 3);
      if (!collections.length) row(spec.title, 'รอข้อมูลจากการรัน', 0);
      collections.forEach((v, r) => {
        const items = v.items.length ? v.items.slice(0, 4) : [{ key: '', value: '(ว่าง)' }];
        items.forEach((item, i) => {
          const set = v.type === 'set';
          const compactDictionary=lesson?.section==='extensions'&&spec.mode==='dictionary';
          const x = compactDictionary?-2.7+i*1.8:spec.mode === 'sets' && set ? -1.9 + Math.cos(i * Math.PI / 2) * .95 : -3.3 + i * 1.05;
          const y = 3 - r * 1.25 + (spec.mode === 'sets' && set ? Math.sin(i * Math.PI / 2) * .25 : 0);
          tile(compactDictionary?item.key+' · '+v.name:v.name + (set ? ' · set' : ' [' + item.key + ']'), item.value, x, y, 0, true, compactDictionary?1.6:1);
        });
      });
    } else if (['loop', 'grid'].includes(spec.mode)) {
      if (spec.mode === 'grid') {
        const iValue = variables.find(v => v.name === 'i')?.value || '?';
        const jValue = variables.find(v => v.name === 'j')?.value || '?';
        row('ลูปนอก · i', iValue, 0, true); row('ลูปใน · j', jValue, 1, true);
        const recent = (context.history || []).slice(-4);
        recent.forEach((event, i) => row('เหตุการณ์ ' + (context.index - recent.length + i + 2), 'L' + event.line + ' · ' + event.event, i + 2, i === recent.length - 1));
      } else {
        const events = (context.history || []).slice(-6);
        (events.length ? events : Array.from({ length: 6 }, () => null)).forEach((event, i) => {
          const angle = i / 6 * Math.PI * 2;
          tile(event ? 'L' + event.line : 'ขั้นตอน', event ? event.variables.find(v => ['i', 'j'].includes(v.name))?.value || event.event : 'รอการรัน', -1.6 + Math.cos(angle) * 1.5, 2 + Math.sin(angle) * 1.25, 0, i === events.length - 1, 1.2);
        });
      }
    } else if (['stack', 'modules'].includes(spec.mode)) {
      const fullStack = frame?.stack?.length ? frame.stack : [{ name: '<module>', file: 'main.py' }];
      const stack = fullStack.slice(-4), omitted = fullStack.length - stack.length;
      stack.forEach((entry, i) => tile('FRAME ' + (omitted + i), entry.name === '<module>' ? entry.file : entry.file + ' · ' + entry.name, -1.6, .65 + i * .68, i * .08, i === stack.length - 1, 3, .57));
      if (omitted) tile('CALL STACK', 'ยังมี ' + omitted + ' frame ด้านล่างที่ไม่ได้แสดง', -1.6, .15, 0, false, 3, .4);
      tile(frame?.event === 'return' ? 'RETURN' : 'LOCAL', frame?.event === 'return' ? frame.returned : variables.map(v => v.name + '=' + v.value).join(' · ') || 'รอเรียกฟังก์ชัน', -1.6, 3.65, .2, true, 3, .65);
    } else if (spec.mode === 'types') {
      const actual = (frame?.output || '').split('\n').filter(Boolean);
      (actual.length ? actual : ['int', 'float', 'str', 'bool', 'NoneType']).slice(0, 6).forEach((type, i) => row(actual.length ? 'ข้อความที่แสดงแล้ว' : 'ชนิดข้อมูล · ตัวอย่าง', type, i, !!actual.length));
    } else {
      const list = variables.filter(v => !['function', 'module'].includes(v.type)).slice(0, spec.mode === 'input' ? 4 : 6);
      if (!list.length) row('ชื่อ → ค่า', 'รอคำสั่งกำหนดค่า', 0);
      list.forEach((v, i) => row(v.name + ' · ' + v.type, v.value, i, true));
      if (spec.mode === 'input') tile('INPUT · ข้อความที่เตรียมไว้', context.inputs || lesson?.inputs || '(ไม่มี)', -1.6, .45, 0, false, 3.5);
    }
  }
  function update(text, kind = 'result') {
    state = { text: String(text), kind };
    monitorText.replaceChildren();const status=document.createElement('span'),output=document.createElement('pre');status.textContent='PYTHON / '+kind.toUpperCase();output.textContent=state.text;monitorText.append(status,output);monitorText.dataset.kind=kind;
    ctx.fillStyle = '#07151e'; ctx.fillRect(0, 0, 1024, 640);
    ctx.fillStyle = kind === 'error' ? '#ffad91' : '#76e6cb';
    ctx.font = '26px monospace'; ctx.fillText('PYTHON / ' + kind.toUpperCase(), 40, 55);
    ctx.fillStyle = '#edf6ff'; ctx.font = '32px monospace';
    const wrapped = state.text.split('\n').flatMap(line => line.match(/.{1,46}/gu) || ['']);
    wrapped.slice(0, 11).forEach((line, i) => ctx.fillText(line, 40, 115 + i * 42));
    if (wrapped.length > 11) { ctx.font = '22px sans-serif'; ctx.fillText('เลื่อนอ่านผลเต็มบนหน้าจอ', 40, 610); }
    texture.needsUpdate = true;
    glow = kind === 'result' || kind === 'error' ? 1 : 0;
  }
  update(state.text, state.kind);
  displayFrame(null);
  const observer = new ResizeObserver(() => {
    const w = el.clientWidth, h = el.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
    if (outputOnly) {
      const distance = Math.max(1.1, 1.8 / camera.aspect) / Math.tan(THREE.MathUtils.degToRad(20)) * 1.08;
      initialDistance = distance;
      camera.position.set(0, 1.65, distance);
      controls.target.set(0, 1.65, 0);
    } else {
      initialDistance = Math.max(2, (spec.mode === 'references' ? 4.6 : 4.2) / camera.aspect) / Math.tan(THREE.MathUtils.degToRad(20)) * 1.08;
      camera.position.set(0, 2, initialDistance);
      controls.target.set(0, 2, 0);
    }
  }); observer.observe(el);
  let frame;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function animate() {
    frame = requestAnimationFrame(animate);
    if (!reduced && !preview) { computer.position.y = Math.sin(glow * Math.PI) * .08; glow *= .94; }
    controls.update();
    const w=el.clientWidth,h=el.clientHeight;
    for(const entry of labels){const center=project(entry.x,entry.y,entry.z),left=project(entry.x-entry.width/2,entry.y,entry.z),right=project(entry.x+entry.width/2,entry.y,entry.z),top=project(entry.x,entry.y+entry.height/2,entry.z),bottom=project(entry.x,entry.y-entry.height/2,entry.z);const width=Math.max(20,Math.abs(right.x-left.x)*w/2),height=Math.max(18,Math.abs(top.y-bottom.y)*h/2);Object.assign(entry.label.style,{left:(center.x+1)*w/2+'px',top:(1-center.y)*h/2+'px',width:width+'px',height:height+'px'});entry.label.hidden=preview||center.z>1||center.z< -1;}
    const left=project(computer.position.x-1.5*computer.scale.x,1.65*computer.scale.y+computer.position.y,.12),right=project(computer.position.x+1.5*computer.scale.x,1.65*computer.scale.y+computer.position.y,.12),center=project(computer.position.x,1.65*computer.scale.y+computer.position.y,.12);
    const width=Math.max(20,Math.abs(right.x-left.x)*w/2);Object.assign(monitorText.style,{left:(center.x+1)*w/2+'px',top:(1-center.y)*h/2+'px',width:width+'px',height:width*.54+'px'});monitorText.hidden=preview||center.z>1||center.z< -1;
    renderer.render(scene, camera);
  } animate();
  return { update, displayFrame, resetView, dispose() {
    cancelAnimationFrame(frame); observer.disconnect(); controls.dispose();
    scene.traverse(obj => { obj.geometry?.dispose(); if (obj.material) obj.material.dispose(); });
    conceptTextures.forEach(t => t.dispose()); texture.dispose(); renderer.dispose(); renderer.domElement.remove();overlay.remove();
  }};
}
