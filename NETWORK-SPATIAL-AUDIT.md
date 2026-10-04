# Network spatial audit — 2026-10-03

เผยแพร่แล้ว 2026-10-03: https://7cf2dce9.techatlas-aoh.pages.dev — เว็บหลัก https://techatlas-aoh.pages.dev หลังผู้ใช้อนุมัติ สำรวจ source ครบ 54 บท: 52 บทมี 3D (เพิ่ม 24 บทใน shared mechanism renderer; 17 renderer เดิม/เฉพาะบท และ shared 35 บท) อีก 2 บทใช้เครื่องมือข้อมูล 2D เพราะโจทย์คือการคำนวณ/เปรียบเทียบ ไม่ใช่เส้นทางอุปกรณ์

หลักฐานรอบเผยแพร่: model/controller checks 37 บท / 103 สถานการณ์, browser shared 3D 35 บทและ Python 35 ฉากผ่าน ตรวจเว็บจริง OSI canvas/ซ่อน Stack ซ้ำ และ SHA-256 ของโมเดลตรงกับ release ไม่ใช่การตรวจภาพทุกมุมของทุกบท เอกสารนี้อัปเดตตามผลรอบก่อน ไม่ได้รันทดสอบใหม่ในรอบแก้ Markdown

3D ใช้ nodes, links, transfers, fields และ active/blocked ของ teaching model เดิม ไม่อนุมาน Packet จากเส้นที่ไฮไลต์ ขั้นที่ไม่มี transfer แสดงสถานะ/การตัดสินใจเท่านั้น มีแผงข้อมูลในภาพ; ACL/cache/route table/planes/desired state เป็นบริบทเชิงตรรกะ ไม่ใช่ Router เพิ่ม ใช้เส้นประแยกออกจาก link จริง

OSI: ซ่อน stack 2D ที่ซ้ำเมื่อ 3D พร้อม ย้ายเฉพาะ inspector Header ไปใต้คำอธิบาย; stack 2D มีไว้ fallback เท่านั้น

เลขเฟสใช้ชุดเดียว: 0 → เฟส 1 ขั้น 01–14 → 2 → 3 ทั้ง Explore และ Path ไม่ใช้เลข path อีกชุดหนึ่ง ไม่มี 1 หลัง 1.13 อีกแล้ว คงลำดับ prerequisite Ethernet/MAC → IPv4 → ARP → VLAN และเนื้อหาเดิม ไม่เปลี่ยน ID/progress

## Inventory

