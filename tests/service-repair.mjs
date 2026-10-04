import assert from 'node:assert/strict';
import {simulateVideo,simulateRate,serviceLessons,serviceScene} from '../dist/assets/service-tools.js';
import {repairInitial,repairResult,repairModel} from '../dist/assets/repair-lab.js';
import {arrangeNetwork} from '../dist/assets/network-foundations.js';
import {networkLessons} from '../dist/assets/network-curriculum.js';
let cases=0;
for(const pattern of ['steady','bursty','slow'])for(const startup of [0,2,4]){
 const m=simulateVideo({pattern,startup});let received=0;
 for(const s of m.steps){received+=s.incoming;assert.equal(received,s.played+s.buffer);assert(s.buffer>=0);}
 assert.equal(serviceScene(serviceLessons[0],m).steps.length,12);cases++;
}
assert.equal(simulateVideo({pattern:'steady',startup:0}).stalls,0);
assert(simulateVideo({pattern:'slow',startup:0}).stalls>0);
for(const policy of ['shape','police'])for(const rate of [1,2,4])for(const bucket of [2,4,8]){
 const m=simulateRate({policy,rate,bucket});let received=0;
 for(const s of m.steps){received+=s.incoming.length;assert.equal(received,s.sent+s.dropped+s.queue.length);assert(s.tokens>=0&&s.tokens<=bucket);if(policy==='shape')assert.equal(s.lost.length,0);else assert.equal(s.queue.length,0);}
 assert.equal(m.sent+m.dropped+m.pending,20);cases++;
}
for(const fault of ['vlan','route','uplink']){
 const s=repairInitial(fault);assert(!repairResult(s).ok);assert(!repairModel(s).steps[0].transfers.some(t=>t.to==='server'));
 if(fault==='vlan')s.vlan=10;if(fault==='route')s.route=true;if(fault==='uplink')s.uplink=true;
 assert(repairResult(s).ok);assert(repairModel(s).steps[0].transfers.some(t=>t.from==='server'));cases++;
}
const ids=arrangeNetwork(networkLessons).map(l=>l.id);assert.equal(ids.length,63);assert.equal(new Set(ids).size,63);
assert(ids.indexOf('network-quality')<ids.indexOf('video-buffer'));assert(ids.indexOf('qos-queues')<ids.indexOf('rate-control'));
console.log(`PASS ${cases} new service/repair configurations, conservation, return path and 63-lesson order`);
