import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {linear} from './ai-neural-model.js';
export function mountScene(host,read,onAdvance){
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,1,.1,100);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));host.append(renderer.domElement);renderer.domElement.setAttribute('role','img');renderer.domElement.setAttribute('aria-label','โครงสร้างและการคำนวณของโมเดล AI จิ๋วสามมิติ ลากเพื่อหมุน อ่านค่าที่ตารางได้');
  const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=8;controls.maxDistance=24;
  scene.add(new THREE.HemisphereLight(0xc4f9ff,0x173144,2));const lamp=new THREE.DirectionalLight(0xffffff,3);lamp.position.set(3,8,8);scene.add(lamp);
  const grid=new THREE.GridHelper(18,24,0x386477,0x234351);grid.position.y=-3;scene.add(grid);
  let group=new THREE.Group();scene.add(group);let labels=[],particles=[],signature='',elapsed=0,last=performance.now(),raf,disposed=false;
  const resetView=()=>{camera.position.set(0,4,14);controls.target.set(0,0,0);controls.update();};resetView();
  const label=(name,position)=>{const el=document.createElement('div');el.className='node-label';el.textContent=name;host.append(el);labels.push({el,position});};
  const ball=(pos,color,size=.23)=>{const mesh=new THREE.Mesh(new THREE.SphereGeometry(size,20,14),new THREE.MeshStandardMaterial({color,roughness:.3,metalness:.25}));mesh.position.copy(pos);group.add(mesh);return mesh;};
  const line=(a,b,color)=>{const curve=new THREE.QuadraticBezierCurve3(a,new THREE.Vector3((a.x+b.x)/2,(a.y+b.y)/2+.25,0),b);const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,30,.018,6,false),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.55}));group.add(mesh);return curve;};
  function clear(){for(const l of labels)l.el.remove();labels=[];particles=[];group.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose();});scene.remove(group);group=new THREE.Group();scene.add(group);}
  function rebuild(s){clear();elapsed=0;const V=(x,y,z=0)=>new THREE.Vector3(x,y,z);
    if(s.lesson==='gradient'){
      const geo=new THREE.PlaneGeometry(6,6,35,35),a=geo.attributes.position;
      for(let i=0;i<a.count;i++){const w=a.getX(i)/1.5,b=a.getY(i)/1.5;a.setXYZ(i,a.getX(i),Math.min(8,linear(w,b).loss)*.65-2,a.getY(i));}geo.computeVertexNormals();
      group.add(new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0x399f94,side:THREE.DoubleSide,wireframe:true,transparent:true,opacity:.4})));
      const point=p=>V(p.w*1.5,Math.min(8,linear(p.w,p.b).loss)*.65-2,p.b*1.5);
      const end=s.history.at(-1),start=s.history.at(-2)||end;const orb=ball(point(start),0xffca6b,.17);particles.push({mesh:orb,curve:new THREE.LineCurve3(point(start),point(end)),once:true});
      for(let i=1;i<s.history.length;i++)line(point(s.history[i-1]),point(s.history[i]),0xffca6b);
      label(`w ${end.w.toFixed(3)} · b ${end.b.toFixed(3)}\nLoss ${linear(end.w,end.b).loss.toFixed(4)}`,point(end).add(V(0,.7)));
      label('w →',V(4,-2,0));label('b →',V(0,-2,4));label('สูง = Loss มาก\nผิวแสดงช่วง w,b ∈ [−2,2]',V(-3,2,-3));return;
    }
    const neuron=s.lesson==='neuron',f=s.f;
    const xs=[V(-4,1),V(-4,-1)],hs=neuron?[V(0,0)]:[V(0,1.6),V(0,0),V(0,-1.6)],ys=neuron?[]:[V(4,1),V(4,-1)];
    xs.forEach((p,i)=>{ball(p,0x74cbe5);label(`x${i+1} ${f.x[i].toFixed(3)}`,p.clone().add(V(0,.7)));});
    const backward=s.lesson==='backprop'&&s.step>=3;
    hs.forEach((p,j)=>{ball(p,0x71ddbc,.32);label(neuron?`z = ${s.z.toFixed(3)}`:backward?`∂L/∂z${j+1}\n${f.dz[j].toFixed(3)}`:s.step===0?`z${j+1} ${f.z[j].toFixed(3)}`:`h${j+1} ${f.h[j].toFixed(3)}`,p.clone().add(V(0,.65)));});
    ys.forEach((p,k)=>{ball(p,0xf2c779,.32);label(backward?`∂L/∂ŷ${k+1}\n${f.dy[k].toFixed(3)}`:`ŷ${k+1} ${f.y[k].toFixed(3)}`,p.clone().add(V(0,.7)));});
    function connect(a,b,w,active){const c=line(a,b,w>=0?0x7adebc:0xd599ff);if(active){const curve=backward?new THREE.QuadraticBezierCurve3(b,c.v1,a):c;particles.push({mesh:ball(curve.getPoint(0),backward?0xffab8f:0x9cffdf,.08),curve});}}
    xs.forEach((a,i)=>hs.forEach((b,j)=>connect(a,b,neuron?s.weights[i]:s.p.w1[j][i],neuron||s.step===0||s.step===1||s.step===4)));
    hs.forEach((a,j)=>ys.forEach((b,k)=>connect(a,b,s.p.w2[k][j],s.step===2||s.step===3)));
    label(neuron?`x₁w₁ = ${(s.x[0]*s.weights[0]).toFixed(3)}\nb = ${s.bias.toFixed(3)}`:backward?`∂L/∂w₁[1,1]\n= ∂L/∂z₁ × x₁\n= ${f.grad.w1[0][0].toFixed(3)}`:`เส้น x₁ → h₁\nw = ${s.p.w1[0][0].toFixed(3)}\nx₁w = ${(s.x[0]*s.p.w1[0][0]).toFixed(3)}`,V(-2,3.3));
    label(backward?'← Gradient · ความไวของ Loss ไม่ใช่ข้อมูลย้อนกลับ':'→ ค่าที่คำนวณจาก Input · เส้นเขียวบวก / ม่วงลบ',V(0,-2.6));
  }
  function frame(now){if(disposed)return;const s=read(),sig=s.revision+':'+s.step;if(sig!==signature){signature=sig;rebuild(s);}const dt=Math.min(50,now-last);last=now;if(s.playing)elapsed+=dt*s.speed;
    const phase=Math.min(1,elapsed/1600);for(const p of particles)p.mesh.position.copy(p.curve.getPoint(phase));renderer.domElement.dataset.playhead=elapsed.toFixed(1);renderer.domElement.dataset.step=String(s.step);renderer.domElement.dataset.particles=String(particles.length);
    if(s.playing&&elapsed>=2300){elapsed=2300;onAdvance();}
    controls.update();for(const l of labels){const p=l.position.clone().project(camera);l.el.style.left=`${(p.x*.5+.5)*host.clientWidth}px`;l.el.style.top=`${(-p.y*.5+.5)*host.clientHeight}px`;l.el.hidden=p.z>1||p.z< -1;}
    renderer.render(scene,camera);raf=requestAnimationFrame(frame);
  }
  const resize=()=>{renderer.setSize(host.clientWidth,host.clientHeight);camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();};const ro=new ResizeObserver(resize);ro.observe(host);resize();raf=requestAnimationFrame(frame);
  return {resetView,dispose(){disposed=true;cancelAnimationFrame(raf);ro.disconnect();controls.dispose();clear();renderer.dispose();renderer.domElement.remove();}};
}
