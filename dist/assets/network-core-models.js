// Bounded, deterministic protocol mechanisms. No traffic leaves the browser.
const select=(key,label,value,options)=>({key,label,value,options,type:'select'});
const num=(key,label,value,min,max)=>({key,label,value,min,max,type:'number'});
const spec=(title,controls)=>({mode:'3d',title,controls});
export const coreSpecs={
  dhcp:spec('DORA → Lease clock → ต่ออายุหรือหยุดใช้ IP',[
    select('phase','สิ่งที่จะทดลอง','allocate',[['allocate','ขอ Lease ใหม่'],['lease','Lease ที่ได้มาแล้ว']]),
    num('lease','Lease (วินาที) · T1=1/2, T2=7/8',800,80,7200),
    num('elapsed','เวลาตั้งแต่ได้ Lease (วินาที) · โหมด Lease',400,0,8000),
    select('response','Server ตอบเมื่อร้องขอต่ออายุ','ack',[['ack','ACK · ต่ออายุ'],['silent','ไม่มีคำตอบ'],['nak','NAK ผ่าน Relay · เลือกเวลา T2 ขึ้นไป']]),
  ]),
  'tcp-handshake':spec('Byte stream: Seq / ACK / Buffer / ส่งซ้ำ',[
    select('flow','สิ่งที่จะทดลอง','handshake',[['handshake','จับมือ'],['data','จับมือแล้วส่งข้อมูล'],['close','FIN ปิดทั้งสองทิศทาง']]),
    select('fault','เงื่อนไขจำลอง','none',[['none','ปกติ'],['lost-ack','ACK จับมือยังไม่ถึง'],['refused','ไม่มีบริการรับ Port'],['loss','ข้อมูลช่วงแรกหาย'],['reorder','ข้อมูลช่วงแรกมาช้า'],['reset','RST หลังจับมือ']]),
    num('bytes','ข้อมูลเป้าหมายต่อช่วง (Bytes)',100,1,500),num('rwnd','Receive window (Bytes)',200,0,2000),num('cwnd','Congestion window คงที่ใน Lab (Bytes)',200,1,2000),
  ]),
  dns:spec('ชื่อ → Referral → Authoritative answer → IP',[
    select('mode','เงื่อนไขการค้นชื่อ','cold',[['cold','Cold cache'],['warm','Warm cache'],['nxdomain','ไม่มีชื่อใน Zone'],['servfail','Resolver ทำไม่สำเร็จ'],['timeout','Resolver ไม่ตอบ'],['reverse','ไม่มี PTR']]),
    select('record','ชนิด Forward record','A',[['A','A · IPv4'],['AAAA','AAAA · IPv6'],['CNAME','CNAME → A · alias']]),
  ]),
  'dns-cache':spec('Cache clock → Answer เดิมหรือ Query ใหม่',[
    num('elapsed','เวลาที่ผ่านไป (วินาที)',0,0,600),
  ]),
  'mtu-pmtud':spec('ขนาด Packet เทียบช่อง MTU → ICMP → ส่งใหม่',[
    select('version','IP version','4',[['4','IPv4 · DF=1'],['6','IPv6 · Router ไม่ fragment']]),
    num('mtu','MTU ของ link แคบ (Bytes)',1492,1280,1500),
    num('payload','ข้อมูล TCP ต่อ segment (Bytes)',1460,1,1460),
    select('icmp','ICMP ที่เกี่ยวข้องกลับถึงต้นทาง','yes',[['yes','กลับถึง'],['no','ถูกกรองระหว่างทาง']]),
  ]),
};
export function coreDefaults(id,scenario){
  const presets={dhcp:[{phase:'allocate'},{phase:'allocate'},{phase:'allocate'},{phase:'lease',elapsed:400},{phase:'lease',elapsed:800,response:'silent'},{phase:'lease',elapsed:700,response:'nak'}],
    'tcp-handshake':[{flow:'handshake'},{flow:'handshake',fault:'lost-ack'},{flow:'data'},{flow:'handshake',fault:'refused'},{flow:'data',fault:'loss'},{flow:'data',fault:'reorder'},{flow:'close'}],
    dns:[{mode:'cold'},{mode:'warm'},{mode:'nxdomain'},{mode:'servfail'},{mode:'timeout'},{mode:'reverse'}],
    'dns-cache':[{elapsed:0},{elapsed:120},{elapsed:0},{elapsed:0}],
    'mtu-pmtud':[{},{icmp:'no'},{version:'6'},{payload:100}],
  };
  return presets[id]?.[scenario]||{};
}
const node=(id,name,address,kind='router',position)=>({id,name,address,kind,position});
const edge=(from,to,label='')=>({id:from+'-'+to,from,to,label});
const move=(from,to,message)=>({from,to,message});
export function buildCoreLab(lesson,scenario,p){
  if(!coreSpecs[lesson.id])return null;
  let nodes=[],links=[],steps=[];
  const add=(title,detail,fields=[],active=[],transfers=[],status='ok',updates={})=>{
    const edges=transfers.map(t=>links.find(e=>(e.from===t.from&&e.to===t.to)||(e.to===t.from&&e.from===t.to))?.id).filter(Boolean);
    const frame={title,detail,fields,active,edges,transfers,status,nodeUpdates:updates};steps.push(frame);return frame;
  };
  const finish=(extra={})=>({id:lesson.id,title:coreSpecs[lesson.id].title,mode:'3d',scenario,parameters:p,nodes,links,steps,...extra});
  if(lesson.id==='dhcp'){
    const lease=Number(p.lease),time=Number(p.elapsed),t1=lease/2,t2=lease*7/8,ip='192.168.10.25';
    if(p.phase==='lease'&&p.response==='nak'&&time>=t1&&time<t2)throw Error('ตัวอย่าง NAK ใช้ broadcast REBINDING ผ่าน Relay: เลือกเวลาอย่างน้อย T2 = '+t2+' วินาที (ก่อนหมด lease)');
    nodes=[node('client','Client',p.phase==='lease'?ip+'/24':'0.0.0.0','client'),node('relay','Gateway / Relay','192.168.10.1'),node('server','DHCP Server','192.168.99.10','server')];links=[edge('client','relay','LAN'),edge('relay','server','Routed network')];
    if(p.phase==='allocate'){
      add('DISCOVER ใน LAN','Client ยังไม่มี IP จึง broadcast ใน link; สมมติ client broadcast replies ในการขอครั้งแรก',[['Source','0.0.0.0:68'],['Destination','255.255.255.255:67'],['Client state','SELECTING']],['client','relay'],[move('client','relay','DISCOVER · UDP 68 → 67 · Broadcast')]);
      if(scenario===1){add('ไม่มี Relay → Server ไม่เห็น DISCOVER','Router ไม่ส่ง broadcast ข้าม subnet แบบปกติ ต้องมี DHCP Relay ที่ถูกกำหนด',[['OFFER','ยังไม่มี'],['Client IP','0.0.0.0']],['relay'],[],'blocked');return finish();}
      add('Relay ส่งต่อ DISCOVER','Relay เพิ่ม giaddr ให้ Server เลือก pool ของ LAN; ทิศทาง Relay→Server ใช้ UDP 67→67',[['giaddr','192.168.10.1'],['UDP','67 → 67']],['relay','server'],[move('relay','server','Relayed DISCOVER · giaddr 192.168.10.1')]);
      if(scenario===2){add('Pool ไม่มี Address ว่าง','ไม่มี OFFER ในกรณีจำลองนี้; ไม่ใช่ Server ส่ง ACK ให้ใช้ address ใดก็ได้',[['Client IP','0.0.0.0'],['Next test','ตรวจ Pool / lease allocation']],['server'],[],'blocked');return finish();}
      add('OFFER: ข้อเสนอ ไม่ใช่สิทธิ์ใช้แล้ว','Server เสนอ configuration ผ่าน Relay กลับ Client',[['Offered IP',ip],['Lease',lease+' s'],['Client state','SELECTING']],['server','relay','client'],[move('server','relay','OFFER · UDP 67 → 67'),move('relay','client','OFFER · UDP 67 → 68')]);
      add('REQUEST: เลือกข้อเสนอ','Client broadcast REQUEST ที่มี requested IP และ server identifier ผ่าน Relay',[['Requested IP',ip],['Server identifier','192.168.99.10'],['Client state','REQUESTING']],['client','relay','server'],[move('client','relay','REQUEST · UDP 68 → 67'),move('relay','server','Relayed REQUEST · UDP 67 → 67')]);
      add('DHCP ACK: ยืนยัน Lease','สมมติ address conflict check ผ่าน จึงนำ configuration มาใช้และเริ่ม timers',[['Client state','BOUND'],['IP',ip+'/24'],['Gateway / DNS','192.168.10.1 / 192.168.10.53'],['T1 / T2 / Expiry',`${t1} / ${t2} / ${lease} s`]],['server','relay','client'],[move('server','relay','ACK · UDP 67 → 67'),move('relay','client','ACK · UDP 67 → 68')],'ok',{client:ip+'/24 · BOUND'});
      return finish();
    }
    add('Lease ตั้งต้นพร้อมใช้งาน','นับจาก ACK เดิม เวลาที่เลือกเป็น snapshot; ยังไม่สมมติว่าต่ออายุสำเร็จในอดีต',[['T1',t1+' s'],['T2',t2+' s'],['Expiry',lease+' s'],['Elapsed',time+' s']],['client'],[],'ok',{client:ip+'/24 · BOUND'});
    if(time<t1){add('ยังไม่ถึง T1','ใน Lab ยังไม่เริ่มร้องขอต่ออายุ IP จาก lease นี้ยังใช้ได้',[['State','BOUND'],['Remaining',(lease-time)+' s']],['client'],[],'ok',{client:ip+'/24 · BOUND'});return finish();}
    add('T1: RENEWING','ส่ง REQUEST unicast ไป Server เดิม; ciaddr เป็น IP ที่ใช้อยู่ ไม่ใช่ DISCOVER ใหม่',[['State','RENEWING'],['ciaddr',ip],['UDP','68 → 67']],['client','relay','server'],[move('client','relay','REQUEST unicast → Server เดิม'),move('relay','server','Route unicast · UDP 68 → 67')],'ok',{client:ip+'/24 · RENEWING'});
    if(time>=t2){
      add('T2: REBINDING','สมมติไม่มี ACK ระหว่าง T1→T2 จึง broadcast ขอ Server ที่รับผิดชอบ โดยไม่ระบุ server identifier',[['State','REBINDING'],['ciaddr',ip],['Remaining',Math.max(0,lease-time)+' s']],['client','relay','server'],[move('client','relay','REQUEST broadcast · UDP 68 → 67'),move('relay','server','Relayed REQUEST · UDP 67 → 67')],'ok',{client:ip+'/24 · REBINDING'});
    }
    if(time>=lease){add('Lease หมด: หยุดใช้ IP แล้วกลับ INIT','ไม่มี ACK ก่อน expiry; response ที่ตั้งไม่ได้ช่วยต่ออายุ lease ที่สิ้นสุดแล้ว เริ่ม DORA ใหม่',[['State','INIT'],['Usable leased IP','ไม่มี'],['Next action','DISCOVER ใหม่']],['client'],[],'blocked',{client:'0.0.0.0 · Lease expired'});return finish();}
    if(p.response==='silent'){add('ยังไม่ได้คำตอบ','ยังใช้ lease ที่ไม่หมดได้ แต่ต้อง retry ตาม protocol; Lab ย่อ retry timer',[['State',time>=t2?'REBINDING':'RENEWING'],['Remaining',(lease-time)+' s'],['ACK','ไม่พบ']],['client'],[],'blocked');}
    else if(p.response==='nak'){add('DHCP NAK: หยุดใช้ IP','Server ปฏิเสธ configuration ที่ร้องขอ Client กลับ INIT ไม่ใช้ IP เก่าต่อ',[['State','INIT'],['Usable leased IP','ไม่มี']],['server','client'],[move('server','relay','DHCP NAK'),move('relay','client','NAK → เริ่มขอใหม่')],'blocked',{client:'0.0.0.0 · NAK received'});}
    else add('ACK ต่ออายุที่เวลาที่เลือก','Lease ใหม่เริ่มนับจาก ACK นี้ ไม่ใช่บวกเวลาต่อท้าย expiry เดิม',[['State','BOUND'],['New T1 / T2 / Expiry',`${time+t1} / ${time+t2} / ${time+lease} s`],['Remaining',lease+' s']],['server','client'],[move('server','relay','DHCP ACK'),move('relay','client','ACK → reset lease clock')],'ok',{client:ip+'/24 · BOUND (renewed)'});
    return finish();
  }
  if(lesson.id==='tcp-handshake'){
    if(['loss','reorder'].includes(p.fault)&&p.flow!=='data')throw Error('ข้อมูลหาย/มาช้าทดลองในโหมด จับมือแล้วส่งข้อมูล: เลือกโหมดนี้ก่อน');
    nodes=[node('client','Client','192.168.10.25:51514','client'),node('server','Server','203.0.113.80:443','server')];links=[edge('client','server','TCP endpoints · intermediate hops omitted')];
    const states=(c,s)=>({client:'192.168.10.25:51514 · '+c,server:'203.0.113.80:443 · '+s});
    add('SYN: seq 100','SYN ใช้ sequence space 1 จึงคาดข้อมูล Client เริ่ม 101',[['Client','SYN-SENT'],['seq',100]],['client'],[move('client','server','SYN · seq 100')],'ok',states('SYN-SENT','LISTEN'));
    if(p.fault==='refused'){add('RST: ไม่มีบริการรับ Port ในตัวอย่าง','ได้รับคำปฏิเสธ ต่างจาก timeout; ระบบจริง RST อาจมาจาก middlebox ต้องตรวจ capture',[['Result','Connection refused']],['server'],[move('server','client','RST / ACK · ack 101')],'blocked',states('CLOSED','CLOSED'));return finish();}
    add('SYN-ACK: seq 500 / ack 101','Server SYN ใช้ sequence space 1 เช่นกัน ACK คือ byte ถัดไปที่คาด',[['Server','SYN-RECEIVED'],['seq',500],['ack',101]],['server'],[move('server','client','SYN-ACK · seq 500 / ack 101')],'ok',states('SYN-SENT','SYN-RECEIVED'));
    if(p.fault==='lost-ack'){add('ACK Client ยังไม่ถึง Server','ย่อ timer/retry Server ยัง SYN-RECEIVED Client ส่ง ACK แล้วแต่ packet ถูกทิ้งระหว่างทาง',[['Server','SYN-RECEIVED'],['ACK expected',501]],['client'],[move('client','server','ACK · lost before Server')],'blocked',states('ESTABLISHED','SYN-RECEIVED'));return finish();}
    add('ACK: connection พร้อม','TCP พร้อม ไม่ได้หมายความว่า TLS/application ผ่านแล้ว',[['seq',101],['ack',501],['TCP','ESTABLISHED']],['client','server'],[move('client','server','ACK · seq 101 / ack 501')],'ok',states('ESTABLISHED','ESTABLISHED'));
    if(p.fault==='reset'){add('RST หลังจับมือ','ยกเลิก connection ไม่ใช่ FIN ปิดอย่างเป็นลำดับ',[['TCP','CLOSED']],['server'],[move('server','client','RST · abort connection')],'blocked',states('CLOSED','CLOSED'));return finish();}
    if(p.flow==='close'){
      add('Client FIN: ปิดขาส่งของ Client','ไม่มีข้อมูลหลังจับมือใน flow นี้ FIN ใช้ sequence space 1',[['seq',101],['Client','FIN-WAIT-1']],['client'],[move('client','server','FIN · seq 101')],'ok',states('FIN-WAIT-1','ESTABLISHED'));
      add('Server ACK แต่ยังส่งข้อมูลได้','ACK ของ FIN Client ไม่ได้ปิดขาส่งของ Server ทันที',[['ack',102],['Server','CLOSE-WAIT']],['server'],[move('server','client','ACK · ack 102')],'ok',states('FIN-WAIT-2','CLOSE-WAIT'));
      add('Server FIN','เมื่อ application Server ปิดขาส่ง Server จึงส่ง FIN',[['seq',501],['Server','LAST-ACK']],['server'],[move('server','client','FIN · seq 501')],'ok',states('FIN-WAIT-2','LAST-ACK'));
      add('Client ACK → TIME-WAIT','Server รับ ACK แล้ว CLOSED ส่วนผู้ปิดก่อนรอ TIME-WAIT ตาม protocol ไม่ใช่ connection ส่งข้อมูลต่อ',[['ack',502],['Client','TIME-WAIT'],['Server','CLOSED']],['client','server'],[move('client','server','ACK · ack 502')],'ok',states('TIME-WAIT','CLOSED'));return finish();
    }
    if(p.flow==='handshake')return finish();
    const limit=Math.min(Number(p.rwnd),Number(p.cwnd)),n=Math.min(Number(p.bytes),limit),next=101+n,end=101+2*n;
    add('เลือกข้อมูลที่ส่งได้','Windows คงที่ใน Lab เป็น bytes ไม่จำลอง congestion-control; สองช่วงส่งต่อกันตาม ACK',[['Receive window',p.rwnd+' B'],['Congestion window',p.cwnd+' B'],['Outstanding limit',limit+' B'],['Actual bytes per chunk',n]],['client']);
    if(!limit){add('Receive window = 0','ยังส่ง data ปกติไม่ได้; zero-window probes เป็นอีกกลไกที่ Lab นี้ไม่จำลอง',[['Delivered bytes',0],['Next test','ตรวจ receiver buffer/window']],['client'],[],'blocked');return finish();}
    const send=(seq,bytes,title='ส่งข้อมูล')=>add(title,'ช่วงข้อมูลนับเป็น byte; header ไม่อยู่ในจำนวนข้อมูล TCP นี้',[['seq',seq],['Bytes',bytes],['Byte range',`${seq}–${seq+bytes-1}`]],['client'],[move('client','server',`DATA · seq ${seq} / ${bytes} B`)]);
    const ack=(value,buffered,delivered)=>add('Receiver ACK / Buffer','ACK ไม่ข้ามช่องว่าง; Delivered ใน Lab คือ byte stream พร้อมให้ application อ่าน ไม่ใช่การยืนยันว่า application อ่านแล้ว',[['ACK',value],['Buffered out-of-order',buffered+' B'],['Delivered bytes',delivered]],['server'],[move('server','client','ACK · next byte '+value)],'ok',{server:`203.0.113.80:443 · ACK ${value}`});
    if(['loss','reorder'].includes(p.fault)){
      send(101,n,p.fault==='loss'?'ช่วงแรกถูกทิ้งระหว่างทาง':'ช่วงแรกมาช้าระหว่างทาง');steps.at(-1).status='blocked';steps.at(-1).transfers[0].message+=' · '+(p.fault==='loss'?'DROP':'DELAY');
      if(limit<2*n){add('Window ยังไม่พอส่งช่วงหลังโดยไม่มี ACK','ช่วงแรกยังไม่ถูก ACK จึง outstanding n bytes; ไม่แต่งว่าช่วงหลังถูกส่งทั้งที่เกิน window',[['Outstanding',n+' B'],['Limit',limit+' B']],['client']);}
      if(limit>=2*n){send(next,n,'ช่วงหลังถึงก่อน');ack(101,n,0);}
      if(p.fault==='loss')add('RTO: ส่งช่วงแรกซ้ำ','เหตุการณ์ timer สมมติ ไม่มีค่าเวลาหรือ fast retransmit ที่แต่งจาก ACK เพียงหนึ่งครั้ง',[['Retransmit seq',101],['Bytes',n]],['client'],[move('client','server',`RETRANSMIT · seq 101 / ${n} B`)]);
      else send(101,n,'ช่วงแรกมาถึงในภายหลัง');
      ack(limit>=2*n?end:next,0,limit>=2*n?2*n:n);
      if(limit<2*n){send(next,n,'หลังได้ ACK จึงส่งช่วงถัดไป');ack(end,0,2*n);}
    }else{send(101,n);ack(next,0,n);send(next,n);ack(end,0,2*n);}
    return finish();
  }
  if(lesson.id==='dns'){
    nodes=[node('client','Client','ops.example.org','client',[-6,1]),node('resolver','Recursive Resolver','192.0.2.53', 'server',[-3,-1]),node('root','Root (จำลอง)','referral: .org','server',[0,-3]),node('tld','TLD .org (จำลอง)','referral: example.org','server',[3,-3]),node('auth','Authoritative (จำลอง)','zone: example.org','server',[6,1])];
    links=[edge('client','resolver'),edge('resolver','root'),edge('resolver','tld'),edge('resolver','auth')];
    const q=p.mode==='reverse'?'80.113.0.203.in-addr.arpa':p.mode==='nxdomain'?'missing.example.org':p.record==='CNAME'?'portal.example.org':'ops.example.org',ip=p.record==='AAAA'?'2001:db8::80':'203.0.113.80';
    nodes[0].address=q;
    add('Client ถาม Resolver','ภาพ hierarchy เป็นข้อมูลสมมติ ไม่ใช่ server จริงของ example.org Query อาจใช้ UDP/53; DNS รองรับ TCP ด้วย',[['Name',q],['Type',p.mode==='reverse'?'PTR':p.record==='CNAME'?'A (ตาม alias)':p.record],['Recursion desired','RD=1']],['client','resolver'],[move('client','resolver',q+' ?')]);
    if(p.mode==='timeout'){add('ไม่มี DNS Response','ย่อการรอ/retry ไม่มี response จึงไม่มี RCODE ให้อ่าน ยังสรุปว่าชื่อไม่มีไม่ได้',[['Result','Timeout'],['Next test','reachability / resolver availability']],['resolver'],[],'blocked');return finish();}
    if(p.mode==='servfail'){add('Resolver ตอบ SERVFAIL','กำหนดให้ resolver ทำการค้นไม่สำเร็จ ไม่ใช่หลักฐานว่า domain ไม่มี',[['RCODE','SERVFAIL (2)']],['resolver'],[move('resolver','client','SERVFAIL')],'blocked');return finish();}
    if(p.mode==='reverse'){
      nodes[0].address='203.0.113.80 → PTR?';add('Reverse PTR Query','ชื่อ query ของ IPv4 reverse เรียง octet ย้อนใน in-addr.arpa; Lab ย่อ reverse hierarchy',[['Name','80.113.0.203.in-addr.arpa'],['Type','PTR']],['resolver','auth'],[move('resolver','auth','PTR? (reverse authority ย่อ)')]);add('ไม่มี PTR ในตัวอย่าง','สมมติ reverse owner มีอยู่แต่ไม่มี PTR: NOERROR / empty answer ไม่ทำให้ A เดิมหาย',[['RCODE','NOERROR (0)'],['PTR answers',0],['Forward A','ยังมี ops.example.org → 203.0.113.80']],['client'],[move('resolver','client','No PTR answer')],'blocked');return finish();
    }
    if(p.mode!=='warm'){
      add('Cache miss → ถาม Root','Resolver ตาม referral เอง Client ไม่ต้องเปลี่ยนไปถามทุก Server',[['Cache','MISS']],['resolver','root'],[move('resolver','root',q+' ?')]);
      add('Root ให้ Referral ไป .org','คำตอบนี้บอก nameserver ของ TLD ไม่ใช่ IP เว็บ',[['Referral','NS for .org']],['root','resolver'],[move('root','resolver','.org nameservers')]);
      add('Resolver ถาม TLD .org','TLD ชี้ไป nameserver ที่ดูแล example.org',[['Referral','NS for example.org']],['resolver','tld'],[move('resolver','tld',q+' ?'),move('tld','resolver','example.org nameservers')]);
      add('ถาม Authoritative ของ Zone','สมมติ address ของ NS และ delegation พร้อมแล้ว ไม่จำลอง glue/DNSSEC ทุกขั้น',[['Zone','example.org']],['resolver','auth'],[move('resolver','auth',q+' ?')]);
    }
    if(p.mode==='nxdomain'){add('Authoritative: NXDOMAIN','ชื่อ missing.example.org ไม่มีใน zone จำลอง Resolver คืนคำตอบเชิงลบให้ Client',[['Name','missing.example.org'],['RCODE','NXDOMAIN (3)'],['Negative TTL (สมมติ)',60]],['auth','resolver','client'],[move('auth','resolver','NXDOMAIN + SOA'),move('resolver','client','NXDOMAIN')],'blocked');return finish();}
    if(p.record==='CNAME')add('CNAME: ตาม alias ต่อ','portal.example.org เป็น alias ของ ops.example.org แล้วตามหา A ใน zone เดียวกัน',[['CNAME','portal.example.org → ops.example.org']],['resolver','auth'],p.mode==='warm'?[]:[move('auth','resolver','CNAME ops.example.org'),move('resolver','auth','A ops.example.org ?')]);
    add(p.mode==='warm'?'Cache hit: ไม่ถาม Root/TLD':'Authoritative ให้ Answer','คำตอบของ record ไม่ใช่ packet เว็บ; cache hit สมมติ record/alias ทั้งชุดยังใช้ได้',[['Name',q],['Answer',ip],['TTL',p.mode==='warm'?'120 s remaining':'300 s']],p.mode==='warm'?['resolver']:['auth','resolver'],p.mode==='warm'?[]:[move('auth','resolver',p.record==='AAAA'?'AAAA = '+ip:'A = '+ip)]);
    add('Resolver คืนชื่อ → IP ให้ Client','Client จึงเริ่มการติดต่อบริการเป็นขั้นแยก ไม่ส่งข้อมูลเว็บผ่าน DNS',[['Name',q],['IP',ip],['Web request','ยังไม่ส่งใน DNS Lab']],['resolver','client'],[move('resolver','client',q+' → '+ip)],'ok',{client:q+' → '+ip,resolver:'Answer '+ip});return finish();
  }
  if(lesson.id==='dns-cache'){
    const elapsed=Number(p.elapsed),negative=scenario===3,ttl=negative?60:120,expired=elapsed>=ttl;
    nodes=[node('client','Client','ops.example.org','client'),node('cache','Resolver cache','TTL'),node('auth','Authoritative','A / PTR (จำลอง)','server')];links=[edge('client','cache'),edge('cache','auth')];
    if(scenario===2){add('Forward A','A และ PTR เป็น record แยก ไม่สร้าง reverse ให้อัตโนมัติ',[['A','ops.example.org → 203.0.113.80']],['cache','client'],[move('cache','client','A = 203.0.113.80')]);add('Reverse: ไม่มี PTR','สมมติ reverse owner มีอยู่แต่ไม่มี PTR; ไม่ใช่ A หาย',[['PTR answers',0],['RCODE','NOERROR / empty answer']],['cache','client'],[move('cache','client','No PTR answer')],'blocked');return finish();}
    add('ตรวจอายุ Cache','ค่าที่เลือกเป็น elapsed หลังเริ่ม snapshot; ยังไม่ refresh ซ้ำในอดีต',[['Entry',negative?'NXDOMAIN เดิม (ตอนนี้เพิ่มชื่อแล้ว)':'A เดิม .80 (authoritative เปลี่ยนเป็น .81)'],['Initial remaining TTL',ttl+' s'],['Elapsed',elapsed+' s'],['Remaining',Math.max(0,ttl-elapsed)+' s']],['cache']);
    if(!expired){add(negative?'Negative cache hit':'A cache hit',negative?'ยังคืน NXDOMAIN แม้ authoritative เพิ่มชื่อแล้ว; มี response ต่างจาก timeout':'ยังคืน IP เดิมจน cache หมดอายุในโมเดลนี้',[['Answer',negative?'NXDOMAIN':'203.0.113.80'],['Query authoritative','ไม่มี']],['cache','client'],[move('cache','client',negative?'NXDOMAIN (cached)':'A = 203.0.113.80')],negative?'blocked':'ok',{cache:negative?'NXDOMAIN · '+(ttl-elapsed)+' s':'203.0.113.80 · '+(ttl-elapsed)+' s'});}
    else{add('Cache expired → Query ใหม่','ถาม authoritative ที่จำลองให้มีค่าปัจจุบันแล้ว',[['Old entry usable','No']],['cache','auth'],[move('cache','auth','A ops.example.org ?')]);add('เก็บ Answer ใหม่','TTL ของคำตอบใหม่เริ่มนับที่เวลาค้นใหม่ ไม่ได้ใช้ remaining ของ entry เก่า',[['Answer','203.0.113.81'],['New TTL',300+' s']],['auth','cache'],[move('auth','cache','A = 203.0.113.81 · TTL 300')],'ok',{cache:'203.0.113.81 · TTL 300 s'});add('คืนคำตอบใหม่ให้ Client','ชื่อเดิม แต่ข้อมูลเปลี่ยนเพราะ cache ถูก refresh',[['Answer','203.0.113.81'],['RCODE','NOERROR']],['cache','client'],[move('cache','client','ops.example.org → 203.0.113.81')]);}
    return finish();
  }
  if(lesson.id==='mtu-pmtud'){
    const v6=p.version==='6',mtu=Number(p.mtu),payload=Number(p.payload),header=v6?60:40,total=header+payload,limit=mtu-header;
    nodes=[node('client','Sender',v6?'2001:db8:1::10':'192.0.2.10','client'),node('router','Router · link แคบ','MTU '+mtu+' B'),node('server','Receiver',v6?'2001:db8:2::20':'203.0.113.20','server')];links=[edge('client','router','MTU 1600 B · jumbo LAN สมมติ'),edge('router','server','MTU '+mtu+' B')];
    const sizes=bytes=>[['IP packet',bytes+' B'],['Path MTU',mtu+' B'],['TCP header / IP header',v6?'20 / 40 B':'20 / 20 B']];
    add('ประกอบ IP packet','TCP ไม่มี options/TLS overhead; สมมติ first-hop jumbo LAN MTU 1600 จึงส่ง packet ตั้งต้นได้ทั้งสอง version Path MTU ต่ำสุดคือ link Router→Receiver',[...sizes(total),['TCP payload',payload+' B']],['client'],[], 'ok',{client:total+' B · payload '+payload+' B'}).datagramBytes=total;
    add('ถึง Router → เทียบขนาด','IPv4 ตั้ง DF=1; IPv6 Router ไม่ fragment ข้อมูลที่เกิน MTU',[...sizes(total),['Fits',total<=mtu?'Yes':'No']],['router'],[move('client','router',`IP packet ${total} B`)],total>mtu?'blocked':'ok').datagramBytes=total;
    if(total<=mtu){add('ผ่าน Link และถึง Receiver','ข้อมูลเล็กผ่านไม่ได้พิสูจน์ว่าข้อมูลขนาดใหญ่จะผ่านด้วย',[['Delivered payload',payload+' B'],['PMTUD resize','ไม่ต้องในกรณีนี้']],['server'],[move('router','server','Fits MTU · '+total+' B')]).datagramBytes=total;return finish({pathMTU:mtu});}
    add('Router ทิ้ง Packet ที่ใหญ่เกิน','ไม่ส่ง packet ต้นฉบับไป Receiver; ไม่ทำ fragmentation ใน Lab นี้',[['Oversize',total-mtu+' B'],['Delivered payload','0 B']],['router'],[],'blocked').datagramBytes=total;
    if(p.icmp==='no'){add('ICMP ถูกกรองระหว่างทาง','Router สร้าง error แต่ Sender ไม่ได้รับ; classic PMTUD ยังไม่รู้ MTU ใหม่ แบบจำลองไม่ทำ PLPMTUD fallback',[['ICMP generated',v6?'Packet Too Big':'fragmentation needed / DF set'],['Sender learns MTU','No'],['Result','PMTUD black hole สำหรับ packet นี้']],['router'],[move('router','client','ICMP error · DROP before sender')],'blocked').datagramBytes=total;return finish({pathMTU:mtu});}
    add(v6?'ICMPv6 Packet Too Big':'ICMP fragmentation needed','error ที่เกี่ยวข้องบอก MTU ให้ต้นทาง ไม่ใช่ ICMP Echo Reply',[['Reported MTU',mtu+' B'],['IP/TCP headers',header+' B'],['New payload limit',limit+' B']],['router','client'],[move('router','client','ICMP · MTU '+mtu)]).datagramBytes=total;
    add('Sender ลดขนาดแล้วส่งใหม่','Lab แสดง segment แรกที่ลดแล้ว ข้อมูลส่วนที่เหลือต้องส่ง segment ถัดไป ไม่ได้ลบข้อมูล application ทิ้ง',[['New payload',limit+' B'],['Remaining data',payload-limit+' B'],['Advertised MSS','ไม่ได้ renegotiate ใหม่จาก ICMP; ปรับ effective send size']],['client','router','server'],[move('client','router','Resend IP '+mtu+' B'),move('router','server','Fits MTU '+mtu+' B')],'ok',{client:mtu+' B · payload '+limit+' B'}).datagramBytes=mtu;
    const remaining=payload-limit;
    add('ส่งข้อมูลที่เหลือใน segment ถัดไป','รวม byte stream ได้ payload เดิม ไม่สูญข้อมูลจากการแบ่ง segment',[['Final packet',remaining+header+' B'],['Total delivered payload',payload+' B']],['server'],[move('client','router','Remaining '+remaining+' B payload'),move('router','server','Remaining data')]).datagramBytes=remaining+header;
    return finish({pathMTU:mtu});
  }
}
