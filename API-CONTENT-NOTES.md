# Programming · API เท่านั้น

วันที่ 2026-10-05 · เผยแพร่รุ่น 2026.10.05.1 หลังผู้ใช้อนุมัติ commit/push/deploy · รายละเอียด deployment ใน context.md

## ขอบเขต

เปิดเฉพาะ 9 บท: พื้นฐาน API → REST → GraphQL → gRPC → SOAP → WebSocket → SSE → Long Polling → Webhooks แบ่งเป็นพื้นฐาน, Contract และ Events ไม่เปิดบท HTML/CSS/JavaScript/TypeScript/Node.js เดิมหรือ AI

ผู้เริ่มต้นอธิบายได้ว่าใครเริ่มส่ง ข้อตกลงกำหนดอะไร ส่งกลับกี่ข้อความ เมื่อใดการสื่อสารจบ และกรณีล้มเหลวมีหลักฐานอะไร ทุกบทมี 3 สถานการณ์ ภารกิจเฉพาะเรื่อง และต้องเดินทั้งสามกรณีจนจบก่อนตอบ quiz เพื่อบันทึกผ่าน

## การใช้ reference

อ่านคำบรรยายโพสต์ AlgoZen https://www.instagram.com/p/Dd_26udtoec/ ซึ่งกล่าวถึง 8 รูปแบบ ไม่ได้ยืนยันว่าเปิดดูวิดีโอครบทุกเฟรม ไม่ดาวน์โหลด/นำวิดีโอ ภาพ เสียง หรือข้อความต้นฉบับมารวมใน release

นำหัวข้อมาออกแบบโจทย์ร้านเครื่องเขียนของเรา กลไกและคำอธิบายภาษาไทยเขียนใหม่ ตรวจข้อเท็จจริงกับแหล่งหลัก หลีกเลี่ยงการเหมารวม GraphQL ไม่ over-fetch/เร็วเสมอ, gRPC เร็วที่สุด, SOAP ปลอดภัยโดยตัวมันเอง และระบุว่า 8 รูปแบบมี taxonomy ต่างกันและใช้ร่วมกันได้

## เอกสารหลักที่ใช้

- API: https://developer.mozilla.org/en-US/docs/Glossary/API
- HTTP methods/status: https://datatracker.ietf.org/doc/html/rfc9110
- REST architecture: https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm
- GraphQL schema/response: https://graphql.org/learn/ และ https://graphql.org/learn/response/
- gRPC calls/stream/deadline: https://grpc.io/docs/what-is-grpc/core-concepts/
- SOAP 1.2 Envelope/Fault: https://www.w3.org/TR/soap12-part1/
- WebSocket handshake/messages: https://www.rfc-editor.org/rfc/rfc6455
- SSE EventSource/reconnect: https://html.spec.whatwg.org/dev/server-sent-events.html
- Long polling: https://www.rfc-editor.org/rfc/rfc6202
- Webhooks producer/receiver: https://docs.github.com/en/webhooks/about-webhooks

## สิ่งที่จำลองและสิ่งที่ไม่ได้ทำ

- api-model.js เป็นแหล่งข้อมูลเดียวสำหรับขั้นตอน ผล Request/Response สถานะ และภาพตัวอย่าง; ไม่เรียก API ภายนอก ไม่เปิด server/socket จริง
- ข้อมูลสินค้าเป็น fixture ใน memory เริ่มใหม่ต่อการทดลอง ไม่ใช่ระบบ persistent CRUD
- REST Lab เป็น resource-oriented HTTP API แบบย่อ ไม่ยืนยันว่า implement REST constraints ทั้งหมด
- GraphQL ตรวจตาม 3 query ที่รองรับ ไม่ใช่ parser/engine เต็มระบบ
- gRPC ไม่ encode Protobuf/วัด latency; deadline เกิดฝั่ง Client ไม่แต่ง server reply
- SOAP แสดง XML ที่ถูกโครงสร้าง ไม่รัน WSDL/XSD หรือ arbitrary operation
- WebSocket แสดง classic HTTP/1.1 Upgrade; SSE replay สมมติมี event history
- Long polling ใช้ timeout 204 ตาม policy fixture ไม่ใช่ข้อบังคับทุกระบบ
- Webhook signature ถูก/ผิดเป็น fixture ไม่ทำ HMAC; retry เป็น policy สมมติ; processed เป็นจำนวนงานที่รับและบันทึก ไม่ยืนยันว่างานปลายทางทั้งหมดเสร็จ
- เมื่อ ACK/connection หาย ไม่แสดง body ที่ผู้รับไม่ได้รับจริง; Webhook ID เดิมไม่เพิ่ม processed
- กล่อง Schema/Serializer/Contract/Service คือบริบทเชิงตรรกะ ไม่ใช่เครื่องกลางบนสายจริง ข้อความอ่านจาก DOM ไม่ใช้ texture ที่แตก

