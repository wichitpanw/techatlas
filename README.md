# TechAtlas

เว็บไซต์ห้องทดลองภาษาไทย แยก Network และ Python เป็นหลักสูตรอิสระ โดย Warapon Wichitpan

## สถานะปัจจุบัน — 2026-10-04

- Production: https://techatlas-aoh.pages.dev — https://609c43c4.techatlas-aoh.pages.dev — เวอร์ชัน 2026.10.04.4 รวม Network 63 / Python 48 / พจนานุกรม 285 รายการ
- รุ่นนี้เพิ่ม Python 13 บทต่อยอด พร้อมศัพท์และปรับตัวนับ ใช้ migration 0002 แล้ว; อ่าน context.md สำหรับสถานะจริงและ PROJECT-HISTORY.md สำหรับประวัติ
- Network 61 บทมี 3D; VLSM/IPv6 addressing ใช้เครื่องมือ 2D ตามข้อยกเว้น
- Explore/Path ใช้ลำดับเดียว: เฟส 0 → เฟส 1 ขั้น 01–14 → เฟส 2 WAN/Provider/MPLS → เฟส 3 Cloud → เฟส 4 Internet บทสรุปเดียว
- OSI มี 3D และคำอธิบายครบ 7 ชั้น ซ่อน Stack 2D ที่ซ้ำเมื่อ 3D พร้อม เก็บ Header inspector และ fallback
- Python 35 บท รันจริงด้วย Pyodide มีภารกิจชัดเจน Editor รองรับ Tab/Shift+Tab และไฮไลต์บรรทัดตาม trace จริง
- Programming/AI คงการ์ด 03/04 “กำลังเตรียมบทเรียน” ไม่เปิด route หรือรวมไฟล์เนื้อหาใน release; เก็บ draft ในเครื่อง
- หลักฐานรอบเก่า: Network 37 controllers / 103 scenarios / 35 shared 3D และ Python 35 scenes ผ่าน ตรวจภาพบางหน้าบน desktop/mobile ไม่ใช่ทุกมุมทุกอุปกรณ์ ดู PROJECT-HISTORY.md ไม่ถือว่าเป็นผลตรวจใหม่
- รอบใหม่ตรวจเฉพาะ Python 13 บทและตัวนับ; รายละเอียดอยู่ context.md ไม่ตรวจ Network เดิมซ้ำ

รายละเอียดล่าสุด: `context.md` และ `NETWORK-SPATIAL-AUDIT.md` กฎหลัก: `AGENTS.md`

ตรวจรอบนี้เฉพาะ `node tests/python-next.mjs`, `tests/python-next.html`, `node tests/visit-counter.mjs`, `node tests/visit-client.mjs` ไม่รัน Lab เก่าซ้ำโดยไม่มีคำสั่ง ชุดตรวจรวมบางไฟล์เป็น snapshot รุ่นเก่าที่ hardcode จำนวนบท จึงต้องทบทวนก่อนใช้รับรอง release

ต้องได้รับอนุมัติก่อน Deploy ทุกครั้ง ขณะพัก Programming/AI **ห้าม deploy dist ต้นฉบับ** ใช้ `node scripts/prepare-release.mjs` ตรวจ artifact/preview แล้ว deploy path ที่ script คืนจากโฟลเดอร์ project เพื่อคง Functions/D1 config ไม่ upload repository/docs/credentials

## ประวัติงานเผยแพร่ช่วงต้น — 2026-10-04

เผยแพร่ตามการอนุมัติผู้ใช้ผ่าน clean release ที่ไม่รวมเนื้อหา Programming/AI ตรวจเว็บจริงพบหน้ารายการอัปเดต ตัวนับเข้าชม และ TCP autoplay จบที่ ACK/ESTABLISHED; Internet มีฉาก 3D และตัวเลือกบริการ/เส้นทาง/ปัญหา

เพิ่มฟอร์มรายงานทั้งเว็บ/รายบท ส่งผ่านแอปอีเมลของผู้เรียนไป wichitpan.w@gmail.com พร้อมคัดลอกสำรอง ดูวิธีอ่านใน `FEEDBACK.md` ไม่ใช่ระบบ ticket ที่ส่ง/จัดเก็บรายงานจากเว็บโดยตรง

