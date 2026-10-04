import assert from 'node:assert/strict';
import {networkLessons} from '../dist/assets/network-curriculum.js';
import {arrangeNetwork} from '../dist/assets/network-foundations.js';
import {buildNetworkLab} from '../dist/assets/network-lab-models.js';
const lesson=arrangeNetwork(networkLessons).find(l=>l.id==='network-commands');
for(let scenario=0;scenario<3;scenario++){
 for(const command of ['ip','arp','netstat']){
  const model=buildNetworkLab(lesson,scenario,{command});
  assert(model.steps.every(s=>s.transfers.length===0));
  assert.deepEqual(model.steps[1].active,['client']);
 }
 const dns=buildNetworkLab(lesson,scenario,{command:'nslookup'});
 assert.equal(dns.nodes.find(n=>n.id==='dns').address,scenario===1?'192.168.10.54':'192.168.10.53');
 assert.equal(dns.steps[1].transfers.length,scenario===1?1:2);
 const ping=buildNetworkLab(lesson,scenario,{command:'ping'});
 assert.equal(ping.steps[1].transfers.length,scenario===2?1:4);
 assert(!ping.steps[1].transfers.some(t=>t.from==='client'&&t.to==='server'));
}
console.log('PASS CLI: local reads, resolver consistency, bounded request/reply and blocked next hop');
