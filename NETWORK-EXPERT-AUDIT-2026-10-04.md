# ตรวจหลักสูตร Network แบบผู้เรียนและผู้ตรวจด้านเครือข่าย

วันที่: 2026-10-04 · Baseline: 2026.10.04.4 / commit 243d5eb

## ข้อสรุป

หลักสูตรมีเส้นทางพื้นฐานถึงงานผู้ให้บริการที่กว้างและเชื่อมกันได้ แต่ **ยังไม่ควรระบุว่าถูกต้องครบถ้วนทุกบท** มีทั้งข้อผิดพลาดของภาพ/ถ้อยคำ และกลไกสำคัญที่ยังย่อไว้มากเกินกว่าจะใช้วิเคราะห์ปัญหาจริงได้ด้วยตัวเอง

สิ่งที่ต้องแก้ก่อนเพิ่มบทจำนวนมาก: HSRP state, ความหมาย Priority ตามบริบท, Cloud subnet/overlap, เงื่อนไข TCP/TLS เมื่อ uplink เสีย และข้อความเหมารวมเรื่อง NAT/Load balancer จากนั้นเสริม DHCP/TCP/DNS และ MTU เป็นแกนหลัก

นี่คือการตรวจในมุมวิศวกรเครือข่ายจากหลักฐาน ไม่ใช่การรับรองจาก NT หรือการตรวจระบบเครือข่ายจริงของบริษัท ไม่มีการเชื่อมระบบบริษัท และไม่ได้อ้างว่าอ่านทุกมาตรฐานทั้งฉบับ

## ขอบเขตและหลักฐาน

- ตรวจรายการจริง 63 บทตาม `arrangeNetwork()`; ไม่มี ID ซ้ำ ลำดับท้ายเป็น Internet capstone ไม่ใช่บท Internet รุ่นเดิมสองใบ
- อ่านคำอธิบาย คำถาม เฉลย และข้อมูลสถานการณ์ของหลักสูตร รวม 146 states ที่ประกาศไว้ ตรวจไฟล์โมเดล/การแสดงผลที่เกี่ยวข้อง
- สร้างโมเดล 121 scenario ของ mechanism labs และตรวจ endpoint ของการส่งข้อมูล ไม่ใช่การทดสอบทุก combination ของค่าที่ผู้ใช้ปรับได้
- เปิดหน้า Local `/dist/#lesson/...` ครบ 63 บท คลิก scenario/step ที่มี ขยับ slider และทดสอบ playback/reset ในหน้าที่มี controls รวมทั้ง repair/retest/rollback ทั้งสามกรณีของ NOC
- พบ canvas 61 บท; VLSM และ IPv6 address เป็นเครื่องมือการคำนวณ 2D ที่มีเหตุผล ไม่ถือว่าไม่มี canvas แล้วผิดโดยอัตโนมัติ
- ไม่พบ horizontal overflow ที่ viewport iframe กว้าง 1150px ในรอบนี้ ไม่ได้แปลว่าป้ายทุกตำแหน่ง/มุมกล้อง/มือถือผ่านทั้งหมด ไม่ได้ประเมินคุณภาพภาพด้วยสายตาทุกเฟรม
- เครื่องมือตรวจรอบแรกแจ้ง pause failed 14 บท เพราะถึงเฟรมสุดท้ายและหยุดเอง แล้วเครื่องมือตรวจไปกดเล่นซ้ำ แก้เฉพาะ diagnostic และตรวจ 14 บทนั้นซ้ำ: ผ่านทั้งหมด จึงไม่จัดเป็นบั๊กของเว็บไซต์
- ชุด `osi-lab.mjs`, `telecom-labs.mjs`, `internet-feedback.mjs` ผ่าน ชุด `network-quality.mjs` มี assertion ลำดับเก่าที่ไม่รองรับ video-buffer ซึ่งแทรกแล้ว จึงยังไม่รายงานว่าชุดทดสอบทั้งหมดผ่าน
- เทียบข้อสงสัยกับ RFC/IETF และเอกสาร Cisco/AWS/BBF ที่เกี่ยวข้อง อ่านส่วนที่ใช้ตัดสิน ไม่ใช่แค่บทความสรุปหรือโพสต์ทั่วไป
- ไม่แก้ไฟล์เนื้อหาบทเรียน ไม่ commit/push/deploy ในรอบตรวจนี้

Diagnostic: `tests/network-review-20261004.html` ใช้ iframe local และ controls จริง ไม่ใช่ Network emulator ไม่รวมใน release assets

## A. ข้อผิดพลาด/ข้อความที่ควรแก้ก่อน

### A1 · HSRP ภาพแสดง Router ใช้ไม่ได้ขณะที่กำลังส่งผ่านมัน

