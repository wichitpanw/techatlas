# TechAtlas — สถานะปัจจุบัน

อัปเดต 2026-10-05 · Warapon Wichitpan · wichitpan.w@gmail.com

อ่าน AGENTS.md ก่อนทำงาน ไฟล์นี้ไม่ใช่อนุมัติ commit/push/deploy ผลตรวจเก่าอยู่ PROJECT-HISTORY.md

## Production

- https://techatlas-aoh.pages.dev · release 2026.10.05.3 · immutable https://78146776.techatlas-aoh.pages.dev
- Network **64** / Python **48** / Programming API **9** บท / พจนานุกรม **372** รายการ
- Internet เหลือบทเดียว ฉากใหม่ 13 จุด เป็นบทสุดท้ายเฟส 4 หลัง Cloud; #lesson/packet ส่งต่อ #lesson/internet และรักษาความคืบหน้า
- ลำดับร่วม Explore/Path/ก่อน–ถัดไป: เฟส 0 → เฟส 1 ขั้น 01–14 → เฟส 2 WAN/Provider/MPLS → เฟส 3 Cloud → เฟส 4 Internet
- Telecom แผนสิบชุดส่งมอบในขอบเขตแบบจำลองแล้ว: CLI/evidence, troubleshooting/repair/retest/rollback, FTTH, subscriber, quality, QoS/video/token bucket, enterprise, BGP, CGNAT/IPv6, NOC
- Network 62 บทมีภาพ 3D; VLSM/IPv6 addressing ใช้เครื่องมือ 2D เพื่อคำนวณตามข้อยกเว้น ไม่จำลองระบบบริษัทจริง
- Python รันจริง Pyodide Worker; Tab/Shift+Tab, trace highlight และจอผลลัพธ์อ่านชัด
- Programming เปิดเฉพาะ API บทนำและ 8 รูปแบบ; บทเว็บ/JS/TS/Node.js เดิมยังไม่เปิด ส่วน AI คงการ์ด 04 กำลังเตรียมบทเรียน ปิด route และไม่รวม draft assets ใน release
- Feedback เตรียม mailto/คัดลอก ไม่มี backend ticket หรืออัปโหลดรูป
- ตัวนับเซสชัน Pages Functions + D1 ไม่เก็บ IP ในโค้ดแอป ไม่มีบัญชีผู้เรียน

## Local · 2026.10.05.4 · ยังไม่อนุมัติ commit/push/deploy

- เพิ่มตัวเลือกความเร็ว 0.5×–2× ใน renderer ที่มี animation ตามเวลา: Network รุ่นเดิม/early labs, shared Network/API/Internet/quality/service mechanisms, OSI, Physical signal และ Python trace replay ใช้นาฬิกาที่ปรับร่วมกับตัวเล่นขั้นตอน ไม่แก้ค่าคำนวณ/latency/ความเร็ว Python runtime
- ภาพ preview การ์ดคงนิ่ง ฉาก foundation แบบคลิกดูโครงสร้าง (Computer/OS, เลขฐาน, devices, encapsulation) ระบุภาพนิ่งและปิด speed control เพราะไม่มี timeline ให้เร่ง ไม่สร้างการไหลที่โมเดลไม่ได้ระบุ เครื่องมือ 2D เดิมยังไม่ใช่ animation 3D
- เปลี่ยนชื่อองค์กร/บริการจริงในสถานการณ์ NT/Social และคำอธิบาย Cloud เป็นตัวอย่างเป็นกลาง เพิ่ม disclaimer footer; ไม่ลบชื่อเทคโนโลยี/แหล่งเอกสารหลักที่จำเป็น ตรวจขอบเขต public release assets ไม่อ้างว่าตรวจ PDF เอกสารภายในหรือประวัติ Git ทั้งหมด และไม่รับประกันความเสี่ยงทางกฎหมายเป็นศูนย์
- `tests/speed-model.mjs` ผ่าน rate boundaries, scheduler 0.5/1/2 และเปลี่ยนความเร็วระหว่างเล่น; `tests/speed-browser.html` ผ่าน shared Network/API clock/pause, OSI progress, early/original Network flight duration, Physical control และ static exceptions, Python synthetic trace replay/pause ไม่รัน Python curriculum ทั้งหมดซ้ำ
- ตรวจหน้า MTU จริงเลือก 0.5× ได้และป้ายไม่บังฉากที่มุมตั้งต้น ภาพ `/tmp/techatlas-speed-public.jpg`; ไม่อ้างว่าทุกบท/ทุกมุม/ทุกอุปกรณ์ผ่าน ตรวจเฉพาะกลไกควบคุมที่แก้
- อัปเดต AGENTS และ CLOUDFLARE-FREEPLAN.md: static requests ไม่จำกัด แต่ตัวนับมี shared Functions quota100,000/day และ admission60/min/2,000/day ไม่ใช่เพดานผู้เรียน ยังไม่ load test หรืออ่าน usage ล่าสุดรวมบัญชี
- clean release `/tmp/techatlas-release-tIiVWR/dist` ตัด draft AI/Programming อื่นตามเดิม syntax/diff ตรวจแยกก่อนส่งงาน Production ยังคง .3 ต้องขออนุมัติใหม่

