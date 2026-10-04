# Cloudflare Pages Free plan — ตรวจความเสี่ยง 2026-10-04

## ข้อสรุป

ยังเหมาะกับ TechAtlas ในรูปแบบปัจจุบัน ความเสี่ยงต่ำจากขนาดไฟล์ แต่ API ตัวนับเข้าชมมีโควตา Functions/D1 และใช้ร่วมกับแอปอื่นในบัญชี ไม่ได้ตรวจยอดรวมทุกแอปหรือยืนยัน subscription ของบัญชี รายงานนี้เทียบกับข้อกำหนด Free plan ไม่เปลี่ยน plan/การเรียกเก็บเงิน/ระบบป้องกันบน Production

## สิ่งที่ตรวจจริง

- Deploy 3ef782a7: release 2026.10.04.2, Network 64 บท / Python 35 บท / พจนานุกรม 256 รายการ คงการ์ด Programming/AI กำลังเตรียม ไม่มี draft assets ใน release
- Artifact `/tmp/techatlas-release-d6z2hk/dist`: 38 ไฟล์ ใช้พื้นที่บนดิสก์ประมาณ 816 KB ไฟล์ใหญ่สุด 103,129 bytes
- Functions มีเพียง `functions/api/visits.js`; Wrangler 4.147.0 สร้าง invocation routes แบบ `include: ["/api/visits"]` ใน diagnostic build ตรงกับ source/config ที่ Deploy ไม่เพิ่ม middleware/catch-all
- 3D/Network models/Pyodide รันใน browser; Three.js/Pyodide/font บางส่วนโหลด CDN ภายนอก มีความเสี่ยง CDN/เครื่องผู้เรียนแยกจากโควตา Pages
- `wrangler d1 info techatlas-visits`: 41 kB, rows_read_24h 152, rows_written_24h 156, read_queries_24h 127, write_queries_24h 41 ตัวเลขเป็น snapshot เฉพาะฐานข้อมูลนี้ ไม่ใช่ยอดตามวัน UTC รวมบัญชี

## ลิมิตที่เกี่ยวข้อง

| รายการ | Free plan | ผลกับโครงการ |
|---|---|---|
| Static asset requests | ฟรีและไม่จำกัด เมื่อไม่ invoke Function | หน้าและ assets อยู่นอก generated Function route |
| ไฟล์ | 20,000 ไฟล์ / ไฟล์ละไม่เกิน 25 MiB | 38 ไฟล์ / ใหญ่สุดประมาณ 101 KiB ห่างลิมิตมาก |
| Cloudflare-hosted builds | 500 ครั้ง/เดือน, พร้อมกัน 1 ครั้ง, timeout 20 นาที | ปัจจุบัน Direct Upload ผ่าน Wrangler ไม่มี Git build; อย่าเหมารวมว่าการอัปโหลด CLI ทุกครั้งเป็น hosted build |
| Functions + Workers requests | รวม 100,000/วันในบัญชี | API ตัวนับประมาณหนึ่ง request ต่อการโหลดหน้า; hash navigation ไม่โหลดใหม่ แต่ reload ยังเรียก API |
| Workers CPU | 10 ms ต่อ request | ตัวนับเป็นงานเบาและรอ D1; ยังไม่ได้วัด CPU จริงใน Production |
| D1 | อ่าน 5 ล้านแถว/วัน เขียน 100,000 แถว/วัน | เป็นแถวที่อ่าน/เขียน ไม่ใช่จำนวน queries หรือจำนวนคน |
| D1 storage | 500 MB/ฐาน, รวม 5 GB และไม่เกิน 10 ฐานใน Free account | ฐานตัวนับ 41 kB; ไม่ได้รวมฐาน CCTV/แอปอื่น |

## ความเสี่ยงที่เหลือ

1. Token ใหม่สร้างแถว session + updates counter ผ่าน trigger + indexes จึงใช้หลาย row writes ต่อ session การล้าง token เกิน 30 วันก็ใช้ writes; ไม่สามารถรับรองว่า 100,000 คน/วันจะไม่ชนลิมิตได้
2. มี index บน created_at ช่วย cleanup แต่ทำ DELETE ทุก POST จึงควรประเมินอีกครั้งเมื่อ traffic โต/มี expired sessions มาก
3. ตรวจ Origin และรูป token ไม่ใช่ระบบกัน bot เต็มรูปแบบ ผู้โจมตีสร้าง token ใหม่/ปลอม HTTP Origin แล้วกินโควตาหรือปั่นยอดได้
4. เมื่อ D1 ชน daily quota queries จะล้มเหลวจน reset; โค้ดตัวนับตอบ 503 และหน้าแสดง “ยังไม่พร้อม” ไม่บล็อกบทเรียน Static ที่อยู่นอก Function route Daily reset 00:00 UTC = 07:00 น. ไทย
5. Functions และ D1 มี quota ร่วมบัญชี จึงต้องดู Usage ของแอปอื่นด้วยก่อนสรุปว่าเหลือเท่าไร

## ข้อเสนอ (ยังไม่ได้แก้/Deploy)

- คง Free plan ตอนนี้ ไม่จำเป็นต้องอัปเกรดจาก snapshot นี้เพียงอย่างเดียว
- ดู Workers/Pages requests, CPU errors และ D1 Row Metrics เป็นครั้งคราว โดยเฉพาะหลังประชาสัมพันธ์
- หาก traffic เพิ่ม: ลด POST ตอน reload token เดิม, cache ยอดอ่านแบบมีอายุ, ทำ cleanup เป็นช่วง/จำกัด batch และพิจารณา anti-abuse ที่เหมาะกับ Pages domain ก่อนเพิ่มการพึ่ง API
- อัปเกรดเมื่อยอดใช้ร่วมบัญชีเข้าใกล้ quota หรือมี API จำเป็นเพิ่ม ต้องขออนุมัติเรื่องค่าใช้จ่ายก่อน

## แหล่งข้อกำหนดหลัก

- https://developers.cloudflare.com/pages/platform/limits/
- https://developers.cloudflare.com/pages/functions/pricing/
- https://developers.cloudflare.com/pages/functions/routing/
- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/d1/platform/pricing/
- https://developers.cloudflare.com/d1/platform/limits/

เป็นผลตรวจวันที่ระบุ ข้อกำหนดและยอดใช้งานอาจเปลี่ยน ต้องตรวจใหม่เมื่อเปลี่ยน hosting/backend หรือมี traffic สูงขึ้น
