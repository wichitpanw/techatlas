import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

// The DOM inspector and geometry share one discrete teaching model.
export function mountOSI(container,{preview=false}={}) {
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));container.append(renderer.domElement);
  renderer.domElement.setAttribute('aria-label','3D: OSI Stack เครื่องส่งและเครื่องรับ');
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,100);
  camera.position.set(0,5.5,16);
  const controls=new OrbitControls(camera,renderer.domElement);
  controls.target.set(0,3,0);controls.enablePan=false;controls.enableZoom=!preview;controls.minDistance=11;controls.maxDistance=23;controls.maxPolarAngle=Math.PI*.65;controls.update();
  scene.add(new THREE.HemisphereLight(0xd8f9ff,0x183039,2));
  const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(3,9,6);scene.add(light);
  const colors=[0xdf868b,0xefa274,0xeec46b,0xb6a0ef,0x89bce9,0x7ad5de,0x75e5c8];
  const names=['Physical','Data Link','Network','Transport','Session','Presentation','Application'];
  const slabs=[],labels=[];
  function cube(w,h,d,color,x,y,z=0){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color,roughness:.45,metalness:.15}));mesh.position.set(x,y,z);scene.add(mesh);return mesh;}
  for(const [side,x] of [['sender',-3.5],['receiver',3.5]]){
    cube(3.2,.18,2.3,0x203f4b,x,.15);
    for(let layer=1;layer<=7;layer++){
      const mesh=cube(2.9,.46,1.5,colors[layer-1],x,layer*.7);slabs.push({mesh,side,layer});
      if(!preview){const label=document.createElement('span');label.className='osi-space-label';label.textContent=`L${layer} ${names[layer-1]}`;container.append(label);labels.push({label,mesh});}
    }
  }
  cube(7,.08,.16,0x70bfc3,0,.5);
  const packet=cube(.55,.35,.55,0xffd166,-1.6,4.9,1.05);
  const packetLabel=document.createElement('span');packetLabel.className='osi-space-label osi-packet-label';container.append(packetLabel);
  const halo=new THREE.Mesh(new THREE.BoxGeometry(3.04,.58,1.64),new THREE.MeshBasicMaterial({color:0xffffff,wireframe:true}));scene.add(halo);
  let disposed=false,raf,elapsed=1600,last=null,paused=false,current=null;
  let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motion=document.createElement('button');motion.className='flow-motion-toggle';motion.hidden=preview;container.append(motion);
  const motionLabel=()=>{motion.textContent=reduced?'▶ เปิดการไหลต่อเนื่อง':'ลดการเคลื่อนไหว';motion.setAttribute('aria-pressed',String(!reduced));};motionLabel();
  motion.onclick=()=>{reduced=!reduced;from.copy(packet.position);elapsed=0;last=null;paused=false;motionLabel();};
  const from=packet.position.clone(),target=packet.position.clone(),fromScale=packet.scale.clone(),targetScale=packet.scale.clone(),vector=new THREE.Vector3();
  function render(){if(disposed)return;renderer.render(scene,camera);for(const {label,mesh} of [...labels,{label:packetLabel,mesh:packet}]){vector.copy(mesh.position);vector.z+=.8;vector.project(camera);label.style.left=`${(vector.x*.5+.5)*container.clientWidth}px`;label.style.top=`${(-vector.y*.5+.5)*container.clientHeight}px`;}}
  function resize(){const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();render();}
  const observer=new ResizeObserver(resize);observer.observe(container);controls.addEventListener('change',render);
  function showStep(step){
    if(step===current)return;
    current=step;from.copy(packet.position);fromScale.copy(packet.scale);elapsed=0;last=null;paused=false;
    const active=slabs.find(s=>s.side===step.side&&s.layer===step.layer);
    for(const s of slabs){s.mesh.material.emissive.setHex(s===active?0x385c63:0);s.mesh.material.opacity=s===active?1:.7;s.mesh.material.transparent=true;}
    halo.visible=Boolean(active);if(active)halo.position.copy(active.mesh.position);
    target.set(step.side==='sender'?-1.5:step.side==='receiver'?1.5:0,step.side==='wire'?.5:step.layer*.7,1.05);
    packet.material.color.setHex(step.dropped?0xff514f:0xffd166);
    packetLabel.textContent=preview?'Frame':step.dropped?'DROP':`${step.pdu} · ${step.bytes} B`;
    // Symbolic header growth, not a byte-accurate shape.
    targetScale.set(1+step.depth*.35,1,1+step.depth*.2);
    if(preview||reduced){packet.position.copy(target);packet.scale.copy(targetScale);}
    container.dataset.side=step.side;container.dataset.layer=step.layer;container.dataset.dropped=Boolean(step.dropped);render();
  }
  function tick(now){if(disposed)return;raf=requestAnimationFrame(tick);if(last!==null&&!paused&&!document.hidden)elapsed+=Math.min(50,now-last);last=now;const p=preview||reduced?1:Math.min(1,elapsed/1600),smooth=p*p*(3-2*p);packet.position.lerpVectors(from,target,smooth);packet.scale.lerpVectors(fromScale,targetScale,smooth);container.dataset.flowProgress=String(p);container.dataset.flowPaused=String(paused);render();}
  resize();tick(performance.now());return {showStep,replay(){if(current){const step=current;current=null;showStep(step);}},stepDuration:()=>2050,pause(){paused=true;},resume(){paused=false;last=null;},resetView(){camera.position.set(0,5.5,16);controls.target.set(0,3,0);controls.update();render();},dispose(){disposed=true;cancelAnimationFrame(raf);observer.disconnect();controls.dispose();scene.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});renderer.dispose();renderer.domElement.remove();packetLabel.remove();motion.remove();labels.forEach(({label})=>label.remove());}};
}