## 2026.10.05.3 · Flow ต่อเนื่องเสมอ · เผยแพร่แล้ว

- ตามคำขอผู้ใช้ 2026-10-05 นำปุ่มลดการเคลื่อนไหว/เปิดการไหลต่อเนื่องออกจาก shared Network/API renderer และ OSI ให้ flow ต่อเนื่องเสมอ ไม่ขึ้นกับ prefers-reduced-motion; คงเล่น/หยุด/เดินทีละขั้น ภาพ preview การ์ดยังคงนิ่ง ไม่เปลี่ยน OS preference หรือ Python bounce
- อัปเดต AGENTS.md เป็นข้อยกเว้นเฉพาะฉากสื่อกลไกที่ผู้ใช้ขอ และ versioned imports เพื่อไม่ใช้ renderer รุ่นเก่าจาก cache จำนวนบทและโปรโตคอลไม่เปลี่ยน
- ตรวจเฉพาะพฤติกรรมที่แก้ผ่าน `tests/flow-browser.html?only=mtu-pmtud,tcp-handshake,api-rest`: 3 shared scenes + OSI ไหลทันทีโดยไม่คลิก opt-in ไม่มี toggle และ moving/pause/redraw/resume/reset ผ่าน; ไม่ตรวจหลักสูตรทั้งชุดซ้ำ ผลรอบ 57 ฉากเป็นหลักฐานรุ่น .2 ไม่ใช่การตรวจใหม่
- ก่อนเผยแพร่ตรวจ MTU หน้า actual ไม่มีปุ่มสลับโหมด และแสดง footer รุ่น .3; ภาพ `/tmp/techatlas-always-flow.jpg` syntax renderer และ git diff --check ผ่าน
- ผู้ใช้อนุมัติรอบนี้ด้วย “อนุมัติ” หลังคำถาม commit/push/deploy รุ่น .3 วันที่ 2026-10-05; commit `d53c9b8` (`Make interactive flow continuous by default`) push origin/main แล้ว deploy clean release `/tmp/techatlas-release-mRmy0U/dist` ไป Pages techatlas สำเร็จ immutable `78146776` ไม่เปลี่ยน config/D1 และไม่รวม draft AI/Programming อื่น
- หลังเผยแพร่ตรวจเว็บหลัก index/main/updates/network-mechanism-scene/osi-scene/api-lab/network-concepts/style HTTP200 และ byte-for-byte ตรง release; GET /api/visits HTTP200 total ตัวเลข ไม่สร้าง token ทดสอบผ่าน request ตรวจ หน้า Updates Browser จริงแสดงรุ่น .3 และรายการเอาปุ่มออก ใช้ผล QA รอบก่อน ไม่รันบทเดิมซ้ำในรอบ deploy; รอบถัดไปต้องขออนุมัติใหม่

## Flow 3D 2026.10.05.2 · เผยแพร่แล้ว

