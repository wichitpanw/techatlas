import assert from 'node:assert/strict';
import {simulateQueue} from '../dist/assets/network-quality.js';
import {networkLessons} from '../dist/assets/network-curriculum.js';
import {arrangeNetwork} from '../dist/assets/network-foundations.js';
for(const capacity of [1,2,8])for(const buffer of [1,8,32])for(const burst of [0,4,8])for(const policy of ['fifo','priority']){
 const m=simulateQueue({capacity,buffer,burst,policy});
 assert.equal(m.sent.length+m.dropped.length+m.pending.length,12*(burst+1));
 assert(m.steps.every(s=>s.queue.length<=buffer&&s.outgoing.length<=capacity));
 assert(m.sent.every(p=>p.depart>=p.arrive&&p.delay>=30));
}
assert.throws(()=>simulateQueue({capacity:0}));
const fifo=simulateQueue(),priority=simulateQueue({policy:'priority'});
assert(priority.game.delay<fifo.game.delay);
assert.equal(priority.bandwidth,fifo.bandwidth);
const ordered=arrangeNetwork(networkLessons).map(l=>l.id);
assert.deepEqual(ordered.slice(ordered.indexOf('https'),ordered.indexOf('https')+3),['https','network-quality','qos-queues']);
console.log('PASS: 54 new queue combinations, conservation, priority trade-off, bounds and new lesson ordering');
