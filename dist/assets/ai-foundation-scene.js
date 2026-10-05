import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {activate} from './ai-foundation-model.js';
export function mountFoundationScene(host,read,advance){
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));host.append(renderer.domElement);renderer.domElement.setAttribute('role','img');renderer.domElement.setAttribute('aria-label','ภาพสามมิติแสดงกลไกพื้นฐาน AI ลากเพื่อหมุน อ่านค่าตรงตารางได้');
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,1,.1,100),controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=8;controls.maxDistance=24;
 const resetView=()=>{camera.position.set(0,3,15);controls.target.set(0,0,0);controls.update();};resetView();scene.add(new THREE.HemisphereLight(0xe5ffff,0x193144,3));
 const grid=new THREE.GridHelper(14,20,0x345769,0x244253);grid.position.y=-2.5;scene.add(grid);let group,labels=[],motions=[],signature='',elapsed=0,last=performance.now(),raf,disposed=false;
 const V=(x,y,z=0)=>new THREE.Vector3(x,y,z);
 function label(text,p){const el=document.createElement('div');el.className='node-label';el.textContent=text;host.append(el);labels.push({el,p});}
 function cube(p,color,size=.4){const m=new THREE.Mesh(new THREE.BoxGeometry(size,size,.18),new THREE.MeshStandardMaterial({color}));m.position.copy(p);group.add(m);return m;}
 function path(points,color=0x7cdeca){group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color})));}
 function clear(){labels.forEach(l=>l.el.remove());labels=[];motions=[];if(group){group.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});scene.remove(group);}group=new THREE.Group();scene.add(group);}
 function rebuild(s){clear();elapsed=0;
  if(s.topic==='data'){
   s.pixels.forEach((v,i)=>{const from=V(-3+(i%3)*.7,1.1-Math.floor(i/3)*.7),to=V(1.4+(i%3)*.75,1.1-Math.floor(i/3)*.7);const m=cube(from,new THREE.Color(v/255,v/255,v/255),.55);if(s.step>=1)motions.push({m,from,to});label(`${i+1}: ${s.step===2?s.normalized[i].toFixed(2):v}`,to.clone().add(V(0,.45)));});
   label('ภาพ 3×3\nแถว1 → แถว2 → แถว3',V(-2.3,2.5));label(s.step===2?'Vector · ค่า ÷ 255':'Vector · ลำดับเดิม\nแบ่ง3แถวเพื่ออ่านง่าย',V(2.2,2.5));
  }else if(s.topic==='vector'){
   s.dot.products.forEach((v,i)=>{const y=1-i*1.7;label(`x${i+1} ${s.x[i]} × w${i+1} ${s.w[i]}`,V(-3.2,y));label(`ผลคูณ ${v.toFixed(3)}`,V(-.3,y));const from=V(-2,y),to=s.step===2?V(3,0):V(-.8,y),m=cube(from,v>=0?0x77dcbf:0xc49cf3,.3);motions.push({m,from,to});path([from,to]);});label(`Σ ผลคูณ\nDot ${s.dot.sum.toFixed(3)}`,V(3,1));label('Σ = บวกสมาชิกทั้งหมด ไม่ใช่เพิ่ม Dimension',V(0,-2));
  }else if(s.topic==='activation'){
   path([V(-3,0),V(3,0)],0x6a93a5);path([V(0,-3),V(0,3)],0x6a93a5);
   const pts=Array.from({length:121},(_,i)=>{const z=-3+i*.05;return V(z,activate(z,s.kind));});path(pts);const from=V(s.z,0,.12),to=V(s.z,s.a,.12),m=cube(from,0xffcf7b,.18);motions.push({m,from,to});path([from,to],0xffcf7b);label(`z ${s.z}\n${s.kind}(z) ${s.a.toFixed(3)}`,V(s.z>0?s.z-1:s.z+1,s.a+.8));label('z →',V(3.5,-.4));label('a ↑',V(.6,3));label('กราฟ f(z) บนระนาบ · ไม่ใช่ผิวหลายตัวแปร',V(0,-2.9));
  }else{
   s.mse.errors.forEach((e,i)=>{const x=-2+i*4;label(`ŷ${i+1} ${s.pred[i]}\ny${i+1} ${s.target[i]}`,V(x,2.3));const size=s.step>=1?Math.sqrt(s.mse.squares[i])*.65:.35,m=cube(V(x,0),e>=0?0x7adcc7:0xc59df4,size);if(s.step>=1&&e===0)m.visible=false;label(s.step===0?`Error ${e.toFixed(3)}`:`Error² ${s.mse.squares[i].toFixed(3)}`,V(x,-1));if(s.step===2)motions.push({m,from:V(x,0),to:V(0,-.3)});});label(`เฉลี่ย 2 ค่า\nMSE ${s.mse.loss.toFixed(4)}`,V(0,-2));label('ด้านสี่เหลี่ยม ∝ |Error| · พื้นที่ ∝ Error²',V(0,3.4));
  }
 }
 function frame(now){if(disposed)return;const s=read(),key=s.revision+':'+s.step;if(key!==signature){signature=key;rebuild(s);}const dt=Math.min(50,now-last);last=now;if(s.playing)elapsed+=dt*s.speed;const t=Math.min(1,elapsed/1600),smooth=t*t*(3-2*t);motions.forEach(({m,from,to})=>m.position.lerpVectors(from,to,smooth));renderer.domElement.dataset.playhead=elapsed.toFixed(1);renderer.domElement.dataset.step=s.step;controls.update();labels.forEach(({el,p})=>{const n=p.clone().project(camera);el.style.left=`${(n.x*.5+.5)*host.clientWidth}px`;el.style.top=`${(-n.y*.5+.5)*host.clientHeight}px`;el.hidden=n.z>1||n.z< -1;});renderer.render(scene,camera);if(s.playing&&elapsed>=2300){elapsed=2300;advance();}raf=requestAnimationFrame(frame);}
 const resize=()=>{renderer.setSize(host.clientWidth,host.clientHeight);camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();};const ro=new ResizeObserver(resize);ro.observe(host);resize();raf=requestAnimationFrame(frame);return {resetView,dispose(){disposed=true;cancelAnimationFrame(raf);ro.disconnect();controls.dispose();clear();renderer.dispose();renderer.domElement.remove();}};
}
