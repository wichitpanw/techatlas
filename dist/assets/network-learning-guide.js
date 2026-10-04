// Original observation prompts; playlist titles are an inventory, not copied scripts.
export const networkLearningGuide = {
  'computer-os': ['อ่านค่า IP, mask, gateway และ DNS จากผลจำลองก่อนเลือกคำสั่ง', 'แยกค่าที่ตั้งไว้ ออกจากหลักฐานว่าติดต่อปลายทางได้จริง'],
  internet: ['เทียบ Social feed, CDN และ Game: DNS → NAT → ISP → Peering/Transit → บริการ → คำตอบกลับ', 'DNS ไม่ได้ขนหน้าเว็บกลับมา; แยกเส้นทาง IP, Proxy connection และโปรโตคอลของแต่ละบริการ แผนผังนี้ไม่ใช่โครงข่ายจริงของบริษัทใด'],
  address: ['ใช้ IP กับ prefix ตัดสินว่าเครื่องสองตัวอยู่ subnet เดียวกันหรือไม่', 'อย่าตัดสินจากสามชุดแรกอย่างเดียว; class A/B/C เป็นแนวคิดเก่า ปัจจุบันใช้ CIDR'],
  subnet: ['เปรียบเทียบ prefix แล้วอ่าน network address, broadcast และช่วง host', 'กฎลบสองเหมาะกับ LAN IPv4 ทั่วไป ไม่ใช้เหมารวม /31 point-to-point และ /32'],
  protocols: ['เทียบ Port และหน้าที่ TCP/UDP ไม่ใช่แค่ความเร็ว', 'TCP ให้ byte stream ที่เรียงลำดับ; UDP ไม่รับประกันส่งถึง แต่ application อาจเพิ่มความน่าเชื่อถือเอง'],
  https: ['แยก TCP handshake, TLS handshake และ HTTP request', 'TLS ปกป้องข้อมูลระหว่างทางและตรวจตัวตนตาม certificate ไม่รับประกันว่าเว็บไม่มีการหลอกลวง; SSL รุ่นเก่าไม่ใช่มาตรฐานที่ควรใช้'],
  dns: ['ทดลอง A record ชื่อ → IPv4 แล้วสลับ PTR สำหรับ IP → ชื่อ', 'A และ PTR เป็นคนละ record ต้องตั้งแยกกัน; ไม่มีการเปลี่ยนตัว IP ให้กลายเป็นชื่อโดยอัตโนมัติ'],
  'dns-cache': ['เปรียบเทียบก่อนมี cache, cache ยังใช้ได้ และ TTL หมด', 'TTL ของ DNS คืออายุ cache คนละความหมายกับ IP TTL ที่ลดเมื่อผ่าน router'],
  'nat-pat': ['ดู source IP/port ก่อนและหลังออก router และจับคู่ reply กับ translation table', 'NAT ไม่ใช่ encryption และไม่ใช่นโยบาย firewall; PAT ใช้ port แยกหลาย connection'],
  'proxy-lb': ['เทียบว่าใครตั้งค่าใช้ตัวกลาง และตัวกลางรับแทน Client หรือ Server', 'ดู health check กับ pool ก่อนเลือก backend; proxy ไม่ใช่ VPN และไม่ได้ทำให้ traffic ทุก application ผ่านตัวกลางเสมอ'],
  dmz: ['อ่าน source zone, destination zone และ port ก่อนตัดสิน allow/drop', 'DMZ คือ zone ที่ใช้นโยบายแยก ไม่ใช่อุปกรณ์ที่ทำให้ server ปลอดภัยเอง'],
  pcap: ['เปิดแต่ละ frame แล้วจับคู่ Ethernet, IP, TCP flags หรือ DNS message', 'จับที่ NIC ฝั่ง Client จึงเห็น MAC ของ next hop ไม่ใช่ MAC ของ server ที่อยู่อีก subnet; ข้อมูลนี้เป็น capture ตัวอย่างไม่ใช่การดักจริง'],
  'network-commands': ['เลือกคำสั่งจากคำถาม: การตั้งค่า, DNS, neighbor, route หรือ connection', 'อ่านทั้งสิ่งที่ผลยืนยันและสิ่งที่ยังสรุปไม่ได้; ping timeout ไม่บอกจุดเสียด้วยตัวเอง'],
  troubleshooting: ['เริ่มจากขอบเขตปัญหา แล้วตรวจ link/IP → gateway/route → DNS → service', 'บันทึกหลักฐานก่อนเปลี่ยนค่า แก้หนึ่งอย่างแล้วทดสอบซ้ำ ไม่ไล่เปลี่ยนทุกอย่างพร้อมกัน'],
  'cloud-vpc': ['จับคู่ destination prefix กับ route table และ next hop', 'Subnet อยู่ใน cloud ไม่ได้แปลว่าออก Internet ได้เอง ต้องมี route และนโยบายที่อนุญาตตามบริการนั้น'],
  'cloud-hybrid': ['แยกเส้นทาง on-premise → hub → spoke และตรวจเส้นทางกลับ', 'มี tunnel หรือ peering ไม่ได้แปลว่ามี transitive routing ทุกกรณี; แบบจำลองต้องระบุสิ่งที่เชื่อมต่อไว้'],
};