- คำขอผู้ใช้: ให้ Network ที่กระโดดภาพและ Programming API ไหลต่อเนื่องเหมือนบท `address`; คง renderer เดิมของ address ไม่เปลี่ยนเนื้อหา/โมเดลโปรโตคอลหรือเพิ่มหัวข้อ API
- ปรับ shared mechanism renderer ให้ข้อมูลเดินทางตามเส้นพร้อมป้ายและรอยทาง เรืองแสง; ส่งต่อ hop ที่มี dependency ตามลำดับ ส่วน fan-out อยู่พร้อมกัน ไม่วาด route ที่โมเดลไม่ได้ระบุ
- Player รอเที่ยวข้อมูลและช่วงอ่านก่อนเปลี่ยนขั้น รวมขั้นสุดท้าย; หยุด/เล่นต่อหยุดตำแหน่งจริง และ redraw ขั้นเดิมไม่เริ่มเที่ยวใหม่ Reset เล่นขั้นเดิมซ้ำได้ รวม Internet, quality/QoS, buffer/rate และ OSI; OSI ค่อย ๆ เคลื่อนระหว่าง layer และเปลี่ยนขนาดเชิงสัญลักษณ์
- เวลา animation เป็นเวลาเพื่อการสอน ไม่ใช่ค่า latency จริง; ค่าหลักฐานยังมาจากโมเดลเดิม แท่ง MTU เป็นมาตราส่วน byte ไม่ใช่วัตถุ packet จริง
- พบ browser QA ตั้ง reduced motion: renderer เคยค้างกึ่งกลางขณะขั้นเปลี่ยน เพิ่มปุ่มเปิดการไหลต่อเนื่องแบบ opt-in เมื่อระบบลด motion และปุ่มลดการเคลื่อนไหว เปลี่ยนเฉพาะฉากนั้น ไม่เปลี่ยน OS preference
- ตรวจวันที่ 2026-10-05: `tests/flow-model.mjs` ผ่าน dependency/parallel/model immutability/final dwell/pause/hidden-tab; `tests/flow-browser.html` ผ่าน 57 shared scenes (43 Network mechanisms + 9 API + 2 quality + 2 service + Internet) และ OSI ตรวจ moving/pause/redraw/resume/reset ด้วยข้อมูลตั้งต้น ไม่ใช่ทุก input combination
- API Browser ผ่าน 9 บท × 3 scenarios: controls/evidence/quiz gate/reset; หน้า Network จริงตรวจเฉพาะกลไกที่แก้ 6 หน้า OSI/MTU/Internet/quality/video/rate ผ่าน canvas/play/pause/reset ไม่มี horizontal overflow ที่ iframe1150px ไม่อ้างว่าทุกจอ/ทุกมุมผ่าน
- แก้ versioned imports ของ entry/scene/player/updates เพื่อไม่ให้ preview ใช้ไฟล์เก่าจาก cache; ตรวจ OSI บนหน้า actual ว่ามี motion toggle และ footer รุ่น .2 แล้ว ภาพหลักฐาน `/tmp/techatlas-smooth-flow.jpg`
- ก่อนเผยแพร่สร้าง clean release `/tmp/techatlas-release-Z7ou5Y/dist`; syntax และ git diff --check ผ่าน ผลตรวจข้างต้นเป็นหลักฐานก่อน deploy ไม่รันบทเดิมซ้ำในรอบเผยแพร่
- ผู้ใช้อนุมัติ “commit / push / deploy เลย” วันที่ 2026-10-05; commit `53a34ce` (`Smooth network and API flow animations`) push origin/main สำเร็จ สร้าง release ใหม่ `/tmp/techatlas-release-IEJoUe/dist` แล้ว deploy Cloudflare Pages สำเร็จ immutable `72caf60c` ไม่ทำ D1 migration หรือเปลี่ยน config; draft AI/Programming อื่นยังไม่รวม
- หลัง deploy เว็บหลัก index/main/updates/flow-playback/network-mechanism-scene/osi-scene/api-lab/network-concepts/card-scene HTTP200 และ byte-for-byte ตรง clean release; GET /api/visits HTTP200 มี total ตัวเลข ไม่สร้าง token ทดสอบผ่าน request ตรวจ หน้า Updates ใน Browser จริงแสดง 5 ตุลาคม 2026 รุ่น .2 พร้อมรายการ Flow; การเปิดหน้าเว็บปกติยังใช้ตัวนับตามเดิม
- การอนุมัตินี้ใช้เฉพาะรอบ Flow .2 และเอกสารสถานะการเผยแพร่ รอบแก้ไขถัดไปต้องขออนุมัติใหม่

## รายละเอียดรุ่น 2026.10.04.4 (ประวัติ)

ดู Local prototype API รอบ 2026-10-05 ในหัวข้อท้ายไฟล์; ไม่ใช่สถานะ Production

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

## Local prototype · 2026-10-05 · API-only

