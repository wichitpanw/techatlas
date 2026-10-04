# Network: จากพื้นฐานสู่การวิเคราะห์บริการโทรคมนาคม

วันที่ 2026-10-04 · แผนที่ผู้ใช้อนุมัติให้เริ่มพัฒนา ไม่ใช่การอนุมัติ Deploy

## หลักการจัดลำดับ

รักษา lesson IDs และ progress เดิม ใช้ network-foundations.js เป็นแหล่งลำดับเดียวของ Explore/Path ไม่สร้างเลขเฟสอีกชุด ไม่เพิ่มบทเพียงเพื่อเพิ่มจำนวน: ตรวจบทเดิม แล้วขยายหรือแบ่งเฉพาะเมื่อมีเป้าหมายการเรียนใหม่จริง

พื้นฐานเครื่อง/OSI → Ethernet → IPv4/ARP → VLAN/STP/VLSM → Transport → Routing → Services → Security/Wireless → Operations → WAN/MPLS → Cloud เป็นแกนเดิม หัวข้อใหม่แทรกตาม prerequisite ด้านล่าง ก่อนเปลี่ยนเลขหัวข้อให้ตรวจทั้ง Explore/Path/Previous/Next ไม่เปลี่ยนทั้งหมดจนเนื้อหาพร้อม

## งานครบทั้งสิบชุด

| ชุด | ที่อยู่ในเส้นทาง / prerequisite | งานและภาพที่จะทำ | เกณฑ์ผ่าน |
|---|---|---|---|
| 1 CLI เชื่อมภาพ | ขยาย network-commands; หลัง IP/ARP/Transport/Services ใน Operations | แยกการอ่าน config/cache/socket ซึ่งไม่มี probe ออกจาก ping/DNS/traceroute; คลิกหลักฐานแล้วเห็นจุดที่เกี่ยวข้อง ต่อด้วย MAC/ARP/route lookup ในบทเดิม | ระบุว่าหลักฐานยืนยันอะไรและยังไม่ยืนยันอะไร |
| 2 Troubleshooting | ขยาย troubleshooting หลังชุด 1 | case สาย/VLAN/IP/route/DNS/application; เลือกตรวจ เก็บหลักฐาน ตั้งสมมติฐาน แล้วเลือกตรวจต่อ ไม่เฉลยจุดเสียก่อนวิเคราะห์ | ใช้หลักฐานที่จำเป็นก่อนตอบ; timeout ไม่เท่ากับอุปกรณ์ดับ |
| 3 FTTH | หลัง Physical/VLAN; ใส่เส้นทางผู้ให้บริการต่อจาก WAN ก่อน MPLS ขั้นสูง | ONT/ONU → splitter → OLT → aggregation → BNG; optical access ไม่เหมือน Ethernet switch ทุกจุด | อธิบายขอบเขต access/aggregation/service และจุดเสีย |
| 4 Subscriber session | หลัง FTTH, DHCP, AAA | PPPoE discovery/session/authentication และ IPoE เป็นคนละแนวทาง; RADIUS; ได้ IP แต่สิทธิ์ไม่ผ่าน | แยก link up, session up, authentication และ Internet reachable |
| 5 คุณภาพเครือข่าย | หลัง TCP/UDP; ก่อน QoS | bandwidth/throughput/latency/jitter/loss; timeline/graph เทียบไฟล์ วิดีโอ เกม | เทียบตัวชี้วัดได้โดยไม่สรุปจาก speed test เดียว |
| 6 QoS | หลังชุด 5 | คิว จำกัด capacity, scheduling, drops; DSCP และ shaping/policing แบบ bounded model | อธิบาย congestion กับ link failure และ trade-off ของคิว |
| 7 บริการองค์กร | ขยาย WAN/MPLS VPN หลัง routing | Internet vs private branch network; CE/PE/P; VRF, overlapping IP; label push/swap/pop และ return path | packet ไม่ข้าม VRF; MPLS ไม่แปลว่า encryption |
| 8 BGP/ISP interconnection | หลัง static/OSPF, WAN; ก่อน Cloud connectivity | AS/prefix/peering/transit/policy; control-plane announcements ก่อน forwarding; failover | แยก routing policy จาก shortest physical path และไม่ส่ง user packet ผ่าน controller |
| 9 CGNAT/IPv6 | ต่อ NAT/PAT และ IPv6; ก่อนบริการ inbound/ผู้ให้บริการขั้นสูง | home NAT → CGNAT mappings; IPv6 route/firewall; inbound restrictions | แยก address translation กับ firewall และ IPv6 ไม่เท่ากับปลอดภัย/เปิดรับทุกอย่าง |
| 10 NOC/Incident | ขยาย monitoring/troubleshooting หลัง routing/services; capstone หลังชุด 3–9 | alarm/log/counters/time, service-impact map, incident timeline, safe change/rollback | แยก symptom/root-cause; สรุปผลกระทบพร้อมหลักฐาน ไม่แก้ระบบจริง |

## ลำดับส่งมอบ

1. CLI + Troubleshooting ในบทเดิม: แก้กลไกที่คลาดเคลื่อนก่อน เพิ่ม evidence notebook และตรวจ UI
2. Quality → QoS: โมเดลคิวคำนวณจริงและกราฟ ไม่วาด loss แบบสุ่มโดยไม่มีเหตุ
3. FTTH → subscriber: แสดงโครงสร้าง access และสถานะบริการ
4. WAN/MPLS/VRF → BGP → CGNAT/IPv6: ต่อหัวข้อเดิม ไม่สร้างสำเนา
5. NOC capstone: ใช้กลไกที่เรียนมา ไม่สร้างข้อสอบศัพท์ล้วน

