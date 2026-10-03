# TechAtlas

เว็บไซต์ห้องทดลองภาษาไทยสำหรับคนเริ่มต้นในบริษัทโทรคมนาคม เส้นทาง Network → Python → JavaScript → TypeScript/Node.js → AI

## รุ่นแรก

- Network 6 บท พร้อมฉากอุปกรณ์ 3 มิติ หมุน/ซูม ส่ง Packet แก้ Gateway ทดลอง DNS/Protocol และแบ่ง Subnet
- Python 6 บท รันโค้ดจริงด้วย Pyodide ใน Web Worker แสดง error และหยุดโปรแกรมที่เกิน 8 วินาที
- Explore, เส้นทางการเรียน, โปรเจกต์สะสม, พจนานุกรมศัพท์ และความคืบหน้าผ่าน localStorage
- ข้อมูลอุปกรณ์ทั้งหมดเป็นข้อมูลสมมติ ไม่มีระบบบัญชีหรือการเชื่อมต่อบริษัท
- Python สำหรับข้อมูล, JavaScript, TypeScript, Node.js และ AI แสดงเป็นเส้นทางระยะถัดไป ไม่ได้เป็นบทเรียนที่เปิดใช้งานในรุ่นนี้

## เปิดในเครื่อง

```sh
python3 -m http.server 4173 --directory dist
```

เปิด http://localhost:4173/ โดย hash routes ใช้ได้กับ static hosting ไม่ต้องตั้ง server-side rewrite

## แหล่งโหลด

Three.js 0.180.0, Pyodide 0.27.7 และ font โหลดจาก CDN จึงต้องมีอินเทอร์เน็ต โดยมีข้อความเมื่อโหลดแบบจำลองหรือ Python ไม่สำเร็จ โค้ด Python รันใน browser ของผู้เรียน ไม่ส่งโค้ดไปประมวลผลบน server ความคืบหน้าและ draft ผูกกับ browser/origin ที่ใช้

## โครงสร้าง

- `dist/assets/app.js`: บทเรียน UI การทดลอง และความคืบหน้า
- `dist/assets/scene.js`: ฉาก Three.js ของ Client, Switch, Router และ Server
- `dist/assets/python-worker.js`: runtime Python และ scope ใหม่สำหรับแต่ละรอบ

## ตรวจรับ

ตรวจ Network ทั้ง Gateway ผิด/ถูก, DNS ไม่มีชื่อ, Protocol/Port ไม่ตรง, การส่งใน LAN และช่วง subnet /24 /25 /26 ตรวจ Python ทั้งโค้ดถูก, syntax error, ข้อมูลว่าง, key ที่หาย และ infinite loop ตรวจ progress หลัง reload, filter/search, glossary, navigation และ responsive layout
