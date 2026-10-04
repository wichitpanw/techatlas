import assert from 'node:assert/strict';
import {networkLessons} from '../dist/assets/network-curriculum.js';
import {arrangeNetwork} from '../dist/assets/network-foundations.js';
import {networkLabSpecs,buildNetworkLab} from '../dist/assets/network-lab-models.js';
import {mechanismSurface,wireEvidence} from '../dist/assets/network-mechanism.js';
import {pythonEdit} from '../dist/assets/python-editor.js';
const lessons=arrangeNetwork(networkLessons),newLabs=lessons.filter(l=>l.conceptLab&&l.section!=='foundation');
assert.equal(newLabs.length,37);assert.equal(Object.keys(networkLabSpecs).length,37);
let count=0;
for(const l of newLabs){
 assert(mechanismSurface(l).includes('mechanism-lab'));
 for(let i=0;i<l.states.length;i++){
  const model=buildNetworkLab(l,i),nodes=new Set(model.nodes.map(n=>n.id)),edges=new Set(model.links.map(e=>e.id));
  assert(model.steps.length>0,l.id);assert.equal(nodes.size,model.nodes.length);
  for(const link of model.links)assert(nodes.has(link.from)&&nodes.has(link.to),l.id);
  for(const step of model.steps){assert(step.title&&step.detail&&step.fields.length,l.id);assert(step.active.every(id=>nodes.has(id)),l.id);assert(step.edges.every(id=>edges.has(id)),l.id);assert(step.transfers.every(t=>nodes.has(t.from)&&nodes.has(t.to)&&t.message),l.id);}
  count++;
 }
}
const lesson=id=>lessons.find(l=>l.id===id),run=(id,state=0,params={})=>buildNetworkLab(lesson(id),state,params);
assert(run('arp-icmp',1).steps[0].fields.some(([k,v])=>k==='ARP target'&&v==='192.168.10.1'));
assert(run('arp-icmp',2).steps.at(-1).status==='blocked');
const remote=run('arp-icmp',1),local=run('arp-icmp',0);
assert(remote.steps.some(s=>s.wire?.targetIP==='192.168.10.1'&&!s.wire?.srcIP));
assert(remote.steps.some(s=>s.transfers.length===2&&s.wire?.dstMAC==='ff:ff:ff:ff:ff:ff'));
assert(remote.steps.some(s=>s.wire?.ttl===64&&s.transfers.some(t=>t.from==='switch'&&t.to==='gateway')));
assert(remote.steps.some(s=>s.wire?.ttl===63&&s.wire?.srcIP==='192.168.10.25'&&s.transfers.some(t=>t.from==='gateway'&&t.to==='server')));
assert(local.steps.some(s=>s.wire?.ttl===64&&s.transfers.some(t=>t.from==='peer')));
assert(wireEvidence(remote.steps.find(s=>s.wire?.targetIP)).includes('ARP ไม่ใช่'));
assert(wireEvidence(remote.steps.find(s=>s.wire?.srcIP)).includes('CLI'));
assert(run('static-routing',1).steps.at(-1).status==='blocked');
assert(run('inter-vlan',1).steps.at(-1).status==='blocked');
assert(run('hsrp',1).steps.at(-1).edges.includes('vip-r2'));
assert(run('tcp-handshake',3).steps.at(-1).title.includes('RST'));
assert.equal(run('dhcp',0).steps.length,4);assert.equal(run('dhcp',1).steps.length,2);
assert(run('dhcp',0).steps.at(-1).fields.some(([k,v])=>k==='Client IP'&&v==='192.168.10.25/24'));
assert(run('dhcp',0).steps.at(-1).nodeUpdates.client.includes('192.168.10.25'));
assert(run('nat-pat',1).nodes.some(n=>n.id==='clientB'));
assert(run('acl',0,{port:'22'}).steps.at(-1).status==='blocked');assert(run('acl',1,{port:'443'}).steps.at(-1).status==='ok');
assert(run('acl',2).steps.at(-1).fields.some(([k,v])=>k==='Rule 10'&&v==='Not evaluated'));
assert.equal(run('dns-cache',0,{elapsed:120}).steps.at(-1).fields[0][1],'203.0.113.81');
assert.equal(run('dns-cache',0,{elapsed:119}).steps.at(-1).fields[0][1],'203.0.113.80');
for(const [input,expected]of [['::','::'],['0:0:0:0:0:0:0:1','::1'],['2001:0db8:0000:0001:0000:0000:0000:0025','2001:db8:0:1::25'],['2001:0:0:1:0:0:1:1','2001::1:0:0:1:1']])assert.equal(run('ipv6-address',0,{address:input}).steps[2].fields[0][1],expected);
for(const address of ['1::2::3','1:2:3','fffff::1','::g','1:2:3:4:5:6:7:8:9'])assert.throws(()=>run('ipv6-address',0,{address}));
assert(run('vlsm',1).steps.some(s=>s.status==='blocked'));
for(const hosts of ['', '0','255','1,-2','hello','1,2,3,4,5,6,7,8,9'])assert.throws(()=>run('vlsm',0,{hosts}));
for(const [body,status]of [['{bad',400],['[]',422],['{"description":42}',422],['{"description":"Lab"}',200]])assert(run('rest-json',2,{body}).steps.some(s=>s.fields.some(([k,v])=>k==='Status'&&v===status)));
assert(run('rest-json',1).steps.at(-1).fields.some(([k,v])=>k==='Status'&&v===401));
assert(run('aaa-ssh',0,{action:'configure'}).steps[1].status==='blocked');
assert(run('automation-tools',0,{current:'present',desired:'present'}).steps[1].fields[0][1]==='NO CHANGE');
assert(run('automation-tools',0,{current:'present',desired:'absent'}).steps.at(-1).status==='blocked');
assert.notEqual(run('mpls-vpn',0,{customer:'A'}).steps[1].fields[1][1],run('mpls-vpn',0,{customer:'B'}).steps[1].fields[1][1]);
// บทใหม่จาก playlist อ้างอิง: commands, mail, proxy/LB, DMZ, pcap, WAN, cloud
const field=(model,key)=>model.steps.flatMap(s=>s.fields).find(([k])=>k===key)?.[1];
for(const c of ['ip','ping','tracert','nslookup','arp','netstat'])for(const sc of [0,1,2])assert(run('network-commands',sc,{command:c}).steps.length===3,c+sc);
assert.equal(run('network-commands',1,{command:'nslookup'}).steps[1].status,'blocked');
assert.equal(run('network-commands',0,{command:'nslookup'}).steps[1].status,'ok');
assert.equal(run('network-commands',2,{command:'nslookup'}).steps[1].status,'ok');
assert.equal(run('network-commands',2,{command:'ping'}).steps[1].status,'blocked');
assert.throws(()=>run('network-commands',0,{command:'format'}));
assert.equal(run('mail',0).steps.length,5);assert(run('mail',0).steps.at(-1).fields.some(([k,v])=>k==='IMAPS'&&v==='TCP/993'));
assert(run('mail',1).nodes.some(n=>n.id==='mx2'));assert.equal(run('mail',1).steps[2].status,'blocked');assert.equal(run('mail',1).steps.at(-1).status,'ok');
assert.equal(run('mail',2).steps.at(-1).status,'blocked');
assert(run('proxy-lb',0).steps.some(s=>s.fields.some(([k,v])=>k.startsWith('Source ที่ Server')&&v==='198.51.100.8')));
assert.equal(field(run('proxy-lb',1),'Selected'),'web1 10.0.1.11');assert(run('proxy-lb',1).steps.some(s=>s.fields.some(([,v])=>v==='web2 10.0.1.12')));
assert.equal(run('proxy-lb',2).steps[1].status,'blocked');assert(run('proxy-lb',2).steps.some(s=>s.fields.some(([k,v])=>k==='Pool'&&v==='web1')));
assert.equal(run('dmz',0).steps.at(-1).status,'ok');assert.equal(run('dmz',1).steps.at(-1).status,'blocked');assert.equal(run('dmz',2).steps.at(-1).status,'blocked');
for(let sc=0;sc<3;sc++)for(let f=1;f<=6;f++){const m=run('pcap',sc,{frame:String(f)});assert.equal(m.steps.length,4);assert(m.steps[1].fields.length===2);}
assert.equal(field(run('pcap',0,{frame:'3'}),'Destination MAC'),'02:00:00:00:00:fe');
assert.equal(field(run('pcap',0,{frame:'3'}),'IPv4 destination'),'203.0.113.80');
assert.equal(run('pcap',1,{frame:'4'}).steps[0].status,'blocked');assert(String(field(run('pcap',1,{frame:'4'}),'Transport')).includes('443'));
assert.throws(()=>run('pcap',0,{frame:'9'}));
assert.equal(run('wan',0).steps.length,4);assert.equal(run('wan',0).steps.at(-1).status,'ok');
assert.equal(run('wan',1).steps.at(-1).status,'blocked');assert.equal(field(run('wan',1),'Same subnet'),'No');
assert.equal(run('wan',2).steps.at(-1).status,'blocked');
assert.equal(run('cloud-vpc',0).steps.at(-1).status,'ok');assert(run('cloud-vpc',1).steps.some(s=>s.fields.some(([,v])=>String(v).includes('NAT'))));
assert.equal(run('cloud-vpc',2).steps.at(-1).status,'blocked');
assert.equal(field(run('cloud-hybrid',0),'ซ้อนกัน'),'No');assert.equal(field(run('cloud-hybrid',1),'ซ้อนกัน'),'Yes');assert.equal(run('cloud-hybrid',1).steps.at(-1).status,'blocked');
assert.equal(run('cloud-hybrid',2).steps.length,3);
function edit(value,start,end,action){const e=pythonEdit(value,start,end,action);return {...e,value:value.slice(0,e.from)+e.text+value.slice(e.to)};}
assert.equal(edit('print(1)',0,0,'indent').value,'    print(1)');
assert.equal(edit('    print(1)',4,4,'outdent').value,'print(1)');
assert.equal(edit('x=1\ny=2',0,7,'indent').value,'    x=1\n    y=2');
assert.equal(edit('x=1\ny=2',0,4,'indent').value,'    x=1\ny=2');
assert.equal(edit('    x=1\n  y=2',0,13,'outdent').value,'x=1\ny=2');
assert.equal(edit('if True:',8,8,'newline').value,'if True:\n    ');
assert.equal(edit('\nx',0,0,'indent').value,'    \nx');
console.log(`PASS: 37 Network labs, ${count} scenario models, semantic and input-validation checks, Python Tab/Shift+Tab/Enter edits`);