| เฟส/ขั้น | ID | บท | ภาพ |
|---|---|---|---|
| 0 | computer-os | Computer / OS และ Command line | 3D |
| 0 | number-systems | Binary, Decimal และ Hex | 3D |
| 0 | devices | Hub, Switch, Router, Firewall และ AP | 3D |
| 0 | physical | Physical: UTP, Fiber, Speed และ Duplex | 3D |
| 0 | osi-model | OSI 7 ชั้น และ TCP/IP 4 ชั้น | 3D |
| 0 | encapsulation | Encapsulation: ข้อมูลถูกห่ออย่างไร | 3D |
| 0 | internet | จาก Computer สู่โลก Internet | 3D |
| 1·01 | layer2 | Layer 2: Frame, MAC และ Switch | 3D |
| 1·02 | address | IP และเครือข่ายเดียวกัน | 3D |
| 1·02 | subnet | แบ่งเครือข่ายด้วย Subnet | 3D |
| 1·02 | dhcp | DHCP: DORA และ Lease | 3D · เพิ่มรอบนี้ |
| 1·02 | gateway | ทำไมอุปกรณ์เชื่อมต่อไม่ได้ | 3D |
| 1·03 | arp-icmp | ARP, ICMP และการตรวจด้วย Ping | 3D |
| 1·04 | vlan | VLAN: แยกเครือข่ายบน Switch | 3D |
| 1·05 | stp | Switching Loop และ STP / RSTP | 3D |
| 1·05 | etherchannel | EtherChannel / LACP | 3D |
| 1·06 | vlsm | VLSM: จัดสรร Subnet ต่างขนาด | 2D tool · คงไว้โดยตั้งใจ |
| 1·07 | protocols | TCP, UDP และ Port | 3D |
| 1·07 | tcp-handshake | TCP Handshake, Port และ Socket | 3D · เพิ่มรอบนี้ |
| 1·07 | https | HTTP, HTTPS และ TLS | 3D · เพิ่มรอบนี้ |
| 1·08 | ipv6-address | IPv6 Address, Prefix และ Link-local | 2D tool · คงไว้โดยตั้งใจ |
| 1·08 | slaac | NDP, RA, SLAAC และ Dual-stack | 3D · เพิ่มรอบนี้ |
| 1·09 | layer3 | Layer 3: เลือกเส้นทางด้วย IP | 3D |
| 1·09 | static-routing | Connected, Static และ Default Route | 3D |
| 1·09 | inter-vlan | Inter-VLAN Routing: จาก Frame สู่ Packet | 3D |
| 1·09 | ospf | OSPF Single Area | 3D |
| 1·09 | hsrp | Gateway สำรอง: HSRP และแนวคิด VRRP | 3D |
| 1·10 | dns | ชื่อเว็บไซต์กลายเป็น IP ได้อย่างไร | 3D |
| 1·10 | dns-cache | DNS Records, Cache และ TTL | 3D · เพิ่มรอบนี้ |
| 1·10 | mail | Email: SMTP, MX, IMAP และ POP3 | 3D · เพิ่มรอบนี้ |
| 1·10 | nat-pat | NAT / PAT และตารางการแปลง | 3D · เพิ่มรอบนี้ |
| 1·10 | proxy-lb | Proxy, Reverse Proxy และ Load Balancer | 3D · เพิ่มรอบนี้ |
| 1·10 | monitoring | NTP, Syslog และ SNMP | 3D · เพิ่มรอบนี้ |
| 1·11 | acl | ACL และ Stateful Firewall | 3D · เพิ่มรอบนี้ |
| 1·11 | dmz | Firewall Zone และ DMZ | 3D · เพิ่มรอบนี้ |
| 1·11 | port-security | Port Security บน Access Port | 3D · เพิ่มรอบนี้ |
| 1·11 | dhcp-snooping | DHCP Snooping และ Dynamic ARP Inspection | 3D · เพิ่มรอบนี้ |
| 1·11 | aaa-ssh | AAA, SSH และการบริหารอย่างปลอดภัย | 3D · เพิ่มรอบนี้ |
| 1·11 | vpn | VPN เบื้องต้น: Tunnel และ Encryption | 3D |
| 1·12 | wireless-radio | Wi-Fi: SSID, Channel และ Interference | 3D |
| 1·12 | wlc | WLAN Architecture, WLC และ AP Modes | 3D |
| 1·12 | wifi-security | Roaming และ Wi-Fi Security | 3D · เพิ่มรอบนี้ |
| 1·13 | rest-json | REST API, JSON และ Authentication | 3D · เพิ่มรอบนี้ |
| 1·13 | automation-tools | Ansible / Terraform: Desired State | 3D · เพิ่มรอบนี้ |
| 1·13 | sdn | SDN, Planes และ Catalyst Center | 3D · เพิ่มรอบนี้ |
| 1·14 | network-commands | Network Commands: เลือกคำสั่งให้ตรงคำถาม | 3D · เพิ่มรอบนี้ |
| 1·14 | pcap | อ่าน Packet Capture แบบ Wireshark | 3D · เพิ่มรอบนี้ |
| 1·14 | troubleshooting | Troubleshooting: แยกปัญหาทีละชั้น | 3D · เพิ่มรอบนี้ |
| 1·14 | packet | Computer สู่ Internet: ประกอบความรู้ทั้งหมด | 3D |
| 2 | wan | WAN: เชื่อมสองสถานที่ด้วย Link เฉพาะ | 3D · เพิ่มรอบนี้ |
| 2 | mpls | MPLS: เดินทางผ่าน Label | 3D |
| 2 | mpls-vpn | MPLS L3VPN: CE / PE / P และ VRF | 3D |
| 3 | cloud-vpc | Cloud VPC: Subnet, Route Table และ Gateway | 3D · เพิ่มรอบนี้ |
| 3 | cloud-hybrid | Hybrid Cloud และ Hub-and-Spoke | 3D · เพิ่มรอบนี้ |

## ขอบเขต

อัปเดต 2026-10-04 (เผยแพร่แล้วใน https://8105e611.techatlas-aoh.pages.dev): Internet ใช้โลก 13 จุดจาก internet-model.js กับ shared scene แทน renderer เดิม 4 จุด; ตัวเลข 35 หมายถึง shared mechanism lessons ตาม networkLabSpecs ไม่รวม Internet ตัวใหม่ แก้ TCP default ให้เล่นครบสามขั้น เพิ่ม actual-page playback audit ครบ 54 บทและตรวจ marker movement/103 scenarios ดู context.md สำหรับผลตรวจรอบนี้ ไม่เปลี่ยนจำนวนบทหรือบังคับ VLSM/IPv6 tool เป็น 3D

- ทุกภาพเป็น bounded teaching model ไม่ใช่ network emulator, packet capture หรือคำสั่ง CLI จริง
- VLSM: แผนที่ address pool 2D พร้อมค่าคำนวณ; IPv6 addressing: กลุ่ม 16 บิตและการย่อที่อยู่ 2D ไม่ใส่ router เพื่อทำเป็น 3D เทียม
- แบบจำลอง Cloud route table และ SDN plane แสดงความสัมพันธ์เชิงตรรกะ ไม่ได้อ้างตำแหน่ง hardware จริง
- ผลทดสอบดู context.md; การผ่าน automated checks ไม่เท่ากับตรวจทุกมุม/ทุกอุปกรณ์ด้วยตา
