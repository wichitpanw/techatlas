# ตัวนับครั้งเข้าชม

ตัวเลขคือจำนวนเซสชัน ไม่ใช่จำนวนคนจริงหรือผู้ใช้ที่ Online ในขณะนี้
sessionStorage เก็บ UUID สุ่มต่อแท็บ; รีโหลดและเปลี่ยนบทไม่เพิ่มยอดซ้ำ
เมื่อเกิน 30 วัน token เดิมจะถูกนับเป็นเซสชันใหม่ เก็บเฉพาะ token สุ่มและเวลา
ไม่เก็บ IP, อีเมล, ชื่อ, URL ที่อ่าน หรือข้อมูลบริษัท ลบ token ที่เก่ากว่า 30 วัน
แต่เก็บยอดรวมไว้ Production เดิมยังไม่มี admission cap จึงไม่ใช้เป็นตัวเลขตรวจสอบทางธุรกิจ
ถ้า storage ใช้ไม่ได้จะอ่านยอดอย่างเดียว ไม่เพิ่มยอดซ้ำจากการรีโหลด

## เปิดใช้หลังเจ้าของอนุมัติ

เปิดใช้งานแล้วบน Cloudflare Pages หลังเจ้าของอนุมัติ 3 ตุลาคม 2026
สร้าง D1 `techatlas-visits`, ผูก `VISITS_DB`, ใช้ migration และ Deploy สำเร็จ
Production: https://techatlas-aoh.pages.dev/ · deployment b18f7b02
ตรวจ GET API และรีโหลดแท็บเดิมแล้ว ยอดไม่เพิ่มซ้ำ

1. สร้าง D1 ชื่อ `techatlas-visits` ในบัญชี Cloudflare ของเจ้าของ
2. เพิ่ม `d1_databases` ใน wrangler.jsonc: binding `VISITS_DB`, database_name
   `techatlas-visits`, database_id จากผลการสร้าง, migrations_dir `migrations`
3. ใช้ `wrangler d1 migrations apply techatlas-visits --remote` เพื่อสร้าง schema
4. Deploy Pages ด้วยคำสั่งใน AGENTS.md เมื่อได้รับอนุญาตเท่านั้น
5. GET `/api/visits` ต้องคืน `{total:..., metric:"sessions"}` และ footer แสดงยอด

Pages Functions อยู่ใน functions/api/visits.js; เผยแพร่เฉพาะ route `/api/visits`
ไฟล์ migration และเอกสารไม่อยู่ใน dist จึงไม่อัปโหลดเป็นเนื้อหาสาธารณะ
Client เพิ่มยอดเฉพาะ techatlas-aoh.pages.dev; ถ้าเพิ่ม Custom Domain ต้องปรับ
allowlist ก่อน ตัวอย่างและ Preview อ่านยอดอย่างเดียว API เป็นสาธารณะสำหรับ
ตัวนับ anonymous; Origin check ป้องกัน browser cross-site แต่ไม่ป้องกัน bot

ตรวจในเครื่อง: `node tests/visit-counter.mjs` ใช้ SQLite จริงในหน่วยความจำ
ก่อนผูก D1 หน้าเว็บจะแสดง "ยังไม่พร้อม" ไม่ใช้ตัวเลขจำลองแทนยอดจริง

## Local รอบปรับปรุง 2026-10-04 — ยังไม่เผยแพร่

- Client บันทึก token/time ที่ server รับสำเร็จใน sessionStorage จากนั้น reload ใช้ GET สูงสุด 30 วัน ลด POST ซ้ำ หาก admission เต็มอ่านยอดผ่าน GET แทน ไม่หมุน token หรือ retry อัตโนมัติ
- GET Cache API และ browser อายุ 30 วินาที ยอดอ่านอาจล้าหลังไม่เกินอายุ cache แต่ POST สำเร็จคืนยอด DB ในขณะนั้น
- token เดิมใน 30 วันไม่เขียนฐานข้อมูล; cleanup วันละครั้งไม่เกิน 1,000 records เฉพาะ token ใหม่ มี indexed created_at อาจยังเหลือ expired records ใน backlog แต่ token ที่ใช้อีกหลัง 30 วันลบเฉพาะตัวและนับใหม่ได้
- ขนาด body ไม่เกิน 512 bytes อ่าน stream แบบจำกัด; Origin/JSON/UUID ตรวจเหมือนเดิม
- จำกัด admission แบบรวมทั่วเว็บ 60 เซสชันใหม่/นาทีและ 2,000/วัน UTC ไม่ใช่ต่อ IP; ไม่เก็บ IP หรือ identifier ใหม่ ขีดจำกัดอาจทำให้ผู้ใช้จริงนับขาดเมื่อเข้าพร้อมกันมาก
- INSERT แบบมีเงื่อนไขใน transactional batch และ trigger daily budget จำกัดการหมุน UUID โดยไม่มี race check-then-insert ภายนอก transaction
- ยังไม่ป้องกันทุก request/DDoS หรือการกิน Functions/D1 read quota ต้องใช้การป้องกัน edge เพิ่มเมื่อจำเป็น ไม่อ้างว่าเป็นระบบ analytics แม่นยำ
- ก่อน deploy ต้องอนุมัติและ apply migration 0002_counter_maintenance.sql กับ D1 เดิม ไม่ reset ตาราง sessions/totals; ห้าม deploy Function ใหม่ก่อน schema พร้อม
- ผลตรวจ SQLite + mock client ใน tests/visit-counter.mjs และ tests/visit-client.mjs ผ่าน ไม่ใช่การวัด CPU/quota Production
