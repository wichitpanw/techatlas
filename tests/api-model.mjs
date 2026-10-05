import assert from 'node:assert/strict';
import {apiLessons,apiSections} from '../dist/assets/api-curriculum.js';
import {buildAPI,apiMessages} from '../dist/assets/api-model.js';
import {termsForLesson,glossaryEntries} from '../dist/assets/lesson-terms.js';
assert.equal(apiLessons.length,9);
assert.equal(new Set(apiLessons.map(l=>l.id)).size,9);
let runs=0;
for(const l of apiLessons){
 assert(apiSections.some(s=>s.id===l.section));
 assert(l.source.startsWith('https://'));assert(l.work&&l.reason&&l.choices[l.answer]);
 for(let s=0;s<3;s++)for(const id of ['1','99'])for(const message of ['สมุดใหม่','','<img src=x onerror=alert(1)>']){
  const m=buildAPI(l,s,{id,message});runs++;const ids=new Set(m.nodes.map(n=>n.id));
  assert(m.steps.length>=2);assert(m.nodes.some(n=>n.logical));
  for(const f of m.steps){assert(f.title&&f.detail);assert(Array.isArray(f.fields));
   for(const t of f.transfers){assert(ids.has(t.from)&&ids.has(t.to));assert(t.message);}
   for(const e of f.edges)assert(m.links.some(x=>x.id===e));
   for(const n of Object.keys(f.nodeUpdates))assert(ids.has(n));
  }
  assert.deepEqual(m,buildAPI(l,s,{id,message}),'deterministic rebuild');
 }
 const terms=termsForLesson({...l,termMechanisms:l.cases.map((_,s)=>buildAPI(l,s))});
 assert(terms.length>=4,l.id+' glossary');assert(terms.every(t=>t.track==='programming'));
 assert.throws(()=>buildAPI(l,3));assert.throws(()=>buildAPI(l,0,{id:'2'}));assert.throws(()=>buildAPI(l,0,{message:'x'.repeat(81)}));
}
const model=(kind,s=0,p)=>buildAPI(apiLessons.find(l=>l.kind===kind),s,p);
assert(model('basics',2).steps[0].request.includes('not-a-number'));
assert(model('rest',1).steps.at(-1).fields.some(([k,v])=>k==='HTTP'&&v==='201 Created'));
assert(model('rest',0,{id:'99'}).steps.at(-1).response.includes('not_found'));
assert.deepEqual(JSON.parse(model('graphql').steps.at(-1).response),{data:{product:{name:'สมุด'}}});
assert.equal(model('graphql',2).steps.at(-1).fields.find(([k])=>k==='Resolver calls')[1],0);
assert.equal(model('grpc',1).steps.filter(s=>/^Response message/.test(s.title)).length,2);
assert(model('grpc',2).steps.at(-1).transfers.length===0,'deadline is local, not fabricated server reply');
assert(model('soap',2).steps.at(-1).response.includes('VersionMismatch'));
const versionFault=model('soap',2).steps.at(-1).response;
assert(versionFault.includes('xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"'));
assert(versionFault.includes('<faultcode>s:VersionMismatch</faultcode>'));
assert(!versionFault.includes('<env:Code>'),'SOAP 1.1 fault is not SOAP 1.2 fault shape');
assert.equal(model('grpc').steps.filter(s=>s.response!==undefined).length,1,'status not second unary message');
assert.equal(model('grpc',1).steps.filter(s=>s.response!==undefined).length,2,'status not third stream message');
assert.equal(apiMessages(model('grpc'),99).messages,1);
assert(apiMessages(model('grpc'),99).response.includes('RPC status'));
assert.equal(apiMessages(model('grpc',2),99).messages,0,'deadline not app data');
assert(apiMessages(model('websocket',2),99).response.includes('101'));
assert(!apiMessages(model('websocket',2),99).response.includes('รับข้อความแล้ว'));
assert(apiMessages(model('sse'),1).response.includes('text/event-stream'),'headers received before events');
assert.equal(apiMessages(model('sse'),1).messages,0,'headers not event');
assert.equal(model('webhooks',2).steps.at(-1).fields.find(([k])=>k==='HTTP in mock')[1],403);
assert(model('websocket').steps.at(-1).nodeUpdates.client==='OPEN');
assert(!model('websocket',2).steps.at(-1).response,'disconnect does not fabricate app reply');
assert(!model('sse',2).steps.at(-1).response,'invalid reverse channel does not fabricate event');
assert(model('sse',1).steps.at(-1).response.startsWith('id: 2'));
assert(!model('long-polling',2).steps.at(-1).response);
assert(model('long-polling').steps.at(-1).request.endsWith('after=1'));
assert(!model('webhooks',1).steps.find(s=>s.title.startsWith('ACK')).response);
assert.equal(model('webhooks',1).steps.at(-1).nodeUpdates.work,'processed = 1');
assert.equal(model('webhooks',2).steps.at(-1).nodeUpdates.work,'processed = 0');
console.log(`PASS API-only: ${runs} model combinations, 9 lesson metadata/glossary and mechanism invariants; ${glossaryEntries.filter(e=>e.track==='programming').length} API terms`);
