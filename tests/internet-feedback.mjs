import assert from 'node:assert/strict';
import {buildInternet} from '../dist/assets/internet-model.js';
import {reportText} from '../dist/assets/feedback.js';
let cases=0;
for(const service of ['social','cdn','game'])for(const route of ['peering','transit'])for(const fault of ['none','dns','gateway','uplink']){
  const m=buildInternet({service,route,fault});assert(m.steps.length>=2);
  for(const step of m.steps)for(const t of step.transfers){assert(m.nodes.some(n=>n.id===t.from));assert(m.nodes.some(n=>n.id===t.to));assert(m.links.some(l=>(l.from===t.from&&l.to===t.to)||(l.to===t.from&&l.from===t.to)));}
  assert.equal(m.steps.at(-1).status,fault==='none'?'ok':'blocked');
  if(fault==='none'){assert.equal(m.steps.at(-1).active[0],'client');assert(m.steps.some(s=>s.active.includes(service)));assert(m.steps.some(s=>s.transfers.some(t=>t.from===(route==='peering'?'ix':'transit'))));}
  if(fault==='gateway')assert.equal(m.steps.flatMap(s=>s.transfers).length,0);
  if(fault==='dns')assert(!m.steps.some(s=>s.title==='เตรียม TCP และ TLS ก่อน HTTP'));
  cases++;
}
const text=reportText({kind:'bug',scope:'lesson',title:'TCP',url:'https://example.test/#lesson/tcp-handshake',message:'เล่นไม่ได้',steps:'กดเล่น',expected:'SYN-ACK'});assert(text.includes('TCP'));assert(text.includes('เล่นไม่ได้'));assert(text.includes('SYN-ACK'));
console.log(`PASS: Internet ${cases} service/route/fault cases; feedback text`);
