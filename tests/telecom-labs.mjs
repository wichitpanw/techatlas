import assert from 'node:assert/strict';
import {telecomLessons,buildTelecom} from '../dist/assets/telecom-labs.js';
import {networkLessons} from '../dist/assets/network-curriculum.js';
import {arrangeNetwork} from '../dist/assets/network-foundations.js';
let count=0;
for(const l of telecomLessons)for(let i=0;i<3;i++){
 const m=buildTelecom(l,i),ids=new Set(m.nodes.map(n=>n.id));assert(m.steps.length>1);
 for(const s of m.steps){assert(s.fields.length);for(const t of s.transfers)assert(ids.has(t.from)&&ids.has(t.to));for(const a of s.active)assert(ids.has(a));}count++;
}
const run=(id,i)=>buildTelecom(telecomLessons.find(l=>l.id===id),i);
assert(!run('subscriber-session',1).steps.some(s=>s.transfers.some(t=>t.to==='net')));
assert(run('ftth-access',1).steps.every(s=>s.transfers.length===0));
assert(run('bgp-peering',1).steps.at(-1).transfers.some(t=>t.to==='transit'));
assert(run('cgnat-ipv6',1).steps.at(-1).status==='blocked');
const ids=arrangeNetwork(networkLessons).map(l=>l.id);assert.equal(new Set(ids).size,ids.length);
assert(ids.indexOf('ftth-access')<ids.indexOf('subscriber-session'));assert(ids.indexOf('mpls-vpn')<ids.indexOf('enterprise-path'));assert(ids.indexOf('bgp-peering')<ids.indexOf('noc-incident'));
console.log('PASS new provider models: '+count+' scenarios, failure boundaries and prerequisite order');
