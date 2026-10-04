# TechAtlas — สถานะปัจจุบัน

อัปเดต 2026-10-04 · Warapon Wichitpan · wichitpan.w@gmail.com

อ่าน AGENTS.md ก่อนทำงาน ไฟล์นี้ไม่ใช่อนุมัติ commit/push/deploy ผลตรวจเก่าอยู่ PROJECT-HISTORY.md

## Production

- https://techatlas-aoh.pages.dev · release 2026.10.04.4 · immutable https://609c43c4.techatlas-aoh.pages.dev
- Network **63** / Python **48** บท / พจนานุกรม **285** รายการ
- Internet เหลือบทเดียว ฉากใหม่ 13 จุด เป็นบทสุดท้ายเฟส 4 หลัง Cloud; #lesson/packet ส่งต่อ #lesson/internet และรักษาความคืบหน้า
- ลำดับร่วม Explore/Path/ก่อน–ถัดไป: เฟส 0 → เฟส 1 ขั้น 01–14 → เฟส 2 WAN/Provider/MPLS → เฟส 3 Cloud → เฟส 4 Internet
- Telecom แผนสิบชุดส่งมอบในขอบเขตแบบจำลองแล้ว: CLI/evidence, troubleshooting/repair/retest/rollback, FTTH, subscriber, quality, QoS/video/token bucket, enterprise, BGP, CGNAT/IPv6, NOC
- Network 61 บทมีภาพ 3D; VLSM/IPv6 addressing ใช้เครื่องมือ 2D เพื่อคำนวณตามข้อยกเว้น ไม่จำลองระบบบริษัทจริง
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

- private repo https://github.com/wichitpanw/techatlas · origin/main · baseline e3dac69 commit/push สำเร็จ
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

## Planned

- Python Decorators/abstract classes/NumPy และ runtime server/socket/database ยังไม่ทำ
- Programming JavaScript → TypeScript → Node.js; AI Neural Network → NLP/LLM/RAG/Tool calling ยังพัก
- Network Identity/SSO และ capture drill อยู่แผน Playlist ไม่อ้างว่าอ่านทุกวิดีโอ
- มือถือ/keyboard/reduced-motion/WebGL failure ยังไม่ครบ ต้องขอขอบเขตก่อนตรวจบทเดิมซ้ำ
- WAF/Turnstile/monitoring ยังไม่ตั้งภายนอกหรือเปลี่ยนแพ็กเกจ