แก้ TCP เริ่มต้นให้เล่น Handshake ครบ และขยาย Internet เป็น 13 จุด เลือก Social/CDN/Game, Peering/Transit และจุดเสียได้ แบบจำลองไม่ได้อ้างโครงข่ายจริงของ Facebook หรือเกมใด

ตรวจเพิ่ม: `node tests/internet-feedback.mjs`, `tests/network-playback.html` (54 หน้าเรียนจริง), `tests/network-interactive.html` (37 labs/103 scenarios พร้อม autoplay และ marker movement), `tests/internet-interactive.html` (24 แบบ) หลักฐานและข้อจำกัดอยู่ใน `context.md`

## ประวัติรุ่นก่อนหน้า

ส่วนด้านล่างเก็บรายละเอียดการพัฒนารุ่นก่อน ตัวเลข 46/28, จำนวนสถานการณ์ และสถานะ Programming ที่เคยเปิดเป็นประวัติ ไม่ใช่ inventory หรือสถานะ Production ปัจจุบัน ให้ใช้ส่วนสถานะปัจจุบันและ `context.md` เป็นหลัก

## รุ่นแรก

- Network 46 บท: เฟส 0, Switching, IPv4/VLSM/ARP/ICMP, Transport, IPv6, Routing/OSPF/HSRP, Services, Security, Wireless, Automation และ MPLS
- 3D มี floating IP, topology แยกสำหรับ DNS/VLAN/L2/L3/MPLS และข้อมูลแต่ละ hop; Concept labs เปรียบเทียบสถานการณ์ มีเครื่องมือบิต, OSI stack, Encapsulation, STP, OSPF, VLSM และ DHCP
- เฟส 0 มี 3D ครบ 6 บท: ส่วนประกอบเครื่อง, บิต 8 ตัว, อุปกรณ์, สาย/สถานะ Link, OSI/TCP-IP และการห่อ Header; Internet ย้ายไปเฟส 4 แล้วใน release 2026.10.04.3
- การ์ด Explore ใช้ renderer และผังเดียวกับบท 3D จริง ไม่วาด topology แยก; Concept lab ใช้แผนภาพ/ข้อมูลสถานการณ์แรกชุดเดียวกับเนื้อหา และ Python ใช้โค้ดเริ่มต้นของบทนั้น
- Gateway lab เปรียบเทียบ Ping ใน LAN กับต่าง subnet มี Gateway ผิด/ถูก/ไม่มี/อยู่นอก LAN พร้อมหลักฐาน ARP, ผลคำสั่งจำลอง และภารกิจเปรียบเทียบก่อน–หลัง
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

## Python 3D Interactive

ครบ 28 บท ใช้ `python-visuals.js` กำหนดภาพต่อบท และใช้ `python-scene.js` ร่วมกันระหว่างบทกับภาพตัวอย่าง ไม่ใช้ค่าตัวอย่างแทนสถานะของโค้ดที่ผู้เรียนรัน

Hello World มองจอตรงและไม่มีคีย์บอร์ด บทอื่นใช้ช่องชื่อ/ค่า, ลำดับสมาชิก, Key–Value, บรรทัดที่ทำงาน, เหตุการณ์ลูป และ Call stack ตามหัวข้อ `python-tracer.js` จับเหตุการณ์ CPython จริงใน Pyodide worker และ `python-interactive.js` ให้ย้อนหลังด้วยปุ่ม/slider ไม่ใช่การหยุด debugger ระหว่างรัน

Line event แสดงค่าก่อนทำบรรทัดนั้น, return แสดงค่าคืน, exception อาจถูก except รับไว้ การตรวจชุดโจทย์ไม่ปนกับประวัติรอบที่ผู้เรียนรัน จำกัด 180 เหตุการณ์, 12 ชื่อต่อ scope, 160 ตัวอักษรต่อค่าที่แสดง และ 4 สมาชิกต่อชุดใน 3D (ดูจำนวนเต็มได้จาก metadata) มีข้อความเมื่อเกินขีดจำกัด อ่านผลเต็มในช่อง output ได้

เปิด `tests/python-interactive.html` ผ่านเซิร์ฟเวอร์ที่ root โปรเจกต์เพื่อทดสอบทั้ง 28 บทด้วย Pyodide จริง รวมชุดตรวจโจทย์, ฉาก 3D, Error, ข้อมูลก่อน Error และขีดจำกัดประวัติ ไฟล์ทดสอบอยู่นอก `dist` และไม่ขึ้นเว็บ