- หลักฐาน: `dist/assets/network-lab-models.js:576` ตั้ง R1 เป็น Unavailable เมื่อ `i === 1` โดยไม่แยก scenario
- ทำซ้ำ: บท hsrp → Router หลักพร้อม → ขั้น 2 ส่งผ่าน Active
- ผลจริง: R1 Unavailable, R2 Standby แต่เส้นทาง/ชื่อขั้นบอกส่งผ่าน Active จึงไม่มี Active ที่สอดคล้องกับภาพ
- ควรเป็น: scenario ปกติ R1 Active ตลอด; กรณีเสียจึงให้ R1 Unavailable และ R2 Active หลัง failover ตามขั้น
- ผ่านเมื่อป้าย สถานะ เส้นทาง หลักฐาน และ quiz ใช้ state เดียวกัน ทั้งปกติ/เสีย/reset
- กลไก Active/Standby อ้างอิง [RFC 2281](https://www.rfc-editor.org/rfc/rfc2281)

ภาพทำซ้ำ: `/tmp/techatlas-network-audit-hsrp.png`

### A2 · Priority ในพจนานุกรมผิดบริบท

- `dist/assets/lesson-terms.js:100` นิยามเป็นความสำคัญของคิวเท่านั้น แต่แสดงใน HSRP; STP ก็มีคำ Priority เช่นกัน
- HSRP priority เกี่ยวกับการเลือกบทบาท Router ไม่ใช่ QoS queue; STP bridge priority เป็นส่วนของ Bridge ID ไม่ใช่กฎเดียวกับ HSRP
- แยก HSRP Priority / Bridge Priority / Queue Priority และเติม preemption, tracking, virtual MAC เมื่อพบครั้งแรก
- อ้างอิง [RFC 2281](https://www.rfc-editor.org/rfc/rfc2281) และ [Cisco STP/RSTP](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.html)

### A3 · Public subnet ปนกับเงื่อนไขของ Instance

- `dist/assets/network-foundations.js:1813` รวม route ไป Internet gateway และ instance public IP ไว้ในนิยาม public subnet
- ในโมเดล AWS subnet เป็น public จาก routing; public IPv4 ของ instance เป็นอีกเงื่อนไขในการติดต่อ Internet แบบ IPv4 ของ instance ไม่ได้เปลี่ยนประเภท subnet
- บทอ้างว่าใช้ศัพท์กลาง แต่พฤติกรรม IGW/NAT gateway เป็นแบบ AWS มาก ควรติดป้ายแบบจำลอง AWS-style และไม่เหมารวมทุก cloud
- อ้างอิง [AWS Subnet types](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html)

### A4 · Cloud overlap ให้เหตุผลผิดและใช้ IP ตัวเองเป็นปลายทาง

- `network-foundations.js:1857,1894` และ `network-lab-models.js:530–532` บอก Router ตัดสินใจไม่ได้เพราะ prefix ซ้ำ
- กรณีเสียให้ On-prem host และ Cloud VM เป็น 10.0.0.20 เหมือนกัน หากเครื่องพยายามติดต่อ IP ของตนเอง โดยทั่วไปจะไม่ส่ง packet ไป VPN gateway แบบในภาพ
- Router ยังเลือก route ตาม lookup/policy ได้ ปัญหาคือเลือก local/connected path แทนเครือข่ายที่ต้องการ หรือบริการ cloud ไม่อนุญาตการเชื่อม overlap ไม่ใช่ router หมดความสามารถเลือกทาง
- แก้ fixture ให้ host กับ destination คนละ IP แล้วแสดง on-link ARP/route ที่เลือกจริง หรือทำกรณี AWS peering ปฏิเสธ overlap แยกต่างหาก
- อ้างอิง [RFC 1812: route selection](https://www.rfc-editor.org/rfc/rfc1812) และ [AWS peering: overlapping CIDRs](https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html)

### A5 · Internet uplink เสีย แต่ขั้นก่อนหน้าระบุ TCP/TLS พร้อมแล้ว

- `dist/assets/internet-model.js:33` เพิ่ม TCP connection พร้อม/TLS certificate ผ่าน ก่อนตรวจ Access → Core down ใน loop ถัดมา
- ทำซ้ำจากโมเดล: social หรือ cdn + fault uplink บนเส้นทางที่เลือก จะมีขั้นพร้อมก่อนขั้น drop ทั้งที่ handshake ต้องผ่านลิงก์ที่เสียเช่นกัน
- การย่อ handshake ทำได้ แต่ต้องเป็นสมมติฐานเฉพาะกรณีเส้นทางพร้อม หรือแสดงความล้มเหลวก่อนอ้าง establishment สำเร็จ ไม่ใช้คำว่า ready เป็นผลจริงในกรณีเสีย
- อ้างอิงขั้นสร้าง connection ของ [RFC 9293](https://datatracker.ietf.org/doc/html/rfc9293)

### A6 · Private IP ไม่ได้ต้องใช้ NAT ทุกวิธีที่เข้าถึงบริการ Internet

- `dist/assets/network-curriculum.js:93` เขียนว่า private ต้องผ่าน NAT จึงออก Internet ได้ กว้างเกินไป
- เปลี่ยนเป็น private IPv4 ไม่ routable บน public Internet โดยตรง; ใน Lab บ้านนี้ใช้ source NAT/PAT ส่วนการเข้าถึงบริการผ่าน application proxy/gateway เป็นอีกแบบหนึ่ง
- ไม่ให้เข้าใจว่า IPv6/public IP ต้อง NAT จึงมี Internet
- อ้างอิง [RFC 1918: private hosts / mediating gateways](https://www.rfc-editor.org/rfc/rfc1918)

### A7 · Load balancer ไม่ใช่ L7 ทั้งหมด

- `dist/assets/network-foundations.js:1634` กล่าว Forward proxy, Reverse proxy, Load balancer เป็นตัวกลางระดับ application ทั้งสาม
- Lab ที่เลือกใช้ L7 ทำได้ แต่ต้องระบุ scope; มี Load balancer แบบ L4 ไม่ควรสอนเป็นนิยามเหมารวม
- อ้างอิง [AWS Network Load Balancer: layer 4](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html)

## B. ผลรายบทตามลำดับปัจจุบัน

สถานะ “หลักถูกใน scope” หมายถึงไม่พบข้อขัดแย้งสำคัญจากสิ่งที่ตรวจ ไม่ใช่รับรองว่า protocol ครบทุกกรณี หัวข้อเสริมเป็นข้อเสนอ ไม่ต้องเพิ่มทุกอย่างในระดับเริ่มต้นทันที

| # | บท / ID | ผลตรวจเนื้อหาและสิ่งที่ควรปรับ |
|---|---|---|
| 01 | Computer/OS · computer-os | หลักถูกใน scope; แยก CPU/RAM/Storage ชัด เพิ่มว่า ipconfig เป็น Windows ส่วน Linux ใช้ ip addr/ip route และผลคำสั่งใน Lab เป็น fixture |
| 02 | Binary/Decimal/Hex · number-systems | หลักถูก; เพิ่มแบบฝึก byte→decimal และ AND mask ทีละบิตเชื่อมกับ subnet ไม่แค่จำ powers of two |
| 03 | อุปกรณ์ · devices | หลักถูก; ชี้ multi-function home router รวม switch/AP/firewall ได้ รูปกล่องไม่ใช่ข้อพิสูจน์ว่าอุปกรณ์ทำชั้นใด |
| 04 | Physical · physical | หลักถูกใน scope; เพิ่ม auto-negotiation/duplex mismatch เทียบ link up กับ errors ไม่ตีความว่าความเร็วที่ตั้งคือ throughput จริง |
| 05 | OSI/TCP-IP · osi-model | หลักถูกในแบบจำลองที่ประกาศ; L5–7 เป็น conceptual mapping ไม่บังคับ 1 protocol = 1 layer เพิ่มสรุปหน้าที่ชั้นที่เลือกก่อนเริ่มเดิน packet |
| 06 | Encapsulation · encapsulation | หลักถูก; ต้องคง byte assumptions, FCS/drop และแยก header ที่เปลี่ยนราย hop จาก end-to-end ไม่อ้างว่าเป็น capture จริง |
| 07 | L2/MAC table · layer2 | หลักถูก; เสริม learn จาก source MAC, unknown unicast flooding ใน VLAN และ aging/MAC move ให้ปรับได้ |
| 08 | IP/MAC · address | ต้องแก้ NAT เหมารวม A6; เสริม loopback/link-local และย้ำ private/public เป็นขอบเขต address ไม่ใช่ความปลอดภัย |
| 09 | IPv4 Subnet · subnet | หลักถูกในชุดที่รองรับ; ขยาย prefix ไม่จำกัดตัวอย่างใกล้ /24 และแยก /31 point-to-point, /32 host route จากสูตร usable hosts ทั่วไป |
| 10 | DHCP · dhcp | DORA/relay/pool มีแล้ว; ชื่อมี Lease แต่ยังไม่มี renewal/rebinding/expiry/NAK ให้เดินดู ต้องเสริม ACK ว่ายืนยัน configuration ไม่ใช่ TCP ACK |
| 11 | Gateway · gateway | หลักถูก; เพิ่มกรณีส่งใน subnet ไม่ต้องผ่าน gateway และมี route เฉพาะแม้ไม่มี default เพื่อไม่สอนว่า gateway คือทางเดียวทุกกรณี |
| 12 | ARP/ICMP · arp-icmp | หลักถูก; next-hop MAC ไม่ใช่ MAC Server ไกล เสริม stale cache/ARP retry, ICMP unreachable/time exceeded และ timeout ไม่บอกจุดเสียแน่นอน |
| 13 | VLAN/Trunk · vlan | หลักถูกใน fixture; เสริม access/tagged/native VLAN/allowed VLAN mismatch ให้เห็น frame tag และ broadcast ขอบเขตจริง |
| 14 | STP/RSTP · stp | หลักถูกใน topology ย่อ; เพิ่ม Bridge ID/MAC tie-break, port roles และ RSTP states; แยก Bridge Priority จาก Queue Priority |
| 15 | EtherChannel · etherchannel | หลักถูก; เพิ่ม per-flow hash ทดลองหลาย flow/สมาชิกเสีย และ passive/passive หรือ config mismatch ไม่ bundle ไม่ให้คิด flow เดียวได้ผลรวม bandwidth |
| 16 | VLSM · vlsm | เครื่องมือ 2D เหมาะสม; เพิ่มโจทย์ชุดความต้องการใหม่/overlap/remaining block พร้อมตรวจสิ่งที่ผู้เรียนจัดเอง |
| 17 | TCP/UDP/Port · protocols | หลักถูก; UDP ไม่มี transport guarantee ไม่ได้แปล application ห้ามมี reliability; แยก service port กับ ephemeral source port |
| 18 | TCP Handshake · tcp-handshake | handshake มีแล้วแต่ยังไม่อธิบาย TCP data reliability; เสริม seq/ack bytes, loss/retransmit, FIN/RST และ window ไม่เหมารวม ACK เป็นรับ application สำเร็จ |
| 19 | HTTPS/TLS · https | หลักถูกใน intro; เพิ่ม key establishment/hostname-trust-time validation และข้อแตกต่าง TCP+TLS กับ HTTP/3+QUIC โดยไม่ต้องจำลองทั้งหมด |
| 20 | Network quality · network-quality | queue/drop model มีเหตุผล; เสริม throughput vs goodput, serialization/propagation/queueing แยกค่าจำลองจาก SLA จริง |
| 21 | Video buffer · video-buffer | หลักถูกในสูตรที่รองรับ; เพิ่มเหตุผล adaptive bitrate/segment request ไม่ให้คิด Internet ต้องส่งต่อเนื่องคงที่ทุกวิดีโอ |
| 22 | QoS queues · qos-queues | หลักถูก; เพิ่ม starvation/DSCP trust-boundary และ QoS ไม่สร้าง bandwidth ใหม่ Priority ศัพท์ควรใช้ Queue Priority |
| 23 | Policing/Shaping · rate-control | หลักถูกใน discrete model; เสริม burst/token units กับข้อแลกเปลี่ยน latency vs drop ไม่อ้างว่าเป็น ASIC จริง |
| 24 | IPv6 Address · ipv6-address | 2D คำนวณเหมาะสม; เสริม compressed notation หลายตัวอย่าง, link-local ต้องมี scope/interface, global/ULA และไม่ใช้ broadcast |
| 25 | SLAAC · slaac | RS/RA/DAD มีแล้ว; แสดงสมมติฐาน link-local เตรียมไว้ เสริม NS/NA, DAD fail และ default route มาจาก RA ไม่ใช่ DHCPv6 address lease |
| 26 | L3 Routing · layer3 | LPM ถูก; เพิ่ม RIB→FIB กับ next-hop resolution และแยก route selection prefix เดียวจาก forwarding longest prefix |
| 27 | Static/default · static-routing | หลักถูก; เสริม return route/asymmetric path กับ blackhole/next-hop unreachable ไม่ถือมี route แล้วปลายทางต้องตอบ |
| 28 | Inter-VLAN · inter-vlan | หลักถูก; เพิ่ม per-VLAN gateway, SVI up/down และ frame rewrite ไม่ให้คิด trunk ทำ routing เอง |
| 29 | OSPF · ospf | cost/convergence bounded ถูก; เสริม Hello→neighbor→LSDB→SPF ไม่ต้องเป็น full engine; 2-Way บาง adjacency ไม่ใช่ผิดเสมอ |
| 30 | HSRP/VRRP · hsrp | ต้องแก้ A1/A2; เสริม virtual MAC, preempt และ upstream tracking ที่ต่างจาก physical interface down |
| 31 | DNS · dns | name→IP หลักถูก; เสริม recursive resolver→root→TLD→authoritative และแยกการ resolve จาก data path |
| 32 | DNS cache · dns-cache | TTL/PTR หลักถูก; เสริม NXDOMAIN/SERVFAIL/timeout และ negative cache; DNS TTL ไม่ใช่ hop limit |
| 33 | Mail · mail | SMTP/MX/IMAP หลักถูกใน fixture; อธิบาย submission 587 เทียบ relay 25 และรับเข้า queue ไม่เท่ากับผู้รับเปิดอ่านแล้ว |
| 34 | NAT/PAT · nat-pat | tuples/reverse state หลักถูก; preset Client A กับ Reply ใช้ journey เดียวกัน ควรเลือก frame เริ่มตรงชื่อ เพิ่ม timeout/no mapping และ NAT ไม่ใช่ firewall โดยตัวมันเอง |
| 35 | Proxy/LB · proxy-lb | ต้องแก้ A7; แยก CONNECT tunneling vs TLS termination และ health check ไม่รับประกันทุก request สำเร็จ |
| 36 | NTP/SNMP/Syslog · monitoring | หลักคำอธิบายถูก แต่ presets NTP synchronized กับ Interface counters ได้ steps เหมือนกัน; ต้องแยก time sync, log delivery, poll/trap และ counter delta ให้ตรงชื่อ |
| 37 | ACL · acl | first-match/implicit deny ถูกในแบบนี้; เสริม direction และ stateless reply vs stateful firewall ไม่ให้ permit ขาเดียวดูเหมือนอนุญาตสองทางเสมอ |
| 38 | DMZ · dmz | segmentation หลักถูก; เสริม service dependency reply/state และ DMZ ไม่ใช่รับประกันว่า server ที่เจาะแล้วไม่มีความเสี่ยง |
| 39 | Port security · port-security | MAC ไม่ใช่ user identity ถูก; เสริม violation modes/sticky persistence ตาม platform และ recovery หลังหาสาเหตุ |
| 40 | DHCP snooping/DAI · dhcp-snooping | หลักถูก; ระบุ binding จาก ACK, static IP ต้องมีนโยบายที่รองรับ และแยก trust ของสอง feature ไม่สั่ง trust uplink ทุกอัน |
| 41 | AAA/SSH · aaa-ssh | Authn/Authz/Accounting แยกดี; เพิ่ม authentication failure, log trail และ RADIUS/TACACS+ ไม่เหมารวมสิทธิ์ทุก platform |
| 42 | VPN · vpn | inner/outer/SA ถูกใน scope; เสริม IKE vs ESP, route/selector และ MTU failure เพิ่มคำถาม VPN ของบทเอง ไม่ใช้แต่ MPLS ไม่ encrypt |
| 43 | Wi-Fi radio · wireless-radio | Channel/width/RSSI ข้อความพื้นฐานถูก; วง coverage ไม่แสดง frequency overlap ได้ครบ เพิ่ม spectrum/airtime/CSMA-CA/retry ต่างจาก packet path |
| 44 | WLC · wlc | central/local data กับ control แยกถูก; เพิ่ม AP join/auth fault และถ้า controller ขาด ผลขึ้นกับ mode/auth ไม่สรุปเดียว |
| 45 | Wi-Fi security · wifi-security | SAE/EAP/link-vs-end-to-end ถูก; เสริม bad certificate/rogue SSID และ same SSID ไม่รับประกัน subnet/roaming เดียวกัน |
| 46 | REST/JSON · rest-json | JSON/status/model scope ถูก; แยก 401 กับ 403 และ schema error ให้ปรับจริง ไม่ใช้ปุ่ม credential เดียวแทนทุกสิทธิ์ |
| 47 | Automation · automation-tools | desired/current/risk หลักถูก; คง scope ไม่เรียก Ansible/Terraform จริง เพิ่ม drift/diff/review/retest/rollback |
| 48 | SDN/Planes · sdn | แยก control/data/management ถูก; เพิ่ม controller unavailable policy-installed vs new-flow เฉพาะแบบที่รองรับ ไม่เหมารวมทุก SDN |
| 49 | Network commands · network-commands | fixture มีหลักฐานเหมาะ; เสริมเครื่องมือ Linux/Windows และ ping ไม่เท่ากับ HTTP/TLS readiness |
| 50 | Packet capture · pcap | synthetic capture เปิดเผยแล้ว; เสริม filter/5-tuple/retransmit แยก RST/ICMP/timeout และ capture point/offloading ไม่อ้าง checksum fail จากทุก capture |
| 51 | Troubleshooting · troubleshooting | แยกชั้นหลักถูก; การทดสอบ HTTPS ด้วย IP ต้องรักษา Host/SNI/certificate เช่น forced DNS mapping ไม่แนะนำปิด validation |
| 52 | WAN · wan | /30 fixture ถูก; ไม่ทำเป็นกฎทุก WAN เสริม /31/unnumbered ตามเทคโนโลยี และ handoff vs service end-to-end |
| 53 | FTTH · ftth-access | OLT/PON/ONT หลักมี; splitter ใช้ทรง router ทำให้ภาพสื่อผิดได้ ควรใช้ passive splitter ต่างชัด และแสดง downstream shared/upstream grants; ONT bridge vs router ต้องระบุ |
| 54 | Subscriber session · subscriber-session | PPPoE discovery/IPCP และ IPoE intro ถูก; เสริม EtherTypes/session teardown/lease และ AAA accounting/IPv6 prefix delegation เป็นระดับต่อยอด |
| 55 | MPLS · mpls | label forwarding ไม่ encrypt หลักถูก; เสริม label locally significant, LFIB และ PHP/TTL model assumptions |
| 56 | MPLS VPN · mpls-vpn | VRF/two labels หลักถูก; บาง preset เหมือนกันก่อนเปลี่ยน customer เพิ่ม RD vs RT/import/export และ MP-BGP control path ให้เห็นบริบท ไม่ส่งลูกค้าข้าม VRF |
| 57 | Enterprise path · enterprise-path | attachment/service path หลักถูก; เสริม L2VPN vs L3VPN และ private path ไม่เท่ากับ encrypted path |
| 58 | BGP/Peering · bgp-peering | local preference fixture/ไม่ถาม BGP ทุก packet ถูก; เสริม NEXT_HOP/withdraw, prefix filtering/max-prefix/RPKI ก่อนขยาย policy engine |
| 59 | CGNAT/IPv6 · cgnat-ipv6 | 100.64/10 แยก RFC1918 และ IPv6 firewall ถูก; เสริม mapping timeout/ports capacity กับหลักฐาน tuple+เวลาโดยใช้ข้อมูลจำลองเท่านั้น |
| 60 | NOC Incident · noc-incident | baseline→probe→fix→retest→rollback สามกรณีเล่นได้; เสริมเลือก next test จากหลักฐานและ acceptance ต่อบริการ ไม่เพียง link up |
| 61 | Cloud VPC · cloud-vpc | ต้องแก้ A3; เสริม stateful security group vs stateless network ACL โดยติดป้าย AWS-specific |
| 62 | Cloud Hybrid · cloud-hybrid | ต้องแก้ A4; route สองทาง/non-transitive แนวคิดดีแล้ว เพิ่ม distinct IP/route-selection evidence |
| 63 | Computer→Internet · internet | placement เป็น capstone ถูกแล้ว; ต้องแก้ A5 และย้ำ Social/Game/CDN สมมติ ไม่ใช่ topology จริงของ Meta/เกม |

## C. ช่องว่างสำคัญที่ควรทำก่อนขยายจำนวนบท

### C1 · DHCP: lease มีวงจร ไม่จบที่ ACK ครั้งแรก

ให้ปรับเวลา แล้วเห็น BOUND → RENEWING → REBINDING → lease expiry; ACK ต่ออายุ/NAK ต้องทำอะไร ใช้ค่า timer ที่บอกเป็นสมมติ ไม่ใช้ animation นับเวลาแทนมาตรฐาน [RFC 2131 §4.4.5](https://www.rfc-editor.org/rfc/rfc2131) อธิบาย T1/T2 และ renewal/rebinding

### C2 · TCP: ส่งข้อมูลหลังจับมือ

ผู้เรียนเปลี่ยน loss แล้วเห็น sequence ของ bytes, ACK, retransmission และข้อมูลที่ application ได้จริง แยก receive window กับ congestion window และเพิ่มปิด connection แบบ FIN/RST ทีละระดับ [RFC 9293 §3.8](https://datatracker.ietf.org/doc/html/rfc9293) กำหนดการส่งซ้ำและการจัดการ connection

### C3 · DNS: ใครรู้คำตอบและความล้มเหลวแบบใด

แสดง cold cache ที่ resolver เดิน referrals เทียบ warm cache; เปลี่ยน record/TTL และแยกไม่มีชื่อจาก server ไม่ตอบ ไม่ต้องลาก packet ผู้ใช้ผ่าน DNS หลัง resolve [RFC 1034 §4.3.1–4.3.2](https://www.rfc-editor.org/rfc/rfc1034)

### C4 · MTU / MSS / PMTUD: ช่องว่างข้ามหลายบท

ยังไม่มีบทฝึกกลไกนี้โดยตรง MTU ในศัพท์ไม่เท่ากับเรียนจบ ควรมีหลัง TCP/IP ก่อน VPN/provider ใช้โจทย์ ping เล็กผ่านแต่ transfer ใหญ่ค้างเมื่อ overhead ทำให้ packet เกิน MTU เปรียบเทียบ IPv4 DF/ICMP fragmentation needed กับ IPv6 Packet Too Big และ router ไม่ fragment IPv6; แยก MSS ของ TCP จาก MTU ของ link [RFC 1191](https://www.rfc-editor.org/rfc/rfc1191), [RFC 8200 §5](https://datatracker.ietf.org/doc/html/rfc8200)

### C5 · Troubleshooting และหลักฐานปิด Incident

ทุกกลุ่มหลักควรมี 1 fault ที่ผู้เรียนต้องเลือกตรวจ ไม่เฉลยด้วย scenario title อย่างเดียว: observation → สมมติฐาน → next test → fix → service acceptance → rollback การ ping ผ่านยังไม่ยืนยัน DNS/TLS/application พร้อม

## D. ลำดับเนื้อหาและเป้าหมายเรียน

ไม่แนะนำย้ายทุกหัวข้อใหม่ทันที จำนวนบทไม่ใช่ปัญหาเดียว ปัญหาคือผู้เรียนไม่รู้ว่าแต่ละบทต้องพิสูจน์อะไร

1. รักษา phase 0 → Ethernet เบื้องต้น → IPv4/subnet → DHCP/gateway/ARP → VLAN/switching ตามลำดับปัจจุบัน
2. DHCP ก่อน Port/TCP ใช้กล่อง prerequisites สั้นว่า UDP/67–68 คือช่องบริการ ไม่ต้องเข้าใจ transport ทุกอย่างก่อน DORA
3. ทำ DNS introduction ก่อน HTTPS หรือเพิ่ม primer ใน HTTPS ว่า hostname ที่ใช้ตรวจ certificate ถูก resolve มาก่อน ส่วน recursive/cache ยังเรียนต่อภายหลังได้
4. เพิ่ม MTU drill หลัง TCP และ IPv6 note ใน SLAAC; reuse mechanism ใน VPN/PPPoE ไม่สร้างบทชื่อซ้ำหลายชุด
5. Internet คงไว้ท้าย capstone แล้วเชื่อม “ถ้าขั้นนี้ผิดกลับไปบทไหน” ครอบคลุม DHCP→ARP→DNS→route/NAT→transport/TLS→application
6. บทผู้ให้บริการเพิ่ม ISP mental model: physical access → subscriber/session → addressing → forwarding/policy → service quality → incident ไม่แสดงอุปกรณ์ชื่อ NT ที่เดามา

ตัวอย่างภารกิจที่ชัดแทน “ลองทุกเงื่อนไข”:

> DHCP: เปิดกรณี Server ปกติ เดินจนถึง ACK จด IP/Gateway ที่ Client ได้ จากนั้นเลือก Server ไม่ตอบ เปรียบเทียบว่า message ใดหายและ Client มี IP ที่ใช้ได้หรือไม่ ผ่านเมื่อเลือกหลักฐานที่ยืนยันปัญหาได้ และอธิบาย ACK ว่าต่างจาก Offer อย่างไร

กิจกรรมก่อน quiz ไม่ควรผ่านเพียงคลิก 2 scenario โดยไม่ดูผล แต่ไม่บังคับเดิน animation ทุกเฟรมที่ไม่ได้เกี่ยวกับวัตถุประสงค์

## E. การแสดงผลที่ควรปรับ

- scenario ที่ชื่อแตกต่างแต่ steps เหมือน: Monitoring (NTP/counters) เป็นจุดสำคัญ; TCP preset, NAT Reply และ MPLS VPN บาง preset ควรเริ่มที่ frame/parameters ที่ตรงกับชื่อหรือรวมตัวเลือกไม่ให้ดูเหมือนทดลองแล้วไม่เปลี่ยน
- FTTH passive splitter ต้องไม่ใช้รูป router มีพอร์ต/บทบาท routing โดยไม่แยกให้ชัด
- RF ต้องเห็นการซ้อนความถี่/แย่ง airtime ไม่ใช่ใช้วงพื้นที่หรือ packet path อย่างเดียว
- ภาพ logical node เช่น virtual gateway/VRF/controller ต้องคงป้าย “บริบทเชิงตรรกะ” เพื่อไม่ให้เข้าใจว่ากล่องเพิ่มอยู่บนสายจริง
- ต้องผูก node label, evidence, animation และ quiz กับ state/model เดียว ไม่แก้แค่ข้อความให้กลบข้อขัดแย้ง
- หลายบทใช้ลิงก์ Cisco networking overview กว้างเกินไป ควรใส่แหล่งเฉพาะ feature ใกล้ข้ออธิบาย

## F. แผนแก้ที่เสนอ

อัปเดตหลังผู้ใช้สั่ง “ทำไปพร้อมๆกันเลย”: รอบ 1 และ 2 ลงมือและตรวจ Local แล้วตามหัวข้อ H ส่วนรอบ 3–4 ยังเป็นแผนต่อ ไม่ได้ deploy หรือ commit/push งานรอบนี้

| รอบ | ขอบเขต | เกณฑ์ผ่าน |
|---|---|---|
| 1 | A1–A7: ความถูกต้องก่อน | assertions ทุก scenario; UI ทำซ้ำแล้วป้าย/packet/evidence ไม่ขัดกัน; ศัพท์ตรงบริบท |
| 2 | DHCP/TCP/DNS และ MTU | ทุกบทมีเป้าหมายเดี่ยว, input ปรับได้, normal/fault, expected evidence และ feedback ชัด |
| 3 | Monitoring/FTTH/Wireless และภารกิจทั้งหลักสูตร | กลไกเฉพาะหัวข้อจริง ไม่ใช้ animation เดิมหรือ snapshots ชื่อใหม่แทนการเปลี่ยนผล |
| 4 | Provider advanced และ glossary/prerequisite bridges | RD/RT/IPv6 PD/BGP safety เป็น optional depth; ไม่เพิ่มความซ้ำและไม่อ้างจำลองเต็มมาตรฐาน |

ก่อนเปลี่ยน shared model ต้องระบุบทที่ได้รับผลและขอบเขต regression ใหม่ ขออนุมัติ deploy/commit/push หลังสรุปงานแต่ละรอบตาม AGENTS.md

## G. แหล่งหลักที่ใช้เทียบกลุ่มเนื้อหา

รายการนี้เป็นหลักฐานอ้างอิงต่อไป ไม่ใช่การคัดลอกเนื้อหาหรือโครงสร้างหลักสูตรจากต้นทาง

- IPv4/Private/NAT/CGNAT: [RFC 1812](https://www.rfc-editor.org/rfc/rfc1812), [RFC 1918](https://www.rfc-editor.org/rfc/rfc1918), [RFC 3022](https://www.rfc-editor.org/rfc/rfc3022), [RFC 6598](https://www.rfc-editor.org/rfc/rfc6598)
- IPv6/SLAAC: [RFC 8200](https://datatracker.ietf.org/doc/html/rfc8200), [RFC 4862](https://datatracker.ietf.org/doc/html/rfc4862)
- DHCP/DNS/Mail: [RFC 2131](https://www.rfc-editor.org/rfc/rfc2131), [RFC 1034](https://www.rfc-editor.org/rfc/rfc1034), [RFC 5321](https://datatracker.ietf.org/doc/html/rfc5321)
- TCP/HTTP: [RFC 9293](https://datatracker.ietf.org/doc/html/rfc9293), [RFC 9110](https://datatracker.ietf.org/doc/html/rfc9110)
- OSPF/HSRP: [RFC 2328](https://datatracker.ietf.org/doc/html/rfc2328), [RFC 2281](https://www.rfc-editor.org/rfc/rfc2281)
- MPLS/VPN/BGP/PPPoE: [RFC 3031](https://www.rfc-editor.org/rfc/rfc3031), [RFC 4364](https://www.rfc-editor.org/rfc/rfc4364), [RFC 4271](https://datatracker.ietf.org/doc/html/rfc4271), [RFC 2516](https://datatracker.ietf.org/doc/html/rfc2516)
- QoS/Monitoring: [RFC 2475](https://www.rfc-editor.org/rfc/rfc2475), [RFC 5905](https://datatracker.ietf.org/doc/html/rfc5905), [RFC 5424](https://datatracker.ietf.org/doc/html/rfc5424), [RFC 3414](https://datatracker.ietf.org/doc/html/rfc3414)
- Security/JSON: [RFC 4301](https://datatracker.ietf.org/doc/html/rfc4301), [NIST Firewall guidelines](https://csrc.nist.gov/pubs/sp/800/41/r1/final), [RFC 8259](https://datatracker.ietf.org/doc/html/rfc8259)
- Switching: [Cisco RSTP](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.html), [Cisco EtherChannel](https://www.cisco.com/c/en/us/td/docs/switches/lan/c9000/lyr2-fwd/etherchannel/etherchannel-configuration-guide/etherchannels.html), [Cisco Port Security](https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst_microswitches/software/releases/15_2_7_e/configuration_guide/security/b_1527e_security_cms_cg/configuring_port_security.html)
- DHCP security/WLAN: [Cisco DAI](https://www.cisco.com/c/en/us/support/docs/switches/lan-switch-software/222274-troubleshoot-dynamic-arp-inspection-dai.html), [Cisco FlexConnect](https://www.cisco.com/c/en/us/td/docs/wireless/controller/8-10/config-guide/b_cg810/flexconnect.html)
- FTTH background: [Broadband Forum TR-156](https://www.broadband-forum.org/pdfs/tr-156-4-0-0.pdf) ใช้ส่วน OLT/ONU/VLAN ประกอบ ไม่อ้างตรวจ optical hardware จริง
- Cloud: [AWS Subnets](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html), [AWS Peering](https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html), [AWS L4 LB](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html)

## ข้อจำกัดของผลตรวจ

รอบนี้เป็น content/model/control audit ของ baseline local ที่ตรงกับ release ล่าสุด ไม่ใช่ exhaustive packet emulator validation, accessibility/mobile ทุกจอ, throughput benchmark หรือการทดสอบทุก browser/CDN failure ค่า timer/hash/routing ที่ fixture กำหนดไม่ใช่ผลวัดเครือข่ายจริง ไม่มีคะแนนความสมบูรณ์เป็นเปอร์เซ็นต์ที่ไร้เกณฑ์

## H. การแก้ Local หลัง audit · 2026-10-04

- A1–A7 แก้ model/คำอธิบาย/ศัพท์แล้ว: HSRP normal ไม่ขึ้น Unavailable, Priority แยกโปรโตคอล, AWS-style subnet/instance mapping แยกกัน, overlap ให้เห็น on-link ARP, uplink เสียยังไม่เริ่ม TLS, NAT ไม่เหมารวม และ LB ระบุ L4/L7
- DHCP/TCP/DNS/DNS Cache ใช้บทเดิม ไม่สร้างบทซ้ำ เพิ่ม MTU/MSS/PMTUD หลัง TCP: 64 Network lessons, glossary320; ทุกกลุ่มมีสถานการณ์ปกติ/ผิดพลาด, sandbox, หลักฐาน และโจทย์ชัดเจน
- DHCP ตาม [RFC2131](https://www.rfc-editor.org/rfc/rfc2131); TCP ตาม [RFC9293](https://datatracker.ietf.org/doc/html/rfc9293); DNS hierarchy ตาม [RFC1034](https://www.rfc-editor.org/rfc/rfc1034), negative cache ตาม [RFC2308](https://www.rfc-editor.org/rfc/rfc2308); MTU ตาม [RFC1191](https://www.rfc-editor.org/rfc/rfc1191) และ IPv6 ตาม [RFC8200](https://datatracker.ietf.org/doc/html/rfc8200) ใช้ส่วนที่เกี่ยวข้อง ไม่คัดลอกภาพ/คำอธิบายต้นฉบับ
- tests/network-core.mjs: 36 edited/new scenarios + 75 TCP combinations + 80 MTU combinations ผ่าน พร้อม DHCP/DNS time boundaries, A1–A7 assertions, order และ glossary uniqueness
- Browser rendering/controls เฉพาะ 11 บทที่แก้ ผ่านทุกหน้า รวม scenarios/steps/play/pause/reset; Browser custom-input/quiz gate 5 core lessons ผ่านและ TCP 3D byte buffer มีค่าเดียวกับ evidence
- TCP diagnostic รอบแรกเทียบข้อความเก่า rwnd=0 ไม่ตรงชื่อใหม่ Receive window=0 จึงแก้ test และตรวจ TCP ซ้ำผ่าน ไม่จัดเป็น runtime bug; local server หยุดระหว่างรอบภาพ คืน server แล้วเปิด tab ทดสอบใหม่สำเร็จ
- ภาพ TCP สองช่วงและ MTU ruler เป็น representation เชิงตรรกะ ไม่ใช่ RAM layout/วัตถุบนสายจริง; DHCP timer เป็น snapshot, TCP ย่อสอง chunks/windowคงที่, DNS ไม่จำลอง DNSSEC/glue/retryครบ, MTU ไม่จำลอง PLPMTUD/options/TLS/tunnelทุกชนิด
- หลังตรวจ Local ผู้ใช้อนุมัติ deploy แล้ว: Production .5 / immutable https://1add9443.techatlas-aoh.pages.dev เผยแพร่ 2026-10-04; ตรวจ homepage และ assets ใหม่บนเว็บหลัก HTTP200 และตรง release พร้อม GET counter HTTP200 แบบ read-only จากนั้นผู้ใช้อนุมัติ commit/push แยกต่างหาก งาน Monitoring/FTTH/Wireless และ Provider advanced ยังเหลือ ไม่อ้างปิด audit ทั้งหมด
