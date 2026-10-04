import {telecomLessons,buildTelecom} from './telecom-labs.js';
import {coreSpecs,coreDefaults,buildCoreLab} from './network-core-models.js';
// Bounded teaching models, not a network emulator. Each lesson owns its mechanism.
const spec = (mode, title, controls = []) => ({ mode, title, controls });
const number = (key, label, value, min, max) => ({ key, label, value, min, max, type: 'number' });
const select = (key, label, value, options) => ({ key, label, value, options, type: 'select' });
const text = (key, label, value) => ({ key, label, value, type: 'text' });
export const networkLabSpecs = {
  'arp-icmp': spec('3d', 'ARP cache → Frame → ICMP'),
  stp: spec('3d', 'พอร์ตสำรอง ไม่ใช่สายที่หายไป'),
  etherchannel: spec('3d', 'หลายสาย · หนึ่ง logical link'),
  vlsm: spec('tool', 'จัดสรรพื้นที่ IP', [text('hosts', 'จำนวน Host แต่ละ LAN (คั่นด้วย ,)', '100,50,20')]),
  'tcp-handshake': spec('sequence', 'TCP: ดูสถานะทั้งสองฝั่ง'),
  https: spec('sequence', 'TCP → TLS → HTTP'),
  'ipv6-address': spec('tool', 'IPv6: ย่อและขยายที่อยู่', [text('address', 'IPv6 address (ไม่ใส่ prefix/zone)', '2001:0db8:0000:0001:0000:0000:0000:0025')]),
  slaac: spec('sequence', 'RS / RA → Address → DAD'),
  'static-routing': spec('3d', 'ไปถึงไม่พอ ต้องมีทางกลับ'),
  'inter-vlan': spec('3d', 'IP เดิม · Frame ใหม่ · VLAN ใหม่'),
  ospf: spec('3d', 'Cost เปลี่ยน → SPF → เส้นทางใหม่'),
  hsrp: spec('3d', 'Virtual IP เดิม · Active router เปลี่ยน'),
  dhcp: spec('sequence', 'DORA: ยังไม่ใช้ Lease จนถึง ACK'),
  'dns-cache': spec('sequence', 'อายุ Cache ไม่ใช่จำนวน Hop', [number('elapsed', 'เวลาผ่านไป (วินาที) · สำหรับสถานการณ์ Cache', 0, 0, 600)]),
  'nat-pat': spec('sequence', 'Tuple ก่อน/หลัง PAT และขากลับ'),
  monitoring: spec('tool', 'เทียบเวลาและดู Counter', [number('offset', 'SW1 เร็วกว่าเวลาจริง (นาที)', 3, 0, 10)]),
  acl: spec('sequence', 'ตรวจทีละ Rule แล้วหยุดที่ Match แรก', [select('port', 'TCP destination port', '443', [['443','HTTPS · 443'],['22','SSH · 22']])]),
  'port-security': spec('sequence', 'MAC ที่พบ → Policy → Port state'),
  'dhcp-snooping': spec('sequence', 'Trusted port → Binding → ตรวจ ARP'),
  'aaa-ssh': spec('tool', 'Login ≠ สิทธิ์ทุกคำสั่ง', [select('action', 'คำสั่งที่ Viewer ขอทำ', 'show', [['show','show interfaces'],['configure','configure interface']])]),
  vpn: spec('3d', 'Inner IP → IPsec → Outer IP'),
  'wireless-radio': spec('3d', 'Channel overlap แม้ RSSI แรง', [select('channels', 'แผน Channel · 2.4 GHz / 20 MHz', '1,6,11', [['1,6,11','1 / 6 / 11'],['1,2,3','1 / 2 / 3']])]),
  wlc: spec('3d', 'Control path ≠ Data path'),
  'wifi-security': spec('sequence', 'Authentication และ Roaming แยกกัน'),
  'rest-json': spec('tool', 'Request → Validation → Response', [select('method','HTTP method','GET',[['GET','GET'],['PATCH','PATCH']]), select('credential','สิทธิ์จำลอง (ไม่มี Token จริง)','yes',[['yes','มีสิทธิ์'],['no','ไม่มี Credential']]), {key:'body',label:'PATCH JSON body',value:'{"description":"Access switch"}',type:'textarea'}]),
  'automation-tools': spec('tool', 'Current → Desired → Plan → Apply จำลอง', [select('current','VLAN10 ปัจจุบัน','absent',[['absent','ยังไม่มี'],['present','มีแล้ว']]), select('desired','VLAN10 ที่ต้องการ','present',[['present','มี'],['absent','ไม่มี']])]),
  sdn: spec('sequence', 'แยก Management / Control / Data plane'),
  troubleshooting: spec('tool', 'ตรวจหลักฐาน ไม่เดาสาเหตุ', [select('command','เครื่องมือตรวจจำลอง','link',[['link','ดูสถานะ Link'],['ip','ดู IP / Gateway'],['ping','ping'],['dns','nslookup'],['tcp','ตรวจ TCP port']])]),
  'network-commands': spec('tool','เลือกคำสั่งตามคำถาม แล้วอ่านผลอย่างระวัง',[select('command','คำสั่งจำลอง','ip',[['ip','ipconfig / ip addr'],['ping','ping'],['tracert','tracert / traceroute'],['nslookup','nslookup / dig'],['arp','arp -a / ip neigh'],['netstat','netstat / ss']])]),
  mail: spec('sequence','Submission → MX lookup → SMTP → Mailbox'),
  'proxy-lb': spec('sequence','Proxy ตัวแทน Client · Reverse proxy ตัวแทน Server'),
  dmz: spec('sequence','ตรวจนโยบายระหว่าง Zone ไม่ใช่แค่พอร์ต'),
  pcap: spec('tool','เปิดทีละ Frame ของ Capture ตัวอย่าง',[select('frame','Frame ที่เปิดดู','3',[['1','Frame 1'],['2','Frame 2'],['3','Frame 3'],['4','Frame 4'],['5','Frame 5'],['6','Frame 6']])]),
  wan: spec('sequence','Link WAN คือ Subnet เล็กระหว่างสอง Router'),
  'cloud-vpc': spec('sequence','Route table กำหนดว่า Subnet ออกไปทางใด'),
  'cloud-hybrid': spec('sequence','CIDR ต้องไม่ซ้อน · Hub ไม่ใช่ทางลัดอัตโนมัติ'),
  'mpls-vpn': spec('3d', 'IP ซ้ำได้เมื่อ Lookup คนละ VRF', [select('customer','ลูกค้าที่ส่งข้อมูล','A',[['A','Customer A · VRF A'],['B','Customer B · VRF B']])]),
};
// Multi-actor lessons can expose positions, named transfers and active/blocked
// decisions in 3D. Address arithmetic stays a tool, never a fake packet network.
export const networkSpatialUpgrades = [
  'tcp-handshake','https','slaac','dhcp','dns-cache','nat-pat','monitoring',
  'acl','port-security','dhcp-snooping','aaa-ssh','wifi-security','rest-json',
  'automation-tools','sdn','troubleshooting','network-commands','mail',
  'proxy-lb','dmz','pcap','wan','cloud-vpc','cloud-hybrid',
];
for(const id of networkSpatialUpgrades){
  networkLabSpecs[id].interaction=networkLabSpecs[id].mode;
  networkLabSpecs[id].mode='3d';
}
for(const lesson of telecomLessons)networkLabSpecs[lesson.id]=spec('3d',lesson.title);
Object.assign(networkLabSpecs,coreSpecs);
export function networkLabDefaults(lesson, scenario = 0) {
  const p = Object.fromEntries((networkLabSpecs[lesson.id]?.controls || []).map(c=>[c.key,c.value]));
  const presets = {
    vlsm:[{hosts:'100,50,20'},{hosts:'200,100'}],
    'ipv6-address':[{address:'2001:0db8:0000:0001:0000:0000:0000:0025'},{address:'fe80::25'}],
    monitoring:[{offset:3},{offset:0},{offset:0}],
    acl:[{port:'443'},{port:'22'},{port:'443'}],
    'aaa-ssh':[{action:'show'},{action:'configure'}],
    'wireless-radio':[{channels:'1,6,11'},{channels:'1,2,3'}],
    'rest-json':[{method:'GET',credential:'yes'},{method:'GET',credential:'no'},{method:'PATCH',credential:'yes'}],
    'automation-tools':[{current:'present'},{current:'absent'},{current:'present'}],
    troubleshooting:[{command:'link'},{command:'dns'},{command:'tcp'}],
    'network-commands':[{command:'ip'},{command:'nslookup'},{command:'ping'}],
    pcap:[{frame:'3'},{frame:'4'},{frame:'2'}],
  };
  return {...p,...presets[lesson.id]?.[scenario],...coreDefaults(lesson.id,scenario)};
}
const node = (id, name, address = '', kind = 'router') => ({ id, name, address, kind });
const edge = (from, to, label = '') => ({ id: `${from}-${to}`, from, to, label });
const step = (title, detail, fields = [], active = [], edges = [], status = 'ok') => ({ title, detail, fields, active, edges, status });
const pair = () => [node('client','Client','192.168.10.25','client'),node('server','Server','203.0.113.80','server')];
const routeNodes = () => [node('client','Client','10.1.0.10','client'),node('r1','R1','192.0.2.1'),node('r2','R2','192.0.2.2'),node('server','Server','10.2.0.20','server')];
function ipv6(value) {
  const input = value.trim();
  if (!/^[0-9a-f:]+$/i.test(input) || (input.match(/::/g)||[]).length > 1) throw Error('ใช้ Hex และ : เท่านั้น; :: ใช้ได้ครั้งเดียว');
  const halves = input.split('::'), left = halves[0] ? halves[0].split(':') : [], right = halves[1] ? halves[1].split(':') : [];
  const missing = 8-left.length-right.length;
  if ((halves.length === 1 && missing !== 0) || (halves.length === 2 && missing < 1)) throw Error('IPv6 ต้องขยายได้ 8 กลุ่ม กลุ่มละไม่เกิน 4 หลัก');
  const parts = halves.length === 2 ? [...left,...Array(missing).fill('0'),...right] : left;
  if (parts.some(p=>!p || p.length>4)) throw Error('แต่ละกลุ่มต้องมี Hex 1–4 หลัก');
  const nums = parts.map(p=>parseInt(p,16)); let start=-1, length=0;
  for(let i=0;i<8;){if(nums[i]!==0){i++;continue;}let end=i;while(end<8&&nums[end]===0)end++;if(end-i>length){start=i;length=end-i;}i=end;}
  const compact = length>=2 ? nums.slice(0,start).map(n=>n.toString(16)).join(':')+'::'+nums.slice(start+length).map(n=>n.toString(16)).join(':') : nums.map(n=>n.toString(16)).join(':');
  return { full: nums.map(n=>n.toString(16).padStart(4,'0')).join(':'), compact, parts:nums, linkLocal:(nums[0]&0xffc0)===0xfe80 };
}
export function buildNetworkLab(lesson, scenario = 0, parameters = {}) {
  if(telecomLessons.some(l=>l.id===lesson.id))return buildTelecom(lesson,scenario);
  const definition = networkLabSpecs[lesson.id];
  if (!definition) throw Error('ไม่มีแบบจำลองสำหรับบท '+lesson.id);
  const p = networkLabDefaults(lesson, scenario);Object.assign(p,parameters);
  for(const c of definition.controls){
    if(c.type==='select'&&!c.options.some(([v])=>v===String(p[c.key])))throw Error('เลือก '+c.label+' จากตัวเลือกใน Lab');
    if(c.type==='number'&&(!Number.isInteger(Number(p[c.key]))||Number(p[c.key])<c.min||Number(p[c.key])>c.max))throw Error(c.label+' ต้องเป็นจำนวนเต็ม '+c.min+'–'+c.max);
  }
  if(coreSpecs[lesson.id])return buildCoreLab(lesson,scenario,p);
  const s = lesson.states[scenario] || lesson.states[0];
  let nodes=pair(), links=[edge('client','server')], steps=[];
  const add=(...args)=>steps.push(step(...args));
  switch(lesson.id){
    case 'arp-icmp': {
      nodes=[node('client','Client','192.168.10.25/24','client'),node('switch','Switch','L2 · VLAN10','switch'),node('gateway','Gateway','192.168.10.1 / 203.0.113.1'),node('peer','LAN peer','192.168.10.20/24','server'),node('server','Remote server','203.0.113.80/24','server')];
      links=[edge('client','switch'),edge('switch','peer'),edge('switch','gateway'),edge('gateway','server')];
      const local=scenario===0, target=local?'192.168.10.20':'192.168.10.1', mac=local?'02:00:00:00:00:02':'02:00:00:00:00:fe';
      add('เลือก Next hop',local?'ปลายทางอยู่ใน /24 เดียวกัน':'ปลายทางต่าง subnet จึงใช้ Gateway',[['IP destination',local?target:'203.0.113.80'],['ARP target',target]],['client']);
      const clientMAC='02:00:00:00:00:01', wanMAC='02:00:00:00:01:fe', serverMAC='02:00:00:00:01:80', destination=local?target:'203.0.113.80', responder=local?'peer':'gateway';
      const record=(title,detail,fields,active,edges,status='ok',transfers=[],wire=null,cli='')=>{
        add(title,detail,fields,active,edges,status);
        Object.assign(steps.at(-1),{transfers,wire,cli});
      };
      const move=(from,to,message)=>({from,to,message});
      const arp={protocol:'ARP Request (EtherType 0x0806)',srcMAC:clientMAC,dstMAC:'ff:ff:ff:ff:ff:ff',targetIP:target};
      const echo={protocol:'IPv4 / ICMP Echo Request',srcMAC:clientMAC,dstMAC:mac,srcIP:'192.168.10.25',dstIP:destination,ttl:64};
      record('ARP Request เข้าสู่ Switch','ARP เป็นข้อมูลใน Ethernet Frame โดยตรง ไม่ใช่ IP packet จึงไม่มี IP TTL', [['Ethernet dst','ff:ff:ff:ff:ff:ff'],['Who has',target]],['client','switch'],['client-switch'],'ok',[move('client','switch','ARP Request · Broadcast')],arp,'arp -a → ยังไม่มี mapping ของ next hop');
      record('Switch เรียน Source MAC แล้ว Flood','เรียนจาก source ไม่ใช่ destination; ส่ง Broadcast ออกพอร์ต VLAN10 อื่น ยกเว้นพอร์ตรับเข้า ไม่ส่งข้าม Router', [['MAC table',`${clientMAC} → port Client`],['VLAN','10'],['Forward','LAN peer + Gateway']],['switch','peer','gateway'],['switch-peer','switch-gateway'],'ok',[move('switch','peer','สำเนา ARP Broadcast'),move('switch','gateway','สำเนา ARP Broadcast')],arp,'show mac address-table → MAC Client อยู่พอร์ต Client');
      record('ARP Reply กลับเข้า Switch','เฉพาะเจ้าของ target IP ตอบ; อีกอุปกรณ์รับ Broadcast แต่ไม่ตอบแทนเป้าหมาย', [['Responder',target],['Source MAC',mac]], [responder,'switch'],[local?'switch-peer':'switch-gateway'],'ok',[move(responder,'switch','ARP Reply · Unicast')],{protocol:'ARP Reply',srcMAC:mac,dstMAC:clientMAC,targetIP:'192.168.10.25'},'Switch เรียน MAC ของผู้ตอบจากพอร์ตรับ Reply');
      record('ARP Reply → Cache','Switch รู้พอร์ต Client จาก Request จึงส่ง Reply เฉพาะพอร์ตนั้น; Client บันทึก IP → MAC ของ next hop', [['ARP cache',`${target} → ${mac}`],['MAC table',`${mac} → port ${local?'LAN peer':'Gateway'}`]],['switch','client'],['client-switch'],'ok',[move('switch','client','ARP Reply → บันทึก cache')],{protocol:'ARP Reply',srcMAC:mac,dstMAC:clientMAC,targetIP:'192.168.10.25'},`arp -a → ${target} ${mac}`);
      record('สร้าง Frame สำหรับ ICMP','MAC ชี้ next hop บน link นี้ แต่ IP ชี้ปลายทางของการสื่อสาร', [['Frame dst MAC',mac],['Packet dst IP',destination],['TTL',64]],['client','switch'],['client-switch'],'ok',[move('client','switch','Ethernet [ IPv4 [ ICMP Echo ] ]')],echo,`ping ${destination} → ส่ง Echo Request`);
      record('Switch Lookup Destination MAC','MAC table มีพอร์ตปลายทางแล้ว จึงส่งเฉพาะพอร์ตนั้น ไม่เปลี่ยน IP/MAC ของคู่สื่อสารและไม่ลด IP TTL', [['Lookup',`${mac} → ${local?'LAN peer':'Gateway'}`],['TTL','64 → 64']],['switch',responder],[local?'switch-peer':'switch-gateway'],'ok',[move('switch',responder,'Unicast Frame · TTL 64')],echo,'show mac address-table → เลือกพอร์ตจาก MAC + VLAN');
      if(!local){
        record('Router ถอด L2 แล้ว Lookup IP','Lab ย่อเส้นทางเป็น Router เดียวที่เชื่อมสอง subnet โดยตรง ไม่จำลอง ISP ทุก hop; ไม่ใช้ NAT และสมมติ ARP ฝั่ง remote พร้อมแล้ว; Header ด้านล่างเป็น Frame ขาเข้าก่อนลด TTL', [['Route','203.0.113.0/24 → interface Remote'],['TTL','64 → 63'],['IP checksum','คำนวณใหม่เมื่อ TTL เปลี่ยน']],['gateway'],[],'ok',[],echo,'show ip route → connected 203.0.113.0/24');
        record('Router สร้าง Frame ใหม่','MAC เปลี่ยนตาม interface/next hop แต่ IP ต้นทางและปลายทางคงเดิมใน Lab ที่ไม่มี NAT', [['Frame src MAC',wanMAC],['Frame dst MAC',serverMAC],['Packet src IP','192.168.10.25'],['Packet dst IP',destination],['TTL',63]],['gateway','server'],['gateway-server'],'ok',[move('gateway','server','Frame ใหม่ · IP เดิม · TTL 63')],{...echo,srcMAC:wanMAC,dstMAC:serverMAC,ttl:63},'หาก capture สอง interface จะเห็น MAC เปลี่ยน และ TTL ลด');
      }
      if(scenario===2){record('Echo ถูกกรอง → Timeout','กำหนดให้ policy ที่ Remote server ทิ้ง ICMP Echo Request ในสถานการณ์นี้ ไม่มี Echo Reply; Timeout อย่างเดียวใน CLI จริงยังระบุจุดเสียไม่ได้', [['Ping','No reply'],['Drop point','Remote server'],['HTTPS','ยังไม่ได้ทดสอบ']],['server'],[],'blocked',[],{...echo,srcMAC:wanMAC,dstMAC:serverMAC,ttl:63},'ping → Request timed out (ผลจำลอง)');}
      else{
        if(!local)record('Echo Reply เป็น Packet ขากลับ','Server สร้าง Reply ใหม่ สลับ src/dst IP และตั้ง TTL เริ่มต้น 64 ตาม Lab; ไม่ใช่ Request ที่วิ่งย้อนกลับ', [['ICMP','Echo Reply · type 0'],['TTL',64]],['server','gateway'],['gateway-server'],'ok',[move('server','gateway','Echo Reply · packet ใหม่')],{protocol:'IPv4 / ICMP Echo Reply',srcMAC:serverMAC,dstMAC:wanMAC,srcIP:destination,dstIP:'192.168.10.25',ttl:64},'Server มี route กลับ 192.168.10.0/24 ผ่าน 203.0.113.1');
        record('Echo Reply ถึง Client',local?'LAN peer ตอบผ่าน Switch; ไม่มี Router จึงไม่ลด TTL':'Gateway lookup ขากลับ ลด TTL เป็น 63 แล้วใช้ MAC ฝั่ง LAN ส่งหา Client ผ่าน Switch', [['Ping','Reply received'],['Reply TTL',local?64:63]],['switch','client'],local?['switch-peer','client-switch']:['switch-gateway','client-switch'],'ok',local?[move('peer','switch','Echo Reply'),move('switch','client','Forward Reply · TTL 64')]:[move('gateway','switch','Frame ใหม่ · Reply TTL 63'),move('switch','client','Forward Reply · TTL 63')],{protocol:'IPv4 / ICMP Echo Reply',srcMAC:mac,dstMAC:clientMAC,srcIP:destination,dstIP:'192.168.10.25',ttl:local?64:63},`ping → Reply from ${destination}, TTL=${local?64:63} (ผลจำลอง)`);
      }
      break;
    }
    case 'stp': {
      nodes=[node('sw1','SW1 · Root','Priority ต่ำสุดใน Lab','switch'),node('sw2','SW2','Root port → SW1','switch'),node('sw3','SW3','Alternate → SW2','switch')];links=[edge('sw1','sw2'),edge('sw2','sw3'),edge('sw1','sw3')];
      add('กำหนด Root และบทบาทพอร์ต','ตัวอย่างกำหนด cost/priority ไว้ ไม่ใช่ STP solver',[['Root','SW1']],['sw1']);
      add(scenario===2?'ปิด STP':'Alternate อยู่ Discarding',scenario===2?'ทุกลิงก์ forward ทำให้วงยังเปิด':'สาย SW3–SW2 ยังอยู่ แต่ไม่ forward user frame',[['SW3 → SW2',scenario===2?'Forwarding':'Discarding']],['sw3'],['sw1-sw2','sw1-sw3']);
      if(scenario===1){add('ลิงก์ SW3–SW1 Down','ตรวจ failure แล้วเข้าสู่ convergence',[['SW3 → SW1','Down']],['sw3'],['sw1-sw3'],'blocked');add('เปิดทางสำรอง','หลัง convergence ใช้ SW3 → SW2 → SW1',[['Alternate','Forwarding']],['sw2','sw3'],['sw2-sw3','sw1-sw2']);}
      else add(scenario===2?'Broadcast วน':'Topology ไม่วน',scenario===2?'SW1 → SW2 → SW3 → SW1; Frame ไม่มี IP TTL หยุด L2 loop':'ลิงก์ที่ forward ไม่สร้างวง',[['MAC table',scenario===2?'อาจ flapping':'Stable ใน Lab']],nodes.map(n=>n.id),scenario===2?links.map(e=>e.id):['sw1-sw2','sw1-sw3'],scenario===2?'blocked':'ok');break;
    }
    case 'etherchannel': {
      nodes=[node('sw1','SW1','Port-channel 1','switch'),node('member1','Member 1','1 Gbps','switch'),node('member2','Member 2','1 Gbps','switch'),node('sw2','SW2','Port-channel 1','switch')];links=[edge('sw1','member1'),edge('member1','sw2'),edge('sw1','member2'),edge('member2','sw2')];
      add('LACP และความสอดคล้อง','ตรวจสมาชิกและ trunk configuration',[['Member 1',scenario===2?'Config mismatch':'Compatible']],['member1','member2']);
      add('สถานะ Bundle',s.detail,s.rows,['member1','member2'],scenario===0?links.map(e=>e.id):['sw1-member2','member2-sw2'],scenario===2?'blocked':'ok');
      add('เลือก Member ต่อ Flow','ตัวอย่าง hash แบบกำหนดไว้ ไม่แยกทุก packet สลับสาย',[['Flow A',scenario===0?'Member 1':'Member 2'],['Flow B','Member 2'],['หนึ่ง Flow','ไม่รับประกัน 2 Gbps']],['sw2'],scenario===0?['sw1-member1','member1-sw2']:['sw1-member2','member2-sw2']);break;
    }
    case 'vlsm': {
      nodes=[node('pool','Address pool','192.168.10.0/24','server')];links=[];
      const raw=String(p.hosts).split(',').map(x=>x.trim()); const hosts=raw.map(Number);
      if(raw.some(x=>!/^\d+$/.test(x))||hosts.length>8||hosts.some(n=>n<1||n>254))throw Error('ใส่ Host 1–254 จำนวนไม่เกิน 8 LAN คั่นด้วย ,');
      let used=0;add('เรียงความต้องการจากมากไปน้อย','LAN ทั่วไปเผื่อ network และ broadcast; ไม่รวม /31,/32',[['Requests',hosts.join(', ')]],['pool']);
      for(const h of hosts.sort((a,b)=>b-a)){const size=2**Math.ceil(Math.log2(h+2)),prefix=32-Math.log2(size);if(used+size>256){add('พื้นที่ไม่พอ','Block size รวมเกิน /24; ไม่แจก subnet ที่ทับกัน',[['Request',h+' hosts'],['Required block',size+' addresses'],['Remaining',256-used]],['pool'],[],'blocked');break;}add(`จัดสรร ${h} hosts`,`เริ่มที่ boundary ${size}; ใช้ได้ ${size-2} host`,[['Subnet',`192.168.10.${used}/${prefix}`],['Usable',`.${used+1}–.${used+size-2}`],['Broadcast',`.${used+size-1}`],['Block size',size]],['pool']);used+=size;}
      const insufficient=steps.some(s=>s.status==='blocked');add('สรุป Address pool',insufficient?'หยุดแจกเมื่อพื้นที่ไม่พอ; Requests ที่เหลือยังไม่ได้รับ subnet':'พื้นที่ไม่ทับซ้อนและไม่เกิน .255',[['Used',used],['Unallocated',256-used],['Plan',insufficient?'Incomplete · ต้องเพิ่ม/ปรับ Address block':'Complete']],['pool'],[],insufficient?'blocked':'ok');break;
    }
    case 'tcp-handshake': {
      nodes[0].address+=':51514';nodes[1].address+=':443';
      add('SYN · Client → Server','ตัวอย่าง ISN ของ Client = 100',[['Client','SYN-SENT'],['seq',100]],['client'],['client-server']);
      if(scenario===3){add('RST จาก Server','กรณีจำลองไม่มีบริการรับ port; ต่างจาก timeout',[['TCP','Connection refused']],['server'],['client-server'],'blocked');break;}
      add('SYN-ACK · Server → Client','ISN Server = 500; SYN ใช้ sequence space 1',[['Server','SYN-RECEIVED'],['seq',500],['ack',101]],['server'],['client-server']);
      if(scenario===1){add('รอ ACK ที่ยังมาไม่ถึง','สถานการณ์นี้ย่อการรอ/ส่งซ้ำ ไม่ได้จำลอง timer จริง; Server ยังไม่ ESTABLISHED',[['Server','SYN-RECEIVED'],['Client ACK','ยังไม่ถึง Server']],['server']);break;}
      add('ACK · Client → Server','Server เข้าสู่ ESTABLISHED หลังรับ ACK',[['seq',101],['ack',501],['TCP','ESTABLISHED'],['TLS','ยังไม่ได้ทำ']],['client','server'],['client-server']);break;
    }
    case 'https': {
      add('TCP connection พร้อม','ตัวอย่าง HTTP/1.1 บน TCP/443 ไม่ใช่ HTTP/3',[['TCP','Established']],['client','server'],['client-server']);
      add('TLS ตรวจ Certificate','ตรวจชื่อและ chain ตามความเชื่อถือใน Lab',[['Requested host','ops.example.test'],['Certificate',scenario===1?'other.example.test':'ops.example.test']],['client'],['client-server'],scenario===1?'blocked':'ok');
      if(scenario===1){add('หยุดก่อนส่ง HTTP','ไม่ปิด certificate validation เพื่อข้าม error',[['Result','Name mismatch']],['client'],[],'blocked');break;}
      add('HTTPS Request / Response','HTTP status เกิดหลัง TLS สำเร็จ',[['TLS','Verified'],['HTTP',scenario===2?'404 Not Found':'200 OK']],['server'],['client-server'],scenario===2?'blocked':'ok');break;
    }
    case 'ipv6-address': {
      nodes=[node('address','IPv6 address','128 bits','server')];links=[];const a=ipv6(String(p.address));
      add('ขยายเป็น 8 กลุ่ม','กลุ่มละ 16 บิต = 128 บิต',[['Expanded',a.full]],['address']);
      add('ตัดศูนย์นำหน้า','ค่าของแต่ละกลุ่มยังเท่าเดิม',[['Groups',a.parts.map(n=>n.toString(16)).join(' : ')]],['address']);
      add('ย่อกลุ่มศูนย์ยาวที่สุด','ใช้ :: ครั้งเดียว; หากยาวเท่ากันเลือกกลุ่มแรก',[['Compressed',a.compact]],['address']);
      add('ตรวจ Scope',a.linkLocal?'Link-local fe80::/10 ไม่ route ข้าม link':'ตัวอย่าง address นี้ไม่ใช่ link-local; ไม่ได้ยืนยัน reachability',[['Scope',a.linkLocal?'Link-local':'Not link-local'],['Scenario note',s.headline]],['address']);break;
    }
    case 'slaac': {
      nodes=[node('client','Host','fe80::25','client'),node('router','Router','fe80::1')];links=[edge('client','router')];
      add('Router Solicitation','Host ขอข้อมูล Router ผ่าน ICMPv6',[['Protocol','NDP / ICMPv6']],['client'],['client-router']);
      if(scenario===1){add('RA / NDP ถูกบล็อก','ใน Lab นี้ Host เรียน default router ไม่ได้',[['Default router','Unknown']],['client'],[],'blocked');break;}
      add('Router Advertisement','ตัวอย่าง prefix มี Autonomous flag และ router lifetime ใช้ได้',[['Prefix','2001:db8:10::/64'],['Default router','fe80::1']],['router'],['client-router']);
      add('สร้าง Address แล้วทำ DAD','Address ยัง tentative จนตรวจซ้ำเสร็จ; ย่อ timing',[['Tentative address','2001:db8:10::25'],['DAD','ไม่พบ address ซ้ำใน Lab']],['client']);
      add(scenario===2?'Dual-stack':'Address พร้อมใช้','ไม่แปลง IPv4 เป็น IPv6 อัตโนมัติ',[['IPv6','2001:db8:10::25'],['IPv4',scenario===2?'192.168.10.25':'ไม่แสดงในสถานการณ์นี้']],['client']);break;
    }
    case 'static-routing': {
      nodes=routeNodes();links=[edge('client','r1'),edge('r1','r2'),edge('r2','server')];
      add('Lookup route ที่ R1','ตัวอย่าง next hop พร้อมใช้งาน',[['Destination',scenario===2?'203.0.113.80':'10.2.0.20'],['Selected',scenario===2?'0.0.0.0/0 → ISP':'10.2.0.0/24 → 192.0.2.2']],['r1']);
      if(scenario===2){nodes[3]=node('server','Internet server','203.0.113.80','server');nodes[2]=node('r2','ISP','192.0.2.2');add('ส่งไป ISP','ใช้ /0 เฉพาะเมื่อไม่มี prefix เฉพาะกว่าที่ตรง',[['Rule','Longest prefix match']],['r2'],links.map(e=>e.id));break;}
      add('Forward ถึงปลายทาง','ขาไปสำเร็จยังไม่ยืนยันขากลับ',[['Delivered','10.2.0.20']],['server'],links.map(e=>e.id));
      add('Lookup ขากลับที่ R2',scenario===1?'ไม่มี route กลับ Client ใน Lab':'มี return route ไป 10.1.0.0/24',[['Return route',scenario===1?'Missing':'10.1.0.0/24 via 192.0.2.1']],['r2'],scenario===1?[]:['r2-server','r1-r2','client-r1'],scenario===1?'blocked':'ok');break;
    }
    case 'inter-vlan': {
      nodes=[node('client','Client A · VLAN10','192.168.10.10','client'),node('l3','L3 switch / SVI','192.168.10.1 / 192.168.20.1','switch'),node('server','Client B · VLAN20','192.168.20.20','client')];links=[edge('client','l3','VLAN10'),edge('l3','server','VLAN20')];
      add('Client เลือก Gateway','ต่าง subnet จึงส่ง Frame หา SVI ของ VLAN10',[['IP dst','192.168.20.20'],['Frame dst','MAC ของ SVI VLAN10']],['client'],['client-l3']);
      if(scenario===1){add('มีเพียง L2 Trunk','Trunk ขน VLAN แต่ไม่มี SVI/routing ตาม Lab',[['Route','Unavailable'],['Broadcast domain','ยังแยกกัน']],['l3'],[],'blocked');break;}
      add('ถอด Frame แล้ว Route IP','L3 lookup เลือก connected VLAN20 และลด TTL',[['IP dst','192.168.20.20'],['TTL','64 → 63']],['l3']);
      add('สร้าง Frame ใหม่บน VLAN20','สมมติรู้ MAC ของ B ผ่าน ARP แล้ว',[['Frame src','MAC ของ SVI VLAN20'],['Frame dst','MAC ของ Client B'],['IP dst','192.168.20.20']],['server'],['l3-server']);break;
    }
    case 'ospf': {
      nodes=[node('r1','R1','Area 0'),node('r2','R2',scenario===2?'Area 1':'Area 0'),node('r3','R3','Area 0')];links=[edge('r1','r2','cost 10'),edge('r2','r3','cost 10'),edge('r1','r3','cost 50')];
      add('ตรวจ Neighbor','ภาพย่อ Hello/adjacency ไม่จำลอง DR/BDR',[['R1–R2',scenario===2?'Area mismatch':'Compatible']],['r1','r2'],['r1-r2'],scenario===2?'blocked':'ok');
      if(scenario===2){add('ไม่เกิด Adjacency บน Link นี้','อย่าใช้เส้นทางผ่าน R2 ที่ยังไม่ได้เรียนอย่างถูกต้อง',[['Action','ตรวจ Area ID และ parameters']],['r2'],[],'blocked');break;}
      add('SPF เปรียบเทียบ Cost','ไม่เลือกจาก hop count อย่างเดียว',[['Via R2','10 + 10 = 20'],['Direct','50']],['r1']);
      if(scenario===1)add('Path A ขาด → เปลี่ยน Link-state','ต้องมีช่วง convergence ก่อนใช้ผลใหม่',[['Path A','Unavailable']],['r2'],['r1-r2'],'blocked');
      add('ติดตั้ง Best route',scenario===1?'คำนวณใหม่แล้วเลือกทางตรง':'เลือกผลรวม cost 20',[['Selected',scenario===1?'R1 → R3 / 50':'R1 → R2 → R3 / 20']],['r3'],scenario===1?['r1-r3']:['r1-r2','r2-r3']);break;
    }
    case 'hsrp': {
      nodes=[node('client','Client','GW 192.168.10.1','client'),node('r1','R1','192.168.10.2'),node('r2','R2','192.168.10.3'),node('vip','Virtual gateway','192.168.10.1')];links=[edge('client','vip'),edge('vip','r1'),edge('vip','r2')];
      add('Virtual IP ไม่ใช่ Router เพิ่ม','กล่อง Virtual gateway เป็นแนวคิดของกลุ่ม HSRP',[['R1','Active'],['R2','Standby'],['Client GW','192.168.10.1']],['r1','vip'],['client-vip','vip-r1']);
      if(scenario===1){add('R1 ไม่พร้อม','ย่อ timer/tracking ใน Lab ไม่ใช่ failover ทันที',[['R1','Unavailable']],['r1'],[],'blocked');add('R2 กลายเป็น Active','Client ใช้ virtual IP เดิม',[['R2','Active'],['Client GW','192.168.10.1']],['r2','vip'],['client-vip','vip-r2']);}
      else add('ส่งผ่าน Active','FHRP ไม่ได้เพิ่ม route Internet ให้เอง',[['Next-hop IP','192.168.10.1']],['r1'],['client-vip','vip-r1']);break;
    }
    case 'dhcp': {
      nodes=[node('client','Client · LAN 192.168.10.0/24','0.0.0.0','client'),node('relay','Gateway / Relay','192.168.10.1'),node('server','DHCP server · LAN 192.168.99.0/24','192.168.99.10','server')];links=[edge('client','relay'),edge('relay','server')];
      add('Discover','Client broadcast ภายใน LAN ของตัวเอง; กรณีสำเร็จสมมติมี Relay',[['Client IP','0.0.0.0'],['UDP','68 → 67']],['client','relay'],['client-relay']);
      if(scenario===1){add('ไม่มี Relay','Router ไม่ส่ง broadcast ข้ามเครือข่ายไปหา Server',[['Offer','ยังไม่ได้รับ']],['relay'],[],'blocked');break;}
      if(scenario===2){add('Pool หมด','Server ไม่มี address ว่างให้เสนอ',[['Offer','No free address']],['server'],[],'blocked');break;}
      add('Offer','Server เสนอ address ยังไม่ใช่ lease ที่ยืนยันแล้ว',[['Offered','192.168.10.25']],['server'],['relay-server','client-relay']);
      add('Request','Client เลือกข้อเสนอและขอใช้ address',[['Requested','192.168.10.25']],['client'],['client-relay','relay-server']);
      add('ACK → ใช้ Lease','ย่อการตรวจ address conflict และ timing',[['Client IP','192.168.10.25/24'],['Gateway','192.168.10.1'],['DNS','192.168.10.53'],['Lease','3600 s']],['client','server'],['relay-server','client-relay']);break;
    }
    case 'dns-cache': {
      const elapsed=Number(p.elapsed);if(!Number.isFinite(elapsed)||elapsed<0||elapsed>600)throw Error('ใส่เวลาจำนวน 0–600 วินาที');
      nodes=[node('client','Client','ops.example.test','client'),node('cache','Resolver cache','TTL'),node('server','Authoritative','A / PTR','server')];links=[edge('client','cache'),edge('cache','server')];
      if(scenario===2){add('Forward query A','A กับ PTR เป็นคนละ record',[['A','ops.example.test → 203.0.113.80']],['server'],links.map(e=>e.id));add('Reverse query PTR','Lab ไม่กำหนด PTR; ไม่ได้แปลว่า A หาย',[['PTR','No PTR answer']],['server'],links.map(e=>e.id),'blocked');break;}
      const expired=scenario===1||elapsed>=120;
      add('ตรวจ Cache','TTL remaining ตั้งต้น 120 s; เวลาจำลองไม่ใช่เวลาเครื่องจริง',[['Elapsed',elapsed+' s'],['Remaining',expired?'0 s':(120-elapsed)+' s']],['cache']);
      if(expired){add('Cache หมดอายุ → Query ใหม่','จำลอง record ที่ authoritative เปลี่ยนเป็น .81',[['Old A','203.0.113.80'],['Lookup','ops.example.test']],['server'],['cache-server']);add('เก็บคำตอบใหม่','TTL ใหม่ 300 s หลัง refresh',[['Answer','203.0.113.81'],['TTL','300 s']],['cache','client'],['client-cache']);}
      else add('Cache hit → ตอบ .80','ไม่จำเป็นต้อง query authoritative ใน flow นี้',[['Answer','203.0.113.80']],['client'],['client-cache']);break;
    }
    case 'nat-pat': {
      nodes=[node('client','Private host','192.168.10.25:51514','client'),node('nat','PAT gateway','198.51.100.25'),node('server','HTTPS server','203.0.113.80:443','server')];links=[edge('client','nat'),edge('nat','server')];
      add('Outbound tuple','เครือข่ายตัวอย่างใช้ TCP/443',[['Before','192.168.10.25:51514 → 203.0.113.80:443']],['client'],['client-nat']);
      if(scenario===1){nodes.push(node('clientB','Private host B','192.168.10.26:51514','client'));links.push(edge('clientB','nat'));add('สอง Client ใช้ source port เดียวกัน','PAT ใช้ port ภายนอกต่างกันแยก mapping',[['Client A','192.168.10.25:51514 → 198.51.100.25:40001'],['Client B','192.168.10.26:51514 → 198.51.100.25:40002']],['client','clientB','nat'],['client-nat','clientB-nat']);add('Reply ระบุ Public tuple','คืนแต่ละ flow ตาม mapping ไม่สลับ Client',[['dst :40001','192.168.10.25:51514'],['dst :40002','192.168.10.26:51514']],['nat'],['nat-server']);break;}
      if(!s.ok){add('ตรวจ Mapping / Policy',s.detail,s.rows,['nat'],[],'blocked');break;}
      add('สร้าง PAT mapping','แปลง source address/port ไม่ใช่เข้ารหัส',[['Inside local','192.168.10.25:51514'],['Inside global','198.51.100.25:40001']],['nat']);
      add('ส่งด้วย Public tuple','Server เห็น source ที่แปลงแล้ว',[['After','198.51.100.25:40001 → 203.0.113.80:443']],['server'],['nat-server']);
      add('Reply → Lookup mapping','คืน destination ให้ host เดิม; ต้องมี state/policy ที่รองรับ',[['Reply dst','198.51.100.25:40001 → 192.168.10.25:51514']],['client','nat'],['nat-server','client-nat']);break;
    }
    case 'monitoring': {
      const offset=Number(p.offset);if(!Number.isFinite(offset)||offset<0||offset>10)throw Error('Clock offset ต้องอยู่ในช่วง 0–10 นาที');
      nodes=[node('sw','SW1','Syslog / SNMP','switch'),node('router','R1','Syslog'),node('collector','Collector','NTP reference','server')];links=[edge('sw','collector'),edge('router','collector')];
      add('เก็บ Log ดิบ','เวลา SW1 = เวลาจริง + offset จำลอง',[['SW1 Link down',`10:${String(2+offset).padStart(2,'0')}`],['R1 Neighbor down','10:02'],['SW1 offset','+'+offset+' min']],['collector'],links.map(e=>e.id));
      add('เทียบเวลา','NTP synchronization ไม่ใช่ตัวแก้ log ย้อนหลัง; ที่นี่คำนวณ offset ของหลักฐานเก่า',[['Normalized SW1','10:02'],['Normalized R1','10:02'],['Inference','นาทีตรงกันยังไม่ยืนยันลำดับเชิงเหตุผล']],['collector']);
      add('เทียบ Counter',scenario===2?'Link up แต่ errors เพิ่ม':'ประกอบหลักฐานอื่น ไม่สรุปสาเหตุจากเวลาอย่างเดียว',[['ifOperStatus','up'],['Errors before',120],['Errors after',340],['Delta',220],['Security','SNMPv3 authPriv ใน Lab']],['sw','collector'],['sw-collector']);break;
    }
    case 'acl': {
      const port=String(p.port);if(!['22','443'].includes(port))throw Error('เลือก port 22 หรือ 443');
      nodes=[node('client','Client','192.168.10.25','client'),node('rules','Ordered ACL','First match'),node('server','Server',`TCP/${port}`,'server')];links=[edge('client','rules'),edge('rules','server')];
      add('Flow เข้า ACL','เมื่อเปลี่ยน port จะคำนวณผลใหม่ ไม่ยึด headline ของ preset',[['Protocol','TCP'],['Source','192.168.10.25'],['Destination port',port]],['client'],['client-rules']);
      if(scenario===2){add('Rule 5 · deny ip any any','ตรง rule แรกจึงไม่ตรวจ rule 10 ต่อ',[['Match','Yes'],['Decision','Deny'],['Rule 10','Not evaluated']],['rules'],[],'blocked');break;}
      add('Rule 10 · permit TCP subnet → 443','ตรวจ source subnet และ port',[['Match',port==='443'?'Yes':'No']],['rules']);
      add(port==='443'?'Permit แล้วหยุด':'Implicit deny',port==='443'?'Forward flow ที่ตรง rule; ไม่ได้จำลอง stateful firewall':'ไม่มี permit rule อื่นใน Lab',[['Decision',port==='443'?'Permit':'Deny']],port==='443'?['server']:['rules'],port==='443'?['rules-server']:[],port==='443'?'ok':'blocked');break;
    }
    case 'port-security': {
      nodes=[node('client','Access host',scenario===0?'MAC …01':'MAC …09','client'),node('port','Gi1/0/1','Max 1 · shutdown','switch')];links=[edge('client','port')];
      add('สังเกต Source MAC','Allowed MAC เต็ม: 02:00:00:00:00:01',[['Observed',scenario===0?'02:00:00:00:00:01':'02:00:00:00:00:09']],['client'],['client-port']);
      add('เทียบกับ Policy','การตรวจ MAC ไม่ใช่ authentication บุคคล',[['MAC match',scenario===0?'Yes':'No']],['port']);
      add(scenario===0?'Forward':'Violation → Err-disabled',s.detail,[['Port',scenario===0?'Forwarding':'Err-disabled'],['Action',scenario===0?'Accept frame':'ตรวจเหตุ ไม่เปิดพอร์ตซ้ำทันที']],['port'],scenario===0?['client-port']:[],scenario===0?'ok':'blocked');break;
    }
    case 'dhcp-snooping': {
      nodes=[node('client','Host / Claim','Gi1/0/1','client'),node('switch','Switch','Snooping + DAI','switch'),node('server','DHCP server','Trusted uplink','server'),node('rogue','Rogue server','Untrusted Gi1/0/9','server')];links=[edge('client','switch'),edge('server','switch'),edge('rogue','switch')];
      add('Trusted boundary','Trusted เฉพาะพอร์ต server/uplink ตาม topology ไม่ใช่ทุกพอร์ต',[['Gi1/0/1','Untrusted'],['Gi1/0/9','Untrusted'],['Server uplink','Trusted']],['switch']);
      if(scenario===1){add('Offer จาก Rogue','Server message จาก untrusted port ถูก drop',[['Ingress','Gi1/0/9'],['Decision','Drop']],['rogue','switch'],['rogue-switch'],'blocked');break;}
      add('เรียน Binding จาก DHCP','IP / MAC / VLAN / port ต้องสัมพันธ์กัน',[['Binding','192.168.10.25 / MAC …01 / VLAN10 / Gi1/0/1']],['switch','server'],['server-switch']);
      add('DAI เทียบ ARP Claim','Static hosts ต้องมี policy/binding รองรับ',[['Claim',scenario===2?'192.168.10.25 = MAC …09':'192.168.10.25 = MAC …01'],['Decision',scenario===2?'Drop':'Pass']],['client','switch'],['client-switch'],scenario===2?'blocked':'ok');break;
    }
    case 'aaa-ssh': {
      nodes=[node('viewer','Viewer','SSH client','client'),node('device','Network device','AAA policy'),node('audit','Accounting log','จำลอง · ไม่มี credential','server')];links=[edge('viewer','device'),edge('device','audit')];
      add('Authentication ผ่าน','สมมติ Viewer login ผ่าน SSH แล้ว',[['Identity','Viewer'],['SSH','Encrypted management channel']],['viewer','device'],['viewer-device']);
      const denied=p.action==='configure';
      add('Authorization ตามคำสั่ง','Viewer อ่านได้ แต่แก้ interface ไม่ได้',[['Requested',denied?'configure interface':'show interfaces'],['Decision',denied?'Deny':'Permit']],['device'],[],denied?'blocked':'ok');
      add('Accounting','บันทึกทั้งการอนุญาต/ปฏิเสธในระบบจำลอง',[['Audit',`Viewer / ${p.action} / ${denied?'DENIED':'PERMITTED'}`]],['audit'],['device-audit']);break;
    }
    case 'vpn': {
      nodes=[node('client','Site A host','10.1.0.10','client'),node('a','IPsec gateway A','198.51.100.10'),node('b','IPsec gateway B','203.0.113.10'),node('server','Site B host','10.2.0.20','server')];links=[edge('client','a'),edge('a','b','IPsec tunnel'),edge('b','server')];
      add('Inner packet','ส่งระหว่าง Private hosts',[['Inner src','10.1.0.10'],['Inner dst','10.2.0.20']],['client'],['client-a']);
      add('ตรวจ Security association','Lab สมมติ ESP tunnel mode ที่เข้ารหัสตาม policy',[['SA',scenario===0?'พร้อม':'ไม่พร้อม / policy mismatch']],['a','b'],[],scenario===0?'ok':'blocked');
      if(scenario!==0)break;
      add('ESP / Outer packet','Outer IP ยังเห็นได้; payload ปกป้องตาม SA ไม่ใช่ทำให้ทุก metadata ลับ',[['Outer src','198.51.100.10'],['Outer dst','203.0.113.10'],['Inner payload','Encrypted / integrity protected ตาม Lab']],['a','b'],['a-b']);
      add('ตรวจและถอด Tunnel','Gateway B ตรวจความถูกต้อง ถอด แล้ว route inner packet',[['Delivered inner dst','10.2.0.20']],['b','server'],['b-server']);break;
    }
    case 'wireless-radio': {
      const channels=String(p.channels).split(',');if(!['1,6,11','1,2,3'].includes(String(p.channels)))throw Error('เลือกแผน Channel ที่มีใน Lab');
      nodes=channels.map((c,i)=>node('ap'+i,'AP'+(i+1),'Channel '+c,'ap'));links=[edge('ap0','ap1'),edge('ap1','ap2')];const overlap=p.channels==='1,2,3';
      add('วาง Channel บน Spectrum','2.4 GHz / 20 MHz แบบจำลอง overlap เชิงแนวคิด ไม่ใช่ RF solver',[['Channels',channels.join(' / ')],['Width','20 MHz']],nodes.map(n=>n.id));
      add('เปรียบเทียบพื้นที่ทับซ้อน','ระยะห่างและ environment จริงยังมีผล',[['Adjacent-channel overlap',overlap?'สูงในตัวอย่าง':'ลดลงในตัวอย่าง'],['RSSI','สมมติแรงทั้งสองแผน']],nodes.map(n=>n.id),overlap?links.map(e=>e.id):[],overlap?'blocked':'ok');
      add('สรุป ไม่ตัดสินจาก RSSI อย่างเดียว','ไม่มี throughput number ที่แต่งขึ้น; ต้อง site survey',[['Expected',overlap?'มีความเสี่ยง interference':'ยังมี co-channel contention ได้']],nodes.map(n=>n.id));break;
    }
    case 'wlc': {
      nodes=[node('client','Wi-Fi client','192.168.10.25','client'),node('ap','AP','CAPWAP / Local VLAN','ap'),node('wlc','WLC','192.168.99.10'),node('lan','Local LAN','VLAN10','switch')];links=[edge('client','ap'),edge('ap','wlc','Control / tunnel'),edge('ap','lan','Local data'),edge('wlc','lan')];
      add('Control / Management','AP ติดต่อ WLC ตาม architecture ใน Lab',[['Control path','AP ↔ WLC']],['ap','wlc'],['ap-wlc']);
      if(scenario===2){add('Monitor mode','เน้นตรวจ radio ไม่ให้บริการ client ปกติใน Lab',[['Client data','ไม่เกิด flow ให้บริการ']],['ap'],[]);break;}
      add('Client data',scenario===0?'Central switching ใช้ tunnel ไป WLC':'FlexConnect local switching ออก VLAN ที่ AP',[['Path',scenario===0?'Client → AP → WLC → LAN':'Client → AP → Local LAN']],['client','ap','lan'],scenario===0?['client-ap','ap-wlc','wlc-lan']:['client-ap','ap-lan']);
      add('เปรียบเทียบ Control กับ Data','Local switching ไม่ได้แปลว่าไม่มีการจัดการจาก WLC',[['Control','AP ↔ WLC'],['Data via WLC',scenario===0?'Yes':'No']],['wlc','ap']);break;
    }
    case 'wifi-security': {
      nodes=[node('client','Client','SSID: Learning','client'),node('ap1','AP1','Authenticator','ap'),node('ap2','AP2','SSID: Learning','ap'),node('auth','RADIUS','Authentication server','server')];links=[edge('client','ap1'),edge('client','ap2'),edge('ap1','auth')];
      if(scenario===2){add('เชื่อมกับ AP1','เริ่มใน coverage ของ AP1',[['Associated','AP1']],['client','ap1'],['client-ap1']);add('Client เลือกย้าย AP','ขึ้นกับ client/signal/policy ไม่ใช่ AP บังคับทุกระบบ',[['Candidate','AP2']],['client','ap2']);add('Reassociation / Authentication ตามระบบ','ย่อขั้นตอน; ไม่รับประกัน seamless handoff',[['Associated','AP2'],['SSID','Learning']],['client','ap2'],['client-ap2']);break;}
      add(scenario===0?'SAE / Personal':'802.1X / Enterprise',scenario===0?'รหัสร่วมตามกลุ่ม ไม่ใช้ RADIUS ใน flow นี้':'AP เป็น Authenticator ส่ง EAP ตามระบบไป authentication server',[['Identity model',scenario===0?'Shared password':'EAP / per-user policy']],['client','ap1'],['client-ap1']);
      if(scenario===1)add('ตรวจ Authentication และ Certificate','ตาม EAP method/policy ที่เลือก ไม่ส่ง secret ลง log',[['Server','RADIUS'],['Certificate','ตรวจตาม EAP/policy']],['auth'],['ap1-auth']);
      add('ลิงก์ Wi-Fi ปกป้องข้อมูล','ไม่แทน HTTPS สำหรับ end-to-end protection',[['Scope','Client ↔ AP'],['Internet','ยังใช้ TLS ตามบริการ']],['client','ap1'],['client-ap1']);break;
    }
    case 'rest-json': {
      nodes=[node('client','API client','Sandbox · ไม่มี HTTP จริง','client'),node('server','Device API','/devices/1','server')];
      add('สร้าง Request','Credential เป็นเพียงตัวเลือกจำลอง ไม่มี token จริง',[['Method',p.method],['Path','/devices/1']],['client'],['client-server']);
      if(p.credential!=='yes'){add('401 Unauthorized','Authentication ไม่ผ่าน จึงไม่อ่าน/แก้ resource',[['Status',401],['Effect','No mutation']],['server'],[],'blocked');break;}
      if(p.method==='PATCH'){let body;try{body=JSON.parse(String(p.body));}catch{add('400 Bad Request','JSON syntax ไม่ถูกต้อง',[['Status',400],['Effect','No mutation']],['server'],[],'blocked');break;}
        const valid=body&&typeof body==='object'&&!Array.isArray(body)&&Object.keys(body).length===1&&typeof body.description==='string'&&body.description.length<=80;
        if(!valid){add('422 Validation error','Lab รับเฉพาะ object ที่มี description เป็น string ≤80 ตัวอักษร',[['Status',422],['Effect','No mutation']],['server'],[],'blocked');break;}
        add('Schema ผ่าน → Update จำลอง','เปลี่ยนเฉพาะข้อมูลในผลจำลองนี้ ไม่บันทึกบนระบบจริง',[['Before','description: ""'],['After',JSON.stringify(body)]],['server']);}
      add('200 OK / JSON response','แยก HTTP status จาก response body',[['Status',200],['Body',p.method==='GET'?'{"id":1,"name":"SW1","status":"up"}':String(p.body)]],['client','server'],['client-server']);break;
    }
    case 'automation-tools': {
      nodes=[node('current','Current state',p.current==='present'?'VLAN10 present':'VLAN10 absent','switch'),node('plan','Plan review','ไม่มีการเรียก Ansible/Terraform','server'),node('desired','Desired state',p.desired==='present'?'VLAN10 present':'VLAN10 absent','switch')];links=[edge('current','plan'),edge('plan','desired')];
      const action=p.current===p.desired?'NO CHANGE':p.desired==='present'?'CREATE VLAN10':'DELETE VLAN10';
      add('Read / Compare','อ่าน current state ก่อนสร้าง plan',[['Current',p.current],['Desired',p.desired]],['current','desired']);
      if(scenario===2){add('Destructive plan ต้อง Review','Scenario นี้แสดงความเสี่ยง delete VLAN20 ไม่ Apply อัตโนมัติ',[['Plan','Delete VLAN20'],['Impact','ผู้ใช้งานอาจถูกตัด']],['plan'],[],'blocked');break;}
      add('Plan / Diff','ผลคำนวณจาก current/desired ที่เลือก',[['Action',action]],['plan'],['current-plan']);
      add(action.startsWith('DELETE')?'หยุดตรวจ Dependency':'Apply เฉพาะ Sandbox',action.startsWith('DELETE')?'ไม่จำลองการลบจนกว่าจะประเมินผลกระทบ':'หลัง apply ที่จำลอง หากรันซ้ำด้วย current ตรง desired จะเป็น no change',[['Final',action.startsWith('DELETE')?'Not applied':p.desired],['Re-run',action.startsWith('DELETE')?'Blocked by review':'NO CHANGE']],['desired'],action.startsWith('DELETE')?[]:['plan-desired'],action.startsWith('DELETE')?'blocked':'ok');break;
    }
    case 'sdn': {
      nodes=[node('mgmt','Management','UI / API','server'),node('control','Control','OSPF / Controller','router'),node('data','Data','Forwarding table','switch'),node('user','User traffic','Packet','client')];links=[edge('mgmt','control'),edge('control','data'),edge('user','data')];
      if(scenario===0){add('Management policy','ผู้ดูแลกำหนด policy ผ่าน UI/API',[['Input','Policy']],['mgmt']);add('Controller กระจาย Configuration','ตาม capabilities ของระบบ; ไม่ใช่ส่ง user packet',[['Operation','Config distribution']],['control','data'],['mgmt-control','control-data']);}
      else if(scenario===1){add('Packet เข้าสู่ Data plane','lookup forwarding table บนอุปกรณ์',[['Input','User packet']],['user','data'],['user-data']);add('Forward โดยไม่ผ่าน Controller ทุก Packet','ไม่วาด control path เป็น data path',[['Used','Forwarding entries']],['data']);}
      else{add('Control plane เรียน Route','OSPF แลก routing information',[['Protocol','OSPF']],['control']);add('สร้าง Forwarding entries','Data plane ใช้ผลการตัดสินใจที่ติดตั้งไว้',[['Result','Route → Forwarding entry']],['data'],['control-data']);}break;
    }
    case 'troubleshooting': {
      nodes=[node('client','Client','192.168.10.25','client'),node('gw','Gateway','192.168.10.1'),node('dns','Resolver · LAN','192.168.10.53','server'),node('server','Service','203.0.113.80:443','server')];links=[edge('client','gw'),edge('client','dns'),edge('gw','server')];
      const evidence={link:['NIC link',scenario===0?'down':'up'],ip:['IP / GW','192.168.10.25/24 · 192.168.10.1'],ping:['ICMP',scenario===0?'ไม่มีทางส่งจาก link นี้':scenario===1?'Reply จาก IP ใน Lab':'No reply (policy ไม่ทราบ)'],dns:['nslookup',scenario===0?'Timeout เนื่องจาก link down ใน Lab':scenario===1?'ชื่อไม่มี record ใน Lab':'203.0.113.80'],tcp:['TCP/443',scenario===0?'เชื่อมไม่ได้เพราะ link down':scenario===1?'บริการผ่าน IP ใช้ได้ใน Lab':'RST / refused ใน Lab']};
      if(!evidence[p.command])throw Error('เลือกเครื่องมือที่มีใน Lab');
      add('เก็บอาการก่อนแก้','นี่คือ incident fixture ไม่รันคำสั่งบนเครื่องจริง',[['Incident',s.label]],['client']);
      const local=['link','ip'].includes(p.command),failed=scenario===0||p.command==='dns'&&scenario===1||p.command==='tcp'&&scenario===2;
      add('ใช้เครื่องมือ: '+p.command,'ผลจำลองจาก incident fixture ไม่ใช่ Packet capture จริง',[evidence[p.command]],local?['client']:['client',p.command==='dns'?'dns':'gw'],local||scenario===0?[]:p.command==='dns'?['client-dns']:['client-gw','gw-server'],failed?'blocked':'ok');
      if(!local&&scenario!==0){
        steps.at(-1).transfers=p.command==='dns'?[{from:'client',to:'dns',message:'DNS query A'},{from:'dns',to:'client',message:scenario===1?'DNS negative answer · ไม่มีชื่อใน fixture':'DNS answer · 203.0.113.80'}]:p.command==='ping'&&scenario===2?[{from:'client',to:'gw',message:'ICMP Echo → next hop'},{from:'gw',to:'server',message:'ICMP probe · ไม่เห็น Reply; ไม่ระบุจุด drop'}]:[{from:'client',to:'gw',message:p.command==='tcp'?'TCP SYN':'ICMP Echo'},{from:'gw',to:'server',message:'Forward probe'},{from:'server',to:'gw',message:p.command==='tcp'&&scenario===2?'TCP RST (fixture จากบริการ)':'Reply (ย่อ)'},{from:'gw',to:'client',message:p.command==='tcp'&&scenario===2?'TCP RST':'Reply ถึง Client'}];
      }
      add('แยก Evidence จาก Inference','ใช้หลักฐานหลายเครื่องมือก่อนเลือกแนวทางตรวจต่อในสมุดด้านล่าง',[['สรุปจากคำสั่งเดียว','ยังไม่ยืนยัน root cause'],['ต้องระวัง','Ping timeout ไม่พิสูจน์ว่า host ดับ; TCP RST อาจมาจาก service หรือ policy']],['client']);break;
    }
    case 'mpls-vpn': {
      const customer=p.customer==='B'?'B':'A',vpnLabel=customer==='A'?'201':'202';
      nodes=[node('ce','CE '+customer,'10.0.0.10','router'),node('pe1','Ingress PE','VRF A / VRF B'),node('p','P router','Transport label only'),node('pe2','Egress PE','VRF '+customer),node('remote','Remote CE '+customer,'10.0.0.20','router')];links=[edge('ce','pe1'),edge('pe1','p'),edge('p','pe2'),edge('pe2','remote')];
      add('Ingress เลือก VRF จาก attachment','ลูกค้า A/B ใช้ 10.0.0.0/24 ซ้ำได้; ไม่ lookup ข้าม VRF',[['Customer',customer],['Lookup context','VRF '+customer],['Dst','10.0.0.20']],['pe1'],['ce-pe1']);
      add('Push label stack','ตัวเลข label กำหนดเพื่อสอน ไม่จำลอง LDP/MP-BGP',[['Top / transport','100'],['Inner / VPN',vpnLabel],['Payload','IP ไม่ได้เข้ารหัสอัตโนมัติ']],['pe1'],['pe1-p']);
      add('P ใช้ Transport label','ตัวอย่าง swap 100 → 110; ไม่อ่าน VRF ลูกค้า',[['Top label','110'],['VPN label',vpnLabel]],['p'],['p-pe2']);
      add('Egress PE เลือก VPN context','ย่อการจัดการ transport label/PHP; VPN label กำหนด context/attachment ตามระบบ',[['VPN label',vpnLabel],['Selected','VRF '+customer],['Delivery','Remote CE '+customer]],['pe2','remote'],['pe2-remote']);break;
    }
    case 'network-commands': {
      const cmds={
        ip:['ipconfig / ip addr + ip route + resolver config','อ่านค่า IP, route และ DNS; Linux ใช้หลายคำสั่ง ไม่ใช่ ip addr คำสั่งเดียว'],
        ping:['ping','ส่ง ICMP Echo แล้วมี Reply กลับมาหรือไม่'],
        tracert:['tracert / traceroute','packet ผ่าน hop ใดบ้างและหยุดที่ใด'],
        nslookup:['nslookup / dig','DNS server ที่ตั้งไว้ตอบชื่อเป็น IP ได้หรือไม่'],
        arp:['arp -a / ip neigh','เครื่องรู้ MAC ของ next hop ใน LAN นี้แล้วหรือยัง'],
        netstat:['netstat / ss','มี connection ใดอยู่และอยู่ในสถานะอะไร'],
      };
      const R=(fields,says,not,bad=false)=>({fields,says,not,bad});
      const gwMac=['192.168.10.1','02:00:00:00:00:fe'], hops=[['Hop 1','192.168.10.1'],['Hop 2','198.51.100.1'],['Hop 3','203.0.113.80']];
      const results=[{
        ip:R([['IPv4','192.168.10.25/24'],['Default gateway','192.168.10.1'],['DNS','192.168.10.53']],'ค่าที่ตั้งไว้ครบ','ยังไม่พิสูจน์ว่าไปถึงปลายทางได้'),
        ping:R([['Target','203.0.113.80'],['Reply','4/4'],['Loss','0%']],'มีเส้นทางไป-กลับสำหรับ ICMP','ไม่ได้แปลว่า TCP/443 เปิดอยู่'),
        tracert:R(hops,'เห็น hop ที่ตอบตามลำดับ','hop ที่แสดง * ไม่ได้แปลว่าสายขาด'),
        nslookup:R([['Server','192.168.10.53'],['ops.example.test','203.0.113.80']],'DNS ตอบชื่อนี้ได้','ไม่ได้แปลว่าเว็บบริการตอบ'),
        arp:R([gwMac,['Type','dynamic']],'รู้ MAC ของ gateway แล้ว','ไม่ได้ตรวจเส้นทางนอก LAN'),
        netstat:R([['Local','192.168.10.25:51514'],['Remote','203.0.113.80:443'],['State','ESTABLISHED']],'TCP handshake สำเร็จแล้ว','ไม่ได้ตรวจว่าเนื้อหาตอบถูกต้อง'),
      },{
        ip:R([['IPv4','192.168.10.25/24'],['Default gateway','192.168.10.1'],['DNS','192.168.10.54']],'DNS ที่ตั้งไว้ต่างจาก resolver ปกติ (.53)','ยังไม่รู้ว่า .54 ตอบหรือไม่',true),
        ping:R([['ping 203.0.113.80','Reply 4/4'],['ping ops.example.test','ไม่พบ host']],'เส้นทางไป IP ใช้ได้ ชื่อยังแปลงไม่ได้','ยังไม่รู้สาเหตุที่ชื่อล้มเหลว',true),
        tracert:R(hops,'เส้นทางไป IP ปกติ','ไม่ได้ตรวจ DNS'),
        nslookup:R([['Server','192.168.10.54'],['Result','request timed out'],['Answer','ไม่มี']],'resolver ที่ตั้งไว้ไม่ตอบ','ไม่รู้ว่าเครื่อง .54 ปิดหรือถูกกรอง',true),
        arp:R([gwMac,['Type','dynamic']],'gateway ใน LAN ปกติ','ไม่เกี่ยวกับ DNS'),
        netstat:R([['Remote 203.0.113.80:443','ไม่มี connection'],['ที่เป็นไปได้','ยังไม่ได้ IP จึงยังไม่เริ่ม TCP']],'ยังไม่มีการเริ่ม TCP','ไม่ใช่หลักฐานเดียวว่าเป็นเพราะ DNS',true),
      },{
        ip:R([['IPv4','192.168.10.25/24'],['Default gateway','192.168.10.1'],['DNS','192.168.10.53']],'ค่าที่ตั้งไว้ปกติ','ไม่ได้บอกว่า gateway ยังทำงาน'),
        ping:R([['Target','192.168.10.1'],['Reply','0/4'],['Loss','100%']],'ไม่เห็น Reply จาก gateway','ไม่ยืนยันว่า gateway ดับ อาจกรอง ICMP หรือ link มีปัญหา',true),
        tracert:R([['Hop 1','* * *'],['ถัดไป','ไม่มี hop']],'หยุดตั้งแต่ hop แรก','ไม่รู้ว่าเกิดที่ gateway หรือ link',true),
        nslookup:R([['Server','192.168.10.53'],['ops.example.test','203.0.113.80']],'DNS อยู่ใน LAN เดียวกันจึงตอบได้','ไม่ยืนยันเส้นทางออก Internet'),
        arp:R([['192.168.10.1','ไม่มี MAC (Linux: INCOMPLETE / FAILED)']],'ARP ไม่ได้รับ reply จาก gateway','ไม่ระบุสาเหตุ: อุปกรณ์ปิด VLAN ผิด หรือ link มีปัญหา',true),
        netstat:R([['Remote 203.0.113.80:443','SYN_SENT']],'ส่ง SYN แล้วยังไม่ได้ SYN-ACK','ไม่บอกตำแหน่งที่ packet หาย',true),
      }];
      const cmd=String(p.command);if(!cmds[cmd])throw Error('เลือกคำสั่งจากตัวเลือกใน Lab');
      const r=results[scenario][cmd];
      nodes=[node('client','Client','192.168.10.25','client'),node('gateway','Gateway','192.168.10.1'),node('dns','Configured resolver',scenario===1?'192.168.10.54':'192.168.10.53','server'),node('server','Server','203.0.113.80','server')];
      links=[edge('client','gateway'),edge('gateway','server'),edge('client','dns')];
      const act=cmd==='ip'?['client']:cmd==='arp'?['client','gateway']:cmd==='nslookup'?['client','dns']:['client','gateway','server'];
      const ed=cmd==='ip'?[]:cmd==='arp'?['client-gateway']:cmd==='nslookup'?['client-dns']:['client-gateway','gateway-server'];
      add('คำถามที่คำสั่งนี้ตอบ','ผลทั้งหมดเป็นตัวอย่างจำลอง ไม่ได้รันบนเครื่องจริง',[['คำสั่ง',cmds[cmd][0]],['ตอบคำถาม',cmds[cmd][1]]],['client']);
      add('ผลจำลอง',s.label,r.fields,act,ed,r.bad?'blocked':'ok');
      if(cmd==='ping'||cmd==='tracert')Object.assign(steps.at(-1),{transfers:[{from:'client',to:'gateway',message:scenario===2?'ARP next hop · ยังไม่มี Reply':cmd==='ping'?'ICMP Echo → next hop':'probe TTL (ภาพย่อ ไม่แสดงทุก hop)'},...(scenario===2?[]:[{from:'gateway',to:'server',message:'forward probe (ย่อ intermediate routers)'},{from:'server',to:'gateway',message:'Reply (ย่อ probes)'},{from:'gateway',to:'client',message:'Reply ถึง Client'}])]});
      if(cmd==='nslookup')Object.assign(steps.at(-1),{transfers:[{from:'client',to:'dns',message:'DNS query A'}]});
      if(cmd==='nslookup'&&scenario!==1)steps.at(-1).transfers.push({from:'dns',to:'client',message:'DNS answer · 203.0.113.80'});
      if(['ip','arp','netstat'].includes(cmd)){
        steps.at(-1).active=['client'];steps.at(-1).edges=[];
        steps.at(-1).detail='อ่านสถานะในเครื่อง ไม่ส่ง probe ใหม่; cache/socket เป็นสถานะที่เตรียมไว้ใน incident fixture';
      }
      add('อ่านผลอย่างระวัง','แยกสิ่งที่สรุปได้ออกจากสิ่งที่ยังสรุปไม่ได้',[['สรุปได้',r.says],['ยังสรุปไม่ได้',r.not]],['client'],[],r.bad?'blocked':'ok');break;
    }
    case 'mail': {
      nodes=[node('sender','Sender app','alice@example.org','client'),node('out','Outgoing server','smtp.example.org','server'),node('dns','DNS','MX / A lookup','server'),node('mx','MX mail1.example.net','203.0.113.25','server'),node('reader','Recipient app','bob@example.net','client')];
      links=[edge('sender','out'),edge('out','dns'),edge('out','mx'),edge('mx','reader')];
      const T=(from,to,message)=>({from,to,message}),tr=(...t)=>Object.assign(steps.at(-1),{transfers:t});
      add('ส่งเข้า Outgoing server','SMTP submission: ผู้ส่งต้องยืนยันตัวตนกับ server ของตน',[['Protocol','SMTP submission · TCP/587'],['Auth','ยืนยันตัวตนผู้ส่ง'],['Recipient','bob@example.net']],['sender','out'],['sender-out']);tr(T('sender','out','SMTP submission'));
      if(scenario===2){
        add('ค้น MX ของโดเมนผู้รับ','Lab สมมติโดเมนปลายทางไม่มี record ใช้งาน',[['Query','MX example.invalid'],['MX','ไม่มี'],['A / AAAA','ไม่มี']],['out','dns'],['out-dns'],'blocked');tr(T('out','dns','MX query'));
        add('ส่งไม่ได้ → แจ้งผู้ส่ง','ปัญหาอยู่ที่โดเมนปลายทาง ไม่ใช่ Inbox ของผู้รับ',[['ผลต่อผู้ส่ง','ได้ bounce (DSN)'],['ตรวจต่อ','สะกดโดเมน · DNS ของโดเมนนั้น']],['out','sender'],['sender-out'],'blocked');tr(T('out','sender','Bounce / DSN'));break;
      }
      add('ค้น MX ของ example.net','MX ที่ preference ต่ำสุดถูกลองก่อน',[['Query','MX example.net'],['Answer',scenario===0?'10 mail1.example.net':'10 mail1 · 20 mail2'],['A mail1','203.0.113.25']],['out','dns'],['out-dns']);tr(T('out','dns','MX query'),T('dns','out','MX answer'));
      if(scenario===1){
        nodes.push(node('mx2','MX mail2.example.net','203.0.113.26','server'));links.push(edge('out','mx2'));
        add('MX 10 ไม่ตอบ','connection timeout ต่อ mail1',[['mail1.example.net','timeout']],['out','mx'],['out-mx'],'blocked');
        add('ลอง MX 20','MX สำรองรับเมลไว้ในคิว แล้วส่งต่อให้ MX หลักเมื่อกลับมา',[['SMTP · TCP/25','250 Accepted'],['สถานะ','Queued at backup MX']],['out','mx2'],['out-mx2']);tr(T('out','mx2','SMTP DATA'));break;
      }
      add('ส่ง SMTP ไปยัง MX','การส่งระหว่าง server ใช้ TCP/25 อาจใช้ STARTTLS ถ้าทั้งสองฝั่งรองรับ',[['MAIL FROM','alice@example.org'],['RCPT TO','bob@example.net'],['Reply','250 Accepted']],['out','mx'],['out-mx']);tr(T('out','mx','SMTP MAIL / RCPT / DATA'));
      add('เก็บเข้ากล่องจดหมาย','MX รับเมลแล้ว เก็บไว้ให้ผู้รับดึงด้วย IMAP/POP3',[['Mailbox','bob@example.net'],['สถานะ','Delivered']],['mx']);
      add('ผู้รับอ่านด้วย IMAP','IMAP เก็บเมลบน server ซิงก์หลายอุปกรณ์ POP3 มักดึงลงเครื่อง (ตั้งค่าได้)',[['IMAPS','TCP/993'],['เมล','ยังอยู่บน server']],['reader','mx'],['mx-reader']);tr(T('reader','mx','IMAP fetch'),T('mx','reader','message'));break;
    }
    case 'proxy-lb': {
      const T=(from,to,message)=>({from,to,message}),tr=(...t)=>Object.assign(steps.at(-1),{transfers:t});
      if(scenario===0){
        nodes=[node('client','Client','10.1.0.10','client'),node('proxy','Forward proxy','198.51.100.8:3128'),node('server','ops.example.test','203.0.113.80','server')];links=[edge('client','proxy'),edge('proxy','server')];
        add('Client ส่งคำขอถึง Proxy','Client ถูกตั้งค่าให้ใช้ proxy จึงเชื่อมต่อกับ proxy ก่อน',[['เชื่อมต่อกับ','198.51.100.8:3128'],['ขอเว็บ','ops.example.test']],['client','proxy'],['client-proxy']);tr(T('client','proxy','HTTP request · ปลายทาง ops.example.test'));
        add('Proxy ตรวจนโยบาย','ตัวอย่าง: อนุญาตเฉพาะโดเมนที่กำหนด',[['Rule','allow ops.example.test'],['Decision','Permit']],['proxy']);
        add('Proxy ติดต่อ Server แทน','Server เห็น IP ของ proxy ไม่เห็น Client',[['Source ที่ Server เห็น','198.51.100.8'],['Client จริง','10.1.0.10 (ไม่ถูกเปิดเผย)']],['proxy','server'],['proxy-server']);tr(T('proxy','server','HTTP request ในนาม proxy'));
        add('ส่งคำตอบกลับ','Proxy ส่งผลให้ Client (บางระบบ cache ไว้ด้วย)',[['Response','HTTP 200']],['client','proxy'],['client-proxy']);tr(T('server','proxy','HTTP 200'),T('proxy','client','HTTP 200'));break;
      }
      nodes=[node('client','Client','198.51.100.77','client'),node('lb','Load balancer · VIP','203.0.113.10:443'),node('web1','web1','10.0.1.11','server'),node('web2','web2','10.0.1.12','server')];links=[edge('client','lb'),edge('lb','web1'),edge('lb','web2')];
      add('Client ส่งถึง VIP','Client รู้เพียง VIP ไม่ทราบจำนวนเครื่องด้านหลัง',[['Destination','203.0.113.10:443']],['client','lb'],['client-lb']);tr(T('client','lb','Request 1'));
      if(scenario===1){
        add('คำขอที่ 1 → web1','Round robin เป็นตัวอย่างอัลกอริทึมหนึ่ง',[['Algorithm','round robin (ตัวอย่าง)'],['Selected','web1 10.0.1.11']],['lb','web1'],['lb-web1']);tr(T('lb','web1','Request 1'));
        add('คำขอที่ 2 → web2','คำขอถัดไปไปเครื่องถัดไปใน pool',[['Selected','web2 10.0.1.12']],['client','lb','web2'],['client-lb','lb-web2']);tr(T('client','lb','Request 2'),T('lb','web2','Request 2'));break;
      }
      add('Health check web2 ล้มเหลว','LB ตรวจสุขภาพเครื่องเป็นระยะ',[['web1','healthy'],['web2','fail']],['lb','web2'],['lb-web2'],'blocked');
      add('ตัด web2 ออกจาก Pool','Client ยังใช้ VIP เดิม ไม่ต้องเปลี่ยนค่า',[['Pool','web1'],['VIP','203.0.113.10:443']],['lb']);
      add('คำขอใหม่ไป web1','ความจุเหลือเครื่องเดียว อาจช้าลงถ้าภาระสูง',[['Selected','web1 10.0.1.11']],['lb','web1'],['lb-web1']);tr(T('lb','web1','Request 3'));break;
    }
    case 'dmz': {
      nodes=[node('internet','Internet user','203.0.113.50','client'),node('fw','Firewall zones','Outside · DMZ · Inside'),node('web','Web server · DMZ','172.16.50.10','server'),node('inside','Database · Inside','10.10.10.20','server')];
      links=[edge('internet','fw'),edge('fw','web'),edge('fw','inside')];
      const T=(from,to,message)=>({from,to,message}),tr=(...t)=>Object.assign(steps.at(-1),{transfers:t});
      if(scenario===0){
        add('Flow จาก Outside','ผู้ใช้ Internet ขอเว็บสาธารณะ',[['Source','203.0.113.50'],['Destination','172.16.50.10:443'],['Zone','Outside → DMZ']],['internet','fw'],['internet-fw']);tr(T('internet','fw','TCP/443'));
        add('ตรวจนโยบาย','อนุญาตเฉพาะบริการสาธารณะ',[['Rule','permit tcp any → web :443'],['Decision','Permit']],['fw']);
        add('ส่งถึง Web server','Reply ขากลับผ่านด้วย state ของ firewall',[['Delivered','172.16.50.10:443']],['fw','web'],['fw-web']);tr(T('fw','web','Permit · TCP/443'));break;
      }
      if(scenario===1){
        add('Flow จาก Outside','Internet พยายามเข้าฐานข้อมูลภายใน',[['Source','203.0.113.50'],['Destination','10.10.10.20:5432'],['Zone','Outside → Inside']],['internet','fw'],['internet-fw']);tr(T('internet','fw','TCP/5432'));
        add('ไม่มี Permit','ไม่มี rule อนุญาต จึงเข้า default deny',[['Rule','ไม่ตรง'],['Decision','Deny']],['fw'],[],'blocked');break;
      }
      add('Web server ใน DMZ เริ่ม flow','สมมติเครื่องใน DMZ ถูกยึดและพยายามเข้า Inside',[['Source','172.16.50.10'],['Destination','10.10.10.20:22'],['Zone','DMZ → Inside']],['web','fw'],['fw-web']);tr(T('web','fw','TCP/22'));
      add('ตรวจนโยบาย DMZ → Inside','อนุญาตเฉพาะ TCP/5432 ที่แอปจำเป็นต้องใช้',[['Permit','tcp web → database :5432'],['Flow นี้','TCP/22'],['Decision','Deny']],['fw'],[],'blocked');break;
    }
    case 'pcap': {
      const M={c:'02:00:00:00:00:01',gw:'02:00:00:00:00:fe',d1:'02:00:00:00:00:53',d2:'02:00:00:00:00:54'},C='192.168.10.25',D1='192.168.10.53',D2='192.168.10.54',S='203.0.113.80';
      const F=(t,eth,ip,l4,info,learn,bad=false)=>({t,eth,ip,l4,info,learn,bad});
      const dnsQ=(t,dm,dip,info,bad,learn)=>F(t,[M.c,dm],[C,dip,64],'UDP 51000 → 53',info,learn,bad);
      const tcp=(t,dir,flags,learn,bad=false)=>dir==='out'?F(t,[M.c,M.gw],[C,S,64],'TCP 51514 → 443 ['+flags+']','TCP '+flags,learn,bad):F(t,[M.gw,M.c],[S,C,61],'TCP 443 → 51514 ['+flags+']','TCP '+flags,learn,bad);
      const caps=[[
        dnsQ(0,M.d1,D1,'DNS query A ops.example.test',false,'DNS ใช้ UDP/53 และ resolver อยู่ใน LAN จึงส่งตรงถึง MAC ของ resolver'),
        F(0.012,[M.d1,M.c],[D1,C,64],'UDP 53 → 51000','DNS response A 203.0.113.80',"คำตอบบอก IP ปลายทางที่จะเชื่อมต่อต่อไป"),
        tcp(0.013,'out','SYN','ปลายทางต่าง subnet: IP ปลายทางเป็น Server แต่ MAC ปลายทางเป็น Gateway'),
        tcp(0.041,'in','SYN, ACK','Server ตอบรับ TTL ที่เหลือเป็นค่าตัวอย่าง ไม่ใช่จำนวน hop ที่แม่นยำ'),
        tcp(0.041,'out','ACK','handshake ครบสามขั้นแล้ว'),
        tcp(0.043,'out','PSH, ACK','TLS ClientHello: เนื้อหา HTTP หลัง handshake เข้ารหัส จึงอ่านจาก capture ไม่ได้หากไม่มีกุญแจ'),
      ],[
        dnsQ(0,M.d1,D1,'DNS query A ops.example.test',false,'ขั้น DNS สำเร็จตามปกติ'),
        F(0.012,[M.d1,M.c],[D1,C,64],'UDP 53 → 51000','DNS response A 203.0.113.80','ได้ IP แล้ว'),
        tcp(0.013,'out','SYN','Client เริ่มเชื่อมต่อ TCP/443'),
        tcp(0.040,'in','RST, ACK','RST คือปลายทางปฏิเสธทันที ต่างจาก timeout ที่ไม่มีคำตอบเลย',true),
        tcp(1.013,'out','SYN','Client ลองใหม่ (พฤติกรรมขึ้นกับแอป)'),
        tcp(1.040,'in','RST, ACK','ถูกปฏิเสธซ้ำ ตรวจว่ามี service ฟัง port นี้หรือไม่',true),
      ],[
        dnsQ(0,M.d1,D1,'DNS query A ops.example.test',true,'ไม่มี response ภายในเวลาที่กำหนด'),
        dnsQ(1,M.d1,D1,'DNS query A ops.example.test (ถามซ้ำ)',true,'ถามซ้ำ resolver เดิมแต่ยังไม่มีคำตอบ'),
        F(2,[M.c,M.d2],[C,D2,64],'UDP 51001 → 53','DNS query A ops.example.test (ไป resolver สำรอง)','เปลี่ยนไปถาม resolver ตัวที่สอง'),
        F(2.02,[M.d2,M.c],[D2,C,64],'UDP 53 → 51001','DNS response A 203.0.113.80','resolver สำรองตอบ ผู้ใช้จึงรอนานกว่าปกติ'),
        tcp(2.021,'out','SYN','หลังได้ IP จึงเริ่ม TCP'),
        tcp(2.049,'in','SYN, ACK','เส้นทางไป Server ปกติ'),
      ]];
      const n=Number(p.frame);if(!Number.isInteger(n)||n<1||n>6)throw Error('เลือก Frame 1–6');
      const f=caps[scenario][n-1];
      nodes=[node('client','Client',C,'client'),node('gateway','Gateway','192.168.10.1'),node('dns','DNS resolvers','.53 หลัก · .54 สำรอง','server'),node('server','Server',S,'server')];
      links=[edge('client','gateway'),edge('gateway','server'),edge('client','dns')];
      const who=ip=>({[C]:'client',[D1]:'dns',[D2]:'dns',[S]:'server'}[ip]);
      const dns=f.l4.includes(' 53');
      add('ภาพรวม Frame','Capture ตัวอย่างที่จับ ณ NIC ของ Client ไม่ใช่ไฟล์ pcap จริง',[['Frame',n+' / 6'],['เวลา (สมมติ)',f.t+' s'],['Info',f.info]],dns?['client','dns']:['client','gateway','server'],dns?['client-dns']:['client-gateway','gateway-server'],f.bad?'blocked':'ok');
      Object.assign(steps.at(-1),{transfers:[{from:who(f.ip[0]),to:who(f.ip[1]),message:f.info}]});
      add('Layer 2 · Ethernet','MAC เปลี่ยนตามแต่ละ link',[['Source MAC',f.eth[0]],['Destination MAC',f.eth[1]]],['client']);
      add('Layer 3/4 · IP + Transport','IP ระบุผู้ส่งและผู้รับปลายทางจริง',[['IPv4 source',f.ip[0]],['IPv4 destination',f.ip[1]],['TTL',f.ip[2]],['Transport',f.l4]],dns?['client','dns']:['client','server']);
      add('อ่านแล้วสรุปอะไรได้',f.learn,[['สรุปได้',f.info],['ยังสรุปไม่ได้','Capture จุดเดียวไม่เห็นสิ่งที่เกิดนอกจุดที่จับ']],['client'],[],f.bad?'blocked':'ok');break;
    }
    case 'wan': {
      const T=(from,to,message)=>({from,to,message}),tr=(...t)=>Object.assign(steps.at(-1),{transfers:t});
      const bAddr=scenario===1?'172.16.0.5/30':'172.16.0.2/30';
      nodes=[node('pca','PC A','10.1.0.10','client'),node('ra','Router A','LAN 10.1.0.1 · WAN 172.16.0.1/30'),node('rb','Router B','WAN '+bAddr+' · LAN 10.2.0.1'),node('pcb','PC B','10.2.0.20','server')];
      links=[edge('pca','ra'),edge('ra','rb','WAN link'),edge('rb','pcb')];
      add('PC A ส่งหา Gateway','ปลายทางต่าง subnet จึงใช้ default gateway',[['IP dst','10.2.0.20'],['Next hop','10.1.0.1']],['pca','ra'],['pca-ra']);tr(T('pca','ra','IP 10.1.0.10 → 10.2.0.20'));
      if(scenario===1){
        add('ตรวจ subnet ของลิงก์ WAN','next hop ต้องอยู่ใน subnet ที่ต่ออยู่ของ Router',[['Router A','172.16.0.1/30 → ช่วง .0–.3'],['Router B','172.16.0.5/30 → ช่วง .4–.7'],['Same subnet','No']],['ra','rb'],[],'blocked');break;
      }
      if(scenario===2){
        add('Interface WAN ลง','ลิงก์จากผู้ให้บริการไม่พร้อมในกรณีนี้',[['WAN link','down'],['Connected 172.16.0.0/30','หายจาก routing table'],['Static route via 172.16.0.2','ใช้ไม่ได้']],['ra','rb'],[],'blocked');
        add('Router A ไม่มีเส้นทาง','packet ถูกทิ้ง และอาจส่ง ICMP unreachable ตามการตั้งค่า',[['Route 10.2.0.0/24','ไม่มี'],['แนวออกแบบ','ลิงก์สำรอง / floating static route']],['ra'],[],'blocked');break;
      }
      add('Router A Lookup','static route ชี้ next hop ที่อยู่ใน subnet ของลิงก์',[['Route','10.2.0.0/24 via 172.16.0.2'],['WAN subnet','172.16.0.0/30 · ใช้ได้ .1 และ .2']],['ra']);
      add('ส่งผ่านลิงก์ WAN','IP src/dst เดิม TTL ลด 1 และ header Layer 2 ของลิงก์สร้างใหม่',[['IP','10.1.0.10 → 10.2.0.20'],['TTL','63'],['Layer 2','header ของลิงก์ WAN (เช่น PPP หรือ Ethernet handoff)']],['ra','rb'],['ra-rb']);tr(T('ra','rb','IP 10.1.0.10 → 10.2.0.20 · TTL 63'));
      add('Router B ส่งเข้า LAN B','Connected route ของ LAN B; ขากลับต้องมี route 10.1.0.0/24 via 172.16.0.1 (ตั้งไว้ในกรณีนี้)',[['Connected','10.2.0.0/24'],['TTL ที่ PC B','62']],['rb','pcb'],['rb-pcb']);tr(T('rb','pcb','IP 10.1.0.10 → 10.2.0.20 · TTL 62'));break;
    }
    case 'cloud-vpc': {
      const T=(from,to,message)=>({from,to,message}),tr=(...t)=>Object.assign(steps.at(-1),{transfers:t});
      const pub=scenario===0||scenario===3,none=scenario===2;
      nodes=[node('vm','VM',pub?scenario===3?'10.0.1.10 · ไม่มี public IPv4':'10.0.1.10 + public IP':'10.0.2.10','client'),node('rt','Route table',pub?'0.0.0.0/0 → igw':none?'10.0.0.0/16 → local':'0.0.0.0/0 → nat-gw'),node('gw',pub?'Internet gateway':'NAT gateway',pub?'AWS-style VPC edge':'อยู่ใน public subnet'),node('internet','Internet server','203.0.113.80','server')];
      links=[edge('vm','rt'),edge('rt','gw'),edge('gw','internet')];
      add('VM ส่งไป Internet','Security rule ขาออกต้องอนุญาต (กรณีนี้อนุญาต)',[['Source',pub?'10.0.1.10':'10.0.2.10'],['Destination','203.0.113.80:443']],['vm'],[]);tr(T('vm','rt','TCP/443 → 203.0.113.80'));
      if(none){add('Route table ไม่มี default route','มีเฉพาะ route ภายใน VPC',[['Match','10.0.0.0/16 → local เท่านั้น'],['0.0.0.0/0','ไม่มี']],['rt'],['vm-rt'],'blocked');add('ผลที่ VM เห็น','ตรวจ route table ก่อนสรุปว่า VM หรือ firewall มีปัญหา',[['ผล','ออก Internet ไม่ได้ (ไม่มีเส้นทาง)']],['vm'],[],'blocked');break;}
      add('Route table เลือก Target',pub?'default route ชี้ Internet gateway':'default route ชี้ NAT gateway',[['Route',pub?'0.0.0.0/0 → igw':'0.0.0.0/0 → nat-gw']],['rt'],['vm-rt']);
      if(scenario===3){add('ไม่มี Public IPv4 mapping ของ VM','Subnet ยังเป็น public ตาม route แต่ IPv4 ผ่าน IGW โดยตรงในแบบ AWS นี้ต้องมี public mapping',[['Subnet type','Public'],['VM private IP','10.0.1.10'],['Public IPv4 mapping','ไม่มี'],['Result','ยังส่งถึง Internet server ไม่ได้']],['gw'],[],'blocked');break;}
      add(pub?'Gateway แปลง private ↔ public IP':'NAT gateway แปลง source',pub?'ตามแบบจำลอง VM เห็นเฉพาะ private IP; public IP ถูกแมปที่ gateway':'ใช้ public IP ของ NAT gateway ออกไป',[['Source หลังผ่านด่าน',pub?'public IP ของ VM (ตัวอย่าง 198.51.100.20)':'public IP ของ NAT gateway (ตัวอย่าง 198.51.100.30)']],['gw','internet'],['rt-gw','gw-internet']);tr(T('gw','internet','TCP/443 จาก public IP'));
      add('ขาเข้าต่างกัน',pub?'ถ้ามี public IP และ rule อนุญาต Internet เริ่มเชื่อมต่อเข้ามาได้':'ไม่มี public IP ของ VM Internet เริ่มเชื่อมต่อเข้ามาตรง ๆ ไม่ได้',[['Inbound จาก Internet',pub?'ได้เฉพาะ port ที่ rule อนุญาต':'เริ่มเชื่อมต่อเข้ามาไม่ได้']],['vm'],[],'ok');break;
    }
    case 'cloud-hybrid': {
      const T=(from,to,message)=>({from,to,message}),tr=(...t)=>Object.assign(steps.at(-1),{transfers:t});
      if(scenario===2){
        nodes=[node('a','Spoke A','10.1.0.0/16','client'),node('hub','Hub','10.0.0.0/16 · firewall'),node('b','Spoke B','10.2.0.0/16','server')];links=[edge('a','hub'),edge('hub','b')];
        add('Spoke A ส่งหา Spoke B','Route ชี้ไป hub ไม่ใช่ตรงไป B',[['Source','10.1.0.10'],['Destination','10.2.0.20'],['Next hop','Hub']],['a','hub'],['a-hub']);tr(T('a','hub','10.1.0.10 → 10.2.0.20'));
        add('Hub ตรวจและส่งต่อ','Hub เป็นจุดควบคุมกลาง; ต้องมี route และนโยบายอนุญาต',[['Inspect','Firewall policy'],['Route','10.2.0.0/16 → Spoke B']],['hub']);
        add('ถึง Spoke B','หลาย provider ไม่ให้ peering ส่งต่ออัตโนมัติ จึงต้องมีตัวกลางจริง',[['Delivered','10.2.0.20']],['hub','b'],['hub-b']);tr(T('hub','b','10.1.0.10 → 10.2.0.20'));break;
      }
      const bad=scenario===1,cloud=bad?'10.0.0.0/16':'10.0.0.0/16',onprem=bad?'10.0.0.0/16':'10.1.0.0/16';
      nodes=[node('host','On-prem host',bad?'10.0.0.10/16':'10.1.0.20/16','client'),node('gwo','On-prem VPN gateway',onprem),node('gwc','Cloud VPN gateway',cloud),node('vm','Cloud VM','10.0.0.20','server')];links=[edge('host','gwo'),edge('gwo','gwc','VPN tunnel'),edge('gwc','vm')];
      add('ตรวจ CIDR ทั้งสองฝั่ง','ก่อนเชื่อมต่อต้องแน่ใจว่าช่วง IP ไม่ซ้อน',[['On-prem',onprem],['Cloud VPC',cloud],['ซ้อนกัน',bad?'Yes':'No']],['gwo','gwc'],[],bad?'blocked':'ok');
      if(bad){add('Host เลือก On-link route','10.0.0.10/16 เห็นปลายทาง 10.0.0.20 อยู่ subnet เดียวกัน จึงไม่ใช้ gateway',[['Destination','10.0.0.20'],['Selected host route','10.0.0.0/16 → LAN'],['VPN tunnel','ยังไม่ได้รับ packet นี้']],['host']);add('ARP ใน LAN ไม่พบ Cloud VM','สมมติ LAN ไม่มีเครื่อง .20 จึงไม่มี ARP Reply; ไม่ได้ส่ง ARP ข้าม VPN และไม่ใช่ Router เลือกทางไม่ได้',[['ARP target','10.0.0.20'],['Result','No neighbor response'],['Next test','ตรวจ IP plan / overlap']],['host'],[],'blocked');break;}
      add('ส่งผ่าน Tunnel','Site-to-site VPN เข้ารหัสบน Internet ตามนโยบาย',[['Inner','10.1.0.20 → 10.0.0.20'],['Route on-prem','10.0.0.0/16 → tunnel']],['host','gwo','gwc'],['host-gwo','gwo-gwc']);tr(T('host','gwo','10.1.0.20 → 10.0.0.20'),T('gwo','gwc','Encrypted tunnel'));
      add('Cloud route ขากลับ','ฝั่ง Cloud ต้องมี route ไป on-prem ด้วย',[['Route cloud','10.1.0.0/16 → VPN gateway'],['Delivered','10.0.0.20']],['gwc','vm'],['gwc-vm']);tr(T('gwc','vm','10.1.0.20 → 10.0.0.20'));break;
    }
    default: throw Error('ยังไม่มี mechanism สำหรับ '+lesson.id);
  }
  const transfer=(from,to,message)=>({from,to,message});
  for(const [i,frame] of steps.entries()){
    frame.transfers ||= [];frame.nodeUpdates={};
    if(lesson.id==='tcp-handshake'&&!(scenario===1&&i===2))frame.transfers=[transfer(i===1?'server':'client',i===1?'client':'server',scenario===3&&i===1?'RST':i===0?'SYN · seq 100':i===1?'SYN-ACK · seq 500 / ack 101':'ACK · ack 501')];
    if(lesson.id==='https'&&i===1)frame.transfers=[transfer('server','client','TLS certificate → ตรวจชื่อ/chain')];
    if(lesson.id==='https'&&i===2&&scenario!==1)frame.transfers=[transfer('client','server','HTTP request ผ่าน TLS'),transfer('server','client',scenario===2?'HTTP 404':'HTTP 200')];
    if(lesson.id==='slaac'&&i===0)frame.transfers=[transfer('client','router','RS · ICMPv6')];
    if(lesson.id==='slaac'&&i===1&&scenario!==1)frame.transfers=[transfer('router','client','RA · prefix / router lifetime')];
    if(lesson.id==='slaac'&&i===3)frame.nodeUpdates.client='2001:db8:10::25 · DAD passed';
    if(lesson.id==='dhcp'){
      const paths=[['client','relay','Discover · Broadcast ใน LAN'],['server','relay','Offer'],['client','relay','Request'],['server','relay','ACK']];
      if(i===0||scenario===0){frame.transfers=[transfer(...paths[i])];if(i===0&&scenario!==1)frame.transfers.push(transfer('relay','server','Discover relayed'));if(i===1||i===3)frame.transfers.push(transfer('relay','client',i===1?'Offer relayed':'ACK relayed'));if(i===2)frame.transfers.push(transfer('relay','server','Request relayed'));}
      if(i===3)frame.nodeUpdates.client='192.168.10.25/24 · Lease confirmed';
    }
    if(lesson.id==='dns-cache'){
      if(scenario===2)frame.transfers=[transfer('client','cache',i===0?'Query A':'Query PTR'),transfer('cache','server',i===0?'Forward lookup':'Reverse lookup')];
      else if(i===1&&steps.length===3)frame.transfers=[transfer('cache','server','Query A · cache expired')];
      else if(i===steps.length-1){const answer=String(frame.fields.find(([k])=>k==='Answer')?.[1]||'');frame.transfers=[transfer('cache','client','A = '+answer)];frame.nodeUpdates.cache=answer;}
    }
    if(lesson.id==='nat-pat'){
      if(scenario===1&&i===1)frame.transfers=[transfer('client','nat',':51514 → public :40001'),transfer('clientB','nat',':51514 → public :40002')];
      else if(i===0)frame.transfers=[transfer('client','nat','Private source :51514')];
      else if(i===2&&scenario!==1)frame.transfers=[transfer('nat','server','Public source :40001')];
      else if(i===3)frame.transfers=[transfer('server','nat','Reply to public :40001'),transfer('nat','client','Restore destination :51514')];
    }
    if(lesson.id==='acl'&&i===0)frame.transfers=[transfer('client','rules','TCP dst port '+p.port)];
    if(lesson.id==='acl'&&frame.title.startsWith('Permit'))frame.transfers=[transfer('rules','server','Permit · first match')];
    if(lesson.id==='port-security'&&i===0)frame.transfers=[transfer('client','port','Source MAC → ตรวจ Policy')];
    if(lesson.id==='dhcp-snooping'){
      if(frame.title.startsWith('Offer'))frame.transfers=[transfer('rogue','switch','Offer จาก Untrusted → DROP')];
      if(frame.title.startsWith('เรียน Binding'))frame.transfers=[transfer('server','switch','DHCP server message · Trusted')];
      if(frame.title.startsWith('DAI'))frame.transfers=[transfer('client','switch',scenario===2?'ARP claim MAC …09 → DROP':'ARP claim MAC …01 → PASS')];
    }
    if(lesson.id==='wifi-security'){
      if(scenario===2&&(i===0||i===2))frame.transfers=[transfer('client',i===0?'ap1':'ap2','Associated link')];
      if(scenario!==2&&i===0)frame.transfers=[transfer('client','ap1',scenario===0?'SAE authentication':'802.1X / EAP')];
      if(scenario===1&&i===1)frame.transfers=[transfer('ap1','auth','EAP / authentication ตามระบบ')];
    }
    if(lesson.id==='sdn')for(const linkId of frame.edges){const e=links.find(e=>e.id===linkId);frame.transfers.push(transfer(e.from,e.to,scenario===1?'User packet':scenario===2?'Forwarding entry':'Configuration'));}
    if(lesson.id==='hsrp'){frame.nodeUpdates.r1=scenario===1&&i>=1?'192.168.10.2 · Unavailable':'192.168.10.2 · Active';frame.nodeUpdates.r2=scenario===1&&i>=2?'192.168.10.3 · Active':'192.168.10.3 · Standby';}
    if(lesson.id==='wlc'&&scenario===2)frame.nodeUpdates.ap='Monitor · ไม่ให้บริการ Client';
  }
  return { id:lesson.id, title:definition.title, mode:definition.mode, nodes, links, steps, scenario:scenario, parameters:p };
}
