import assert from 'node:assert/strict';
import {incidentReady,incidentRequirements} from '../dist/assets/incident-evidence.js';
import {networkLessons} from '../dist/assets/network-curriculum.js';
import {arrangeNetwork} from '../dist/assets/network-foundations.js';
import {buildNetworkLab} from '../dist/assets/network-lab-models.js';
const lessons=arrangeNetwork(networkLessons),lesson=lessons.find(l=>l.id==='troubleshooting');
assert(lessons.findIndex(l=>l.id==='network-commands')<lessons.indexOf(lesson));
assert(lessons.findIndex(l=>l.id==='pcap')<lessons.indexOf(lesson));
for(let i=0;i<3;i++){
 assert(!incidentReady(i,[]));assert(!incidentReady(i,[incidentRequirements[i][0]]));
 assert(incidentReady(i,incidentRequirements[i]));
 for(const command of ['link','ip','ping','dns','tcp']){
  const m=buildNetworkLab(lesson,i,{command});
  assert(!m.steps.flatMap(s=>s.fields).some(([k])=>k==='Known fault'));
  if(['link','ip'].includes(command)||i===0)assert(m.steps.every(s=>s.transfers.length===0));
  if(command==='dns'&&i!==0)assert.deepEqual(m.steps[1].transfers.map(t=>[t.from,t.to]),[['client','dns'],['dns','client']]);
 }
}
console.log('PASS 15 incident probes, evidence gates and Operations prerequisite order');