- บันทึกการพัฒนาและตรวจรับก่อนเผยแพร่รุ่น 2026.10.05.1; เผยแพร่แล้วตามหัวข้อด้านล่าง ข้อความที่ระบุยังไม่ deploy ในรายการนี้เป็นประวัติ ณ เวลาตรวจ
- Programming เปิดเฉพาะ API **9** บท: basics → REST → GraphQL → gRPC → SOAP → WebSocket → SSE → Long Polling → Webhooks; AI และ draft เว็บ/JS/TS/Node.js ยังไม่เปิด
- Network 64 / Python 48 ไม่เพิ่มหรือลด; API glossary เพิ่ม **52** รายการ รวม Local 372
- แหล่ง reference อ่านคำบรรยาย Instagram AlgoZen แล้วตรวจกลไกกับ MDN/RFC/Fielding/GraphQL/gRPC/W3C/WHATWG/GitHub Docs รายละเอียด API-CONTENT-NOTES.md; ไม่ได้กล่าวว่าอ่าน/ชมวิดีโอครบทั้งหมด
- api-model.js คำนวณ 27 scenarios โดยข้อความ/สถานะ/ผล/ภาพตัวอย่างใช้โมเดลเดียวกัน; ไม่เรียกบริการภายนอก ไม่ encode Protobuf หรือเปิด socket จริง
- ทุกบทมี 3D จาก logical pipeline พร้อมป้ายอ่านชัด, Request/Response/Events, controls เล่น–หยุด–เดิน–เริ่มใหม่, input ที่เกี่ยวข้องกับกรณีนั้น และภารกิจเฉพาะเรื่อง ต้องดูทั้งสามกรณีจนจบก่อน quiz ผ่าน
- renderer ร่วมเพิ่มเฉพาะการรองรับ node.logical และเส้นเชิงตรรกะของ API; ไม่เปลี่ยนกลไก Network และไม่ตรวจ Lab เก่าซ้ำตามกฎ
- tests/api-model.mjs ผ่าน 162 model/input combinations พร้อม invariants เฉพาะ 9 บทใหม่และศัพท์
- tests/api-browser.html ผ่าน 9/9 × 3 scenarios ใน Browser/WebGL จริง: steps ตรง evidence/canvas, play/pause/natural completion, next/previous/reset/view, quiz gate, XML well-formed, SSE เก็บหลาย Events และ output markup เป็นข้อความไม่รัน HTML; ไม่เขียน progress/storage ผู้เรียน
- ตรวจหน้า REST จริงด้วย input ปากกาสีฟ้าได้ JSON ชื่อตรง input; เปิดพจนานุกรมได้ 52 คำในหมวด Programming; Explore เห็น API 9 บท/AI placeholder และลำดับหมวด Network→Python→Programming
- clean release script ผ่าน และเก็บ api-*.js แต่ตัด ai-*.js/programming-*.js ตามเดิม; ต้องสร้าง release ใหม่และขออนุมัติรอบนี้ก่อน Deploy
- Recheck official ตามคำขอผู้ใช้ครบ 8 รูปแบบ (ยังคงบทนำ): แก้ SOAP VersionMismatch ให้ตอบ Fault รูปแบบ 1.1 พร้อม Upgrade; แยก gRPC status/HTTP stream headers ออกจาก application messages; ระบุ Webhook retry เป็นนโยบายจำลองและ GitHub ไม่ retry อัตโนมัติ รายละเอียด/แหล่งหลักใน API-CONTENT-NOTES.md
- หลังแก้ official audit: tests/api-model.mjs ผ่าน 162 combinations และ Browser fixture ผ่าน 9/9 บท × 3 scenarios อีกครั้ง ไม่เขียน progress ผู้เรียน; git diff --check ผ่าน
- ตรวจ GraphQL จริงที่ viewport390px: document scrollWidth375 ไม่ล้นแนวนอน ป้าย Client/Schema/Resolver กว้าง80px และแยกกัน; ตรวจเฉพาะหน้านี้ ไม่อ้างว่าทุกบท/ทุกมุมบนมือถือผ่าน รีเซ็ต viewport แล้ว
- หลักฐานภาพผล Query/Response `/tmp/techatlas-api-official-review.jpg`; clean release รอบล่าสุด `/tmp/techatlas-release-7O8aIt/dist`; ยังไม่มี commit/push/deploy ของ API

## รายละเอียดรุ่น 2026.10.05.1 · เผยแพร่แล้ว

- ผู้ใช้อนุมัติรอบนี้ด้วยข้อความ “commit/push/deploy ได้เลย” วันที่ 2026-10-05 ขอบเขต API ที่ตรวจแล้วและเอกสาร/ชุดตรวจที่เกี่ยวข้อง ใช้ข้อความ commit `Add API lessons and verified interactive simulations`; การอนุมัตินี้ไม่ครอบคลุมรอบถัดไป
- สร้าง clean release `/tmp/techatlas-release-IC9VZw/dist` ตัด AI และ Programming drafts ตามเดิม คง API assets แล้ว deploy ด้วย Wrangler4.147.0 ไป Pages project techatlas branch main สำเร็จ ไม่ทำ D1 migration หรือเปลี่ยน hosting config
- หลัง deploy เว็บหลัก HTTP200 และตรวจ byte-for-byte ของ updates/main/card-scene/api-curriculum/api-model/api-lab/lesson-terms/style/network-mechanism-scene ตรง clean release ทั้งหมด
- GET /api/visits HTTP200 และตอบยอดเป็นตัวเลขโดยไม่สร้าง token ทดสอบ; เปิดหน้า Updates ใน Browser จริงแสดง 5 ตุลาคม 2026 รุ่น2026.10.05.1 พร้อมรายการ API ใหม่ การเปิดเว็บปกติยังใช้ตัวนับตามเดิม
- ใช้หลักฐานทดสอบ API รอบก่อนที่เพิ่งผ่าน 162 combinations และ 27 Browser scenarios ไม่รัน Lab เก่าซ้ำในรอบ deploy

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
