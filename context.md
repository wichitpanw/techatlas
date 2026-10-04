# TechAtlas — สถานะปัจจุบัน

อัปเดต 2026-10-04 · Warapon Wichitpan · wichitpan.w@gmail.com

อ่าน AGENTS.md ก่อนทำงาน ไฟล์นี้ไม่ใช่อนุมัติ commit/push/deploy ผลตรวจเก่าอยู่ PROJECT-HISTORY.md

## Production

- https://techatlas-aoh.pages.dev · release 2026.10.04.5 · immutable https://1add9443.techatlas-aoh.pages.dev
- Network **64** / Python **48** บท / พจนานุกรม **320** รายการ
- Internet เหลือบทเดียว ฉากใหม่ 13 จุด เป็นบทสุดท้ายเฟส 4 หลัง Cloud; #lesson/packet ส่งต่อ #lesson/internet และรักษาความคืบหน้า
- ลำดับร่วม Explore/Path/ก่อน–ถัดไป: เฟส 0 → เฟส 1 ขั้น 01–14 → เฟส 2 WAN/Provider/MPLS → เฟส 3 Cloud → เฟส 4 Internet
- Telecom แผนสิบชุดส่งมอบในขอบเขตแบบจำลองแล้ว: CLI/evidence, troubleshooting/repair/retest/rollback, FTTH, subscriber, quality, QoS/video/token bucket, enterprise, BGP, CGNAT/IPv6, NOC
- Network 62 บทมีภาพ 3D; VLSM/IPv6 addressing ใช้เครื่องมือ 2D เพื่อคำนวณตามข้อยกเว้น ไม่จำลองระบบบริษัทจริง
- Python รันจริง Pyodide Worker; Tab/Shift+Tab, trace highlight และจอผลลัพธ์อ่านชัด
- Programming/AI คงการ์ด 03/04 กำลังเตรียมบทเรียน ปิด route และไม่รวม draft assets ใน release
- Feedback เตรียม mailto/คัดลอก ไม่มี backend ticket หรืออัปโหลดรูป
- ตัวนับเซสชัน Pages Functions + D1 ไม่เก็บ IP ในโค้ดแอป ไม่มีบัญชีผู้เรียน

## รายละเอียดรุ่น 2026.10.04.4

ผู้ใช้อนุมัติ migration/commit/push/deploy รอบนี้แล้ว และเผยแพร่ Production 2026.10.04.4 สำเร็จวันที่ 2026-10-04

