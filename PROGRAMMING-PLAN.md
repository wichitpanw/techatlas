# แผนหมวด Programming

สถานะ: ชุดแรก 6 บทขึ้น Cloudflare Pages แล้วหลังผู้ใช้อนุมัติ 3 ตุลาคม 2026
ตรวจการแสดงผลขนาด 390px/1440px และแก้ HTML ในคำอธิบายกับการวัด CSS ก่อน Deploy

## สิ่งที่ทำแล้ว

- หมวด Programming แยกจาก Network/Python: Explore, เส้นทางเรียน, ค้นหา, ความคืบหน้าและพจนานุกรม
- เว็บหนึ่งหน้า: Request/Response จำลอง, 200/404, HTML/CSS/JS และภารกิจท้ายบท
- HTML/CSS: หน้าเว็บจริงใน Sandbox, ตรวจ Element และขนาด Box Model ที่ Browser คำนวณจริง
- JavaScript: ตัวรับ click และสถานะบนหน้าจอจริง, Console, ตัวแปรและชนิด, ตรวจช่วงคะแนนหลายค่า
- ทุกบทมีภารกิจเฉพาะ, โค้ดเริ่มต้น, คำใบ้, เฉลย, Feedback; บันทึก Draft ในเครื่อง
- JavaScript ตัวแปร/เงื่อนไขใช้ Worker จำกัด 2 วินาที; บท DOM ใช้ iframe แยก origin และไม่มีตัวตัดลูปของโค้ด DOM จึงยังไม่ใช้บทนี้สอน Loop
- ยังไม่มี JavaScript trace/highlight อัตโนมัติ; ไม่อ้างว่ามี 3D ในบทที่เป็น Live Preview
- ตรวจรับ: tests/programming-interactive.html และคลิกจริงในบท web-javascript

## ชุดถัดไปหลัง 6 บทแรก

7. Operator และการแปลงชนิด (ระวัง String + Number และ ===)
8. Loop: for/while พร้อมตัวนับรอบและหยุดลูปที่ไม่จบใน Worker
9. Function: Parameter/Argument/Return และทดสอบค่าอื่น
10. Array: Index, push, map/filter แบบเริ่มต้น
11. Object: Property และรายการงานหลายฟิลด์
12. Mini-project: สรุปรายการงานจาก Array/Object ให้เป็นผล Console

แล้วจึงขยาย DOM/Event/Form/Validation/LocalStorage ตามเฟส 2

## หลักการ

ผลสำรวจชุดเอกสารเพิ่มเติมและข้อควรระวังเรื่องสิทธิ์อยู่ใน [CONTENT-AUDIT.md](CONTENT-AUDIT.md) (3 ตุลาคม 2026): สำรวจ 15 เล่ม ไม่ใช่ตรวจทุกหน้า/ตัวอย่างครบแล้ว ใช้เป็นรายการตรวจช่องว่าง ไม่คัดลอกบท ภาพ หรือแบบฝึกเดิมมาเปลี่ยนชื่อ

เพิ่มเติมลำดับ: ให้ Git/VS Code/Terminal พื้นฐานเป็นบทเครื่องมือเลือกเรียนได้ตั้งแต่ต้น ส่วน Git ขั้นทีม/Testing/Security ยังอยู่ช่วงท้าย ขยาย HTML semantic/accessibility/Form และ CSS Responsive/Flex/Grid ก่อน framework; React/Flask/Docker เป็นทางเลือกหลังพื้นฐาน ไม่เพิ่ม C/Java/PHP เป็นด่านบังคับ ส่วน TypeScript ต้องใช้เอกสารเฉพาะ เพราะชุดนี้ไม่มีเล่ม TypeScript

หมวดอิสระ เริ่มได้โดยไม่ต้องผ่าน Network หรือ Python ลำดับ JavaScript → TypeScript → Node.js ใช้แอปจัดการงานส่วนตัวเป็นโปรเจกต์สะสม แต่ทุกบทมีโค้ดและข้อมูลตั้งต้นสำหรับเรียนแยกได้ AI เป็นอีกหมวด ไม่ใช่เงื่อนไขในการเรียน

## ลำดับเนื้อหา

0. เข้าใจเว็บ: Browser/Server, HTML, CSS, JavaScript, Console, DevTools
1. JavaScript พื้นฐาน: ตัวแปร ชนิดข้อมูล Operator เงื่อนไข Loop Function Array Object
2. เว็บที่โต้ตอบได้: DOM Event Form Validation LocalStorage
3. ข้อมูลและงานเบื้องหลัง: JSON Modules Promise Async/Await Fetch Loading/Empty/Error
4. TypeScript: Inference Type Interface Union Optional Narrowing Generic เบื้องต้น
5. Node.js: Runtime npm package.json Modules File system Environment variable HTTP Server
6. Backend/ฐานข้อมูล: REST CRUD Validation Status code SQLite SQL Parameterized query
7. วิธีทำงานนักพัฒนา: Git Debugging Unit/Integration test Security พื้นฐาน Deployment

Login และสิทธิ์เป็นส่วนขยายหลังเฟส 7

## ชุดแรก 6 บท

1. เว็บหนึ่งหน้าเกิดขึ้นได้อย่างไร
2. HTML: จัดโครงสร้างหน้าเว็บ
3. CSS: จัดหน้าตาและ Box Model
4. JavaScript: ทำให้หน้าเว็บตอบสนอง
5. ตัวแปรและชนิดข้อมูล
6. เงื่อนไข: ให้โปรแกรมเลือกทำงาน

## Interactive และการตรวจรับ

- HTML/CSS: แก้โค้ดแล้วหน้าเว็บเปลี่ยนพร้อมชี้องค์ประกอบ
- ตัวแปร: เห็นชื่อ ค่า ชนิด และการเปลี่ยนแปลง
- เงื่อนไข/Loop: ไฮไลต์บรรทัดและค่าต่อรอบ
- Function: Argument → การทำงาน → Return
- DOM/Event: เชื่อมเหตุการณ์กับโค้ดที่ทำงาน
- Async/Fetch: ลำดับรอ สำเร็จ ล้มเหลว และ await
- TypeScript: แยกการตรวจชนิดก่อนรันจากผล runtime
- API/ฐานข้อมูล: Request Response ข้อมูลก่อน–หลัง
- ใช้ 3D เมื่อช่วยอธิบาย ไม่ใช้ภาพหรือ animation ซ้ำทุกบท
- ระบุเมื่อเป็นการจำลอง ให้ภาพตัวอย่างตรงกับ Interactive จริง
- ภาษาไทย ตัวอย่างแก้ได้ ภารกิจ คำใบ้ Feedback ความคืบหน้าในเครื่อง
- ทำ JavaScript ให้ครบก่อน TypeScript/Node.js
- ตรวจตัวอย่างในเครื่อง และขออนุญาตผู้ใช้ก่อน Deploy ทุกครั้งตาม AGENTS.md
