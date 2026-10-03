# TechAtlas

เว็บไซต์ห้องทดลองภาษาไทย แยก Network และ Python เป็นหลักสูตรอิสระ โดย Warapon Wichitpan

## รุ่นแรก

- Network 46 บท: เฟส 0, Switching, IPv4/VLSM/ARP/ICMP, Transport, IPv6, Routing/OSPF/HSRP, Services, Security, Wireless, Automation และ MPLS
- 3D มี floating IP, topology แยกสำหรับ DNS/VLAN/L2/L3/MPLS และข้อมูลแต่ละ hop; Concept labs เปรียบเทียบสถานการณ์ มีเครื่องมือบิต, OSI stack, Encapsulation, STP, OSPF, VLSM และ DHCP
- เฟส 0 มี 3D ครบ 7 บท: ส่วนประกอบเครื่อง, บิต 8 ตัว, อุปกรณ์, สาย/สถานะ Link, OSI/TCP-IP, การห่อ Header และ Computer → Internet เลือกโมเดล/ป้ายเพื่อเปลี่ยนสถานการณ์ได้
- การ์ด Explore สร้างภาพจากบทนั้นโดยตรง: โมเดลพื้นฐาน, topology รายหัวข้อ, ข้อมูลสถานการณ์ของ Concept lab และโค้ดเริ่มต้นของ Python ไม่ใช้ topology เดียวแทนทุกบท
- Python 28 บท อิงเอกสารใน docs รันจริงด้วย Pyodide มี input(), editable modules, แบบฝึกท้ายบท 6 ข้อ และตรวจหลายชุดข้อมูล
- Explore, เส้นทางอิสระ, แบบฝึกหัด, Credits, พจนานุกรมศัพท์ และความคืบหน้า/draft ผ่าน localStorage
- ข้อมูลอุปกรณ์ทั้งหมดเป็นข้อมูลสมมติ ไม่มีระบบบัญชีหรือการเชื่อมต่อบริษัท
- JavaScript, TypeScript, Node.js และ AI เป็นหมวดระยะถัดไป ยังไม่เปิดบทเรียน

## เปิดในเครื่อง

```sh
python3 -m http.server 4173 --directory dist
```

เปิด http://localhost:4173/ โดย hash routes ใช้ได้กับ static hosting ไม่ต้องตั้ง server-side rewrite

## แหล่งโหลด

Three.js 0.180.0, Pyodide 0.27.7 และ font โหลดจาก CDN จึงต้องมีอินเทอร์เน็ต โดยมีข้อความเมื่อโหลดแบบจำลองหรือ Python ไม่สำเร็จ โค้ด Python รันใน browser ของผู้เรียน ไม่ส่งโค้ดไปประมวลผลบน server ความคืบหน้าและ draft ผูกกับ browser/origin ที่ใช้

## โครงสร้าง

- `dist/assets/main.js`: UI routes, การทดลอง และความคืบหน้า
- `dist/assets/network-foundations.js`: ลำดับเฟสและสถานการณ์ Network
- `dist/assets/network-concepts.js`: Concept labs และแผนภาพเชิงกลไก
- `dist/assets/network-curriculum.js`: Network 3D labs และ forwarding logic
- `dist/assets/python-curriculum.js`: หลักสูตรและแบบฝึก Python
- `dist/assets/lab-scene.js`: Topology, ป้าย IP และ packet metadata ของ 3D labs
- `dist/assets/foundation-scene.js`: แบบจำลอง 3D เฉพาะเรื่องสำหรับบทพื้นฐาน
- `dist/assets/card-scene.js`: ภาพตัวอย่าง 3D รายบทบนการ์ด Explore
- `dist/assets/scene.js`: ฉาก Three.js ของ Client, Switch, Router และ Server
- `dist/assets/python-worker.js`: runtime Python และ scope ใหม่สำหรับแต่ละรอบ

## ตรวจรับ

ตรวจ Network ทั้ง Gateway ผิด/ถูก, DNS ไม่มีชื่อ, Protocol/Port ไม่ตรง, การส่งใน LAN และช่วง subnet /24 /25 /26 ตรวจ Python ทั้งโค้ดถูก, syntax error, ข้อมูลว่าง, key ที่หาย และ infinite loop ตรวจ progress หลัง reload, filter/search, glossary, navigation และ responsive layout

`node tests/curriculum.mjs` ตรวจ 46 บท Network, forwarding cases และ Python 54 solution/input cases ด้วย CPython ควบคู่กับการตรวจ Pyodide ในเบราว์เซอร์