## การตรวจในรอบนี้

ตรวจเฉพาะ API ใหม่และหน้ารวมที่เพิ่ม API ไม่ตรวจ Network/Python Labs ที่เคยผ่านซ้ำ รายการหลักฐานหลังตรวจเสร็จบันทึกใน context.md

## Recheck กับเอกสาร official · 2026-10-05

คง 8 รูปแบบเดิมและบทนำ ไม่เพิ่มรูปแบบใหม่ ตรวจคำอธิบาย ภารกิจ ข้อสอบ และหลักฐานในโมเดล ไม่อ้างว่า Lab นี้ implement specification เต็มระบบ

| รูปแบบ | สิ่งที่ยืนยัน/แก้ | เอกสารหลัก |
| --- | --- | --- |
| REST | แยก architecture ออกจาก HTTP CRUD/JSON; 201/Location และ 405/Allow ในตัวอย่าง | Fielding §5, RFC 9110 |
| GraphQL | Query ที่ไม่ผ่าน validation ไม่เรียก resolver และไม่มี data; execution error อาจมี partial data | GraphQL Learn/Response |
| gRPC | Unary หนึ่ง request/response message; stream หลาย message; แยก RPC status ออกจากข้อมูลตอบกลับ แก้การนับ status เป็น message | gRPC Core Concepts |
| SOAP | Header optional, Body required; แก้ VersionMismatch เมื่อรับ 1.1 ให้ใช้ Fault รูปแบบ 1.1 พร้อม Upgrade header ไม่ส่ง Fault 1.2 กลับผิดรุ่น | SOAP 1.2 Part 1 Appendix A |
| WebSocket | Classic HTTP/1.1 handshake 101 แยกจาก application messages; ส่งข้อความสองทิศทางหลังเปิด connection | RFC 6455 |
| SSE | หนึ่ง HTTP response stream, text/event-stream; แยก response header จาก Events; replay อาศัย history ของระบบ | WHATWG EventSource |
| Long Polling | รอข้อมูล/timeout แล้วจบ response ก่อนส่ง request ใหม่; อาจใช้ TCP connection เดิม; 204 เป็น policy ของตัวอย่าง | RFC 6202 |
| Webhooks | ตรวจ fixture signature ก่อนรับงาน, delivery ID เดิมไม่เพิ่ม processed; retry เป็น policy ผู้ส่ง ไม่ใช่กฎทุกระบบ; signature ไม่ผ่านใช้ 403 ใน Lab | GitHub Webhooks Docs |

GitHub **ไม่ redeliver ที่ล้มเหลวโดยอัตโนมัติ** ตาม [Handling failed deliveries](https://docs.github.com/en/webhooks/using-webhooks/handling-failed-webhook-deliveries) จึงระบุชัดในบทว่ากรณี retry นี้เป็นนโยบายสมมติของร้าน ไม่ได้จำลองนโยบาย GitHub ทุกข้อ ส่วน [Validating deliveries](https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries) อธิบาย signature จริง; ตัวอย่างของเราไม่ทำ HMAC จริง

หลังแก้ tests/api-model.mjs ผ่าน 162 combinations รวม SOAP namespace/Fault, gRPC message counts/status, WebSocket/SSE headers และ webhook deduplication
