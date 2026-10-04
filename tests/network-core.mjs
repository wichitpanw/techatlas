import assert from 'node:assert/strict';
import {networkLessons} from '../dist/assets/network-curriculum.js';
import {arrangeNetwork} from '../dist/assets/network-foundations.js';
import {buildNetworkLab} from '../dist/assets/network-lab-models.js';
import {buildInternet} from '../dist/assets/internet-model.js';
import {termsForLesson,glossaryEntries} from '../dist/assets/lesson-terms.js';
const lessons=arrangeNetwork(networkLessons),get=id=>lessons.find(l=>l.id===id);
const run=(id,s=0,p={})=>buildNetworkLab(get(id),s,p);
const field=(s,k)=>s.fields.find(([name])=>name===k)?.[1];
const ids=['dhcp','tcp-handshake','dns','dns-cache','mtu-pmtud','hsrp','cloud-vpc','cloud-hybrid'];
let scenarios=0;
for(const id of ids)for(let s=0;s<get(id).states.length;s++){
  const m=run(id,s),nodes=new Set(m.nodes.map(n=>n.id));scenarios++;
  assert(m.steps.length>1);
  for(const frame of m.steps){
    assert(frame.title&&frame.detail);assert(frame.nodeUpdates);assert(frame.active.every(id=>nodes.has(id)));
    assert(frame.transfers.every(t=>nodes.has(t.from)&&nodes.has(t.to)&&t.message));
    assert(frame.edges.every(id=>m.links.some(e=>e.id===id)));
  }
}
assert.equal(lessons.length,64);assert.equal(new Set(lessons.map(l=>l.id)).size,64);
const order=lessons.map(l=>l.id);assert.equal(order.at(-1),'internet');
assert.equal(order[order.indexOf('tcp-handshake')+1],'mtu-pmtud');
assert.equal(order[order.indexOf('dns')+1],'dns-cache');
for(const id of ['dhcp','tcp-handshake','dns','dns-cache','mtu-pmtud']){
  assert(get(id).observationRequired);assert(get(id).work.length>60);assert(get(id).source.startsWith('https://'));
}
assert(run('hsrp').steps.every(s=>s.nodeUpdates.r1.endsWith('Active')));
assert.equal(run('hsrp',1).steps[0].nodeUpdates.r1,'192.168.10.2 · Active');
assert(run('hsrp',1).steps.slice(1).every(s=>s.nodeUpdates.r1.endsWith('Unavailable')));
assert(run('hsrp',1).steps.at(-1).nodeUpdates.r2.endsWith('Active'));
assert(termsForLesson(get('hsrp')).some(t=>t.name==='HSRP Priority'));
assert(!termsForLesson(get('hsrp')).some(t=>t.name==='Priority'||t.name==='Queue Priority'));
assert(termsForLesson(get('stp')).some(t=>t.name==='Bridge Priority'));
assert.equal(new Set(glossaryEntries.map(e=>e.track+':'+e.name)).size,glossaryEntries.length);
assert(!get('address').explain.includes('ต้องผ่าน NAT จึงออก Internet'));
assert(get('proxy-lb').explain.includes('L4'));assert(get('cloud-vpc').explain.includes('AWS-style'));
const overlap=run('cloud-hybrid',1);
assert.notEqual(overlap.nodes.find(n=>n.id==='host').address,overlap.nodes.find(n=>n.id==='vm').address);
assert(overlap.steps.at(-1).title.includes('ARP'));
assert(!overlap.steps.some(s=>s.transfers.some(t=>t.from==='gwo'&&t.to==='gwc')));
const publicNoIP=run('cloud-vpc',3);assert.equal(publicNoIP.steps.at(-1).status,'blocked');
assert.equal(field(publicNoIP.steps.at(-1),'Subnet type'),'Public');
const dora=run('dhcp');assert(!dora.steps.slice(0,-1).some(s=>s.nodeUpdates.client?.includes('BOUND')));
assert(dora.steps.at(-1).nodeUpdates.client.includes('BOUND'));
assert(dora.steps[1].fields.some(([k,v])=>k==='UDP'&&v==='67 → 67'));
for(const [time,status] of [[399,'BOUND'],[400,'RENEWING'],[699,'RENEWING'],[700,'REBINDING'],[799,'REBINDING'],[800,'INIT'],[900,'INIT']]){
  const m=run('dhcp',3,{elapsed:time,response:'silent'});
  const last=m.steps.at(-1);assert.equal(field(last,'State'),status);
  if(time>=800)assert(last.nodeUpdates.client.startsWith('0.0.0.0'));
}
assert.equal(field(run('dhcp',3,{elapsed:400}).steps.at(-1),'New T1 / T2 / Expiry'),'800 / 1100 / 1200 s');
assert(run('dhcp',5).steps.at(-1).nodeUpdates.client.startsWith('0.0.0.0'));
assert.throws(()=>run('dhcp',3,{response:'nak',elapsed:400}),/T2/);
assert.equal(field(run('tcp-handshake',2).steps.at(-1),'ACK'),301);
const lost=run('tcp-handshake',4);assert(lost.steps.some(s=>field(s,'ACK')===101&&field(s,'Buffered out-of-order')==='100 B'));
assert(lost.steps.some(s=>s.title.includes('RTO')));assert.equal(field(lost.steps.at(-1),'Delivered bytes'),200);
assert(!run('tcp-handshake',5).steps.some(s=>s.title.includes('RTO')));
assert.equal(field(run('tcp-handshake',2,{rwnd:0}).steps.at(-1),'Delivered bytes'),0);
const smallWindow=run('tcp-handshake',4,{rwnd:100});
assert(!smallWindow.steps.some(s=>s.title==='ช่วงหลังถึงก่อน'));assert.equal(field(smallWindow.steps.at(-1),'ACK'),301);
assert.equal(field(run('tcp-handshake',6).steps.at(-1),'Client'),'TIME-WAIT');
assert(run('tcp-handshake',6,{fault:'reset'}).steps.at(-1).title.includes('RST'));
assert.throws(()=>run('tcp-handshake',0,{fault:'loss'}),/ส่งข้อมูล/);
for(const rwnd of [1,100,199,200,500])for(const cwnd of [1,100,199,200,500])for(const fault of ['none','loss','reorder']){
  const m=run('tcp-handshake',2,{rwnd,cwnd,fault});
  assert.equal(field(m.steps.at(-1),'Delivered bytes'),2*Math.min(100,rwnd,cwnd));
  assert.equal(field(m.steps.at(-1),'ACK'),101+2*Math.min(100,rwnd,cwnd));
}
assert(run('dns').steps.some(s=>s.transfers.some(t=>t.to==='root')));
assert(!run('dns',1).steps.some(s=>s.transfers.some(t=>['root','tld','auth'].includes(t.to))));
assert.equal(field(run('dns',0,{record:'AAAA'}).steps.at(-1),'IP'),'2001:db8::80');
assert(run('dns',0,{record:'CNAME'}).steps.some(s=>s.title.includes('CNAME')));
assert(run('dns',2).steps[0].fields.some(([k,v])=>k==='Name'&&v==='missing.example.org'));
assert.equal(field(run('dns',2).steps.at(-1),'RCODE'),'NXDOMAIN (3)');
assert.equal(field(run('dns',3).steps.at(-1),'RCODE'),'SERVFAIL (2)');
assert.equal(field(run('dns',4).steps.at(-1),'Result'),'Timeout');
assert.equal(field(run('dns',5).steps[0],'Type'),'PTR');
assert.equal(field(run('dns',5).steps[0],'Name'),'80.113.0.203.in-addr.arpa');
assert.equal(field(run('dns-cache',0,{elapsed:119}).steps.at(-1),'Answer'),'203.0.113.80');
assert.equal(field(run('dns-cache',0,{elapsed:120}).steps.at(-1),'Answer'),'203.0.113.81');
assert.equal(field(run('dns-cache',3,{elapsed:59}).steps.at(-1),'Answer'),'NXDOMAIN');
assert.equal(field(run('dns-cache',3,{elapsed:60}).steps.at(-1),'Answer'),'203.0.113.81');
let mtuCases=0;
for(const version of ['4','6'])for(const mtu of [1280,1400,1492,1500])for(const payload of [1,100,1240,1440,1460])for(const icmp of ['yes','no']){
  const m=run('mtu-pmtud',0,{version,mtu,payload,icmp});mtuCases++;
  const total=payload+(version==='4'?40:60),last=m.steps.at(-1);
  assert.equal(m.steps[0].datagramBytes,total);assert.equal(m.pathMTU,mtu);
  assert(m.steps.every(s=>s.datagramBytes<=1600));
  if(total>mtu&&icmp==='no'){assert.equal(last.status,'blocked');assert.equal(field(last,'Sender learns MTU'),'No');}
  else{assert(last.datagramBytes<=mtu);assert.equal(field(last,total>mtu?'Total delivered payload':'Delivered payload'),payload+' B');}
}
for(const bad of [{payload:0},{mtu:1279},{version:'5'},{elapsed:'bad'}]){
  assert.throws(()=>run('mtu-pmtud',0,bad.payload!==undefined||bad.mtu!==undefined||bad.version!==undefined?bad:{payload:'bad'}));
}
for(const service of ['social','cdn'])for(const route of ['peering','transit']){
  const m=buildInternet({service,route,fault:'uplink'});
  assert(!m.steps.some(s=>s.fields.some(([k,v])=>k==='TCP'&&v==='จำลองการเชื่อมต่อพร้อม')));
  assert(!m.steps.some(s=>s.transfers?.some(t=>t.message.includes('HTTPS · encrypted request'))));
  assert(m.steps.some(s=>s.fields.some(([k,v])=>k==='TLS'&&v==='ยังไม่เริ่ม')));
}
console.log(`PASS: ${scenarios} edited/new scenarios, 75 TCP window/fault cases, ${mtuCases} MTU cases, DHCP/DNS boundaries, A1–A7 regressions, ordering/glossary`);
