# TechAtlas — ประวัติการพัฒนาและผลตรวจเดิม

Snapshot ก่อนจัดเอกสารใหม่ 2026-10-04 ข้อความล่าสุด/Local/ยังไม่ Deploy หมายถึงเวลาที่บันทึกรอบนั้น ใช้ context.md เป็นสถานะปัจจุบัน ไม่ถือหลักฐานเก่าเป็นผลตรวจใหม่

อัปเดต: **2026-10-04**

ไฟล์นี้เป็นภาพรวมสถานะ ไม่ใช่ใบอนุญาต Deploy อ่านกฎใน `AGENTS.md` ก่อนทำงาน และตรวจ source/config จริงเมื่อข้อมูลอาจเปลี่ยน

## 1. ตัวตนและเป้าหมาย

- เว็บไซต์ห้องทดลองภาษาไทยสำหรับผู้เริ่มต้น เน้นเห็นกลไกและปรับค่าเพื่อเรียนรู้
- ผู้จัดทำ: Warapon Wichitpan · wichitpan.w@gmail.com
- Network, Python, Programming และ AI เป็นหมวดอิสระ ไม่บังคับทุกบทเชื่อมกับ Telecom
- มี Explore, เส้นทางการเรียน, แบบฝึกหัด, ความคืบหน้า, พจนานุกรม และ Credits
- ไม่มีบัญชีผู้เรียนหรือการเชื่อมระบบภายในบริษัท ข้อมูลอุปกรณ์เป็นข้อมูลจำลอง

## 2. Production vs Local

### สถานะปัจจุบันหลังงานต่อเนื่อง (เผยแพร่แล้ว 2026-10-04)

- Release ล่าสุด: 2026.10.04.3 — https://826ca007.techatlas-aoh.pages.dev (canonical https://techatlas-aoh.pages.dev), Network 63 / Python 35; รวม Internet ไว้ท้ายเฟส 4 พร้อม alias/progress และกฎ commit/push ใช้ clean release /tmp/techatlas-release-0jo44P/dist ตามอนุมัติ “deploy commit push เลย” รายการด้านล่างเป็นประวัติ release ก่อน
- Git remote origin เชื่อม https://github.com/wichitpanw/techatlas.git (private) แล้ว; 2026-10-04 ผู้ใช้ล็อกอิน GitHub CLI สำเร็จ ตั้งตัวตน Warapon Wichitpan / wichitpan.w@gmail.com และอนุมัติ commit/push เพื่อบันทึก baseline ของ source, tests, Functions และเอกสาร รวม draft ที่ไม่เผยแพร่ ตรวจ Pages project list พบ Git Provider = No จึงไม่ trigger auto-deploy จาก push; ไม่เก็บ credentials/PDF/ebook ใน commit

