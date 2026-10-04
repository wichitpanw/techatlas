# TechAtlas — ผลสำรวจเอกสารและแผนปรับเนื้อหา

วันที่: 3 ตุลาคม 2026 · เจ้าของเว็บไซต์: Warapon Wichitpan

## ขอบเขตและสถานะ

พบ PDF 15 เล่ม รวม 2,149 หน้า ใน `../docs/ebook-for-education-main` สกัดข้อความได้ทุกเล่ม สำรวจหัวข้อจากข้อความรายหน้าและอ่านรายละเอียดบางช่วงที่เกี่ยวกับหลักสูตร รวมทั้งตรวจภาพหน้าจริงของ Python รุ่นใหม่ หน้า 230, Python OOP หน้า 25 และ React หน้า 24

นี่คือการสำรวจความครอบคลุมและตรวจประเด็นสำคัญรอบแรก **ไม่ใช่การอ่านละเอียด/ตรวจความถูกต้องครบทุกหน้า หรือรันทดสอบทุกตัวอย่างในหนังสือ** ข้อความไทยบางจุดแยกสระ และ OpenCV/Python OOP มีคำเตือนการสร้างโครงสร้าง PDF กลับใหม่ระหว่างสกัด จึงต้องตรวจภาพต้นฉบับเพิ่มเมื่อใช้รายละเอียดของสองเล่มนี้

เทียบกับข้อมูลหลักสูตรใน `dist/assets/python-curriculum.js`, `python-tasks.js`, `programming-curriculum.js`, `network-curriculum.js` และ `PROGRAMMING-PLAN.md` ไม่ได้ตรวจการแสดงผลทุกบทใหม่ในรอบนี้

เว็บไซต์ที่เผยแพร่ยังไม่เปลี่ยน ไม่เพิ่มภาษาทั้งหมดโดยอัตโนมัติ และไม่ Deploy

### ความคืบหน้าการสร้างชุดแรก

เพิ่มในเว็บฉบับ local แล้ว 3 บท: `membership`, `identity`, `list-copy` ในส่วนต่อยอดหลัง 28 บทเดิม รวมเป็น 31 บท โดยไม่เปลี่ยน ID/ความคืบหน้าของบทเดิม เขียนคำอธิบาย ภารกิจ ตัวอย่าง และชุดตรวจใหม่จากแนวคิดภาษา ไม่คัดเนื้อหา/ภาพจาก PDF

เพิ่ม object identity ใน trace โดยใช้ป้ายรายรอบ ไม่เปิดเผย address; เก็บ reference ระหว่าง trace เพื่อไม่ให้ ID ของออบเจ็กต์ที่ถูกเก็บกวาดนำกลับมาใช้จนภาพเชื่อมผิด บท identity/copy แสดงเส้นชื่อ → ออบเจ็กต์จากข้อมูลรันจริง ภาพ Explore ของสองบทเป็นภาพประกอบ starter ที่ระบุว่าเป็นตัวอย่าง ไม่ใช่ผลรัน

ตรวจ CPython: 60 กรณีผ่าน และ Network 46 บทผ่าน; ตรวจ Pyodide/trace/highlight/renderer 31 บท พร้อม starter ของบทใหม่และ identity ของ alias/copy ผ่าน; ตรวจหน้าบท list-copy ใน desktop และรันเฉลยผ่าน การตรวจมือถือในรอบนี้ยังไม่ยืนยัน เพราะ browser viewport ไม่เปลี่ยนเป็น 390px ตามที่ร้องขอ จึงไม่บันทึกว่าผ่านมือถือแล้ว งาน Function ขั้นต่อยอด/ไฟล์/JSON/OOP และการอ่านละเอียดเอกสารที่เหลือยังอยู่ในแผน

## แหล่งที่มาและสิทธิ์

