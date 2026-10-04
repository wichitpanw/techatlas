import assert from 'node:assert/strict';
import {simulateQueue} from '../dist/assets/network-quality.js';
import {queueSceneModel} from '../dist/assets/quality-scene-model.js';
for(const policy of ['fifo','priority']){
 const m=simulateQueue({policy}),scene=queueSceneModel(m);
 for(let i=0;i<24;i++){
  assert.equal(scene.steps[i].transfers.length,m.steps[i].outgoing.length+m.steps[i].lost.length);
  assert(scene.steps[i].nodeUpdates.queue.includes(String(m.steps[i].queue.length)));
  assert.equal(scene.steps[i].transfers.filter(t=>t.to==='drop').length,m.steps[i].lost.length);
 }
}
console.log('PASS new queue 3D mapping: 48 frames, exact output/drop identity and queue occupancy');
