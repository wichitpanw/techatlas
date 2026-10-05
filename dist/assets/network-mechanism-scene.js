import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { appliance, laptop, rack, material, box } from './scene.js';
import { buildNetworkLab } from './network-lab-models.js';

export function mountScene(container, {lesson, preview=false,initialModel}={}) {
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x102732);
  container.append(renderer.domElement);renderer.domElement.setAttribute('role','img');renderer.domElement.setAttribute('aria-label',lesson.title+' · แบบจำลองกลไกสามมิติ');
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,1,.1,100),controls=new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true;controls.enablePan=false;controls.enabled=!preview;controls.minDistance=7;controls.maxDistance=40;controls.maxPolarAngle=Math.PI*.48;
  scene.add(new THREE.HemisphereLight(0xe1f4ff,0x233d48,3));const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(5,10,6);scene.add(light);
  const grid=new THREE.GridHelper(20,20,0x375a69,0x203d49);grid.position.y=-.1;scene.add(grid);
  const labels=document.createElement('div');labels.className='mechanism-labels';labels.hidden=preview;container.append(labels);
  const decision=document.createElement('div');decision.className='mechanism-decision';decision.hidden=preview;decision.setAttribute('aria-live','off');container.append(decision);
  // These are logical contexts, not extra routers or cables in a real topology.
  const logicalNodes={
    'video-buffer':['in','buffer','out','drop'],'rate-control':['in','buffer','out','drop'],
    'dns-cache':['cache'],acl:['rules'],'cloud-vpc':['rt'],
    'automation-tools':['current','plan','desired'],sdn:['mgmt','control','data'],
    hsrp:['vip'],
  };
  let model=initialModel||buildNetworkLab(lesson), stepIndex=0, meshGroup=new THREE.Group(),objects=[],links=[],messages=[],started=0,packetMeter=null,byteSlots=[];scene.add(meshGroup);
  const traffic=new THREE.Group();scene.add(traffic);
  function clearTraffic(){traffic.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});traffic.clear();for(const m of messages)m.label.remove();messages=[];}
  const positions=new Map();
  function clear(){clearTraffic();meshGroup.traverse(o=>{o.geometry?.dispose();for(const m of(Array.isArray(o.material)?o.material:[o.material])){m?.map?.dispose();m?.dispose();}});scene.remove(meshGroup);meshGroup=new THREE.Group();scene.add(meshGroup);labels.replaceChildren();objects=[];links=[];positions.clear();}
  function build(next){
    model=next;clear();packetMeter=null;byteSlots=[];
    if(lesson.id==='tcp-handshake'&&model.parameters.flow==='data'){
      for(let i=0;i<2;i++){
        const slot=new THREE.Mesh(new THREE.BoxGeometry(2.1,.3,.8),new THREE.MeshStandardMaterial({color:0x355666}));
        slot.position.set(i*2.3-1.15,.35,3);meshGroup.add(slot);
        const label=document.createElement('span');label.className='mechanism-flight';label.hidden=preview;labels.append(label);
        byteSlots.push({slot,label,anchor:new THREE.Vector3(i*2.3-1.15,1,3)});
      }
    }
    if(lesson.id==='mtu-pmtud'){
      // A byte ruler, not a claim that packets are physical blocks on a wire.
      const bar=new THREE.Mesh(new THREE.BoxGeometry(1,.45,.65),new THREE.MeshStandardMaterial({color:0x73dfc5}));
      bar.position.set(-4,.5,3);meshGroup.add(bar);packetMeter=bar;
      box(meshGroup,0,.12,3,8,.06,1,material(0x355666));
      const boundary=-4+8*model.pathMTU/1600;
      box(meshGroup,boundary,.7,3,.055,1.25,1.1,material(0xf4bd64));
      for(let n=0;n<=1600;n+=400)box(meshGroup,-4+8*n/1600,.18,3,.025,.08,1.1,material(0x799aaa));
    }
    for(const zone of model.zones||[]){const pad=new THREE.Mesh(new THREE.BoxGeometry(zone.width,.08,zone.depth),new THREE.MeshStandardMaterial({color:zone.color,transparent:true,opacity:.35}));pad.position.set(zone.x,-.02,zone.z);meshGroup.add(pad);}
    model.nodes.forEach((n,i)=>{
      const count=model.nodes.length;
      const x=n.position?.[0]??(count===3?[-4,0,4][i]:count===4?[-5,-1.8,1.8,5][i]:-6+i*12/(count-1));
      const z=n.position?.[1]??(count===3&&i===1?-3:count>=4?(i%2?-.9:.9):.5);
      const logical=!!n.logical||(logicalNodes[lesson.id]||[]).includes(n.id);
      const group=logical?new THREE.Group():n.kind==='client'?laptop():n.kind==='server'?rack():appliance(n.kind==='switch'?'switch':n.kind==='ap'?'router':'router');
      if(logical){box(group,0,.8,0,2,1.3,.3,material(0x426a87));box(group,0,.8,.17,1.7,1,.03,material(0x153742));}
      group.scale.setScalar(n.kind==='server'?.55:.85);group.position.set(x,0,z);meshGroup.add(group);positions.set(n.id,new THREE.Vector3(x,.6,z));
      const anchor=new THREE.Vector3(x,2,z);const button=document.createElement('button');button.className='mechanism-device';
      const name=document.createElement('strong'),address=document.createElement('span');name.textContent=n.name;address.textContent=n.address;button.append(name,address);if(logical){const note=document.createElement('small');note.textContent='บริบทเชิงตรรกะ';button.append(note);}labels.append(button);
      button.addEventListener('click',()=>{container.dispatchEvent(new CustomEvent('mechanism-pick',{detail:n.id}));});
      objects.push({id:n.id,group,button,anchor});
      if(lesson.id==='wireless-radio'){
        const ring=new THREE.Mesh(new THREE.RingGeometry(1.2,2,64),new THREE.MeshBasicMaterial({color:[0x73dfc5,0x75bafa,0xf4bd64][i],side:THREE.DoubleSide,transparent:true,opacity:.25}));ring.rotation.x=-Math.PI/2;ring.position.set(x,.02,z);meshGroup.add(ring);
      }
    });
    model.links.forEach(l=>{const points=[positions.get(l.from),positions.get(l.to)];const logical=lesson.apiLab||(logicalNodes[lesson.id]||[]).some(id=>id===l.from||id===l.to);const mat=logical?new THREE.LineDashedMaterial({color:0x526d79,transparent:true,opacity:.65,dashSize:.35,gapSize:.2}):new THREE.LineBasicMaterial({color:0x526d79,transparent:true,opacity:.65});const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),mat);if(logical)line.computeLineDistances();meshGroup.add(line);links.push({id:l.id,line});});
  }
  function show(index){
    stepIndex=Math.max(0,Math.min(index,model.steps.length-1));const frame=model.steps[stepIndex];
    if(packetMeter){const length=8*frame.datagramBytes/1600;packetMeter.scale.x=length;packetMeter.position.x=-4+length/2;packetMeter.material.color.set(frame.datagramBytes>model.pathMTU?0xed8e7c:0x73dfc5);}
    if(byteSlots.length){
      const chunk=Math.min(Number(model.parameters.bytes),Number(model.parameters.rwnd),Number(model.parameters.cwnd));
      let delivered=0,buffered=0;
      for(const s of model.steps.slice(0,stepIndex+1))for(const [key,value] of s.fields){if(key==='Delivered bytes')delivered=Number(value);if(key==='Buffered out-of-order')buffered=parseInt(value,10);}
      byteSlots.forEach((b,i)=>{
        const ready=chunk>0&&delivered>=(i+1)*chunk,pending=i===1&&buffered>0;
        b.slot.material.color.set(ready?0x73dfc5:pending?0xf4bd64:0x355666);
        b.label.textContent=chunk?`${101+i*chunk}–${100+(i+1)*chunk} · ${ready?'พร้อมอ่าน':pending?'รอช่วงแรก':'ยังไม่พร้อม'}`:'Window 0 · ไม่ส่งข้อมูล';
      });
      renderer.domElement.dataset.deliveredBytes=String(delivered);renderer.domElement.dataset.bufferedBytes=String(buffered);
    }
    decision.replaceChildren();const title=document.createElement('strong');title.textContent=frame.title;decision.append(title);
    for(const [key,value] of frame.fields.slice(0,3)){const row=document.createElement('span');row.textContent=`${key}: ${value}`;decision.append(row);}
    decision.classList.toggle('blocked',frame.status==='blocked');
    for(const o of objects){o.button.classList.toggle('active',frame.active.includes(o.id));o.button.classList.toggle('blocked',frame.status==='blocked'&&frame.active.includes(o.id));o.group.position.y=frame.active.includes(o.id)?.12:0;o.button.querySelector('span').textContent=frame.nodeUpdates[o.id]||model.nodes.find(n=>n.id===o.id).address;}
    for(const l of links){const active=frame.edges.includes(l.id);l.line.material.color.set(active?(frame.status==='blocked'?0xed8e7c:0x7ce4c6):0x526d79);l.line.material.opacity=active?1:.4;}
    clearTraffic();started=performance.now();
    frame.transfers.forEach((t,i)=>{
      const from=positions.get(t.from)?.clone(),to=positions.get(t.to)?.clone();if(!from||!to)return;
      from.y+=.45;to.y+=.45;
      const color=frame.status==='blocked'?0xed8e7c:t.message.includes('ARP')?0xf4bd64:0x7ce4c6;
      const marker=new THREE.Mesh(new THREE.BoxGeometry(.38,.24,.24),new THREE.MeshBasicMaterial({color}));traffic.add(marker);
      const direction=to.clone().sub(from).normalize(),arrow=new THREE.ArrowHelper(direction,from,from.distanceTo(to),color,.35,.18);traffic.add(arrow);
      const label=document.createElement('span');label.className='mechanism-flight'+(frame.status==='blocked'?' blocked':'');label.textContent=t.message;label.hidden=preview;labels.append(label);
      messages.push({from,to,marker,label,index:i});
    });
    renderer.domElement.dataset.step=String(stepIndex);
  }
  function resize(){const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();reset();}
  function reset(){const distance=Math.max(15,14/Math.max(camera.aspect,.45));camera.position.set(distance*.35,distance*.48,distance*.75);controls.target.set(0,.5,0);controls.update();}
  build(model);show(0);
  let disposed=false,raf;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function place(element,p,placed){
    if(preview||element.hidden)return;
    const w=element.offsetWidth,h=element.offsetHeight,left=w/2+8,right=container.clientWidth-w/2-8;
    const top=h/2+8,bottom=Math.max(top,container.clientHeight-decision.offsetHeight-h/2-20);
    const x=Math.max(left,Math.min(right,(p.x+1)*.5*container.clientWidth)),y=Math.max(top,Math.min(bottom,(-p.y+1)*.5*container.clientHeight));
    let best={x,y},cost=Infinity;
    for(const candidateX of [x,left,right])for(let candidateY=top;candidateY<=bottom;candidateY+=8){
      if(placed.some(r=>Math.abs(candidateX-r.x)<(w+r.w)/2+5&&Math.abs(candidateY-r.y)<(h+r.h)/2+5))continue;
      const distance=(candidateX-x)**2+(candidateY-y)**2;if(distance<cost){cost=distance;best={x:candidateX,y:candidateY};}
    }
    placed.push({...best,w,h});element.style.left=best.x+'px';element.style.top=best.y+'px';
  }
  function tick(){if(disposed)return;raf=requestAnimationFrame(tick);controls.update();const placed=[];for(const o of objects){const p=o.anchor.clone().project(camera);o.button.hidden=preview||p.z>1||p.z< -1||(objects.length>8&&!model.steps[stepIndex].active.includes(o.id));place(o.button,p,placed);}
    for(const b of byteSlots){const p=b.anchor.clone().project(camera);b.label.hidden=preview||p.z>1||p.z< -1;place(b.label,p,placed);}
    // Named transfers come from the teaching model, never inferred from every lit link.
    for(const m of messages){const progress=(reduced||preview)? .5:Math.min(1,(performance.now()-started)/1100);m.marker.position.lerpVectors(m.from,m.to,progress);const midpoint=m.from.clone().lerp(m.to,.5);midpoint.y+=.65+m.index*.28;const p=midpoint.project(camera);m.label.hidden=preview||p.z>1||p.z< -1;place(m.label,p,placed);}
    if(!preview&&!reduced)for(const l of links)if(model.steps[stepIndex].edges.includes(l.id))l.line.material.opacity=.78+Math.sin(performance.now()/450)*.2;
    renderer.render(scene,camera);
  }
  const observer=new ResizeObserver(resize);observer.observe(container);resize();tick();
  return {setModel(next){build(next);show(0);},showStep:show,resetView:reset,snapshot(){return {step:stepIndex,transfers:messages.map(m=>({message:m.label.textContent,position:m.marker.position.toArray()}))};},dispose(){disposed=true;cancelAnimationFrame(raf);observer.disconnect();controls.dispose();clear();grid.geometry.dispose();grid.material.dispose();renderer.dispose();renderer.domElement.remove();labels.remove();decision.remove();}};
}
