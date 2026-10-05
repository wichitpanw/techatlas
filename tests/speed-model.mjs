import assert from 'node:assert/strict';
import {clampSpeed} from '../dist/assets/animation-speed.js';
import {startFlowPlayback} from '../dist/assets/flow-playback.js';
assert.equal(clampSpeed(NaN),1);assert.equal(clampSpeed(.1),.5);assert.equal(clampSpeed(5),2);
for(const rate of [.5,1,2]){
  let queue=new Map(),id=0,step=0,finished=false;
  globalThis.document={hidden:false};globalThis.requestAnimationFrame=f=>{queue.set(++id,f);return id;};globalThis.cancelAnimationFrame=i=>queue.delete(i);
  const scene={speed:()=>rate,stepDuration:()=>200};let player;
  player=startFlowPlayback({scene:()=>scene,advance:()=>step++,atEnd:()=>step===1,onEnd:()=>{finished=true;player.stop();}});
  const tick=t=>{const pending=[...queue.values()];queue.clear();pending.forEach(f=>f(t));};
  for(let t=0;t<400/rate;t+=25)tick(t);
  assert.equal(finished,false);tick(400/rate);assert.equal(finished,true);assert.equal(queue.size,0);
}
// Change speed mid-flight without restarting or skipping steps.
let rate=.5,q=[],step=0;globalThis.requestAnimationFrame=f=>{q=[f];return 1;};globalThis.cancelAnimationFrame=()=>{q=[];};
const scene={speed:()=>rate,stepDuration:()=>200};const player=startFlowPlayback({scene:()=>scene,advance:()=>step++,atEnd:()=>false,onEnd:()=>{}});
for(const t of [0,50,100]){const pending=q;q=[];pending.forEach(f=>f(t));}assert.equal(step,0);
rate=2;for(const t of [150,175]){const pending=q;q=[];pending.forEach(f=>f(t));}assert.equal(step,1);player.stop();
console.log('PASS rate boundaries, 0.5/1/2 scheduler timing and mid-flight rate change');
