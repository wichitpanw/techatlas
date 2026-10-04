# ตัวนับครั้งเข้าชม

ตัวเลขคือจำนวนเซสชัน ไม่ใช่จำนวนคนจริงหรือผู้ใช้ที่ Online ในขณะนี้
sessionStorage เก็บ UUID สุ่มต่อแท็บ; รีโหลดและเปลี่ยนบทไม่เพิ่มยอดซ้ำ
เมื่อเกิน 30 วัน token เดิมจะถูกนับเป็นเซสชันใหม่ เก็บเฉพาะ token สุ่มและเวลา
ไม่เก็บ IP, อีเมล, ชื่อ, URL ที่อ่าน หรือข้อมูลบริษัท ลบ token ที่เก่ากว่า 30 วัน
แต่เก็บยอดรวมไว้ ไม่มีการกรอง Bot/การจงใจเพิ่มยอด จึงไม่ใช้เป็นตัวเลขตรวจสอบทางธุรกิจ
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