- Network 63 / Python **48** บท เพิ่ม 13 บทใน python-next.js หลังพื้นฐานเดิม
- ลำดับ: Bitwise/Swap → Comprehension → zip/Search → *args/**kwargs → Local scope → Iterator → Generator → Class/Object/self/__init__ → Instance/Class attributes/Methods → Inheritance/Duck typing/Composition concept → Files/with → CSV/JSON → Sorting
- ภารกิจมี goal/actions/starter ที่ยังไม่ผ่าน solution และ assertions ตรวจค่าที่คำนวณจริง
- renderer Python ใช้ visualSpec sequence/dictionary/stack/memory จาก trace ของ runtime ไม่แต่ง RAM layout หรือสถานะ iterator ภายในที่ tracer ไม่รองรับ
- OOP tracer อ่านเฉพาะ stored instance dict ของ plain classes ในตัวอย่าง (Book/Cart/Person/Student/Robot) ผ่าน getset descriptor ไม่เรียก method/property getter แสดง self.title/self.pages ก่อน–หลัง assignment จริง ไม่รองรับ arbitrary classes ทุกชนิด
- Generator yield อาจสร้าง return trace event หมายถึงพัก ไม่ใช่จบฟังก์ชัน ภาพไม่ใช่ debugger เต็มรูปแบบ
- Files ใช้ TemporaryDirectory ของ Pyodide ลบเมื่อจบบล็อก ไม่แตะไฟล์เครื่องผู้เรียน ไม่มี persistence ถาวร; CSV ใช้ StringIO, JSON ใช้ dumps/loads จริง
- glossary Local **285** รายการ เพิ่มศัพท์ต่อยอด ไม่เพิ่มข้อความยาวข้าง footer counter
- Counter Local: reload token ที่รับแล้วใช้ GET; token เดิมยังไม่หมดอายุไม่เขียน DB; GET cache 30s; cleanup สูงสุดวันละครั้งไม่เกิน 1,000 expired records เมื่อมี token ใหม่; body ไม่เกิน 512 bytes; รับสูงสุด 60 เซสชันใหม่/นาที และ 2,000/วัน UTC; 429/Retry-After พร้อม GET fallback ไม่เก็บ IP
- Migration 0002 เพิ่ม state/trigger ไม่ reset ยอดเดิม apply remote สำเร็จก่อน deploy Function ใหม่
- cap จำกัด token churn/การเขียน ไม่ใช่ rate-limit ทุก HTTP request/DDoS บอตยังกิน Functions/read quota ได้ ยอดอาจนับขาดเมื่อชน cap ต้องพิจารณา WAF/Turnstile ภายหลัง

## หลักฐานตรวจ

- หลัง deploy ตรวจเว็บหลัก: updates.js เป็น 2026.10.04.4, python-next.js ดาวน์โหลดได้ และ GET /api/visits ตอบ HTTP 200 พร้อมยอดจริง ไม่สร้างเซสชันทดสอบใน Production

- tests/python-next.mjs: CPython solutions/assertions/starter failure/metadata/glossary ครบ 13 บทใหม่ผ่าน ไม่รัน Lab เดิมซ้ำ
- tests/visit-counter.mjs: SQLite จริง ตรวจ migration รักษายอดเดิม, dedup zero-write, retention, origin/size/method/token, minute/daily cap, UTC reset และ cache hit ไม่อ่าน DB ผ่าน; tests/visit-client.mjs ตรวจ reload GET/429 fallback/preview read-only ไม่มี remote D1 mutation
- Browser tests/python-next.html: Pyodide ครบ 13 บทใหม่ ผ่าน solution/starter failure/assertions และทุก trace frame สร้าง 3D ได้ ไม่มี trace truncation; หน้า class-object รันจริงผ่านภารกิจและแสดงค่าบนภาพ/ไฮไลต์ editor ตรง ยังไม่ใช่การดูทุกมุม/ทุกจอ
- พบและแก้ผลข้างเคียง CPython 3.12 inlined comprehension ระหว่างอ่าน f_locals ที่ module: ใช้ global namespace ของ module แทน ไม่อ่าน slot ชั่วคราว จึงไม่สร้าง RuntimeWarning ของ row โดย tracer ตัวแปรชั่วคราวใน module comprehension ไม่แสดงเป็นตัวแปร global; ตรวจแก้ด้วยชุดใหม่ ไม่รัน Lab เก่าซ้ำ
- รอบก่อน: Internet placement/alias/progress และ duplicate audit ผ่าน; release 826ca007 ตรวจ version/alias assets บนเว็บจริง รายละเอียดเก่าอยู่ PROJECT-HISTORY.md
- ไม่ตรวจบทเดิมที่เคยผ่านซ้ำเว้นแต่ผู้ใช้สั่ง

## Git/Deploy

- private repo https://github.com/wichitpanw/techatlas · origin/main · baseline ก่อน Network .5 คือ 243d5eb; ดู commit ล่าสุดจาก Git log
- GitHub CLI บัญชี wichitpanw credentials อยู่นอก repo ห้ามพิมพ์ token
- Pages techatlas Git Provider = No ตามการตรวจรอบ push 2026-10-04 จึง deploy แยกจาก Git
- รอบนี้ผู้ใช้อนุมัติแล้ว; รอบถัดไปต้องขออนุมัติใหม่ก่อน commit/push/deploy
- node scripts/prepare-release.mjs สร้าง clean release ตัด AI/Programming drafts ห้าม deploy dist ต้นฉบับ
- หลังอนุมัติ migration: npx --yes wrangler@4.147.0 d1 migrations apply techatlas-visits --remote แล้ว deploy clean release ตาม AGENTS.md

## ไฟล์/ข้อจำกัด

- Entry dist/index.html และ assets/main.js; Network order = network-foundations.js, alias = lesson-aliases.js
- Python curriculum/next/tasks/worker/tracer/scene/visuals/editor อยู่ dist/assets
- Three.js/Pyodide/font ใช้ CDN ยังไม่ใช่เว็บ offline สมบูรณ์
- Progress/drafts ใน browser storage ผูก origin/เครื่อง ล้าง storage แล้วหาย ไม่มี sync
- localhost preview: python3 -m http.server 4174 --bind 127.0.0.1 จาก project เข้า /dist/ และ /tests/python-next.html
- CLOUDFLARE-FREEPLAN.md เป็น quota/snapshot รอบก่อน ไม่ใช่ account usage ปัจจุบัน
- เรียบเรียงอ้างอิงใหม่ ไม่เผยแพร่ PDF/ebook ไม่รับประกันสิทธิ์จากการให้เครดิตอย่างเดียว

## รายละเอียดรุ่น 2026.10.04.5 · เผยแพร่แล้ว

- ผู้ใช้อนุมัติ deploy ด้วยข้อความ “อนุมัติ” หลังสรุปงาน; deploy Cloudflare Pages สำเร็จ 2026-10-04 จากนั้นอนุมัติ commit/push แยกด้วยข้อความ “commit push เลย” ขอบเขต Network .5, tests และเอกสาร ใช้ข้อความ commit `Improve network core lessons and interactive models` ไม่ deploy ซ้ำในรอบ Git
- Network **64** / Python **48** บท / glossary **320** รายการ; Network มี 3D 62 บท อีกสองบทคงเครื่องมือคำนวณ 2D ตามเหตุผลเดิม
- แก้ HSRP normal/failover labels และ Priority ตามบริบท; AWS-style public subnet ขึ้นกับ route ไม่ใช่ instance มี public IP; overlap ให้เห็น host เลือก on-link/ARP; uplink เสียไม่แสดง TCP/TLS พร้อม; NAT และ L4/L7 LB ไม่เหมารวม
- DHCP บทเดิมเพิ่ม DORA ผ่าน relay, T1/T2, renewal/rebinding, expiry/NAK; TCP บทเดิมเพิ่ม sequence/ACK, out-of-order buffer, retransmission, window, FIN/RST พร้อมกล่องช่วง byte ใน 3D แยกยังไม่พร้อม/รอช่องว่าง/พร้อมอ่าน
- DNS บทเดิมเพิ่ม resolver→Root→TLD→authoritative และ cache/errors/AAAA/CNAME/PTR; DNS Cache เพิ่ม elapsed/TTL/negative cache; หมายเลข server/address เป็นข้อมูลจำลอง ไม่ถาม DNS จริง
- เพิ่ม MTU/MSS/PMTUD หลัง TCP ก่อน HTTPS พร้อม 3D byte ruler/MTU boundary, IPv4 DF/IPv6 Packet Too Big และ ICMP filtered black hole; สมมติ first-hop LAN MTU1600, TCP/IP header ไม่มี options ไม่จำลอง PLPMTUD หรือ tunnel overhead ทุกแบบ
- core lessons ใช้ IDs เดิมรักษา progress; ต้องเดินอย่างน้อยสองสถานการณ์จนจบก่อน quiz ผ่าน ไม่ผ่านจากคลิกเปลี่ยน tab อย่างเดียว มีโจทย์/คำศัพท์/guide ใหม่
- tests/network-core.mjs ผ่าน: 36 scenarios ที่แก้/เพิ่ม, 75 TCP window/fault combinations, 80 MTU combinations, DHCP/DNS boundaries และ regression A1–A7/order/glossary
- Browser tests/network-review-20261004.html แบบ ids ตรวจเฉพาะ 11 บทที่แก้: canvas/play/pause/reset/scenario/steps ผ่าน ไม่มี horizontal overflow ที่ iframe1150px; ไม่ตรวจบทที่ไม่ได้แก้ซ้ำ
- Browser tests/network-core-ui.html ตรวจ 5 core lessons ผ่าน: quiz gate, two completed scenarios, custom input/evidence และ MTU invalid bounds; TCP รอบแรก assertion ใช้ข้อความเก่า rwnd=0 แทน Receive window=0 จึงแก้ diagnostic และตรวจเฉพาะ TCP ใหม่ผ่าน รวมตรวจ 3D buffer ก่อนเติมช่องว่าง delivered0/buffer100 และหลังเติม delivered200
- ตรวจภาพ MTU และ TCP byte buffer ด้วยสายตา เก็บภาพ /tmp/techatlas-mtu-20261004.png และ /tmp/techatlas-tcp-20261004.png; แก้ป้าย sidebar core ให้เป็นขั้นการทดลองทั่วไป ไม่ค้างชื่อสถานการณ์แรกเมื่อเลือกกรณีอื่น; ไม่อ้างว่าทุกมุมกล้อง/ทุกจอมือถือผ่าน
- clean release `/tmp/techatlas-release-6vStRI/dist` ตัด AI/Programming draft แล้ว deploy ด้วย Wrangler4.147.0 ไป Pages techatlas branch main; ไม่ทำ D1 migration หรือเปลี่ยน config/แพ็กเกจ
- หลัง deploy ตรวจเว็บหลักแบบ read-only: homepage HTTP200; updates.js, network-core-lessons.js, network-core-models.js, network-mechanism-scene.js, network-foundations.js และ lesson-terms.js HTTP200 และเนื้อหา byte-for-byte ตรง clean release; GET /api/visits HTTP200 ตอบ total/metric ไม่สร้างเซสชันทดสอบใน Production
- รอบ audit ถัดไป Monitoring/FTTH/Wireless และ Provider advanced ยังอยู่ Planned ไม่อ้างว่าหลักสูตรครบมาตรฐานทั้งหมด

## Planned

- Network expert audit baseline .4: 63 หน้า / 146 curriculum states / 121 mechanism scenario builds รายละเอียด `NETWORK-EXPERT-AUDIT-2026-10-04.md`; A1–A7 และกลุ่ม DHCP/TCP/DNS/MTU เผยแพร่ใน .5 แล้ว รอบ Monitoring/FTTH/Wireless และ Provider advanced ยังไม่ทำ
- Diagnostic ใหม่ `tests/network-review-20261004.html`: rendering/controls ของ 63 หน้า ตรวจ iframe 1150px; เครื่องมือรอบแรกมี pause false-positive เมื่อจบอัตโนมัติ แก้ diagnostic และตรวจเฉพาะ 14 หน้าเดิมผ่าน ไม่อ้างว่าทุกมุมกล้อง/มือถือผ่าน ชุด network-quality มี order assertion เก่าที่ต้องปรับตาม curriculum ก่อนใช้เป็น gate

- Python Decorators/abstract classes/NumPy และ runtime server/socket/database ยังไม่ทำ
- Programming JavaScript → TypeScript → Node.js; AI Neural Network → NLP/LLM/RAG/Tool calling ยังพัก
- Network Identity/SSO และ capture drill อยู่แผน Playlist ไม่อ้างว่าอ่านทุกวิดีโอ
- มือถือ/keyboard/reduced-motion/WebGL failure ยังไม่ครบ ต้องขอขอบเขตก่อนตรวจบทเดิมซ้ำ
- WAF/Turnstile/monitoring ยังไม่ตั้งภายนอกหรือเปลี่ยนแพ็กเกจ
