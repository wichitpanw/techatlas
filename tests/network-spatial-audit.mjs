import assert from 'node:assert/strict';
import {networkLessons} from '../dist/assets/network-curriculum.js';
import {arrangeNetwork,orderedSections} from '../dist/assets/network-foundations.js';
import {networkLabSpecs,buildNetworkLab,networkSpatialUpgrades} from '../dist/assets/network-lab-models.js';
const lessons=arrangeNetwork(networkLessons);
assert.equal(lessons.length,54);
assert.equal(new Set(orderedSections.map(s=>s.code)).size,orderedSections.length);
assert.deepEqual(orderedSections.map(s=>s.code),['0',...Array.from({length:14},(_,i)=>`1·${String(i+1).padStart(2,'0')}`),'2','3']);
assert.deepEqual(lessons.map(l=>l.id),orderedSections.flatMap(s=>lessons.filter(l=>l.section===s.id).map(l=>l.id)));
let scenes=0,scenarios=0;
for(const lesson of lessons){
  const spec=networkLabSpecs[lesson.id];if(!spec)continue;
  for(let i=0;i<lesson.states.length;i++){
    const model=buildNetworkLab(lesson,i);scenarios++;
    if(model.nodes.length>1)assert.equal(spec.mode,'3d',lesson.id+' missing spatial view');
    for(const step of model.steps)for(const transfer of step.transfers){
      assert(model.nodes.some(n=>n.id===transfer.from));assert(model.nodes.some(n=>n.id===transfer.to));assert(transfer.message);
    }
    if(lesson.id==='cloud-hybrid'&&i===0)assert.equal(model.nodes[0].address,'10.1.0.20');
  }
  if(spec.mode==='3d')scenes++;
}
assert.equal(scenes,35);assert.equal(networkSpatialUpgrades.length,24);
console.log(`PASS: 54 lessons, ordered phase codes, ${scenes} spatial mechanisms / ${scenarios} scenarios; 2 address tools intentionally 2D`);