ชุดเอกสารของ KongRuksiam Studio / KongRuksiam Tutorial: [ต้นทาง](https://github.com/kongruksiamza/ebook-for-education) README ที่อยู่ในเครื่องระบุ **CC BY-NC** ให้ระบุที่มาและห้ามใช้เชิงพาณิชย์ แต่ไม่ได้ระบุเลขเวอร์ชันใบอนุญาต จึงไม่สมมติว่าเป็น CC BY-NC 4.0 ทุกไฟล์ ภาพหรือสื่อภายนอกที่อยู่ในหนังสืออาจมีสิทธิ์แยกต่างหาก

การเปลี่ยนคำหรือแปลใหม่ไม่ได้ทำให้ข้อจำกัดของงานดัดแปลงหายไปโดยอัตโนมัติ ส่วนข้อเท็จจริงและแนวคิดทั่วไปแยกจากรูปแบบการนำเสนอที่มีลิขสิทธิ์ ดู [Creative Commons FAQ](https://creativecommons.org/faq/index.html) นี่เป็นแนวทางลดความเสี่ยง ไม่ใช่การรับรองทางกฎหมาย

แนวทางการสร้างฉบับ TechAtlas:

- ใช้ชุดนี้เป็นรายการตรวจช่องว่าง ไม่คัดข้อความ ภาพ สไลด์ โครงสร้างบทแบบหน้า-ต่อ-หน้า หรือชุดแบบฝึกเดิมมาเปลี่ยนชื่อ
- เขียนจากเป้าหมายการเรียนของเรา แล้วตรวจพฤติกรรมภาษา/API กับเอกสารทางการ ออกแบบข้อมูล โค้ด ภารกิจ คำใบ้ และภาพใหม่
- บันทึกที่มาของแต่ละบทและสิ่งที่นำมาใช้ หากมีการดัดแปลงจริง ต้องให้เครดิตและตรวจเงื่อนไข NC ก่อนเผยแพร่ ไม่ใช่ให้เครดิตแล้วใช้เชิงพาณิชย์ได้
- อย่าอัปโหลด PDF หรือภาพต้นฉบับเข้า `dist` ไม่ใช้นาม Warapon Wichitpan อ้างสิทธิ์เหนือเอกสารของผู้อื่น
- ก่อนใช้เนื้อหาดัดแปลงในงานบริษัท ระบบเสียเงิน หรือโครงการเชิงพาณิชย์ ให้ยืนยันสิทธิ์กับเจ้าของงาน การเปิดอ่านฟรีอย่างเดียวไม่ยืนยันว่าเป็น noncommercial

## เปรียบเทียบทั้งชุด

| เอกสาร | หน้า | สิ่งที่พบจากการสำรวจ | สถานะ/ข้อเสนอสำหรับ TechAtlas |
|---|---:|---|---|
| Python อัปเดตล่าสุด | 284 | พื้นฐาน, String/Collection, identity/membership, match-case, Function/default/args/kwargs, Scope, Exception, Module | 28 บทเดิมครอบคลุมพื้นฐานจำนวนมากแล้ว; เพิ่มบทแยกเรื่องการอ้างถึงข้อมูล, membership, Function ขั้นต่อยอด และ match-case ไม่ยัดทั้งหมดในบทเดิม |
| Python OOP | 40 | Class/Object, self, initializer, Attribute/Method, Class/Instance variable, Inheritance, super, __str__, Polymorphism | ยังไม่มีชุด OOP; ทำหลัง Function/Collection พร้อมตรวจความหมาย underscore และการเรียกเมธอดใหม่ |
| HTML/CSS/JavaScript ฉบับ 2020 | 154 | HTML/semantic/form, responsive, Flex/Grid, selector, transform/animation, JSพื้นฐาน, Array/Object, DOM/Event | มี 6 บทแรกเท่านั้น; เติม HTML semantic/accessibility, Form, Responsive, Flex/Grid แล้วต่อ JS ตามแผน ไม่ใช้เทคนิคตกแต่งแทนหลักการ |
| JSON | 29 | Data type, Object กับ JSON text, parse/stringify | เพิ่มหลัง Object ก่อน Fetch; ตรวจ JSON syntax จริง และแสดงการแปลง text ↔ value |
| Node.js | 198 | Async/Event loop, Callback/Promise, Module, File, HTTP, Express, Template, Form, MongoDB, Cookie/Session | ยังเป็นแผน; เริ่ม runtime/module/async/HTTP/API ก่อน framework/database/auth; ใช้ SQLite ชุดแรกตามแผนเรา MongoDB เป็นทางเลือก |
| React v17 | 67 | Component/JSX, Props/Keys, State/Hooks, Effect/Context/Reducer, Router, ReactDOM.render | ยังไม่อยู่ในชุดแรก; ทำหลัง JS DOM/Modules/Async และ TypeScriptเบื้องต้น ตรวจ APIs/เครื่องมือปัจจุบัน ไม่ทำตาม setup v17 ตรง ๆ |
| VS Code | 139 | UI, Command Palette, File/Folder, Editor, Workspace, Search, Terminal, Extension, Profile | เพิ่มชุด “เริ่มใช้เครื่องมือจริง” แยกจากห้องทดลองเว็บ ให้ผู้เรียนรู้ไฟล์/โฟลเดอร์/บันทึก/รัน/อ่าน Error ก่อนเรื่องแต่ง UI |
| Git/GitHub | 145 | Version control, Working tree/Stage/Commit, Diff/Log, Reset, Branch, Remote/Push/Pull/Clone | ย้ายพื้นฐานเข้าต้นหลักสูตร ไม่รอหลัง Backend; Git ขั้นทีมค่อยเรียนภายหลัง เน้น diff/commit/revert และความเสี่ยงคำสั่งล้างงาน |
| Flask | 20 | Client/Server, Route, Status, Template/Jinja, Inheritance | ทางเลือก Python Web หลังพื้นฐาน Python และ HTTP; ใช้ server สำหรับพัฒนาเฉพาะ local ไม่สอนว่า built-in server พร้อม production |
| Docker | 428 | Deployment/VM/Container, Image/Registry, Dockerfile/Layer, Ports, Ignore, Compose, MongoDB, Volume | ทำหลังสร้างบริการได้แล้ว; เห็น image/container/port/volume ต่างกันผ่านสถานการณ์ ไม่ยกหลักสูตร 428 หน้ามาเป็นด่านเริ่มต้น |
| Prompt Engineering | 177 | AI/ML/DL/LLM, Token, ข้อจำกัด, Task/Context/Examples/Format, Zero/One/Few-shot, CoT | สร้างหมวด AI อิสระ เน้นข้อมูลต้นทาง, เกณฑ์วัด, ความปลอดภัย และการเปรียบเทียบผล ไม่รับรองว่า prompt ดีทำให้คำตอบถูก |
| OpenCV/Python | 65 | Color/Pixel, Threshold, Morphology, Kernel/Convolution, Blur, Edge, Contour | ทางเลือก Computer Vision หลัง Python data/array; ต้องสอน NumPy/image array ก่อน ไม่เหมารวม image processing ทุกอย่างเป็น ML |
| C | 255 | Compiler, Input/Output, Variables, Operators, Control flow, Array, Function, Pointer, Structure | ทางเลือก Systems Programming ภายหลัง ไม่บังคับก่อน JS/AI; หากทำต้องมี compiler จริงและภาพ memory ที่แยกแบบจำลองจาก address จริง |
| Java OOP | 39 | Class/Method, Modifier, Constructor, this/super, static/final, Inheritance, Abstract/Interface | ทางเลือกแยกภาษา Java ไม่ใช่ JavaScript; เอกสารเน้น OOP จึงยังต้องออกแบบพื้นฐานภาษา/เครื่องมือก่อน |
| PHP | 109 | Output, Variables/types, Operators, Control flow, Function, Array, String, Number/Date | ทางเลือก Web Backend อีกสาย ไม่แทรกในเส้นทาง Node.js ชุดแรก |

ชุดนี้ไม่มีเล่ม Network โดยตรง และไม่มี TypeScript โดยเฉพาะ จึงไม่ใช้เป็นหลักฐานว่า Network/TypeScript ของเราครบหรือถูกต้อง ต้องตรวจเอกสารเฉพาะด้านต่อ

## สิ่งที่ต้องตรวจ/อธิบายใหม่ ไม่ยกตามหนังสือ

1. **Python identity:** หน้า 230 ใช้คำอธิบายสั้นที่อาจทำให้เข้าใจว่า `is` เทียบค่าเหมือน `==` ฉบับเราต้องแยก “ค่าเท่ากัน” กับ “ออบเจ็กต์เดียวกัน” และทดลองกับ List ไม่พึ่งพา caching ของเลขจำนวนเต็ม ดู [Python Expressions](https://docs.python.org/3/reference/expressions.html#is)
2. **Python OOP:** หน้า 25 อธิบาย `_`/`__` ในลักษณะ access control ฉบับเราต้องสอน `_name` เป็น convention และ `__name` เกี่ยวกับ name mangling ไม่ใช่ security boundary แบบ Java ดู [Python Classes](https://docs.python.org/3/tutorial/classes.html#private-variables) ไม่ใช้ `__del__` เป็นหลักรับประกันการปิดไฟล์
3. **Node.js:** ช่วงหน้า 27–49 ย่อ single-thread/event loop มาก ฉบับเราต้องแยก JavaScript callback, OS I/O และ worker pool; ลูปคำนวณหนักหรือ API แบบ sync ยังบล็อกได้ ไม่แสดงว่า event loop ส่งงานหนักทุกชนิดออกไปเอง ดู [Node.js: Don't Block the Event Loop](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop)
4. **React:** หน้า 24 ใช้ `ReactDOM.render` ซึ่งเป็นเนื้อหารุ่นเก่า บทใหม่อ้าง [createRoot](https://react.dev/reference/react-dom/client/createRoot) และ [Installation](https://react.dev/learn/installation) ตามรุ่นที่เลือกทดสอบ ไม่ประกาศว่า class component ทั้งหมดใช้ไม่ได้
5. **JSON:** ต้องเห็น JSON เป็นข้อความ ไม่ใช่ใช้ `let` ในไฟล์ JSON; boolean ใช้ `true`/`false`, ไม่มี function/comment/trailing comma ใน JSON มาตรฐาน แยก parse failure จากข้อมูลไม่ตรง schema ดู [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259)
6. **Flask:** ข้อดี built-in server ในเล่มหมายถึงความสะดวกพัฒนา ไม่ใช่ deployment จริง ดู [Deploying to Production](https://flask.palletsprojects.com/en/stable/deploying/)
7. **Docker:** แยก Image กับ Container ที่หยุดอยู่ ไม่สอนว่าเมื่อหยุดแล้วกลายเป็น Image; `EXPOSE` ไม่ได้ publish port เอง และ `-p HOST:CONTAINER` ต้องอ่านจากฝั่งที่เชื่อมต่อ ดู [Publishing ports](https://docs.docker.com/get-started/docker-concepts/running-containers/publishing-ports/)
8. **AI:** Token ไม่เท่ากับคำเสมอ; คำตอบที่อธิบายดูดีไม่เป็นหลักฐานความถูกต้อง; แยกโมเดลพื้นฐานจากระบบที่มีเครื่องมือค้นข้อมูล ไม่อ้างว่าทุก AI รู้/ไม่รู้ข่าวล่าสุดเหมือนกัน

ประเด็น 1–4 ตรวจรายละเอียดต้นฉบับแล้ว ไม่ใช่ข้อสรุปว่าหนังสือทั้งหมดผิด ประเด็นอื่นเป็นข้อควรระวังสำหรับผู้เขียนบทใหม่ ต้องรันตัวอย่างก่อนใช้งานจริง

## ลำดับทำต่อที่เสนอ

### P1 — เติมพื้นฐานที่ใช้ทันที

- คง 28 บท Python เดิมและชื่อบทที่มีความคืบหน้าอยู่ ไม่ย้าย IDs
- Python: แยก String ให้มี format/precision และ slicing; แยก Tuple กับ Set หากโจทย์รวมทำให้สับสน; เพิ่ม `in`, `==`/`is`, reference/copy, default/keyword arguments
- Programming: ทำบท 7–12 ตามแผนเดิมให้จบก่อนเพิ่ม framework
- เพิ่ม DevTools/VS Code/Terminal และ Git พื้นฐานเป็นหมวดเครื่องมือที่เลือกเรียนได้ตั้งแต่ต้น ไม่บังคับติดตั้งเพื่อทำ Python ในเว็บ
- ขยาย HTML/CSS ด้วย semantic element, label/form, keyboard/accessibility, responsive, Flexbox และ Grid

### P2 — Python ขั้นต่อยอด (ไม่ได้อ้างว่าทุกหัวข้ออยู่ใน ebook)

1. Function: default/keyword arguments → unpacking → `*args`/`**kwargs`
2. List/Dictionary comprehension หลังผู้เรียนใช้ Loop ได้แล้ว
3. ไฟล์ข้อความ + `with` + encoding + error handling
4. CSV/JSON และการตรวจข้อมูลเสีย/ข้อมูลไม่ครบ
5. แยก module/package, virtual environment, pip, dependency reproducibility
6. ทดสอบ Function ด้วยข้อมูลหลายชุด แล้วจึง `assert`/unit test
7. OOP: Class/Object → self/initializer → Instance/Class variable → Method → composition → inheritance/super → polymorphism
8. `match-case` เป็นบทเลือกหลัง Collection ไม่ใช่สิ่งจำเป็นก่อน if/else
9. โปรเจกต์ “บันทึกค่าใช้จ่ายส่วนตัว” โหลดข้อมูล กรอง สรุป และ export โดยไม่ผูกกับ Network

ไฟล์/CSV/JSON/venv/testing เป็นช่องว่างที่เราเสนอเพิ่มเอง ไม่ใช่อ้างว่าเล่ม Python 284 หน้าครอบคลุมทั้งหมดแล้ว ก่อนสร้าง lab ต้องรองรับไฟล์เสมือน/นำเข้า/ส่งออกจริง ไม่แสดงว่ากำลังเขียนไฟล์ลงเครื่องผู้ใช้หากยังไม่ได้ทำ

### P3 — Programming ตามเส้นทางเรา

DOM/Form/Validation → JSON → Modules → Promise/Async/Fetch (Loading/Empty/Error) → TypeScript → Node.js/HTTP → API/Validation/SQLite → Testing/Security/Deployment

React เป็นทางเลือกหลังพื้นฐานเว็บและ JavaScript ไม่ใช่แทนการเรียน DOM ส่วน Cookie/Session/Auth เป็นส่วนขยายหลัง API และ security ไม่เริ่มด้วยระบบ login ก่อนเข้าใจ HTTP

### P4 — หมวดขยายอิสระ

- AI: เข้าใจโมเดล/ข้อจำกัด → prompt ที่ระบุงาน/ข้อมูล/รูปแบบ → ทดลองเทียบผล → structured output → source grounding → evaluation → API integration
- OpenCV: image array/NumPy → pixel/color → threshold → morphology → filter/edge/contour
- Flask: ทางเลือก Python Web; Docker: ทางเลือก runtime/deployment หลังทำบริการสำเร็จ
- C/Java/PHP: เก็บใน backlog ยังไม่เพิ่มเป็นด่านบังคับหรือสร้างการ์ดที่เปิดแล้วไม่มีบทจริง

## รูปแบบบทฉบับของเราและเกณฑ์ตรวจรับ

ทุกบทต้องระบุ: ทำอะไร → แก้ส่วนไหน → ใช้ข้อมูลอะไร → ผลที่คาดหวัง → ผ่านเพราะอะไร → ทดลองต่ออย่างไร ข้อมูล/โค้ดเริ่มต้นต้องเพียงพอแม้เปิดเรียนแยกบท

Interactive ต้องสื่อกลไกของหัวข้อนั้น:

| กลไก | ภาพ/การโต้ตอบ | สิ่งที่ต้องตรวจจริง |
|---|---|---|
| Reference/Copy | ชื่อสองชื่อชี้ออบเจ็กต์เดียวกัน แล้วแยกสำเนา | ค่าและผล mutation จาก Python จริง ไม่ใช้ address สมมติอ้างเป็น memory จริง |
| Function | ส่ง argument → local scope → return | เรียกหลายอินพุตและตรวจ returned value ไม่ตรวจแค่ print |
| JSON | ข้อความ → parse → tree/value และสถานะผิดพลาด | parser จริงกับ malformed JSON และชนิดข้อมูล |
| Git | Working tree → Stage → Commit และ diff | ถ้าเป็น simulator ให้ระบุ ไม่อ้างว่ารัน Git จริง |
| CSS layout | การ์ด/กล่องขยับตาม viewport, Flex/Grid | Browser layout จริงและขนาดจอเล็ก |
| Async | Pending → fulfilled/rejected + timeline | ผลลัพธ์และลำดับจาก runtime; ไม่อ้างว่า async คือ parallel เสมอ |
| Docker | Image/Container, host/container ports, persistent volume | แบบจำลองต้องระบุขอบเขต ถ้ามี terminal ต้องรันใน sandbox ที่เหมาะสม |
| AI | เทียบคำตอบกับข้อมูลและ rubric | จำลอง/คำตอบตัวอย่างต้องติดป้าย ไม่ทำ animation อ้างว่าเรียกโมเดลจริง |

ทุกบทใหม่มี starter ไม่ผ่าน, solution ผ่าน, edge/error case, คำใบ้ที่ไม่เปลี่ยนโจทย์, ภาพ Explore ตรง lab, สถานะรอ/สำเร็จ/ผิดพลาด และทดสอบ UI มือถือ/desktop การทำ 3D เป็นวิธีอธิบาย ไม่ใช่เกณฑ์ให้ใส่ทุกบทแม้ทำให้อ่านผลยาก

## งานที่ยังเหลือในการอ่านละเอียด

- อ่านเนื้อหาที่เหลือครบทุกหน้าโดยแบ่งเป็นชุด และตรวจภาพหน้าที่ข้อความสกัดไม่พอ โดยเฉพาะ Git/VS Code/C ซึ่งมีสไลด์ภาพจำนวนมาก
- รันตัวอย่างที่เลือกใช้ด้วย runtime version ที่กำหนด; ตรวจ modern APIs ของ React/Node/framework และ Python tracer ก่อนเพิ่มไวยากรณ์ใหม่
- ตรวจสิทธิ์ระดับไฟล์/ภาพที่เลือกอ้างอิง และยืนยันรูปแบบการใช้เว็บไซต์ก่อนดัดแปลงงาน CC BY-NC
- ทำบทใหม่ตาม P1 ทีละชุดพร้อมทดสอบ ไม่ถือว่า roadmap นี้คือบทเรียนที่เปิดใช้งานแล้ว
