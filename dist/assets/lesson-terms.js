// Definitions are original Thai summaries. Match terms in lesson data, not only headings.
const networkData = `
CPU|Central Processing Unit · หน่วยประมวลผลคำสั่งของเครื่อง
RAM|Random Access Memory · หน่วยความจำชั่วคราวที่โปรแกรมใช้ขณะทำงาน
OS|Operating System · ระบบปฏิบัติการที่จัดการเครื่องและโปรแกรม
CLI|Command-Line Interface · หน้าจอรับคำสั่งข้อความ ไม่ใช่ภาพ Packet ที่จับได้จริง
Binary|เลขฐานสอง ใช้ 0 และ 1
Decimal|เลขฐานสิบ ใช้ตัวเลข 0–9
Hex|Hexadecimal · เลขฐานสิบหก ใช้ 0–9 และ A–F
Bit|หน่วยข้อมูลที่มีค่า 0 หรือ 1
Byte|ข้อมูล 8 บิต; อัตรา bytes/s ไม่เท่ากับ bits/s
OSI|Open Systems Interconnection · แบบอ้างอิงหน้าที่สื่อสาร 7 ชั้น ไม่ใช่กล่องจริงเจ็ดใบ
TCP/IP|กลุ่มโปรโตคอล Internet และแบบจัดกลุ่มหน้าที่เป็นชั้น
L1|Physical · สาย แสง คลื่น และสัญญาณที่ขนบิต
L2|Data Link · ส่ง Frame บน Link เช่น Ethernet และการตัดสินใจด้วย MAC
L3|Network · ส่ง Packet ระหว่างเครือข่ายด้วยที่อยู่ IP และ Route
L4|Transport · การสื่อสารระหว่างปลายทาง เช่น TCP/UDP และ Port
L5|Session · หน้าที่จัดการบทสนทนาการสื่อสารในแบบ OSI
L6|Presentation · หน้าที่เกี่ยวกับรูปแบบและการแทนข้อมูลในแบบ OSI
L7|Application · โปรโตคอลที่แอปใช้ เช่น HTTP และ DNS
Encapsulation|ห่อข้อมูลด้วย Header/Trailer ตามโปรโตคอลก่อนส่ง
De-encapsulation|อ่านและถอดส่วนห่อข้อมูลที่ปลายรับตามโปรโตคอล
Header|ส่วนข้อมูลควบคุมก่อน Payload เช่น ที่อยู่ต้นทางและปลายทาง
Payload|ข้อมูลที่โปรโตคอลชั้นนั้นกำลังขนส่ง
Frame|หน่วยข้อมูลชั้น Link เช่น Ethernet Frame ไม่ใช่ IP Packet ทั้งก้อน
Packet|หน่วยข้อมูลชั้น Network เช่น IP Packet ที่ถูกห่อใน Frame อีกที
MAC|Media Access Control address · ที่อยู่ชั้น Link ใช้ส่ง Ethernet Frame
Ethernet|เทคโนโลยี LAN ที่กำหนด Frame และการสื่อสารบน Link
LAN|Local Area Network · เครือข่ายบริเวณจำกัด เช่น ภายในสำนักงาน
WAN|Wide Area Network · การเชื่อมต่อเครือข่ายข้ามพื้นที่
Hub|ส่งสัญญาณที่รับไปยังพอร์ตอื่น ไม่เลือกปลายทางด้วย MAC table
Switch|อุปกรณ์ส่ง Frame โดยใช้ MAC table ในบริบท VLAN
Router|อุปกรณ์เลือกทางส่ง IP Packet ด้วย Routing table
Firewall|ตรวจและอนุญาต/ปฏิเสธ Traffic ตามนโยบาย ไม่ใช่ NAT โดยตัวมันเอง
AP|Access Point · จุดเชื่อมอุปกรณ์ไร้สายเข้าระบบเครือข่าย
UTP|Unshielded Twisted Pair · สายทองแดงคู่บิดเกลียวไม่มีชิลด์
Fiber|ใยแก้วนำแสงที่ขนข้อมูลด้วยแสง
Duplex|ลักษณะรับ/ส่ง; Full duplex รับและส่งพร้อมกันได้
VLAN|Virtual LAN · แยก Broadcast domain ที่ชั้น L2
Trunk|Link ที่ขนหลาย VLAN โดยทั่วไปใช้ Tag แยก VLAN
802.1Q|มาตรฐาน Tag VLAN ใน Ethernet Frame
Broadcast|ส่งถึงทุกอุปกรณ์ในขอบเขต Broadcast นั้น ไม่ใช่ทั้ง Internet
Unicast|ส่งถึงปลายทางรายเดียว
STP|Spanning Tree Protocol · ป้องกัน Loop ชั้น L2 ด้วยการเลือกทางและบล็อกบางพอร์ต
RSTP|Rapid STP · กลไก Spanning Tree ที่ปรับสถานะได้เร็วกว่า STP เดิม
EtherChannel|รวมหลาย Link เป็นกลุ่มตรรกะ; การกระจายงานขึ้นกับวิธี Hash ไม่รวมความเร็วให้ทุก Flow เสมอ
IP|Internet Protocol address · ที่อยู่สำหรับสื่อสารชั้น Network
IPv4|ที่อยู่ IP ขนาด 32 บิต เช่น 192.168.10.25
IPv6|ที่อยู่ IP ขนาด 128 บิต เขียนกลุ่มเลขฐานสิบหก
Subnet|เครือข่ายย่อยที่กำหนดด้วย Prefix/Mask
Prefix|จำนวนบิตส่วน Network เช่น /24 ใน IPv4
VLSM|Variable Length Subnet Mask · แบ่ง Subnet ให้มีขนาดต่างกันตามความต้องการ
Gateway|Router บน Link ที่เครื่องใช้เป็นทางไปเครือข่ายอื่น
ARP|Address Resolution Protocol · หา MAC ของ IPv4 next hop บน Link ไม่ใช่ค้น MAC ข้าม Internet
ICMP|Internet Control Message Protocol · ข้อความแจ้งสถานะ/ข้อผิดพลาด IP; ping ใช้ Echo Request/Reply
TTL|Time To Live · ค่าใน IPv4 ที่ลดเมื่อผ่าน Router ช่วยจำกัดการวนของ Packet
Route|รายการที่บอกทางออก/Next hop สำหรับ Prefix ปลายทาง
Next hop|อุปกรณ์ถัดไปที่ส่ง Packet ให้ ไม่จำเป็นต้องเป็นปลายทางสุดท้าย
OSPF|Open Shortest Path First · โปรโตคอล Routing แบบ Link-state ใช้ Cost คำนวณเส้นทาง
HSRP|Hot Standby Router Protocol · ให้ Router สำรองร่วม Gateway เสมือนเพื่อความต่อเนื่อง
TCP|Transmission Control Protocol · ส่งข้อมูลเป็น Byte stream พร้อมจัดลำดับและส่งซ้ำตามกลไก
UDP|User Datagram Protocol · ส่ง Datagram โดยไม่มี TCP handshake/การรับประกันส่งซ้ำในตัว
Port|หมายเลขที่ใช้ระบุบริการ/Endpoint ของ Transport ไม่ใช่ช่องเสียบ Switch
Socket|Endpoint การสื่อสารของโปรแกรม; TCP connection ระบุด้วยคู่ IP/Port ทั้งสองฝั่ง
SYN|Synchronize · Flag TCP สำหรับเริ่มประสาน Sequence number
TCP ACK|Acknowledgment · ยืนยันข้อมูล TCP; ACK number โดยทั่วไปคือ Byte ถัดไปที่คาดว่าจะรับ
Sequence|หมายเลขลำดับ Byte ใน TCP ช่วยจัดลำดับและตรวจข้อมูลที่ยังไม่ยืนยัน
HTTP|Hypertext Transfer Protocol · รูปแบบ Request/Response ที่เว็บใช้
HTTPS|HTTP ผ่าน TLS เพื่อป้องกันการสื่อสารระหว่างปลายทาง
TLS|Transport Layer Security · เข้ารหัสและตรวจความถูกต้องของการสื่อสาร พร้อมยืนยันตัวตนตามการตั้งค่า
DNS|Domain Name System · ค้นข้อมูลจากชื่อ เช่น ที่อยู่ IP ไม่ได้แปลง IP ทุกอันเป็นชื่อโดยอัตโนมัติ
NXDOMAIN|คำตอบ DNS ว่าไม่มีชื่อที่ถามในระบบ DNS นั้น
Cache|ข้อมูลที่เก็บไว้ใช้ซ้ำจนหมดอายุหรือถูกแทน ไม่ยืนยันสถานะปลายทางล่าสุดเสมอ
DHCP|Dynamic Host Configuration Protocol · แจก IP และค่าตั้งเครือข่ายให้ Client
DHCP Relay|ตัวกลางส่งข้อความ DHCP ระหว่าง Client subnet กับ Server ที่อยู่ต่างเครือข่าย ไม่ใช่ Server แจก IP เอง
DORA|Discover → Offer → Request → Acknowledgment · ลำดับตัวอย่างการขอ DHCPv4 ใหม่ ไม่ใช่ทุกการต่ออายุใช้ครบสี่ขั้น
Pool|ชุดที่อยู่ที่ Server เตรียมให้จัดสรร; Pool หมดอาจทำให้ไม่มีข้อเสนอ IP
Mask|Subnet mask · บิตที่แยกส่วน Network กับ Host ของ IPv4
Client|ฝั่งที่ขอใช้บริการ เช่น เครื่องที่ขอ IP จาก DHCP Server
Server|ฝั่งที่ให้บริการตามโปรโตคอล ไม่จำเป็นต้องเป็นเครื่องรูปทรง Server rack
ACK|Acknowledgment · ข้อความ/Flag ยืนยันบางสิ่ง ความหมายขึ้นกับโปรโตคอล ดู DHCP ACK หรือ TCP ACK ในบทที่เกี่ยวข้อง
NAK|Negative Acknowledgment · การตอบปฏิเสธ ความหมายและผลต้องอ่านตามโปรโตคอล
A record|DNS record ที่ผูกชื่อกับที่อยู่ IPv4
AAAA|DNS record ที่ผูกชื่อกับที่อยู่ IPv6
PTR|Pointer record · ใช้ค้นชื่อใน Reverse DNS แยกจาก A/AAAA record
MX|Mail Exchange record · ระบุระบบรับอีเมลของ Domain
Domain|ชื่อในระบบ DNS เช่น example.com ไม่ใช่ IP address
RTT|Round-Trip Time · เวลาส่งออกจนคำตอบกลับ; ไม่ใช่ One-way delay
MTU|Maximum Transmission Unit · ขนาดสูงสุดของหน่วยข้อมูลที่ Link รองรับตามบริบท
FCS|Frame Check Sequence · ค่าตรวจความเสียหายของ Ethernet Frame ไม่ใช่การเข้ารหัส
LACP|Link Aggregation Control Protocol · เจรจาการรวม Link ที่เข้ากันได้
DHCP Snooping|ตรวจ/จำกัดข้อความ DHCP ตาม Trusted port และสร้าง Binding ตามกลไกที่รองรับ
Port Security|นโยบายจำกัด MAC ที่ใช้พอร์ต Switch ไม่ใช่การเข้ารหัส Traffic
WPA2|Wi-Fi Protected Access 2 · กลุ่มกลไกความปลอดภัย Wi-Fi ขึ้นกับโหมดและการตั้งค่า
WPA3|Wi-Fi Protected Access 3 · กลุ่มกลไกความปลอดภัย Wi-Fi รุ่นต่อมา ไม่แทนการตั้งนโยบายที่ดี
SSH|Secure Shell · โปรโตคอลเข้าถึง/จัดการระบบผ่านช่องทางที่ป้องกันด้วยการเข้ารหัส
Ansible|เครื่องมือ Automation ที่สั่งจัดการระบบตามงานและ Inventory
Terraform|เครื่องมือ Infrastructure as Code ที่จัดการ Resource ตาม Configuration/State
FIFO|First In First Out · คิวที่นำงานเข้าก่อนออกก่อน
Priority|ความสำคัญที่ใช้เลือกคิวตามนโยบาย; อาจทำให้คิวความสำคัญต่ำรอนาน
Burst|ข้อมูลที่เข้ามามากในช่วงสั้น แม้อัตราเฉลี่ยอาจไม่สูง
Stall|การเล่นสะดุดเพราะข้อมูลพร้อมใช้ไม่พอในช่วงนั้น
Baseline|ค่าตั้งต้น/ผลก่อนเปลี่ยน ใช้เปรียบเทียบกับผลหลังแก้
DHCP DISCOVER|Client ค้นหา DHCP Server ที่ให้บริการ
DHCP OFFER|Server เสนอ IP และค่าที่ให้ใช้ได้ ยังไม่ใช่การยืนยันสุดท้าย
DHCP REQUEST|Client ขอใช้ข้อเสนอ/ต่ออายุค่าที่เลือกตามสถานะ DHCP
DHCP ACK|DHCP Acknowledgment · Server ยืนยันการจัดสรร IP และค่าตั้งที่ใช้ได้; ไม่ใช่ TCP ACK
DHCP NAK|DHCP Negative Acknowledgment · Server ปฏิเสธคำขอที่ไม่เหมาะสม Client ต้องกลับไปขอค่าที่ถูกต้อง
Lease|สิทธิ์ใช้ IP ตามระยะเวลาที่ DHCP Server กำหนด ต้องต่ออายุเมื่อถึงเวลา
NAT|Network Address Translation · แปลงที่อยู่ IP ตาม Mapping ไม่ใช่การเข้ารหัส
PAT|Port Address Translation · ใช้ Port ร่วมกับ IP เพื่อแยกหลายการเชื่อมต่อที่แชร์ที่อยู่
NTP|Network Time Protocol · ช่วยเทียบเวลาของเครื่องผ่านเครือข่าย
SNMP|Simple Network Management Protocol · อ่าน/จัดการค่าของอุปกรณ์ตามสิทธิ์
Syslog|ข้อความ Log จากระบบ/อุปกรณ์สำหรับเก็บและวิเคราะห์เหตุการณ์
ACL|Access Control List · กฎอนุญาตหรือปฏิเสธ Traffic ตามเงื่อนไขและลำดับ
DAI|Dynamic ARP Inspection · ตรวจ ARP กับ Binding/นโยบายที่เชื่อถือได้
AAA|Authentication, Authorization, Accounting · ยืนยันตัวตน กำหนดสิทธิ์ และบันทึกการใช้งาน
VPN|Virtual Private Network · เครือข่ายส่วนตัวตรรกะ; ไม่ใช่ VPN ทุกชนิดเข้ารหัส
WLAN|Wireless LAN · เครือข่ายท้องถิ่นแบบไร้สาย
WLC|Wireless LAN Controller · จัดการ AP และนโยบายตามสถาปัตยกรรมที่ใช้
SSID|ชื่อเครือข่าย Wi-Fi ที่ประกาศให้ Client เลือก ไม่ใช่รหัสผ่าน
RSSI|ค่าประเมินความแรงสัญญาณที่รับ วิธีวัดขึ้นกับอุปกรณ์
SNR|Signal-to-Noise Ratio · เปรียบเทียบสัญญาณกับ Noise; แรงอย่างเดียวไม่แปลว่าคุณภาพดี
REST|แนวทางออกแบบการเข้าถึง Resource ผ่าน Interface เช่น HTTP API
API|Application Programming Interface · ช่องทางที่โปรแกรมใช้เรียกความสามารถอีกระบบ
JSON|JavaScript Object Notation · รูปแบบข้อมูลข้อความ ไม่ใช่โปรแกรม
SDN|Software-Defined Networking · แยก/จัดการ Control plane แบบโปรแกรมได้ตามสถาปัตยกรรม
Control plane|กลไกสร้างข้อมูลตัดสินใจ เช่น Route ไม่ใช่เส้นทาง Packet ผู้ใช้เอง
Data plane|ส่วนที่ส่งต่อ Traffic ตามข้อมูลตัดสินใจที่ติดตั้งแล้ว
MPLS|Multiprotocol Label Switching · ส่งต่อด้วย Label ในบริบทเครือข่ายที่กำหนด ไม่เท่ากับเข้ารหัส
Label|หมายเลข MPLS ที่ใช้ค้นการส่งต่อ มีความหมายตามบริบท/Link
VRF|Virtual Routing and Forwarding · แยกตาราง Routing หลายบริบทในอุปกรณ์เดียว
CE|Customer Edge · อุปกรณ์ขอบเครือข่ายฝั่งลูกค้า
PE|Provider Edge · อุปกรณ์ขอบเครือข่ายผู้ให้บริการที่เชื่อมลูกค้า
FTTH|Fiber To The Home · บริการที่เข้าถึงบ้านด้วยใยแก้วนำแสง
ONT|Optical Network Terminal · อุปกรณ์ปลายทางบริการใยแก้วฝั่งผู้ใช้
ONU|Optical Network Unit · อุปกรณ์หน่วยปลายทาง Optical access; ONT เป็นการใช้ปลายทางรูปแบบหนึ่ง
OLT|Optical Line Terminal · อุปกรณ์ฝั่งผู้ให้บริการที่ควบคุม Optical access
Splitter|ตัวแบ่งกำลังแสงแบบ Passive ไม่เลือกส่ง Frame ด้วย MAC table
BNG|Broadband Network Gateway · จุดจัดการ Subscriber session/นโยบายบริการ Broadband
LOS|Loss Of Signal · ไม่พบสัญญาณรับตามที่อุปกรณ์คาด ไม่ได้ระบุสาเหตุสายขาดเสมอ
PPPoE|Point-to-Point Protocol over Ethernet · สร้าง PPP session ผ่าน Ethernet
IPoE|IP over Ethernet · แนวทางบริการ IP ผ่าน Ethernet โดยไม่ใช้ PPPoE session
RADIUS|Remote Authentication Dial-In User Service · โปรโตคอล AAA ระหว่างอุปกรณ์บริการกับ Server
PADI|PPPoE Active Discovery Initiation · Client เริ่มค้น Access concentrator
PADO|PPPoE Active Discovery Offer · Access concentrator ตอบเสนอให้บริการ
PADR|PPPoE Active Discovery Request · Client ขอ Session จากตัวที่เลือก
PADS|PPPoE Active Discovery Session-confirmation · ยืนยัน Session ID
LCP|Link Control Protocol · เจรจา/ดูแล PPP Link ไม่ใช่การแจก IP โดยตรง
IPCP|IP Control Protocol · เจรจาค่า IPv4 บน PPP
BGP|Border Gateway Protocol · แลก Prefix และข้อมูลเส้นทางโดยใช้นโยบายระหว่าง AS
AS|Autonomous System · กลุ่มเครือข่ายภายใต้การบริหาร Routing ที่เป็นระบบเดียว
Peering|ความสัมพันธ์แลก Traffic/Route ระหว่างเครือข่ายตามข้อตกลง
Transit|บริการรับส่ง Traffic ไปเครือข่ายอื่นผ่านผู้ให้บริการ
LOCAL_PREF|ค่าความชอบเส้นทางภายใน AS ของ BGP; มากกว่ามักถูกเลือกก่อนตามขั้นตอนที่เกี่ยวข้อง
Withdraw|ถอนประกาศ Route; ต้องมี Route ทางเลือกจึงจะส่งต่อได้
CGNAT|Carrier-Grade NAT · NAT ระดับผู้ให้บริการที่หลายผู้ใช้แชร์ Public IPv4
SLAAC|Stateless Address Autoconfiguration · วิธีตั้ง IPv6 จาก Router Advertisement และกลไกที่เกี่ยวข้อง
QoS|Quality of Service · นโยบายจัดการ Traffic/คิวตามเป้าหมาย ไม่สร้าง Bandwidth เพิ่ม
DSCP|Differentiated Services Code Point · เครื่องหมาย class ใน IP ต้องมีนโยบายรองรับจึงมีผล
Bandwidth|ความจุ/อัตราสูงสุดของช่องทางตามบริบท ไม่ใช่อัตราส่งสำเร็จที่วัดได้เสมอ
Throughput|อัตราข้อมูลที่ส่งสำเร็จในช่วงเวลาที่วัด
Latency|เวลาเดินทาง/ตอบสนอง ต้องระบุว่า One-way หรือ Round-trip
Jitter|ความแปรปรวนของ Delay; ต้องระบุวิธีคำนวณที่ใช้
Loss|ข้อมูลที่สูญหาย/ถูกทิ้ง ไม่ได้แปลว่า Link ดับเสมอ
Buffer|พื้นที่พักข้อมูลก่อนใช้/ส่งต่อ; อาจลดการสะดุดแต่เพิ่มเวลารอ
Shaping|หน่วง Traffic เกินโควตาไว้ในคิวเพื่อควบคุมอัตราส่ง
Policing|จัดการ Traffic เกินโควตา เช่น Drop/Remark ตามนโยบาย
Token bucket|แบบจำลองโควตาที่เติม Token ตาม Rate และเก็บได้ไม่เกิน Bucket เพื่อรองรับ Burst
NOC|Network Operations Center · งานเฝ้าระวังและจัดการเหตุการณ์บริการเครือข่าย
Incident|เหตุการณ์ที่กระทบหรืออาจกระทบบริการ ต้องตรวจหลักฐานและผลกระทบ
Rollback|คืนการเปลี่ยนแปลงตามแผนสำรอง แล้วทดสอบผลอีกครั้ง
NDP|Neighbor Discovery Protocol · กลไก IPv6 ค้น Neighbor/Router และข้อมูล Link โดยใช้ ICMPv6
RA|Router Advertisement · ข้อความ IPv6 ที่ Router ประกาศ Prefix และค่าที่เกี่ยวข้อง ไม่ใช่ DHCP ACK
Link-local|ที่อยู่ใช้เฉพาะ Link นั้น; Router ไม่ส่งต่อ Packet ที่อยู่ขอบเขต Link-local ข้าม Link
Dual-stack|ใช้งาน IPv4 และ IPv6 ควบคู่กัน ไม่ใช่การแปลงระหว่างสองระบบโดยอัตโนมัติ
SMTP|Simple Mail Transfer Protocol · ใช้ส่ง/ส่งต่ออีเมล
IMAP|Internet Message Access Protocol · ใช้เข้าถึงและจัดการอีเมลบน Server
POP3|Post Office Protocol version 3 · ใช้ดึงอีเมลตามกลไกของบริการ
Proxy|ตัวกลางรับการสื่อสารแล้วส่งต่อแทนฝั่งที่ใช้งานตามบทบาทที่ตั้งไว้
Load Balancer|ตัวกระจาย Request/Connection ไป Backend ตามนโยบายและสถานะ ไม่รับประกันว่า Backend ทุกตัวปกติ
DMZ|Demilitarized Zone · โซนเครือข่ายแยกสำหรับบริการที่ต้องเปิดรับตามนโยบาย Firewall
Tunnel|ห่อข้อมูลเพื่อขนผ่านเครือข่ายอีกชั้นหนึ่ง ไม่ได้หมายถึงเข้ารหัสเสมอ
Encryption|แปลงข้อมูลด้วยกุญแจเพื่อจำกัดผู้ที่อ่านได้ ไม่ป้องกันทุกชนิดการโจมตี
VPC|Virtual Private Cloud · เครือข่ายตรรกะใน Cloud ที่กำหนด Subnet/Route/นโยบายได้
VRRP|Virtual Router Redundancy Protocol · ทำ Gateway เสมือนร่วมกันเพื่อความต่อเนื่อง
P router|Provider core router · Router แกนกลางในตัวอย่าง MPLS ไม่ได้ถือ VRF ลูกค้าทุกตัวเหมือน PE
Uplink|Link จากจุด Access ขึ้นไปยังส่วนเครือข่ายถัดไป บทบาทขึ้นกับ Topology
Downlink|Link ลงไปฝั่งปลายทาง/Access ตามบริบท Topology
`;
const pythonData=`
Class|แบบกำหนดข้อมูลและพฤติกรรมสำหรับสร้าง instance เช่น class Book
Object|ออบเจ็กต์ที่มีชนิดและ identity เช่น List หรือ instance ที่สร้างจาก Class
Method|ฟังก์ชันที่เรียกผ่าน class หรือ instance ตามรูปแบบที่กำหนด
Override|กำหนด method ใน subclass เพื่อแทนพฤติกรรมชื่อเดียวกันของ class แม่
super|เข้าถึง method ตามลำดับการสืบทอดจาก class ปัจจุบัน ไม่ใช่การคัดลอก object
vars|คืน Dictionary ของ attributes ที่เก็บใน __dict__ ถ้าออบเจ็กต์รองรับ
StringIO|สตรีมข้อความในหน่วยความจำ ใช้อ่าน/เขียนคล้ายไฟล์ ไม่ใช่ไฟล์บนดิสก์
TemporaryDirectory|สร้างโฟลเดอร์ชั่วคราวและลบเมื่อออกจาก context manager
Comprehension|สร้างกลุ่มข้อมูลจากการวนสมาชิกและนิพจน์ อาจกรองด้วย if เช่น List comprehension
Bitwise|การคำนวณทีละบิตของจำนวนเต็ม ไม่ใช่ and/or ที่ตัดสินค่าความจริง
zip|จับคู่สมาชิก iterable ตามตำแหน่ง โดยปกติหยุดที่ชุดสั้นที่สุด
*args|รวบรวม positional arguments ที่เหลือเป็น Tuple
**kwargs|รวบรวม keyword arguments ที่เหลือเป็น Dictionary
Iterator|ออบเจ็กต์ที่อ่านสมาชิกถัดไปด้วย next() และจำตำแหน่งการอ่าน
Generator|Iterator ที่สร้างจากฟังก์ชัน yield หรือ generator expression ทำงานเมื่อขอสมาชิก
yield|ส่งค่าออกจาก Generator แล้วพักสถานะเพื่อทำต่อในครั้งถัดไป
StopIteration|สัญญาณว่า Iterator ไม่มีสมาชิกถัดไปแล้ว
Instance|ออบเจ็กต์ที่สร้างจาก Class มีข้อมูลของตนเองตามการออกแบบ
self|ชื่อพารามิเตอร์ตามธรรมเนียมที่รับ instance ใน method
__init__|method เตรียมข้อมูล instance หลังสร้างออบเจ็กต์ ไม่ใช่ return object
Inheritance|การสืบทอดพฤติกรรมจาก class แม่และเพิ่มหรือ override ใน class ลูก
Composition|การประกอบออบเจ็กต์หนึ่งไว้เป็นส่วนหนึ่งของอีกออบเจ็กต์
Duck Typing|ใช้พฤติกรรมที่ต้องการ เช่น method ที่เรียกได้ แทนการบังคับ class เดียวกัน
classmethod|method ที่รับ class ผ่าน cls แทน instance ผ่าน self
Context Manager|จัดการการเข้าและออกจากบล็อก with เช่น ปิดไฟล์แม้เกิด exception
CSV|Comma-Separated Values · รูปแบบตารางข้อความ ค่าที่อ่านยังต้องแปลงชนิดตามงาน
JSON|JavaScript Object Notation · รูปแบบแลกเปลี่ยนข้อมูล ไม่ใช่โค้ดสำหรับ eval
sorted|คืน List ใหม่ที่เรียงตาม key โดยไม่แก้ iterable ต้นฉบับ
Stable Sort|การเรียงที่รักษาลำดับเดิมของสมาชิกที่มี key เท่ากัน
Python|ภาษาโปรแกรมที่ใช้การย่อหน้าเป็นส่วนหนึ่งของโครงสร้างคำสั่ง
print|ฟังก์ชันแสดงข้อมูลไปยัง Output
input|ฟังก์ชันอ่านข้อมูลเข้าเป็น str; ต้องแปลงเองหากต้องการตัวเลข
Variable|ชื่อที่ผูกกับค่า/ออบเจ็กต์ ไม่ใช่ช่องที่เก็บได้เฉพาะชนิดเดียวตลอดไป
Indentation|การย่อหน้าที่ระบุกลุ่มคำสั่ง Python ต้องสม่ำเสมอใน Block
Comment|ข้อความอธิบายโค้ดหลัง # ไม่ถูกทำงานเป็นคำสั่ง
str|ชนิดข้อความ เช่น "hello"
int|ชนิดจำนวนเต็ม เช่น 12
float|ชนิดเลขทศนิยมแบบ Floating point มีข้อจำกัดความแม่นยำ
bool|ค่าความจริง True หรือ False
True|ค่าความจริงจริงของชนิด bool
False|ค่าความจริงเท็จของชนิด bool
None|ค่าแทนการไม่มีผล/ค่าเฉพาะ ไม่ใช่ 0 หรือข้อความว่าง
Operator|ตัวดำเนินการ เช่น + คำนวณ หรือ == เปรียบเทียบ
if|ตรวจเงื่อนไขเพื่อเลือกทำ Block
elif|ตรวจเงื่อนไขถัดไปเมื่อเงื่อนไขก่อนหน้าไม่ผ่าน
else|Block ทางเลือกเมื่อเงื่อนไขก่อนหน้าไม่ผ่าน
and|จริงเมื่อเงื่อนไขทั้งสองจริง; Python คืน Operand และ Short-circuit ได้
or|จริงเมื่อมีเงื่อนไขจริง; Python คืน Operand และ Short-circuit ได้
not|กลับค่าความจริง
for|วนทำงานกับสมาชิกของ Iterable
while|ทำซ้ำขณะเงื่อนไขยังจริง ระวัง Loop ไม่จบ
range|ลำดับจำนวนเต็มที่ไม่รวม Stop เช่น range(3) คือ 0,1,2
break|ออกจาก Loop ชั้นใกล้ที่สุด
continue|ข้ามส่วนที่เหลือในรอบนี้แล้วเริ่มรอบถัดไป
List|ข้อมูลลำดับที่แก้สมาชิกได้ เขียนด้วย []
Tuple|ข้อมูลลำดับที่เปลี่ยนสมาชิกของ Tuple ไม่ได้ เขียนเช่น (1,2)
Set|กลุ่มสมาชิกไม่ซ้ำ ไม่มี Index แบบ List
Dictionary|ข้อมูลคู่ Key/Value ใช้ Key ค้นค่า เขียนด้วย {}
Key|ชื่อ/ค่าที่ใช้ค้นใน Dictionary ต้อง Hash ได้
Index|ตำแหน่งสมาชิก Python เริ่มที่ 0; Index ลบอ้างจากท้าย
Slice|เลือกช่วงสมาชิก เช่น a[1:3] ไม่รวมตำแหน่ง Stop
Function|ชุดคำสั่งเรียกซ้ำได้ สร้างด้วย def
Parameter|ชื่อรับค่าที่ประกาศในนิยามฟังก์ชัน
Argument|ค่าที่ส่งขณะเรียกฟังก์ชัน
return|ส่งค่ากลับและออกจากฟังก์ชัน; ไม่มี return จะได้ None
Scope|ขอบเขตที่ค้นและใช้งานชื่อได้ เช่น Local/Global
Exception|ข้อผิดพลาดขณะทำงานที่ส่งผลต่อ Flow และจัดการด้วย try/except ได้
try|Block ที่ให้ Python เฝ้าข้อผิดพลาด
except|Block จัดการ Exception ที่ตรงชนิด
finally|Block ทำงานหลัง try ไม่ว่าจะเกิดข้อผิดพลาดหรือไม่ตามกลไก
Module|หน่วยโค้ดที่ import ใช้ได้ เช่น ไฟล์ .py
import|คำสั่งนำ Module/ชื่อมาใช้งาน
Membership|การตรวจสมาชิกด้วย in / not in
Identity|การตรวจว่าเป็นออบเจ็กต์เดียวกันด้วย is ต่างจาก == ที่ตรวจค่า
Reference|การที่ชื่ออ้างถึงออบเจ็กต์; b = a ไม่ได้คัดลอกออบเจ็กต์
Alias|อีกชื่อที่อ้างถึงออบเจ็กต์เดียวกัน
Shallow copy|สำเนาก้อนนอก แต่สมาชิกซ้อนยังอาจอ้างถึงก้อนเดิม
Deep copy|สำเนาโครงสร้างซ้อนตามกลไก deepcopy; ไม่ใช่ทุกสิ่งคัดลอกได้โดยไม่มีข้อจำกัด
Mutable|ออบเจ็กต์ที่แก้สถานะในก้อนเดิมได้ เช่น List
Immutable|ออบเจ็กต์ที่เปลี่ยนค่าในก้อนเดิมไม่ได้ เช่น int/str
Lambda|นิพจน์สร้างฟังก์ชันขนาดเล็กด้วย lambda มีนิพจน์เดียวและคืนผลนิพจน์นั้น
Recursion|ฟังก์ชันเรียกตัวเอง ต้องมี Base case และความคืบหน้าไปถึงจุดหยุด
Call Stack|ลำดับ Frame ของการเรียกฟังก์ชันที่ยังไม่คืนค่า ไม่ใช่คิว Loop
Base case|กรณีหยุดของ Recursion ที่ไม่เรียกตัวเองต่อ
Local|ชื่อ/ค่าภายในขอบเขตการเรียกฟังก์ชันนั้น
Global|ชื่อในขอบเขต Module; การกำหนดค่าในฟังก์ชันมีข้อกำหนดเรื่อง global
Iterable|ออบเจ็กต์ที่ดึงสมาชิกเพื่อวน for ได้ เช่น List หรือ range
ValueError|ข้อผิดพลาดเมื่อค่าที่ให้ไม่เหมาะสมกับการทำงาน เช่น int("abc")
TypeError|ข้อผิดพลาดเมื่อชนิด/วิธีใช้ไม่รองรับ เช่น บวก str กับ int โดยตรง
IndexError|ข้อผิดพลาดเมื่อ Index อยู่นอกขอบเขตของลำดับ
KeyError|ข้อผิดพลาดเมื่อค้น Key ที่ไม่มีด้วย Dictionary indexing
NameError|ข้อผิดพลาดเมื่อค้นชื่อที่ยังไม่มีในขอบเขตที่ใช้งาน
SyntaxError|รูปคำสั่งไม่ถูกไวยากรณ์ จึงอ่าน/เตรียมโปรแกรมไม่ได้
IndentationError|รูปแบบย่อหน้าไม่ถูกต้อง เป็นข้อผิดพลาดไวยากรณ์ชนิดหนึ่ง
Traceback|ลำดับจุดเรียกที่นำไปสู่ Exception ใช้หาว่าผิดไฟล์และบรรทัดใด
append|เพิ่มสมาชิกหนึ่งชิ้นท้าย List และแก้ List เดิม
len|ฟังก์ชันคืนจำนวนสมาชิก/ความยาวที่ออบเจ็กต์รองรับ
sum|ฟังก์ชันรวมค่าของ Iterable ที่ใช้บวกได้
`;
const parse=(data,track)=>data.trim().split('\n').map(row=>{const [name,meaning]=row.split('|');return {name,meaning,track};});
export const glossaryEntries=[...parse(networkData,'network'),...parse(pythonData,'python')];
const aliases={'DHCP Relay':['Relay'],'DHCP DISCOVER':['DISCOVER','DHCPDISCOVER'],'DHCP OFFER':['OFFER','DHCPOFFER'],'DHCP REQUEST':['REQUEST','DHCPREQUEST'],'DHCP ACK':['ACK','DHCPACK'],'DHCP NAK':['NAK','DHCPNAK'],'TCP ACK':['ACK','SYN-ACK'],'Dictionary':['Dict','พจนานุกรม'],'Variable':['ตัวแปร'],'Indentation':['ย่อหน้า'],'Function':['ฟังก์ชัน'],'Reference':['การอ้างถึง'],'Index':['ดัชนี'],'Operator':['ตัวดำเนินการ'],'Bit':['บิต'],'Byte':['ไบต์']};
const escapeRE=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export function searchGlossary(rows,value){const query=value.trim().toLowerCase();if(!query)return rows;const exact=new RegExp(`(^|[^a-z0-9])${escapeRE(query)}($|[^a-z0-9])`,'i'),words=rows.filter(row=>exact.test(row[0])),names=rows.filter(row=>row[0].toLowerCase().includes(query));return words.length?words:names.length?names:rows.filter(row=>row[1].toLowerCase().includes(query));}
export function termsForLesson(lesson){
 const collect=value=>typeof value==='string'?value:Array.isArray(value)?value.map(collect).join(' '):value&&typeof value==='object'?Object.values(value).map(collect).join(' '):'';
 const text=['title','scenario','explain','states','termMechanisms','starter','work','question','choices','hint','reason'].map(key=>collect(lesson[key])).join(' '),dhcp=/dhcp/i.test(text);
 return glossaryEntries.filter(e=>e.track===lesson.track).map(e=>{
  if((e.name==='TCP ACK'&&dhcp)||(e.name.startsWith('DHCP ')&&!dhcp))return null;
  if(e.name==='ACK'&&(dhcp||/tcp/i.test(text)))return null;
  if(e.name==='NAK'&&dhcp)return null;
  const keys=[e.name,...(aliases[e.name]||[])];let first=Infinity;
  for(const key of keys){const match=new RegExp(`(^|[^A-Za-z0-9_])${escapeRE(key)}(?=$|[^A-Za-z0-9_])`,'i').exec(text);if(match)first=Math.min(first,match.index);}
  return Number.isFinite(first)?{...e,first}:null;
 }).filter(Boolean).sort((a,b)=>a.first-b.first||b.name.length-a.name.length);
}
const html=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function lessonTermsSurface(lesson){const entries=termsForLesson(lesson);return entries.length?`<details class="lesson-terms" open><summary>คำศัพท์ในบทนี้ · ตามลำดับที่พบ (${entries.length})</summary><dl>${entries.map(e=>`<dt>${html(e.name)}</dt><dd>${html(e.meaning)}</dd>`).join('')}</dl></details>`:'';}
