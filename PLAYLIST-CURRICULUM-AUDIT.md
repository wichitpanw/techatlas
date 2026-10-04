# Playlist curriculum audit — 2026-10-03

## ขอบเขตที่สำรวจจริง

ตรวจรายการชื่อวิดีโอใน YouTube playlist และเทียบ source หลักสูตรในเครื่อง ไม่ได้ดู/ถอดเสียงทุกวิดีโอ จึงไม่อ้างว่าอ่านเนื้อหาทั้งชุดแล้ว

- Network: [IT k Funde — Networking Fundamentals for Beginners](https://www.youtube.com/playlist?list=PLcnJIHtHiTA0jUkISZDrd72cCWIgDMmPb), รายการที่ตรวจ 35 วิดีโอ
- Python: [Telusko — Python for Beginners](https://www.youtube.com/playlist?list=PLsyeobzWxl7poL9JTVyndKe62ieoN-MZ3), หน้าแสดง 124 รายการ รวมโฆษณาหลักสูตรและส่วน Web Framework
- ใช้หัวข้อเพื่อค้นช่องว่าง ไม่คัดลอกสคริปต์ ภาพ โจทย์ หรือโครงสร้างเฉพาะของต้นทาง

## Network

ตรวจพบในเครื่องจริง 54 บท ไม่ใช่ 46 ตาม context เดิม มี Command, OSI, IPv4/Subnet, IPv6, TCP/UDP, DHCP, Routing, NAT, DNS, HTTPS/TLS, Proxy/LB, Firewall/DMZ, VPN, SDN, VPC/Hybrid และ Packet Capture แล้ว

รอบนี้เพิ่มภารกิจสังเกต/ข้อควรแยกให้ 16 บท: Computer/OS, Internet, Address, Subnet, Transport, HTTPS, DNS, DNS cache, NAT/PAT, Proxy/LB, DMZ, Packet capture, Commands, Troubleshooting, VPC และ Hybrid Cloud ไม่เปลี่ยน teaching model หรืออ้างว่าจับ traffic จริง

สิ่งที่ต้องทำต่อ:

1. อ่านเนื้อหาแต่ละวิดีโอที่เกี่ยวข้องก่อนเปลี่ยน Lab และตรวจข้อเท็จจริงกับ RFC/เอกสารผู้ผลิต
2. เพิ่ม Active Directory และ identity พื้นฐานหลัง DNS/AAA แล้วต่อ SSO/SAML และ OAuth/OIDC โดยแยก authentication/authorization ให้ถูก ไม่ใช้ชื่อวิดีโอที่เรียก OAuth ว่า authentication เป็นข้อสรุป
3. ตรวจ Proxy/LB ว่าแสดง connection สองฝั่ง, health check และ backend selection อ่านชัดทั้ง mobile/desktop
4. ขยาย capture drill แบบโจทย์หาสาเหตุและ evidence ไม่ใช้ animation แทนหลักฐาน
5. คง VLAN, STP, VLSM และ MPLS เดิม แม้ Playlist ไม่ลงรายละเอียดเท่ากัน ไม่เพิ่มบทโฆษณา ชุมชน สอบ หรือเงินเดือนเป็นเนื้อหาบังคับ

ข้อเท็จจริงที่ใช้เสริม: DNS A/PTR แยก record, DNS TTL ไม่ใช่ IP TTL, CIDR ไม่ใช่ classful addressing, /31 point-to-point เป็นข้อยกเว้นกฎลบสอง, NAT ไม่ใช่ encryption/firewall, TLS ไม่พิสูจน์ว่าเว็บน่าเชื่อถือทุกด้าน

เอกสารหลัก: [RFC 1034](https://www.rfc-editor.org/rfc/rfc1034), [RFC 3021](https://www.rfc-editor.org/rfc/rfc3021), [RFC 6749](https://www.rfc-editor.org/rfc/rfc6749)

## Python

เดิม 31 บท รอบนี้ 35 บท เพิ่มโจทย์เขียนเอง 4 บท พร้อม goal/actions, starter/solution และ visual จาก runtime:

- number-conversion: bin/oct/hex/int และความต่างระหว่างค่า int กับรูปแบบ str
- for-else: จบลูปโดยไม่มี break จึงเข้า else ไม่ใช่ else ของ if
- function-arguments: Parameter/Argument, default และ keyword arguments
- recursion: base case, ลด n และ call stack ตอนคืนค่า

คง ID เดิมและ draft/progress; แทรก prerequisite ตามหัวข้อ ไม่ยกทั้งลำดับ Playlist มาใช้

งานต่อเรียงตาม prerequisites: bitwise/swap → comprehension/zip/search → *args/**kwargs/scope → iterator/generator → class/object/self/__init__ → instance/class attributes/methods → inheritance/composition/duck typing → file/context manager/CSV/JSON → sorting → NumPy

Decorators/abstract classes เป็นส่วนต่อยอด ไม่บังคับผู้เริ่มต้นเรียนก่อนพื้นฐาน Files ใช้ filesystem จำลองของ Pyodide ต้องอธิบาย persistence ให้ชัด ส่วน threading/socket/MySQL/FastAPI/Django ต้องออกแบบ runtime แยก ไม่อ้างว่า browser lab ปัจจุบันรัน server หรือ raw socket บนเครื่องผู้เรียนได้

เอกสารหลัก: [Python control flow](https://docs.python.org/3/tutorial/controlflow.html), [Built-ins](https://docs.python.org/3/library/functions.html), [Classes](https://docs.python.org/3/tutorial/classes.html)

## สถานะเผยแพร่และผลตรวจ

- Programming และ AI คงการ์ดหัวข้อ 03/04 พร้อม “กำลังเตรียมบทเรียน” แต่ถอนเนื้อหาจากรายการ/เส้นทาง/แบบฝึก/ตัวนับบท/เปิด URL โดยตรง รวม localhost เก็บ source และ browser storage ไม่ลบ
- นโยบายนี้ไม่ใช่ authentication และไม่ถือว่า asset เป็นข้อมูลลับ ก่อน deploy ต้องทบทวน package เพื่อไม่ปล่อย AI ที่ผู้ใช้ยังไม่อนุมัติ
- ยังไม่ Deploy
- Python CPython 67 solution/input cases ผ่าน (sandbox subprocess timeout ต้องรัน non-sandbox จึงตรวจได้)
- Python browser Pyodide 35 บทและ renderer/error checks ผ่าน
- Network curriculum 54 บท; models 37 labs/103 scenarios ผ่าน
- Visibility/4 missions/16 guides และ AI regression ผ่าน; UI ตรวจ Explore, withdrawn route, Practice, DNS และ Recursion ไม่ใช่การตรวจด้วยตาทั้ง 54 บทหรือทุกขนาดจอ
