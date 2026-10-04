// Version date describes this content edition, not a generated page-view date.
export const updates=[
  {date:'2026-10-04',version:'2026.10.04.4',title:'Python ต่อจากพื้นฐาน และปรับตัวนับเข้าชม',items:[
    {lesson:'comprehension',name:'Python ต่อยอด 13 บท',detail:'เพิ่ม Bitwise, Comprehension, zip/Search, Arguments/Scope, Iterator/Generator, OOP, Files, CSV/JSON และ Sorting พร้อมภารกิจและภาพจากการรันจริง'},
    {lesson:'class-object',name:'OOP และข้อมูลของ Object',detail:'ทดลอง self/__init__, ข้อมูลแยกแต่ละ instance, classmethod และ inheritance ดูค่าที่อ่านจริงและ call stack'},
    {lesson:'files-context',name:'ไฟล์ในห้องทดลอง',detail:'ใช้โฟลเดอร์ชั่วคราวใน browser runtime พร้อม with เปิด–ปิดไฟล์ ไม่แตะไฟล์เครื่องผู้เรียน'},
    {name:'ตัวนับครั้งเข้าชม',detail:'ลดการเขียนซ้ำ ใช้ cache สำหรับอ่านยอด และจำกัดการสร้างเซสชันใหม่ ไม่เพิ่มข้อมูลระบุตัวผู้เรียน'},
  ]},
  {date:'2026-10-04',version:'2026.10.04.3',title:'จัดบทสรุป Internet และแก้บทซ้ำ',items:[
    {lesson:'internet',name:'จาก Computer สู่โลก Internet',detail:'รวมเหลือบทเดียว ใช้ฉาก 13 จุด และย้ายเป็นบทสุดท้ายเฟส 4 หลังเรียนพื้นฐานและระบบผู้ให้บริการ ลิงก์เก่าและความคืบหน้ายังใช้ได้'},
    {name:'เส้นทางการเรียน',detail:'ตรวจ ID ชื่อ คำอธิบายและโค้ดตั้งต้นซ้ำทุกหมวด พร้อมเพิ่มชุดตรวจป้องกันบทซ้ำ'},
  ]},
  {date:'2026-10-04',version:'2026.10.04.2',title:'ต่อยอดบริการ Telecom และศัพท์ที่อ่านรู้เรื่อง',items:[
    {name:'คำศัพท์ทุกบท Network และ Python',detail:'เพิ่มคำขยายความเรียงตามที่พบในบท และพจนานุกรม 256 รายการพร้อมค้นหา แยก DHCP ACK กับ TCP ACK ตามบริบท'},
    {lesson:'video-buffer',name:'Video Buffer',detail:'ทดลอง Startup buffer กับข้อมูลสื่อที่ถึงไม่สม่ำเสมอ ดูการเล่นและสะดุดจากผลคำนวณใน 3D'},
    {lesson:'rate-control',name:'Shaping / Policing',detail:'เทียบ Token bucket แบบหน่วงในคิวกับ Drop พร้อมผลการส่งจริงตามโมเดล'},
    {lesson:'troubleshooting',name:'แก้แล้วทดสอบซ้ำ',detail:'เพิ่ม VLAN/Route/Uplink sandbox เก็บ baseline และหลักฐานก่อนแก้ พร้อม Rollback'},
    {lesson:'ftth-access',name:'FTTH และ Subscriber',detail:'เพิ่ม Optical access และ PPPoE/IPoE/RADIUS โดยแยกสัญญาณ Session สิทธิ์และการเข้าถึงบริการ'},
    {lesson:'enterprise-path',name:'บริการองค์กรและเส้นทางผู้ให้บริการ',detail:'เพิ่ม VRF/MPLS, BGP policy/Withdraw และ CGNAT/IPv6 ใช้สถานการณ์จำลองเฉพาะกลไก'},
    {lesson:'noc-incident',name:'NOC Incident',detail:'ลงมือเก็บหลักฐาน แก้ configuration และตรวจบริการซ้ำ พร้อมลำดับการกระทำและผลกระทบ A/B'},
  ]},
  {date:'2026-10-04',version:'2026.10.04',title:'โลก Internet ที่กว้างขึ้น และการเล่นที่ชัดเจน',items:[
    {lesson:'network-quality',name:'คุณภาพเครือข่าย',detail:'เพิ่มบทหลัง HTTPS ทดลองความจุลิงก์ โหลดและขนาดคิว ดู delay, variation, throughput และ loss พร้อมฉาก 3D จากผลคำนวณ'},
    {lesson:'qos-queues',name:'QoS: คิว Packet และการจัดลำดับ',detail:'เปรียบเทียบ FIFO กับ Priority โดยเห็นส่งออกและ Drop ตามแบบจำลองเดียวกัน QoS ไม่เพิ่ม Bandwidth'},
    {lesson:'network-commands',name:'CLI เชื่อมภาพและสมุดหลักฐาน',detail:'แยกการอ่าน config/cache/socket จากการส่ง probe แก้ DNS ให้ตรง IP ในภาพ และเก็บผลเพื่อเปรียบเทียบ'},
    {lesson:'troubleshooting',name:'Troubleshooting: วิเคราะห์สาม Incident',detail:'เก็บหลักฐานและเลือกแนวทางตรวจต่อก่อนผ่าน ไม่แสดงเฉลยล่วงหน้า; คงลำดับ Commands → Capture → Troubleshooting'},
    {lesson:'internet',name:'จาก Computer สู่โลก Internet',detail:'ขยายเป็น 13 จุด เลือก Social feed, CDN และเกม ดูเส้นทางผ่าน ISP, Peering/Transit และคำตอบกลับ พร้อมทดลองจุดเสีย'},
    {lesson:'tcp-handshake',name:'TCP Handshake, Port และ Socket',detail:'ปรับสถานการณ์เริ่มต้นให้เล่นครบ SYN → SYN-ACK → ACK และแยกกรณี ACK ยังไม่ถึง Server'},
    {name:'ห้องทดลอง Network ที่ใช้ตัวเล่นขั้นตอนร่วมกัน',detail:'ปรับการหยุดเมื่อจบเส้นทาง และตรวจการเล่น/หยุด/เริ่มใหม่กับการเคลื่อนที่ของตัวส่งในฉาก'},
    {name:'ทั้งเว็บไซต์และทุกบทเรียน',detail:'เพิ่มฟอร์มรายงานบั๊กและข้อเสนอแนะ เตรียมอีเมลพร้อมชื่อบท/ลิงก์ และคัดลอกข้อความสำรอง'},
    {name:'ข่าวอัปเดต',detail:'เพิ่มวันที่เวอร์ชันและประวัติว่าบทเรียนใดเปลี่ยน พร้อมลิงก์เปิดบทนั้น'},
  ]},
  {date:'2026-10-03',version:'2026.10.03',title:'ขยายภาพ Network และจัดเลขเฟสใหม่',items:[
    {lesson:'osi-model',name:'OSI 7 ชั้น และ TCP/IP 4 ชั้น',detail:'เพิ่ม Stack 3D และคำอธิบายแต่ละ Layer ซ่อน Stack 2D ที่ซ้ำเมื่อ 3D พร้อม'},
    {name:'Network: 24 บทที่เพิ่มภาพ 3D',detail:'TCP, HTTPS, SLAAC, DHCP, DNS Cache, NAT/PAT, Monitoring, Security, Automation, Troubleshooting, Email, Proxy/LB, DMZ, Capture, WAN และ Cloud'},
    {name:'เส้นทางการเรียน Network',detail:'จัดเลขให้ใช้ชุดเดียว: เฟส 0 → เฟส 1 ขั้น 01–14 → เฟส 2 → เฟส 3'},
  ]},
];
export function dateLabel(date){return new Intl.DateTimeFormat('th-TH-u-ca-gregory',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Bangkok'}).format(new Date(date+'T12:00:00+07:00'));}
export function updateNotice(){const box=document.createElement('aside');box.className='update-notice';const link=document.createElement('a');link.href='#updates';link.textContent=`อัปเดต ${dateLabel(updates[0].date)} · มีอะไรใหม่บ้าง →`;box.append(link);return box;}
export function renderUpdates(root){root.className='updates-page';root.replaceChildren();const heading=document.createElement('h1');heading.textContent='อัปเดตใหม่ใน TechAtlas';const note=document.createElement('p');note.textContent='ดูวันที่เวอร์ชัน สิ่งที่ปรับปรุง และเปิดบทเรียนที่อัปเดตได้จากหน้านี้';root.append(heading,note);
  for(const release of updates){const section=document.createElement('section');section.className='update-release';const time=document.createElement('time');time.dateTime=release.date;time.textContent=`${dateLabel(release.date)} · เวอร์ชัน ${release.version}`;const title=document.createElement('h2');title.textContent=release.title;const list=document.createElement('ul');for(const item of release.items){const li=document.createElement('li'),name=document.createElement(item.lesson?'a':'strong');if(item.lesson)name.href='#lesson/'+item.lesson;name.textContent=item.name;const detail=document.createElement('p');detail.textContent=item.detail;li.append(name,detail);list.append(li);}section.append(time,title,list);root.append(section);}
}
export function initUpdateFooter(){const box=document.createElement('span');box.className='site-version';const link=document.createElement('a');link.href='#updates';link.textContent=`เวอร์ชัน ${updates[0].version} · ดูรายการอัปเดต`;box.append(link);document.querySelector('footer').append(box);}