ทุกชุดต้องมี scenario/mission/hint/feedback/reset, successful/failed case, keyboard/reduced-motion/fallback ตามชนิดภาพ และ card preview ใช้โมเดลเดียวกับบท จำนวนบทใหม่ยังไม่กำหนดจน audit duplication เสร็จ

## ขอบเขตและอ้างอิง

เป็นเครือข่ายสมมติ ไม่ใช่ topology/config ภายใน NT ไม่เชื่อมระบบบริษัท ไม่ใช้ข้อมูลลูกค้า แบบจำลองไม่ใช่ vendor emulator หรือ packet capture จริง เนื้อหาเรียบเรียงใหม่และสร้างตัวอย่างเอง

- CLI: https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/arp — อ่าน cache ไม่สร้าง ARP request เพียงเพราะใช้ arp -a
- Broadband architecture: https://www.broadband-forum.org/pdfs/tr-156-4-0-0.pdf — ใช้ตรวจส่วนที่เกี่ยวข้องเมื่อเริ่ม FTTH ไม่อ้างว่าอ่านทั้งฉบับแล้ว
- BGP: https://www.rfc-editor.org/rfc/rfc4271
- L3VPN: https://www.rfc-editor.org/rfc/rfc4364
- CGNAT: https://www.rfc-editor.org/rfc/rfc6598

## สถานะ

### ส่งมอบ Local ครบหัวข้อหลักในขอบเขตแบบจำลอง — 2026-10-04

1. CLI: แยกการอ่านกับ Probe และ evidence notebook เดิม; sandbox ใหม่คลิก MAC/route/link/VLAN แล้วแสดงจุดที่เกี่ยวข้องโดยไม่สร้าง Packet จากการอ่านตาราง
2. Troubleshooting: คง 3 Incident เดิม เพิ่ม 3 configuration repair cases VLAN/route/uplink ต้องเก็บ baseline/evidence ก่อนแก้และ retest พร้อม rollback
3–4. FTTH / Subscriber: 3D bounded fixtures แยก Optical access, PPPoE discovery/auth/IP, IPoE และ RADIUS reject
5–6. Quality / QoS: queue model เดิม + Video buffer + Token bucket shaping/policing มี 3D และ completion gate สอง configuration; DSCP เป็นคำอธิบายนโยบาย ไม่ใช่ emulator เต็มรูปแบบ
7–9. Enterprise / BGP / CGNAT-IPv6: เพิ่ม 3D scenarios ในเส้นทาง Provider หลัง prerequisite เดิม; policy/withdraw/VRF/inbound มีขอบเขตสมมติชัดเจน
10. NOC: ผู้เรียนเก็บหลักฐานและลงมือเปลี่ยน/ทดสอบ/rollback ใน Sandbox มี timeline การกระทำและ impact A/B ไม่ใช่ข้อสอบศัพท์อย่างเดียว

Local 64 Network บท; Production ยัง 56 บท ชุดนี้ไม่ Deploy อัตโนมัติ ฟีเจอร์ใหม่ผ่าน model และ browser tests เฉพาะส่วนที่เพิ่ม/แก้ ตามหลักฐานใน context.md ไม่อ้างว่าได้ตรวจ Labs เก่าซ้ำทั้งหมด แผนนี้เสร็จในระดับบทเรียนแบบจำลอง ไม่ใช่การสร้าง ISP/vendor emulator ครบทุก Protocol; advanced QoS remark, adaptive video, full BGP best-path และ configuration อุปกรณ์จริงอยู่นอกขอบเขต

### ประวัติก่อนส่งมอบชุด Local ล่าสุด

Quality/QoS เพิ่ม 3D และ Deploy แล้วใน 625959c2 (2026-10-04); ข้อความต้นแบบ 2D ด้านล่างเป็นประวัติก่อนอัปเกรด

เริ่ม Provider prototypes อีกหกบทในเครื่อง ครอบคลุม FTTH, PPPoE/IPoE/RADIUS, enterprise VPN vs Internet, BGP policy/withdraw, CGNAT/IPv6 และ NOC dependency/timeline ใช้ 18 bounded fixtures มี 3D และ completion gate ขณะนี้ยังไม่ Deploy และยังไม่ถือว่าครบทุกแผน: ยังเหลือ VLAN/route troubleshooting+repair/retest, video buffer, shaping/policing, MAC/route evidence clicking และ NOC capstone ที่ผู้เรียนลงมือวิเคราะห์/เปลี่ยนจริงใน sandbox

Quality/QoS ต้นแบบสองบทในเครื่องแล้ว: network-quality → qos-queues แทรกหลัง HTTPS ก่อน IPv6 จำนวน Local 56; คิว 2D แสดงค่าคำนวณจริง รองรับ FIFO/priority/capacity/buffer/load/base delay ยังไม่มี video buffer/shaping/policing simulator หรือฉาก 3D ตรวจเฉพาะโมเดลใหม่ 54 combinations และ UI QoS ไม่ได้ Deploy

ชุด 1 เริ่มในบท network-commands: ปรับ read-only commands ไม่สร้าง traffic และผล DNS ให้ตรง IP ในฉาก; เพิ่มสมุดหลักฐานสัมพันธ์กับขั้นที่อ่าน

ชุด 2 เริ่มแล้ว: ปรับสาม incident เดิมเป็นเก็บหลักฐาน → เลือกแนวทางตรวจต่อ → quiz โดยไม่แสดง Known fault ก่อนทดลอง ตรวจ model 15 probes และ UI ครบสามเคสผ่าน ยังต้องขยาย VLAN/route cases, repair/retest และ responsive QA ก่อนถือว่าชุดครบ ส่วนชุด 3–10 เป็น Planned ไม่เปลี่ยนจำนวนบทที่เผยแพร่จนแต่ละชุดพร้อม ไม่มี Deploy รอบนี้