Production: https://techatlas-aoh.pages.dev — ต้องถามผู้ใช้และได้รับอนุญาตก่อน Deploy ทุกครั้งตาม AGENTS.md ไม่มี Auto-deploy

## Network mechanisms และ Python editor

Network อีก 29 บทมีห้องทดลองเฉพาะกลไก: 11 ฉาก 3D, 11 ลำดับสถานะ/ข้อความ 2D และ 7 Sandbox รวมกับ 17 บท 3D เดิมเป็น 46 บทที่มีการทดลอง ภาพตัวอย่างใช้ model เดียวกับบทและ badge ระบุประเภทจริง ไม่อ้างว่า 2D เป็น 3D

`network-lab-models.js` มี model รายบทและ validation, `network-mechanism.js` ควบคุม scenario/step/replay/ข้อมูลที่ปรับเอง และ `network-mechanism-scene.js` แสดงอุปกรณ์ IP ลอยและสถานะลิงก์ การเล่นเป็นขั้นตอนเชิงอธิบาย ไม่ใช่ simulation timing, full protocol stack หรือคำสั่งบนอุปกรณ์จริง VLSM จำกัด LAN ทั่วไป /24, IPv6 รับ Hex ไม่รวม IPv4-embedded, API/Automation ไม่ส่ง request หรือเปลี่ยนทรัพยากรจริง เมื่อ WebGL ใช้ไม่ได้ยังอ่านและกดทดลอง 2D ได้

Python ใช้ข้อความ DOM คมชัดบนตำแหน่ง 3D แทน texture ตัวอักษรขนาดเล็ก และเว้นช่องไฟแผ่นโค้ดไม่ให้ทับกัน `python-editor.js` รองรับ Tab 4 ช่อง, Shift+Tab, เลือกหลายบรรทัด, Enter เยื้องต่อ และปุ่มเยื้องสำรองทั้งไฟล์หลัก/โมดูล กด Esc แล้ว Tab เพื่อออกจาก editor ได้

ตรวจเพิ่มด้วย `node tests/network-mechanisms.mjs` (29 labs / 79 scenarios, validation และ keyboard edits) และเปิด `tests/network-interactive.html` จาก root server เพื่อตรวจ controllers, ทุก scenario/step, 11 3D renderers และ Python 28 ฉาก ไฟล์ทดสอบไม่อยู่ใน `dist` จึงไม่ถูก Deploy
# Python mission clarity and editor playback

All 28 Python lessons now have an explicit goal, ordered actions, edit location,
sample inputs and expected output beside the editor. Follow-up experiments are
marked as optional after passing the original exercise. Assessment checks output
and any listed alternate-input/function cases, not the learner's code style.

Trace playback highlights the corresponding line in main.py or the module editor.
The duplicate source/variable/return panel is removed. Highlights are cleared on
edits/reset and are not applied to code that differs from the recorded run.
Playback describes recorded execution, not live compilation.

Verification: `node tests/curriculum.mjs` checks mission coverage and 54 Python
solution/input cases; `tests/python-interactive.html` checks real Pyodide runs,
all 28 scenes, every valid trace line (including modules), stale-code protection,
and error/limit cases. These local changes require new approval before deployment.
# Programming · first six lessons

Independent beginner track: web request journey, HTML structure, CSS box model,
JavaScript click events, variables/types and branching. Integrated into Explore,
Path, Practice, Progress, glossary and local drafts. Each card has a subject-specific
preview rather than reusing a network scene.

`tests/programming-interactive.html` runs real iframe/worker checks on starters and
solutions, alternate scores, errors, timeout and origin/storage isolation. The DOM
lesson also needs a manual click check. Run via the local repository test server,
not production. `tests/curriculum.mjs` and `tests/network-mechanisms.mjs` protect the
existing tracks. Pure JS uses a worker with a two-second limit; DOM JS runs in the
sandboxed frame and has no interruption guarantee for an infinite DOM-side loop.
This first batch does not claim automatic JavaScript line tracing or 3D rendering.
See PROGRAMMING-PLAN.md for the next six lessons. Deploy only after fresh approval.
