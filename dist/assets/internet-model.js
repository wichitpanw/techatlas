// Illustrative networks and documentation addresses, never a map of any real service provider.
export function buildInternet({service='social',route='peering',fault='none'}={}) {
  if(!['social','cdn','game'].includes(service)||!['peering','transit'].includes(route)||!['none','dns','gateway','uplink'].includes(fault))throw Error('ตัวเลือก Internet ไม่ถูกต้อง');
  const node=(id,name,address,kind,x,z)=>({id,name,address,kind,position:[x,z]});
  const nodes=[
    node('client','Computer','192.168.10.25/24','client',-8,3),node('home','Wi-Fi / Home router','192.168.10.1 · WAN 198.51.100.25','router',-5,3),
    node('ont','ONT · Fiber access','L2 bridge · ไม่มี IP สำหรับส่ง Packet','switch',-2,3),node('access','ISP Access / BNG','198.51.100.1','router',1,3),
    node('core','ISP Core','192.0.2.1','router',4,3),node('ix','Peering router · IXP','192.0.2.2','router',7,0),
    node('transit','Transit provider','192.0.2.3','router',4,-3),node('edge','Service network edge','203.0.113.1','router',1,-3),
    node('lb','Reverse proxy / LB','203.0.113.80:443','server',-2,-3),node('social','Social application','10.20.0.10 · private backend','server',-5,-3),
    node('cdn','CDN edge cache','203.0.113.90:443','server',-8,-3),node('game','Game session server','203.0.113.100:3074 / UDP','server',-5,0),
    node('dns','ISP DNS resolver','192.0.2.53','server',1,0),
  ];
  const pairs=[['client','home'],['home','ont'],['ont','access'],['access','core'],['access','dns'],['core','ix'],['ix','edge'],['core','transit'],['transit','edge'],['edge','lb'],['lb','social'],['edge','cdn'],['edge','game']];
  const links=pairs.map(([from,to])=>({id:`${from}-${to}`,from,to}));const steps=[];
  const zones=[{name:'บ้าน / LAN',x:-5,z:3,width:9,depth:3,color:0x286b66},{name:'ISP / Interconnection',x:4,z:1,width:9,depth:7,color:0x334d79},{name:'เครือข่ายบริการ',x:-4,z:-3,width:12,depth:3,color:0x684c78}];
  const finish=()=>({title:'Internet journey',nodes,links,steps,zones});
  const dest=service==='social'?'203.0.113.80':service==='cdn'?'203.0.113.90':'203.0.113.100';
  const host=service==='social'?'social.example.test':service==='cdn'?'media.example.test':'game.example.test';
  const port=service==='game'?'UDP/3074':'TCP/443';
  const add=(title,detail,fields,active=[],transfers=[],status='ok')=>steps.push({title,detail,fields,active,transfers,status,nodeUpdates:{},edges:transfers.map(t=>links.find(l=>(l.from===t.from&&l.to===t.to)||(l.from===t.to&&l.to===t.from))?.id).filter(Boolean)});
  const hop=(from,to,message,fields=[])=>add(`${nodes.find(n=>n.id===from).name} → ${nodes.find(n=>n.id===to).name}`,'ข้อความถูกส่งต่อบนช่วงนี้ อ่านค่าด้านล่างว่าเป็น DNS, IP forwarding หรือข้อมูล Application',fields,[from,to],[{from,to,message}]);
  add('เลือกบริการ ไม่ใช่ Internet server กลาง','Internet เป็นเครือข่ายหลายผู้ดูแล ภาพนี้ย่อจำนวนอุปกรณ์และเมือง; Social เป็นบริการสมมติ ไม่ใช่แผนผังของผู้ให้บริการจริง',[['Service',host],['Destination',dest],['Transport',port]],['client']);
  add('เครื่องมี IP และ next hop','สมมติ DHCP lease และ ARP พร้อม; ไปต่าง subnet ส่ง Frame ให้ Home gateway ไม่หา MAC ของ Server ไกล',[['Source','192.168.10.25'],['Gateway','192.168.10.1'],['DNS','192.0.2.53']],['client','home']);
  if(fault==='gateway'){add('หยุดใน LAN: ไม่มี Default gateway','ไม่มี route อื่นไป Resolver/บริการใน Lab นี้ จึงยังไม่ส่งข้อมูลออกนอก LAN',[['Result','No route']],['client'],[],'blocked');return finish();}
  const dnsPath=['client','home','ont','access','dns'];
  for(let i=0;i<dnsPath.length-1;i++)hop(dnsPath[i],dnsPath[i+1],`DNS query · ${host}`,[['Question',`${host} → A record?`],['Destination DNS','192.0.2.53'],['Source',i<1?'192.168.10.25':'198.51.100.25 (NAT)']]);
  if(fault==='dns'){add('DNS ไม่มีคำตอบของชื่อนี้','ตัวอย่าง NXDOMAIN ไม่ใช่ข้อสรุปว่า Internet ทั้งหมดเสีย; ยังไม่เริ่มเชื่อมบริการด้วยชื่อ',[['DNS','NXDOMAIN']],['dns'],[],'blocked');return finish();}
  add('DNS ตอบชื่อ → IP','Resolver มีคำตอบใน cache ที่ยังไม่หมด TTL; ไม่แสดง recursive lookup ทั้งชุด DNS ไม่ได้เป็นทางผ่านของข้อมูลเว็บ',[['Name',host],['A record',dest],['TTL','300 s (สมมติ)']],['dns']);
  for(let i=dnsPath.length-1;i>0;i--)hop(dnsPath[i],dnsPath[i-1],`DNS answer · ${dest}`,[['Answer',`${host} → ${dest}`]]);
  add('เลือกเส้นทางระหว่างเครือข่าย','BGP แลก reachability/policy ก่อน forwarding; Router ใช้ตารางที่มีแล้ว ไม่สอบถาม BGP ทุก Packet IXP เป็นจุดเชื่อมต่อ ไม่ใช่บังคับต้องผ่านทุกบริการ',[['Path',route==='peering'?'ISP → Peering → Service network':'ISP → Transit → Service network'],['Routing','ตารางพร้อมตามสถานการณ์']],['core',route==='peering'?'ix':'transit','edge']);
  const path=['client','home','ont','access','core',route==='peering'?'ix':'transit','edge',...(service==='social'?['lb']:[]),service];
  if(service!=='game')add(fault==='uplink'?'เริ่ม TCP แต่เส้นทางยังไม่พร้อม':'เตรียม TCP และ TLS ก่อน HTTP',fault==='uplink'?'SYN ต้องผ่าน Access → Core ที่เสียเช่นกัน ขั้นถัดไปแสดงจุดหยุดของการพยายามเชื่อมต่อ ยังไม่มี TLS หรือ HTTP request':'ย่อ handshake; SYN/SYN-ACK/ACK และ TLS ต้องเดินข้ามเส้นทางเช่นเดียวกัน เลือกบท TCP/TLS เพื่อดูแยกขั้น รายงานนี้ไม่อ้างว่าแสดง handshake ทุก Packet',[['TCP',fault==='uplink'?'SYN-SENT · ยังไม่ Established':'จำลองการเชื่อมต่อพร้อม'],['TLS',fault==='uplink'?'ยังไม่เริ่ม':'สมมติตรวจ certificate ผ่าน'],['HTTP','request ยังไม่ถูกส่ง']],['client',...(fault==='uplink'?[]:[service==='social'?'lb':service])]);
  else add('เกมส่งข้อมูล Session','เกมสมมตินี้ใช้ UDP/3074 สำหรับข้อมูลตำแหน่ง ไม่อ้างว่าทุกเกมใช้ UDP/พอร์ตนี้; login/download อาจใช้ HTTPS คนละ connection',[['Payload','move x=12 y=8'],['Transport','UDP ไม่มี TCP handshake'],['Application','ไม่จำลอง reliability/encryption ของเกม']],['client','game']);
  for(let i=0;i<path.length-1;i++){
    if(fault==='uplink'&&path[i]==='access'){add('ISP uplink ใช้งานไม่ได้','หยุดที่ Access ตาม fault ที่ตั้งไว้ ไม่ใช่ความสามารถระบุตำแหน่งเสียจาก ping timeout จริง',[['Link','Access → Core down']],['access'],[],'blocked');break;}
    const backend=path[i]==='lb';
    hop(path[i],path[i+1],service==='game'?'UDP · move x=12 y=8':fault==='uplink'?'TCP SYN · ยังไม่ผ่าน handshake':backend?'Backend request · connection ใหม่':'HTTPS · encrypted request',[['Source IP',backend?'10.20.0.1 (Proxy)':i===0?'192.168.10.25':'198.51.100.25 (PAT)'],['Destination IP',backend?'10.20.0.10':dest],['Link role',path[i]==='ont'?'ONT bridge ไม่ลด TTL':backend?'Proxy จบ connection ฝั่ง Client':'L2 header เปลี่ยนตาม link; Router ลด TTL']]);
  }
  if(fault!=='uplink'){
    add(service==='cdn'?'CDN cache hit':service==='game'?'Game server ประมวลผล':'Social backend ประมวลผล',service==='cdn'?'รูป/วิดีโอที่มีใน Edge cache ไม่ต้องไป Origin ทุกครั้ง':service==='game'?'Server ตอบสถานะโลกเกม ไม่ใช่แค่ packet ส่งถึงแล้วถือว่าเล่นสำเร็จ':'โหลดข้อมูล feed; Reverse proxy ส่งต่อจาก backend กลับ connection ของผู้ใช้',[['Result',service==='cdn'?'Media bytes':service==='game'?'world tick=42':'HTTP 200 · feed data']], [service]);
    for(let i=path.length-1;i>0;i--)hop(path[i],path[i-1],service==='game'?'UDP · world tick=42':'Response bytes',[['Direction','กลับสู่ Client'],['NAT',path[i-1]==='home'?'198.51.100.25 → 192.168.10.25 ตาม state':'ขากลับสมมติใช้ route เดิม; ของจริงอาจต่าง']]);
    add('ภาพบนจอเกิดจากคำตอบกลับ','DNS ช่วยค้นชื่อ → routing นำส่ง → Server ประมวลผล → Client ใช้คำตอบ ไม่มี Server กลางที่เป็น Internet ทั้งหมด',[['Computer',service==='social'?'แสดง Feed':service==='cdn'?'แสดงรูป/วิดีโอ':'อัปเดตโลกเกม'],['Simulation','ไม่ติดต่อบริการจริง']],['client']);
  }
  return finish();
}