- Production: Network 64 บท / Python 35 บท / พจนานุกรม 256 รายการใน release 3ef782a7 (https://3ef782a7.techatlas-aoh.pages.dev), version 2026.10.04.2; canonical https://techatlas-aoh.pages.dev การ์ด Programming/AI ยังเป็นกำลังเตรียมบทเรียน
- Local: Network 63 บท / Python 35 บท รวม Internet เหลือบทเดียว ใช้ฉากใหม่ 13 จุด ย้ายเป็นบทสุดท้ายในเฟส 4 หลัง Cloud; URL เก่า #lesson/packet ส่งต่อ #lesson/internet และรวมความคืบหน้าเดิมโดยไม่ทับผลใหม่ ยังไม่ Deploy รอบนี้
- ตรวจซ้ำตามคำขอผู้ใช้ 2026-10-04 เฉพาะความซ้ำของทุกบท: Network 63 / Python 35 / Programming draft 6 / AI draft 4 ไม่พบ ID, ชื่อ, คำอธิบายหรือ starter code ซ้ำแบบตรงกันหลัง normalize ช่องว่าง (`tests/lesson-duplicates.mjs`) ไม่ใช่การรับประกันว่าแนวคิดไม่ทับกันหรือรัน UI ทุกบทใหม่; `tests/internet-placement.mjs` ตรวจตำแหน่ง/alias/progress และ browser ยืนยันลิงก์ packet เปิด Internet ใหม่ลำดับ 63/63
- Git: มี repository ในเครื่อง branch main แต่ยังไม่มี remote ณ การตรวจรอบนี้ ผู้ใช้สร้าง private repo wichitpanw/techatlas และจะเชื่อมเอง เพิ่มกฎอนุมัติ commit/push ทุกครั้งใน AGENTS.md; ยังไม่ commit/push และไม่เปิด auto-deploy
- `service-tools.js`: 3D จาก Video buffer (หน่วยวินาทีสื่อ) และ Token bucket (หน่วยงาน/token) คำนวณจริงใน browser ไม่จำลอง codec, TCP adaptation, policing remark หรือ QoS ของอุปกรณ์จริง
- `repair-lab.js`: Sandbox VLAN/route/uplink มี baseline → CLI หลักฐาน → เปลี่ยนค่า → retest → rollback เชื่อม MAC/route evidence กับจุดใน 3D; NOC มี action timeline และผลกระทบบริการ A/B จาก dependency ร่วมกัน ไม่เชื่อมอุปกรณ์ NT
- `lesson-terms.js`: พจนานุกรม 256 รายการ (Network 187 / Python 69) แสดงศัพท์ตามการพบครั้งแรกจากเนื้อหาและ model scenarios; ค้นชื่อ/คำอธิบายได้ แยก DHCP ACK/TCP ACK ตามบริบท ทุก 99 บทมีคำอธิบายศัพท์ใน panel แหล่งตรวจแนวคิด DHCP/TCP: RFC 2131 / RFC 9293; Python ใช้ Python Documentation ตามอ้างอิงบท
- หลักฐานใหม่ 2026-10-04: `tests/service-repair.mjs` ผ่าน 30 configurations/conservation/return-path/order; `tests/service-repair.html` browser ผ่านสอง Service labs และสาม Repair cases พร้อม playback/reset/gates/rollback/canvas; `tests/lesson-terms.mjs` ผ่าน 256 definitions และ 99 panels (ตรวจเฉพาะฟีเจอร์ศัพท์ ไม่รัน Labs เดิมซ้ำ) Browser ตรวจศัพท์ใน DHCP และการค้นหาพจนานุกรมแยกบริบท
- Provider 18 scenarios มีหลักฐานจากรอบก่อนในวันเดียวกัน ไม่รันบทที่ไม่แก้ซ้ำ; NOC surface ใหม่ใช้ repair workflow แทนการเปิดเฉลย scenario ผ่านทันที
- Deploy 2026.10.04.2 ตามอนุมัติผู้ใช้ “deploy ได้เลยนะ” ใช้ clean release /tmp/techatlas-release-d6z2hk/dist จำนวน 38 ไฟล์ ไม่มี draft AI/Programming; Functions/D1 upload สำเร็จ ตรวจ canonical พบ Network 64, คำศัพท์ DHCP และค้น ACK แยกสามรายการ ตัวนับแสดงค่า และ footer version ตรง ไม่รัน Lab เดิมซ้ำ
- ตรวจ Free plan ตามคำขอ: generated Functions routes มีเฉพาะ /api/visits; D1 info snapshot 41 kB / 152 rows read / 156 rows written ใน 24h เฉพาะฐานตัวนับ ยังไม่ใช่ยอดรวมบัญชี; ความเสี่ยงหลักคือ shared API/D1 quota และ bot abuse ไม่ใช่ขนาด static assets ดู CLOUDFLARE-FREEPLAN.md ไม่ได้ปรับ plan/rate-limit/โค้ดตัวนับ

ข้อความส่วนถัดไปเป็นบันทึกลำดับการพัฒนารอบก่อน ใช้หัวข้อสถานะปัจจุบันด้านบนเมื่อข้อมูลจำนวนบทขัดกัน

ล่าสุด 2026-10-04: Production Network 56 บทใน https://625959c2.techatlas-aoh.pages.dev (canonical https://techatlas-aoh.pages.dev), clean release /tmp/techatlas-release-5bHCef/dist ตามอนุมัติ Quality/QoS พร้อม 3D; ยืนยันหน้า QoS บน Production พบ canvas/controls และลำดับ 22/56 ชุดใหม่หลัง release นี้ยังไม่ Deploy

Local ขณะนี้ 62 บท: เพิ่มหก Provider labs ใน telecom-labs.js — FTTH → Subscriber หลัง WAN; enterprise-path หลัง MPLS VPN; BGP → CGNAT/IPv6 → NOC ก่อน Cloud ทุกบทใช้ 3D + scenario fixture, ต้องอ่านจนจบอย่างน้อยสอง scenario ก่อนผ่าน quiz ไม่ใช่ emulator/ระบบ NT โมเดลใหม่ 18 scenarios ผ่าน tests/telecom-labs.mjs; UI tests/telecom-interactive.html กำลังตรวจ ไม่อ้างว่าจบทั้งหมดแล้ว

กฎ 3D อัปเดตให้ต้องมีในทุกบทที่ทำได้อย่างมีความหมาย พร้อมเหตุผลข้อยกเว้น ไม่ใช้ animation ที่ขัดกลไก Quality/QoS 3D แสดง output/drop/occupancy จาก queue model เดียวกัน tests/quality-scene.mjs 48 frames ผ่านและ UI ตรวจ step/policy ตรงกัน การปรับชนิด mesh client/server ใน queue model หลัง Deploy ยังอยู่ Local

Local เพิ่ม 2026-10-04 หลัง release 5504ac63: Network 56 บท (Production 54) เพิ่ม network-quality และ qos-queues หลัง HTTPS ใน Transport ก่อน IPv6 ใช้คิว 2D/ตัวเลข DOM ที่คำนวณจริง ไม่อ้างเป็น 3D หรือ network emulator; card preview จากโมดูลเดียวกัน ไม่เปลี่ยน lesson IDs เดิม

network-quality.js: Packet 1000 bytes, tick 10 ms, burst ไฟล์+เกม 12 ticks และ drain 12 ticks, finite queue/tail drop, FIFO/strict priority คำนวณ throughput/mean one-way delay/mean absolute adjacent delay variation ไม่จำลอง TCP congestion control, retransmission หรือ video playback จริง Shaping/Policing/DSCP อธิบายแต่ยังไม่มี simulator เฉพาะ ต้องเปรียบเทียบสอง configuration ที่อ่านจนจบก่อนผ่าน

ตรวจเฉพาะงานใหม่: tests/network-quality.mjs ผ่าน 54 parameter combinations/conservation/bounds/priority/order; browser QoS ตรวจ gate ก่อนทดลอง, เปลี่ยน FIFO→priority, อ่านจนจบสอง configuration และ reset ผ่าน ยังไม่ตรวจ responsive/ทุกมุมหรือทำ video buffer model; ไม่ได้ Deploy ไม่รันทดสอบบทเก่าซ้ำตามกฎ

Deploy ล่าสุด 2026-10-04 รอบ CLI/Incident: https://5504ac63.techatlas-aoh.pages.dev (canonical https://techatlas-aoh.pages.dev) ใช้ clean release /tmp/techatlas-release-tzhAuB/dist ตามการอนุมัติผู้ใช้ ตรวจยืนยันเฉพาะหน้าที่แก้ใหม่บน Production พบสาม Incident/สมุดหลักฐาน/ฉาก 3D และไม่มีเฉลย workbench ล่วงหน้า CLI/Incident จากแผน Telecom เผยแพร่แล้ว ส่วนชุดถัดไปยัง Planned ชุดตรวจบทเก่ารวมที่เริ่มก่อนคำสั่งไม่ตรวจซ้ำถูกหยุด ไม่อ้างว่ารอบนี้ผ่านครบทุกบท

| หมวด/ฟีเจอร์ | เว็บ Production ที่ทราบล่าสุด | ในเครื่อง |
|---|---|---|
| Network | 54 บท: 52 บทมี 3D, 2 บทเป็นเครื่องมือ 2D; guide 16 บท; TCP playback และ Internet 13 จุดเผยแพร่แล้ว | ตรงกับ release 2026.10.04 |
| Python | 35 บท | 35 บท |
| Programming | การ์ด 03 กำลังเตรียมบทเรียน ไม่มีไฟล์เนื้อหาใน release | การ์ด 03 กำลังเตรียมบทเรียน; เก็บ 6 บทเป็น draft ปิด route |
| AI | การ์ด 04 กำลังเตรียมบทเรียน ไม่มีไฟล์เนื้อหาใน release | การ์ด 04 กำลังเตรียมบทเรียน; เก็บ 4 บทเป็น draft ปิด route |
| ตัวนับเข้าชม | Pages Functions + D1 | static preview ไม่มี D1 จึงอาจแสดงว่ายังไม่พร้อม |
| รายงานบั๊ก/ข้อเสนอแนะ | ฟอร์มทั้งเว็บ/รายบท เตรียมอีเมล + คัดลอก | เผยแพร่แล้ว ไม่มี backend ticket |
| วันที่เวอร์ชัน/รายการอัปเดต | 2026.10.04; ปุ่มข้างพจนานุกรม เปิด #updates | ตรงกับ release |
| กฎ/context | เอกสารภายในโปรเจกต์ ไม่ใช่ public assets | ไฟล์นี้และ AGENTS.md |

**ผู้ใช้ยืนยันล่าสุด: ยังไม่ Deploy เรื่อง AI** ห้ามใช้การอนุมัติ Deploy Network ครั้งก่อนมาขึ้น AI

Production หลัก: https://techatlas-aoh.pages.dev

Deployment ล่าสุดที่ตรวจสำเร็จในงานก่อนหน้า: https://6215f11a.techatlas-aoh.pages.dev (Network; 2026-10-03) ตรวจเนื้อหาไฟล์ Network 4 ไฟล์กับเว็บหลักตรงกัน และ GET `/api/visits` ตอบ 200 ข้อมูลนี้เป็นผลตรวจในงานก่อนหน้า ไม่ใช่การตรวจใหม่ขณะเขียน context

**Deploy ล่าสุด 2026-10-03:** https://7cf2dce9.techatlas-aoh.pages.dev หลังผู้ใช้อนุมัติ ใช้ clean release จาก `node scripts/prepare-release.mjs` ไม่รวมไฟล์เนื้อหาและ imports ของ AI/Programming เพิ่ม 3D Network 24 บท แก้เลขเฟส และซ่อน OSI Stack ซ้ำเมื่อ 3D พร้อม ตรวจเว็บหลักพบ OSI canvas และส่วนซ้ำถูกซ่อน หน้ารวมคงสี่การ์ดตามลำดับ 01–04; 03/04 กำลังเตรียม ตัวนับเข้าชมแสดงค่า และ SHA-256 ของ network-lab-models.js ตรงกับ release ข้อมูลนี้เป็นหลักฐานจากรอบ Deploy ก่อนการแก้เอกสาร ไม่ใช่การตรวจ Production ซ้ำในรอบเอกสาร

Deployment ก่อนหน้า: https://6eaca0f9.techatlas-aoh.pages.dev (ถอนเนื้อหา AI/Programming จาก release)

**Workflow ปัจจุบัน:** ห้าม Deploy `dist` ต้นฉบับโดยตรงขณะยังมี draft AI/Programming ใช้ script สร้างชุด dist ชั่วคราวที่ไม่รวมเนื้อหาที่พัก ตรวจไฟล์และ Preview แล้ว deploy path ที่ script คืน (Functions/D1 ใช้ config จาก project เดิม) ต้องขออนุมัติทุกครั้งเหมือนเดิม

## 3. ความสามารถรายหมวด

### Network — Production และในเครื่อง 54 บท

ตรวจ source รอบ Playlist พบ 54 บทอยู่แล้ว (จำนวน 46 ด้านล่างเป็นผลตรวจ/Production ในงานก่อนหน้า ไม่ใช่ inventory ปัจจุบัน) มี Network Commands, Email, Proxy/LB, DMZ, Capture, WAN, VPC และ Hybrid เพิ่มจากชุดเดิม รอบนี้เพิ่มจุดสังเกตกลไกและข้อควรแยกให้ 16 บท ดู `PLAYLIST-CURRICULUM-AUDIT.md` ยังไม่ได้ดูทุกวิดีโอหรือขยายครบ Playlist

ครอบคลุมพื้นฐานคอมพิวเตอร์/OS, เลขฐาน, อุปกรณ์, Physical, OSI/TCP-IP, Encapsulation และ Computer → Internet แล้วต่อด้วย Ethernet/MAC, IPv4/Subnet, ARP/ICMP, VLAN/STP/EtherChannel/VLSM, Transport/HTTPS, IPv6/SLAAC, Routing/OSPF/HSRP, Services, Security, Wireless, Automation และ MPLS/MPLS VPN

- เฟสพื้นฐาน 7 บทใช้ภาพจำลองเฉพาะหัวข้อ
- ห้องทดลองกลไก 37 บท มี 103 สถานการณ์; 35 บทใช้ renderer กลไก 3D ร่วมกัน อีก 2 บทคือ VLSM/IPv6 addressing ใช้เครื่องมือ 2D โดยตั้งใจ รวม renderer เดิม/เฉพาะบทอีก 17 บทเป็น 52/54 บทที่มี 3D
- มีบทเดิมที่ใช้ renderer Network แยก เช่น DNS, VLAN, L2/L3 และ MPLS จึงไม่ควรเหมาว่าทุกบทใช้ไฟล์ renderer เดียวกัน
- ป้ายอุปกรณ์/IP, link state, การเปลี่ยน scenario, ภารกิจและ feedback
- Renderer กลไก 3D แสดงลูกศร ตัวส่งเคลื่อนที่ และชื่อข้อความจาก transfer ที่ระบุจริงใน teaching model ขั้นที่ไม่ส่งข้อมูลไม่แต่ง traffic ขึ้นเอง
- ARP/ICMP แสดง next hop, broadcast, source-MAC learning, unicast reply, ARP cache, forwarding, router re-encapsulation, TTL และ Echo Reply พร้อม Frame inspector/หลักฐาน CLI จำลอง
- Lab ต่าง subnet ย่อเป็น Router เดียว มี subnet ที่ต่อโดยตรง ไม่ใช้ NAT สมมติ ARP ฝั่งปลายทางพร้อมและมี route กลับ ไม่ใช่ Internet/ISP emulator เต็มระบบ
- Timeout ของ Ping ไม่ได้พิสูจน์ว่าเครื่องดับ กรณี Drop ใน Lab เป็นตำแหน่งที่กำหนดไว้ ไม่ใช่ความสามารถหาจุดเสียจริงจาก timeout อย่างเดียว

### Python — ในเครื่อง 35 บท

เพิ่ม Number conversion, for–else, Function arguments/default/keyword และ Recursion แทรกตาม prerequisite คง ID/draft เดิม ภาพใช้ trace/runtime จริง เอกสาร Python หลักช่วยตรวจ semantic ส่วน Playlist ใช้ inventory หาช่องว่าง ไม่ได้อ้างว่าดูทั้งชุดแล้ว

- เนื้อหาเบื้องต้นเรียบเรียงโดยอ้างอิงเอกสารใน `docs` มีตัวแปร ชนิดข้อมูล input/operators/conditions/loops/collections/functions/modules/errors และแบบฝึกท้ายบท 6 ข้อ
- เพิ่ม Membership, Identity/Reference และ Shallow Copy แล้ว
- รัน Python จริงผ่าน Pyodide ใน Web Worker มีช่อง input, editable modules ในบทที่รองรับ และชุดตรวจผลลัพธ์
- Editor รองรับ Tab/Shift+Tab, 4 ช่องว่าง และ Enter พร้อมการเยื้อง
- จอผลลัพธ์/ตัวแปรใช้ข้อความ DOM อ่านชัด แสดงผลจาก runtime และย้อนดู trace ได้; บรรทัดใน editor highlight ตาม trace ไม่ใช่การ compile ทีละบรรทัด
- Trace และภาพประกอบมีขอบเขตที่ renderer รองรับ ไม่ใช่ Python debugger เต็มรูปแบบ ต้องตรวจข้อมูลจาก tracer ก่อนเพิ่ม visual ใหม่

### Programming — 6 บท

**พักการเผยแพร่ใน source ล่าสุด:** คงการ์ด 03 Programming พร้อมข้อความ “กำลังเตรียมบทเรียน” ไม่ใช่ปุ่ม ไม่มีตัวกรอง เส้นทาง แบบฝึก หรือ progress count ของหมวดนี้; URL บทแสดงข้อความกำลังเตรียม ไม่ลบ source/draft/progress เว็บ Production ยังเหมือนเดิมจนได้อนุมัติ Deploy

1. Web overview
2. HTML
3. CSS Box Model
4. JavaScript/DOM
5. JavaScript variables/types
6. JavaScript conditions

แก้โค้ดและแสดงผลใน browser Sandbox มีภารกิจและการตรวจผล ไม่ใช่ backend production ของผู้เรียน ภาพ Request/Response ในบทปูพื้นเป็นแบบจำลอง บท JavaScript ต่อไป, TypeScript และ Node.js ยังเป็นแผน ดู `PROGRAMMING-PLAN.md`

### AI — Local prototype 4 บท (ยังไม่ Deploy)

| ID | ความสามารถ |
|---|---|
| ai-map | แผนที่ AI/ML/DL และป้ายงาน NLP/GenAI/LLM เลือกตัวอย่างและอ่านความสัมพันธ์ |
| ai-rules | เปรียบเทียบกฎคนกับ threshold classifier ที่เลือกเส้นแบ่งจากข้อมูลจริงใน browser |
| ai-training | แยก dataset กับโมเดล เพิ่มตัวอย่างแล้วใช้ threshold เดิมจนกดฝึกใหม่ |
| ai-tokens | ฝึก Bigram ด้วยการนับคู่ token แสดง distribution และสร้างทีละ token ด้วย seeded sampler |

- มีภารกิจ คำใบ้ reset และบันทึกความคืบหน้า; ป้องกันการผ่านจาก quiz ก่อนทดลองในขอบเขตที่ตรวจไว้ ไม่ตรวจเหตุผลที่ผู้เรียนอธิบายด้วยภาษาธรรมชาติ
- คงการ์ด 04 AI ใน Explore พร้อม “กำลังเตรียมบทเรียน” ไม่มีตัวกรอง เส้นทาง หรือ progress count; ปิด URL ของทั้ง 4 บทแม้ใน localhost ตามคำขอล่าสุด
- เก็บ source/draft/progress เดิมไว้ นี่เป็น UI release policy ไม่ใช่ระบบป้องกันไฟล์ static ก่อน deploy ต้องตรวจ artifact ตามคำสั่งไม่ปล่อย AI
- เป็นภาพแนวคิดและโมเดลจิ๋วที่คำนวณจริง ไม่ใช่ LLM/Transformer และไม่เรียก Model API
- Bigram แบ่ง token ด้วยช่องว่างที่ใส่เอง ไม่ใช่ tokenizer ภาษาไทยจริง ใช้เพียง token ก่อนหน้า และไม่ตรวจข้อเท็จจริง
- ยังไม่มี Neural Network lab, Transformer/Attention lab, RAG, Tool Calling หรือ AI API ดู `AI-PLAN.md` สำหรับแผน 20 บท

## 4. สถาปัตยกรรมและไฟล์สำคัญ

- Static HTML/CSS/JavaScript แบบ ES modules ใช้ hash routes เช่น `#explore`, `#path`, `#lesson/ai-tokens`
- Public assets อยู่ใน `dist`; entry คือ `dist/index.html` และ `dist/assets/main.js`
- Network: `network-curriculum.js`, `network-foundations.js`, `network-concepts.js`, `network-lab-models.js`, `network-mechanism.js`, `network-mechanism-scene.js`, `lab-scene.js`, `foundation-scene.js`
- Python: `python-curriculum.js`, `python-tasks.js`, `python-editor.js`, `python-worker.js`, `python-tracer.js`, `python-interactive.js`, `python-scene.js`, `python-visuals.js`
- Programming: `programming-curriculum.js`, `programming-lab.js`, `programming-sandbox.js`
- AI: `ai-curriculum.js`, `ai-models.js`, `ai-lab.js`
- Explore previews: `card-scene.js`; style ร่วม: `style.css`
- Three.js, Pyodide และ font มีการโหลดจาก CDN อินเทอร์เน็ตจึงยังจำเป็นสำหรับบางส่วน ไม่ใช่เว็บ offline สมบูรณ์
- Progress/drafts ใช้ browser storage ผูกกับ origin/เครื่อง ไม่มีการ sync บัญชี การล้าง storage ทำให้ข้อมูลนี้หาย

### Visitor counter

- `/api/visits` ใช้ Cloudflare Pages Functions และ D1 binding `VISITS_DB`
- นับ session token ไม่ใช่จำนวนบุคคล ไม่บันทึก IP ในโค้ดตัวนับของแอป (ไม่ได้หมายความว่าผู้ให้บริการ hosting ไม่มี access logs)
- Token อยู่ใน sessionStorage รีโหลดแท็บเดิมใช้ token เดิม; server ล้าง record token เกิน 30 วัน ไม่ใช่การระบุตัวคนข้ามเครื่อง
- Footer แสดงตัวนับและ Credits ตามที่ผู้ใช้ขอ ไม่เพิ่มข้อความอธิบายยาวใน footer

## 5. วิธีเปิดและตรวจในเครื่อง

เปิดเฉพาะเว็บ: `python3 -m http.server 4173 --directory dist` แล้วเข้า `http://127.0.0.1:4173/`

เมื่อต้องเปิด browser tests พร้อมเว็บ: รันจากโฟลเดอร์โปรเจกต์ `python3 -m http.server 4174 --bind 127.0.0.1` แล้วเข้า `/dist/` และ `/tests/` อย่าเปิดเซิร์ฟเวอร์ครอบคลุม repo ออกสู่สาธารณะ ตัวอย่างในเครื่องอาจหยุดตามอายุ process; ตรวจสถานะก่อนสรุปว่า preview ใช้งานได้

ชุดตรวจ:

- `node tests/curriculum.mjs` — Python/Network curriculum และ execution checks
- `node tests/network-mechanisms.mjs` — Network models/input validation และ Python editor edits
- `node tests/ai-models.mjs` — AI threshold, frozen inference, bigram และ metadata
- `node tests/visit-counter.mjs` — ตัวนับเข้าชม
- Browser: `tests/network-interactive.html`, `tests/python-interactive.html`, `tests/programming-interactive.html`, `tests/ai-interactive.html`
- `git diff --check` และ `node --check` ไฟล์ JavaScript ที่แก้

### หลักฐานตรวจล่าสุดที่มี (2026-10-03 งานก่อนสร้างเอกสารนี้)

- AI model checks และ browser interaction tests ทั้ง 4 บทผ่าน
- Python 60 execution/input cases และ Network curriculum 46 บทผ่าน
- Network mechanism models 29 บท / 79 scenarios ผ่าน; browser Network 29 controllers / 79 scenarios / 11 shared 3D renderers และ Python 31 scene checks ผ่านในรอบ Network ก่อนหน้า
- ตรวจภาพ desktop ของ ARP/ICMP และ AI Training/Token, ตรวจการ์ด/ตัวกรอง AI ใน Explore
- **ยังไม่ใช่การตรวจด้วยตาทุกบท ทุกมุม 3D หรือ mobile ทั้งหมด** อย่าเขียนว่าครบแล้วจากผลนี้

## 6. อ้างอิงและข้อควรระวัง

- `CONTENT-AUDIT.md`: inventory ebook และขอบเขตที่สำรวจ ไม่ใช่หลักฐานว่าอ่านทุกหน้าทั้งหมด
- `CONTENT-LESSON-DRAFTS.md`: บันทึกเนื้อหาที่เรียบเรียงใหม่
- `NETWORK-VISUAL-AUDIT.md`: การแก้กลไกภาพและข้อจำกัดการตรวจ
- `AI-PLAN.md`, `PROGRAMMING-PLAN.md`: แผนต่อยอด ไม่ใช่ความสามารถที่ release ทั้งหมด
- `README.md`: คู่มือภาพรวมและการตรวจโปรเจกต์ อัปเดตจำนวนบท/สถานะ release ให้ตรงกับรอบ Network spatial ล่าสุดแล้ว
- Working tree มีงานแก้และไฟล์ใหม่จำนวนมากที่ยังไม่ commit รักษางานเหล่านี้ ไม่ reset/ลบทิ้ง

## 7. งานถัดไป

- ผลตรวจใหม่ Provider 2026-10-04: tests/telecom-interactive.html ผ่านหกบท/18 scenarios ตรวจ evidence title, transfer count, autoplay advances และ completion gate ใน shared 3D เฉพาะหกบทใหม่ ไม่ใช่การตรวจทุกขนาดจอ/ทุกมุม ไม่ตรวจบทเก่าซ้ำ หกบทนี้ยังอยู่ Local

- ผู้ใช้กำหนด 2026-10-04: ไม่ตรวจบทที่เคยผ่านซ้ำโดยไม่มีคำสั่ง ตรวจเฉพาะส่วนที่แก้ใหม่; เพิ่มใน AGENTS.md แล้ว ชุด browser ตรวจรวมที่เริ่มก่อนข้อความนี้ถูกหยุด ไม่อ้างผลรวมรอบนี้ว่าผ่านครบ

### Telecom learning plan — 2026-10-04 (Local/Planned ไม่ได้ Deploy)

- แผนครบสิบชุดและตำแหน่งตาม prerequisites อยู่ NETWORK-TELECOM-PLAN.md ต่อบทเดิมก่อนเพิ่มบทใหม่ ใช้ลำดับร่วม Explore/Path และรักษา lesson IDs/progress; จำนวนบทคงเดิม
- เริ่มชุด CLI: network-commands แยก ip/arp/netstat ที่อ่าน local state ไม่สร้าง traffic; DNS node ตรง resolver .53/.54 และแสดง reply เฉพาะกรณีตอบ; probe ไป next hop และขากลับแบบย่อ ไม่วาด Client→Server ตรงเมื่อ gateway ไปไม่ได้
- เพิ่มสมุดหลักฐาน ip/ping/nslookup เก็บเมื่ออ่านขั้นสรุปจริง ล้างเมื่อเปลี่ยน scenario; เป็นเครื่องมือช่วยอ่าน ยังไม่เปลี่ยน quiz completion gate และยังไม่ใช่ incident challenge แบบซ่อนสาเหตุ
- ชุด FTTH/Subscriber/Quality/QoS/MPLS/BGP/CGNAT/NOC ยังเป็น Planned ห้ามระบุว่าเสร็จ ไม่อ้าง topology ภายใน NT
- Node regression 37 labs/103 scenarios และ tests/cli-evidence.mjs ผ่านในรอบนี้
- Browser ตรวจ network-commands ใน localhost: ฉาก 3D โหลด, อ่านขั้นสรุปแล้ว ip ถูกเก็บในสมุดหลักฐาน, เปลี่ยนเป็น DNS failure แล้วสมุดล้างและป้าย resolver เปลี่ยนเป็น .54 ถูกต้อง ยังไม่ตรวจ UI ครบทุกคำสั่ง/ทุกขนาดจอในรอบนี้
- ต่อชุด Troubleshooting: สาม incident ไม่แสดง Known fault/เฉลยใน workbench ล่วงหน้า; อ่านผลเครื่องมือที่กำหนดก่อนเลือกแนวทางตรวจต่อ ต้องวิเคราะห์ครบสามเคสจึงตอบ quiz ผ่านได้ เก็บ evidence แยกเคส ไม่รวมผลเก่ามาใช้ข้ามเคส; ภาพ DNS ใน LAN และ probe/reply ตรงกับ fixture ไม่ระบุจุด ICMP drop จาก timeout
- เลือกเนื้อหา troubleshooting ฉบับปรับปรุงจาก foundationLessons โดยเฉพาะ เพราะมี ID เดียวกันใน curriculum เดิม; จำนวนยัง 54 ไม่ลบ progress ลำดับ Operations คง Commands → Capture → Troubleshooting → Capstone
- tests/incident-evidence.mjs ตรวจ 15 probe models, requirements และ prerequisite order ผ่าน; regression 37/103, spatial order 54 ผ่าน Browser localhost ตรวจป้องกันตอบก่อนมีหลักฐานและเก็บ/วิเคราะห์ครบสามเคสได้จริง ยังไม่ได้ตรวจ responsive/ทุกมุม/ทุกปุ่มในรอบนี้ ไม่ได้ Deploy

### Playback / Internet world / Feedback (2026-10-04; เผยแพร่แล้ว)

- เพิ่มหน้า #updates: แสดงเวอร์ชันแบบวันที่ 2026.10.04 และประวัติ 2026.10.03 พร้อมรายการสิ่งที่เปลี่ยน/ลิงก์ Internet, TCP, OSI ปุ่ม “อัปเดตใหม่” อยู่ข้างพจนานุกรมบน header และ footer แสดงวันที่เวอร์ชัน ไม่มีแถบประกาศซ้ำในหน้าแรก ข้อมูลอยู่ updates.js ต้องเพิ่มรายการตาม release จริง ไม่ใช้วันที่เปิดหน้าเป็นวันที่เวอร์ชัน

- พบ TCP สถานการณ์เริ่มต้นมี SYN ขั้นเดียว ทำให้กดเล่นแล้วไม่มีขั้นถัดไป ปรับ default ให้ครบ SYN → SYN-ACK → ACK; สถานการณ์ ACK ยังไม่ถึง Server จบที่การรอ ไม่มีการแต่ง ACK transfer ขึ้นมา
- Shared controller ปิดปุ่มเล่นเมื่อมีขั้นเดียว หยุด timer เมื่อถึงขั้นสุดท้าย/เมื่อถูกถอดจาก DOM และทดสอบ autoplay เพิ่ม ไม่ใช้ผลกดทีละขั้นแทนหลักฐานว่าการเล่นอัตโนมัติทำงาน
- Internet เปลี่ยนจาก 4 อุปกรณ์ย่อเป็น 13 จุด: Computer/Home NAT/ONT/ISP Access/Core/DNS/Peering/Transit/Service edge/Proxy/Social/CDN/Game เลือกบริการ เส้นทาง และ fault ได้รวม 24 แบบ แสดง DNS query/reply, ค่าก่อน/หลัง NAT, routing context, backend connection และคำตอบกลับ ไม่ติดต่อบริการจริง
- ใช้ shared scene กับ initialModel/ตำแหน่งราย node และพื้นที่สีของแต่ละเครือข่าย ป้ายในโลกใหญ่แสดงเฉพาะจุด active เพื่อลดการทับ มีรายการชื่อ/IP ทั้ง 13 จุดเปิดดูได้ แก้ CSS hidden ที่เคยไม่ซ่อนป้ายเพราะ display rule ทับกัน การ์ด Internet ใช้ model/renderer เดียวกับหน้าเรียน
- ตัวอย่าง Social คล้ายเปิด Facebook ไม่ใช่แผนผัง Meta; เกม UDP/3074 สมมติ ไม่ใช่ทุกเกม; DNS cache พร้อม, IPv4/NAT, route ตารางพร้อม, ย่อ TCP/TLS handshake ไม่จำลอง CGNAT, BGP convergence หรือภูมิศาสตร์จริง อ้างอิง RFC 4271 และ MDN ในบท
- Feedback: footer ทั้งเว็บ และปุ่มข้างแต่ละบท เตรียม mailto ถึง wichitpan.w@gmail.com หัวข้อ [TechAtlas] และคัดลอกข้อความสำรอง ผู้ใช้ต้องส่งเอง ไม่มี backend ticket/admin/อัปโหลดรูป ไม่เก็บโค้ด/IP/storage อัตโนมัติ ดูวิธีอ่านใน FEEDBACK.md
- ผลตรวจรอบนี้: หน้าเรียนจริง 54 บทผ่านการเล่น/หยุด/reset หรือส่งข้อมูล/เปลี่ยน state ตามชนิดบท; shared controllers 37/103 พร้อมตรวจ named transfers และตำแหน่ง marker ที่เคลื่อนจริงผ่าน รวม Python 35 ฉาก; Internet model และ browser UI 24 service/route/fault cases ตรวจทุก step/transfer และ replay/reset ผ่าน
- CPython 67 solution/input cases และ Network curriculum 54 บทผ่าน (sandbox Python subprocess timeout จึงตรวจซ้ำ non-sandbox); spatial/OSI/visibility/syntax/diff checks ผ่าน ทดสอบฟอร์มและ mailto โดยไม่ส่งอีเมลจริง ไม่ใช่การตรวจทุกมุม 3D/ทุกเบราว์เซอร์หรือรับประกันไม่มีบั๊ก
- Responsive ตรวจ Internet/TCP และเปิดฟอร์มด้วย iframe viewport 390px (พื้นที่เนื้อหา 375px หลัง scrollbar) ไม่พบ horizontal overflow; เครื่องมือ browser viewport override ไม่เปลี่ยนขนาดจริงในรอบนี้ จึงใช้ iframe ที่กำหนดขนาด ตรวจได้เป็น CSS breakpoint ไม่ใช่โทรศัพท์จริง
- Deploy ล่าสุดตามการอนุมัติผู้ใช้: https://8105e611.techatlas-aoh.pages.dev (canonical https://techatlas-aoh.pages.dev), เวอร์ชัน 2026.10.04 ใช้ clean release /tmp/techatlas-release-cbYI3X/dist คง Programming/AI กำลังเตรียมบทเรียน ไม่มีไฟล์ draft ใน release ตรวจ Production พบหน้ารายการอัปเดตและตัวนับเข้าชม; TCP autoplay จบที่ ACK/ESTABLISHED และ Internet โหลดฉากสามมิติพร้อมตัวเลือกบริการ/เส้นทาง/fault ผลตรวจครบทุกสถานการณ์ด้านบนเป็นการตรวจในเครื่องก่อน Deploy ไม่ใช่ทุกสถานการณ์บน Production

### Network spatial coverage / Phase cleanup (2026-10-03)

- Source inventory 54 บท: 52 มี 3D, อีก 2 เป็น VLSM/IPv6 addressing tool 2D โดยตั้งใจ; เพิ่ม 24 บทเป็น spatial mechanism รวม shared renderer 35 บท ดู `NETWORK-SPATIAL-AUDIT.md`
- 3D แสดง named transfer และ active/blocked ตาม model; เพิ่มแผงค่าตัดสินใจในภาพ ไม่แต่ง Packet ในขั้นที่ไม่มี transfer แยก logical context เช่น Cache, ACL, Route table, SDN plane และ Desired state เป็นแผ่น/เส้นประ ไม่ใช่ Router จริง
- OSI เมื่อ 3D พร้อมไม่แสดง Stack 2D ซ้ำ เก็บเฉพาะ Header inspector ใต้คำอธิบาย; Stack เป็น fallback เมื่อ 3D ไม่พร้อม
- เลขชุดเดียวทั้ง Explore/Path: เฟส 0 → เฟส 1 ขั้น 01–14 → เฟส 2 → เฟส 3 แก้หัวข้อสรุปที่ย้อนจาก 1.13 ไป 1 และเลข badge อีกชุด; ไม่เปลี่ยน lesson IDs/progress
- แก้ Client/Outgoing mail server รูปอุปกรณ์ และ IP On-prem host ที่เคยแสดง 10.1.0.0.20 เป็น 10.1.0.20
- Node tests: Network 37/103, spatial audit/phase 54 บท, OSI, course visibility ผ่าน; Browser ตรวจจริงร่วม concept/controller ครบ 37 labs/103 scenarios/35 shared 3D + Python 35 scenes ผ่าน ตรวจภาพ Email desktop/mobile, Cloud logical table, OSI ซ่อนส่วนซ้ำ และ Path labels; mobile Email ไม่พบป้ายชนหรือ horizontal overflow ณ step ที่ตรวจ ไม่ใช่ QA ทุกมุมทุกบท
- เผยแพร่แล้ว 2026-10-03 ตามการอนุมัติผู้ใช้: https://7cf2dce9.techatlas-aoh.pages.dev (canonical https://techatlas-aoh.pages.dev) ผ่าน clean release ที่ถอนเนื้อหา AI/Programming; ตรวจเว็บจริงพบ OSI canvas พร้อมซ่อน Stack ซ้ำ และหน้ารวมคงการ์ด 03/04 กำลังเตรียมบทเรียน ตัวนับเข้าชมทำงาน

### OSI visual รอบวิดีโออ้างอิง (ประวัติการพัฒนา; เผยแพร่แล้วใน 7cf2dce9)

- รอบปรับ 3D: `osi-scene.js` แสดง Stack ส่ง/รับ 7 ชั้น หมุน/ซูมได้ ไฮไลต์ชั้นและก้อน PDU จาก step เดียวกับ inspector; ขนาดก้อนเป็นภาพสัญลักษณ์ ไม่ใช่ Packet bytes จริง การ์ด Explore ใช้ renderer เดียวกัน
- เพิ่มคำอธิบายไทยสั้นครบ 7 Layer พร้อมคำอธิบายชั้นปัจจุบันใต้ภาพ ย้ายปุ่มเล่น/ย้อน/slider ใกล้ 3D; เมื่อโหลด WebGL ไม่ได้ยังใช้ DOM Stack และขั้นตอนได้
- ตรวจ browser ทุก 15 ขั้นให้ side/layer/PDU ตรงกัน, FCS ผิดหยุด L2, เล่น/หยุด, เปลี่ยนข้อความไทย (UTF-8 18 bytes), reset; ตรวจภาพ desktop/mobile 390px ไม่พบ overflow แนวนอนในหน้าที่ตรวจ ยังไม่ตรวจทุกมุมหมุนหรือบังคับ WebGL failure
- `tests/osi-lab.mjs`, Network 37 labs/103 scenarios และ course visibility ผ่าน; release preparation ผ่าน (ยังไม่ได้ Deploy)

- ดูภาพตัวอย่างทุกช่วงวินาทีของวิดีโอที่ผู้ใช้ส่ง (10.15 วินาที) เห็น Sender/Receiver, encapsulation และขนาด Header; ไม่คัดลอกวิดีโอหรือภาพต้นฉบับมาเผยแพร่
- `osi-lab.js`: สอง stack 7 ชั้น, 15 ขั้น sender/link/receiver, ปรับข้อความ UTF-8, เล่น/หยุด/ย้อน/slider และ Frame เสียหยุด L2 มี mapping TCP/IP และขอบเขตจำลองชัดเจน ไม่ใช้ TLS ไม่แต่ง Session header
- Preview OSI เปลี่ยนเป็นภาพ sequence ของบทนี้; model sizes = UTF-8 + TCP20 + IPv4 20 + Ethernet14/FCS4 (ไม่รวม padding/preamble/IFG) ไม่ใช่ bytes ของ capture จริง
- Model tests ผ่าน UTF-8, symmetric sizes, L2 drop; Network 37/103 regression ผ่าน; browser ตรวจเปิดบท/slider ถึงรับสำเร็จและ FCS drop บน desktop ยังไม่ตรวจ mobile/ทุกปุ่ม
- อ่าน caption ของ [Instagram AlgoInsight](https://www.instagram.com/p/DbdHcYvJ_zg/) ได้ มีรายการ 15 แนวคิด ไม่ได้ดูทุก animation ในโพสต์และไม่ถือว่าเป็นเนื้อหา Network ครบทั้งหมด ยังไม่ขยายบทอื่นจาก caption

### ผลตรวจรอบ Playlist (ประวัติผลตรวจ 2026-10-03; เนื้อหา Network/Python เผยแพร่แล้ว)

- CPython 67 solution/input cases ผ่าน; sandbox subprocess timeout ก่อนเริ่ม จึงตรวจซ้ำด้วย non-sandbox
- Browser Pyodide/visuals 35 บท และเพิ่มเติม error/limit checks ผ่าน
- Network curriculum 54 บท; models 37 labs / 103 scenarios ผ่าน
- `tests/course-visibility.mjs`: public/loopback policy, 4 missions, 16 guides ผ่าน; AI model regression และ diff/syntax ผ่าน
- UI ตรวจ Explore, Programming withdrawn URL, Practice, DNS และ Recursion ไม่ใช่การตรวจทุกบท/ทุกขนาดจอ
- ลำดับงานต่อ/ช่องว่าง Playlist บันทึกใน `PLAYLIST-CURRICULUM-AUDIT.md`

1. ให้ผู้ใช้ลอง AI ต้นแบบและปรับตาม feedback ก่อนขอ Deploy ใหม่
2. ตรวจ responsive/keyboard/ข้อความ/เงื่อนไขผ่านภารกิจให้ละเอียดเพิ่มเติมก่อนขยายจำนวนบท
3. ขยาย AI ตามแผนจากพื้นฐานข้อมูล/การประเมินสู่ Neural Network, NLP, LLM และ RAG โดยไม่ใช้ภาพแต่งแทนกลไก
4. รักษา README และ audit ให้ตรงกับ context เมื่อมี release รอบถัดไป
5. อัปเดต context นี้ทันทีเมื่อความสามารถหรือสถานะเผยแพร่เปลี่ยน โดยคงความแตกต่าง Production/Local/Planned
