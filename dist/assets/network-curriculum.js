const chapter = (
  id,
  title,
  subtitle,
  explain,
  question,
  choices,
  answer,
  reason,
  extra = {},
) => ({
  id,
  track: "network",
  title,
  subtitle,
  explain,
  question,
  choices,
  answer,
  reason,
  visual: "network",
  scene: "network",
  tag: "NETWORK / FOUNDATIONS",
  time: 20,
  scenario: subtitle,
  steps: [
    "อ่านแผนผังและสถานการณ์",
    "เปลี่ยนค่าที่ควบคุมแล้วส่งข้อมูล",
    "ตอบภารกิจจากผลที่สังเกต",
  ],
  hint: reason,
  work: "ลองเปลี่ยนเงื่อนไขครั้งละหนึ่งอย่าง แล้วอ่านผลการส่งข้อมูล",
  source:
    "https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work",
  ...extra,
});
export const networkSections = [
  { id: "overview", title: "จากเครื่องของเราไปถึงปลายทาง" },
  { id: "lan", title: "เข้าใจ LAN และที่อยู่" },
  { id: "segmentation", title: "แยกเครือข่ายและเลือกเส้นทาง" },
  { id: "services", title: "บริการและการตรวจปัญหา" },
  { id: "provider", title: "เครือข่ายผู้ให้บริการ" },
];
export const networkLessons = [
  chapter(
    "internet",
    "จาก Computer สู่โลก Internet",
    "ไล่ดู IP → DNS → Gateway → ISP → Web Server → คำตอบกลับ",
    "เมื่อคอมพิวเตอร์เชื่อม Wi-Fi หรือ Ethernet ต้องมี IP, subnet mask, Default gateway และ DNS ซึ่งอาจได้จาก DHCP หรือกำหนดเอง จากนั้นค้น IP ของชื่อเว็บไซต์ ส่งข้อมูลไป Gateway แล้วผ่าน Router ของผู้ให้บริการหลายเครื่องก่อนถึง Server ตัวอย่างนี้ใช้ HTTPS บน TCP/443 และ NAT บน Router บ้าน การเปิดเว็บจริงอาจใช้ HTTP/3 บน QUIC/UDP ได้ด้วย Internet คือเครือข่ายหลายเครือข่ายที่เชื่อมกัน ไม่ใช่ Server กลางเครื่องเดียว",
    "ก่อนเริ่มติดต่อเว็บไซต์ด้วยชื่อ ops.example.test ขั้นตอนใดช่วยหาที่อยู่ IP ของปลายทาง?",
    ["ค้นชื่อด้วย DNS", "แปลงชื่อด้วย MAC table", "เขียน Python ก่อนเสมอ"],
    0,
    "DNS ช่วยค้น IP จากชื่อ ส่วน Gateway และ ISP ใช้ส่งข้อมูลไปยัง IP ที่ได้",
    {
      section: "overview",
      scene: "internet",
      tag: "COMPUTER → INTERNET",
      scenario:
        "Laptop ของคุณใช้ Wi-Fi บ้าน IP 192.168.10.25/24 ต้องเปิด ops.example.test ผ่านผู้ให้บริการอินเทอร์เน็ต",
    },
  ),
  chapter(
    "packet",
    "ข้อมูลเดินทางอย่างไร",
    "ตาม Packet ผ่าน Client, Switch, Router และ Server",
    "Client เริ่มขอข้อมูล Server ให้บริการ Switch ส่ง frame ภายใน LAN ส่วน Router ส่ง packet ระหว่างเครือข่าย ในตัวอย่าง Client 192.168.10.25/24 ติดต่อเครื่องใน LAN ได้โดยตรง แต่ต้องผ่าน Gateway 192.168.10.1 เมื่อไปหา Server 10.0.0.10",
    "ถ้า Server อยู่คนละเครือข่ายกับ Client อุปกรณ์ใดช่วยส่งข้อมูลออกจาก LAN?",
    ["Switch อย่างเดียว", "Router / Default gateway", "Client เครื่องอื่น"],
    1,
    "Default gateway คือที่อยู่ Router ที่เครื่องใช้ไปยังเครือข่ายอื่น",
    { section: "overview", tag: "PACKET JOURNEY", time: 15 },
  ),
  chapter(
    "layer2",
    "Layer 2: Frame, MAC และ Switch",
    "ใช้ MAC table เลือกพอร์ต และสังเกต Unknown unicast",
    "Ethernet frame มี source และ destination MAC Switch เรียน source MAC จากพอร์ตที่รับข้อมูล แล้วค้น destination MAC ใน MAC table ของ VLAN เดียวกัน ถ้ารู้จะส่งเฉพาะพอร์ตนั้น ถ้าไม่รู้จะ flood ออกพอร์ตอื่นใน VLAN เดียวกัน ARP ใน IPv4 ช่วยหา MAC ที่สัมพันธ์กับ IP บน link ที่เข้าถึงได้โดยตรง เมื่อไปต่างเครือข่ายจะหา MAC ของ Gateway ไม่ใช่ MAC ของ Server ที่อยู่ไกล",
    "เมื่อ Switch รู้ destination MAC อยู่ที่พอร์ต 2 ควรส่ง frame อย่างไร?",
    ["ส่งเฉพาะพอร์ต 2 ใน VLAN นั้น", "ส่งทุก VLAN", "เปลี่ยน destination IP"],
    0,
    "Known unicast ใช้ MAC table ส่งไปพอร์ตปลายทางภายใน VLAN ที่ตรงกัน",
    {
      section: "lan",
      scene: "layer2",
      tag: "L2 / MAC TABLE",
      source: "https://www.rfc-editor.org/rfc/rfc826",
    },
  ),
  chapter(
    "address",
    "IP และเครือข่ายเดียวกัน",
    "เทียบ IP กับ prefix แล้วเลือกส่งตรงหรือผ่าน Gateway",
    "IP เป็นที่อยู่ในเครือข่าย IP ส่วน MAC เป็นที่อยู่ของ frame บน link สำหรับ /24 นี้ Client 192.168.10.25 กับ 192.168.10.2 อยู่ subnet เดียวกัน แต่ 10.0.0.10 อยู่คนละ subnet ต้องดูทั้ง IP และ prefix เสมอ",
    "เครื่องใดอยู่ subnet เดียวกับ 192.168.10.25/24?",
    ["192.168.10.2", "192.168.11.2", "10.0.0.10"],
    0,
    "/24 หมายถึง 24 บิตแรกเป็นส่วน network ในตัวอย่างนี้จึงเทียบสามส่วนแรก",
    {
      section: "lan",
      tag: "IP ADDRESSING",
      time: 18,
      source: "https://www.rfc-editor.org/rfc/rfc791",
    },
  ),
  chapter(
    "subnet",
    "แบ่งเครือข่ายด้วย Subnet",
    "ปรับ /24, /25 และ /26 แล้วอ่านช่วง host และ broadcast",
    "Prefix บอกจำนวนบิตของส่วน network เพิ่มจาก /24 เป็น /26 คือยืม 2 บิต ได้ 4 subnet แต่ละ subnet มี 64 ที่อยู่ สำหรับ LAN IPv4 ทั่วไปมี 62 host หลังหัก network และ broadcast การคำนวณนี้ไม่ครอบคลุมกรณีพิเศษ /31 และ /32",
    "แบ่ง 192.168.10.0/24 เป็น 4 subnet เท่ากัน แต่ละ subnet ใช้ prefix ใด?",
    ["/24", "/25", "/26"],
    2,
    "เพิ่ม prefix 2 บิต ได้ 2² = 4 subnet",
    {
      section: "lan",
      visual: "subnet",
      scene: "subnet",
      tag: "SUBNET LAB",
      time: 25,
      source: "https://www.rfc-editor.org/rfc/rfc4632",
    },
  ),
  chapter(
    "vlan",
    "VLAN: แยกเครือข่ายบน Switch",
    "ทดลอง Access port, Trunk และการติดต่อข้าม VLAN",
    "VLAN แยก Layer 2 broadcast domain บนโครงสร้าง Switch เดียวกัน Access port ในแบบจำลองรับอุปกรณ์หนึ่ง VLAN ส่วน Trunk ระหว่าง Switch ส่งหลาย VLAN ด้วย 802.1Q tag สำหรับ VLAN ที่กำหนด (กรณี native VLAN ไม่แสดงใน Lab นี้) พอร์ตต้องอยู่ VLAN ที่ถูกต้องและ trunk ต้องอนุญาต VLAN ที่จะข้าม ต่าง VLAN ติดต่อกันต้องมี L3 routing และ IP/Gateway ที่ถูกต้อง ใน Lab นี้ PC A อยู่ VLAN10 / 192.168.10.10/24 ปลายทาง VLAN10 ใช้ .20 หรือ VLAN20 ใช้ 192.168.20.20/24",
    "PC A อยู่ VLAN10 และ PC B อยู่ VLAN20 การมี Trunk อย่างเดียวทำให้ติดต่อกันได้หรือไม่?",
    [
      "ได้ เพราะ Trunk รวมทุก VLAN",
      "ต้องมี Inter-VLAN routing และค่า IP/Gateway ที่ถูกต้อง",
      "ได้ ถ้าเลข VLAN ต่างกัน",
    ],
    1,
    "Trunk ขนส่ง frame หลาย VLAN แต่ไม่ทำ routing ระหว่าง VLAN ต้องใช้ Router หรือ L3 Switch",
    {
      section: "segmentation",
      scene: "vlan",
      tag: "VLAN / ACCESS & TRUNK",
      time: 25,
      source:
        "https://www.cisco.com/c/en/us/support/docs/lan-switching/inter-vlan-routing/41260-189.html",
    },
  ),
  chapter(
    "layer3",
    "Layer 3: เลือกเส้นทางด้วย IP",
    "อ่าน Routing table และเลือกเส้นทางที่มี prefix ตรงยาวที่สุด",
    "Router ดู destination IP แล้วเลือก route ที่ตรงด้วย longest prefix match ไม่ใช่เลือกแถวแรกเสมอ เช่น /24 ที่ตรงจะชนะ /16 ที่ตรงด้วย Default route 0.0.0.0/0 ใช้เมื่อไม่มี route ที่เฉพาะกว่า IP ปลายทางยังเป็นปลายทางเดิมใน Lab นี้ แต่ frame/MAC เปลี่ยนตาม link และ TTL ลดเมื่อผ่าน Router",
    "เมื่อปลายทาง 10.20.30.15 ตรงทั้ง 10.0.0.0/8, 10.20.0.0/16 และ 10.20.30.0/24 ควรเลือก route ใด?",
    [
      "/8 เพราะอยู่แถวแรก",
      "/16 เพราะอยู่กลางตาราง",
      "/24 เพราะตรงและเฉพาะที่สุด",
    ],
    2,
    "Longest prefix match เลือก /24 ซึ่งตรงกับ IP ปลายทางและเฉพาะกว่าอีกสองแถว",
    {
      section: "segmentation",
      scene: "routing",
      tag: "L3 / ROUTING TABLE",
      time: 25,
      source: "https://www.rfc-editor.org/rfc/rfc1812",
    },
  ),
  chapter(
    "gateway",
    "ทำไมอุปกรณ์เชื่อมต่อไม่ได้",
    "แก้ Default gateway ให้ตรงกับ Router ที่เข้าถึงได้",
    "Client 192.168.10.25/24 ต้องใช้ Gateway 192.168.10.1 ในสถานการณ์นี้ การได้ IP แล้วไม่รับประกันว่าติดต่อ Server ต่างเครือข่ายได้ IP ของ Server ไม่ใช่ Default gateway ของ Client และเลขท้าย .254 ไม่เป็น Gateway โดยอัตโนมัติ",
    "ค่า Gateway ใดทำให้ Client ไปยัง Server ต่างเครือข่ายได้ในสถานการณ์นี้?",
    ["192.168.10.1", "192.168.10.254", "10.0.0.10"],
    0,
    "เลือก IP ของ Router ที่กำหนดไว้บน LAN นี้",
    {
      section: "services",
      visual: "rack",
      tag: "TROUBLESHOOTING",
      source: "https://www.rfc-editor.org/rfc/rfc1122",
    },
  ),
  chapter(
    "dns",
    "ชื่อเว็บไซต์กลายเป็น IP ได้อย่างไร",
    "แยกขั้นตอน DNS ออกจากการเชื่อมต่อ HTTP/HTTPS",
    "DNS ค้นที่อยู่จากชื่อ เมื่อได้ IP แล้วจึงเชื่อมต่อบริการต่อไป ใน Lab ops.example.test มีข้อมูลชื่อ ส่วน missing.example.test ไม่มี การค้นชื่อสำเร็จไม่ได้รับประกันว่าบริการปลายทางจะตอบ",
    "เชื่อมต่อด้วย IP ได้ แต่ค้นชื่อไม่พบ ควรตรวจอะไรเป็นลำดับแรก?",
    ["DNS และข้อมูลชื่อ", "เปลี่ยนสายทุกเส้น", "จำนวน CPU"],
    0,
    "ตรวจการค้นชื่อก่อน เพราะขั้นตอนนี้ต่างจากการติดต่อบริการด้วย IP",
    {
      section: "services",
      scene: "dns",
      tag: "DNS & HTTPS",
      time: 15,
      source:
        "https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_domain_name",
    },
  ),
  chapter(
    "protocols",
    "TCP, UDP และ Port",
    "เลือกชนิดการส่งข้อมูลให้ตรงกับบริการปลายทาง",
    "TCP ส่งข้อมูลเป็น stream พร้อมกลไกจัดลำดับและส่งซ้ำ UDP ส่งเป็น datagram โดยไม่มีการรับประกันเหล่านั้นในตัวโปรโตคอล Port แยกบริการบนเครื่อง บริการจำลองในบทนี้มี HTTPS ที่ TCP/443 และ Telemetry ที่ UDP/5000",
    "บริการ HTTPS ในแบบจำลองนี้รับการเชื่อมต่อที่ใด?",
    ["TCP port 443", "UDP port 443", "TCP port 5000"],
    0,
    "บริการนี้กำหนด TCP/443 ต้องใช้ทั้ง IP, Protocol และ Port ให้ตรง",
    {
      section: "services",
      visual: "rack",
      tag: "TRANSPORT & PORTS",
      time: 18,
      source: "https://developer.mozilla.org/en-US/docs/Glossary/TCP",
    },
  ),
  chapter(
    "mpls",
    "MPLS: เดินทางผ่าน Label",
    "ดู Push → Swap → Pop ระหว่าง CE, PE และ P Router",
    "MPLS จัด packet เข้ากลุ่ม forwarding หรือ FEC ที่ทางเข้า แล้วส่งตาม label ในเครือข่ายผู้ให้บริการ Label มีความหมายตาม link/บริบท ไม่ใช่หมายเลขปลายทางแบบ global PE คือ Router ขอบเครือข่ายผู้ให้บริการ P คือ Router แกนกลาง CE คืออุปกรณ์ฝั่งลูกค้า ภาพนี้ PE ทางเข้า push label 100, P swap 100 เป็น 200 และ PE ทางออก pop ก่อนส่ง IP packet ให้ CE เป็นตัวอย่างที่ให้ทางออก pop เพื่อเข้าใจหลักการ ระบบจริงอาจ pop ที่ hop ก่อนหน้า (PHP) และมี label stack MPLS เองไม่ได้เข้ารหัสข้อมูล และไม่รับประกันว่าจะเร็วกว่า IP ในทุกกรณี",
    "P Router ในตัวอย่างใช้ข้อมูลใดเลือก forwarding entry ของ packet ที่ติด label?",
    [
      "Label ขาเข้าตามตารางของ hop นั้น",
      "ชื่อเว็บไซต์ทุกครั้ง",
      "MAC ของ CE ปลายทางที่อยู่ไกล",
    ],
    0,
    "ในตัวอย่างนี้ lookup label 100 แล้ว swap เป็น 200 ตาม forwarding entry ของ P Router",
    {
      section: "provider",
      scene: "mpls",
      visual: "rack",
      tag: "MPLS / LABEL SWITCHING",
      time: 25,
      source: "https://www.rfc-editor.org/rfc/rfc3031",
    },
  ),
];

export function networkControls(id) {
  if (id === "packet") id = "internet";
  const select = (name, label, options) =>
    `<label>${label}<select id="${name}">${options.map(([value, text]) => `<option value="${value}">${text}</option>`).join("")}</select></label>`;
  if (id === "internet")
    return select("connection", "การตั้งค่าของ Computer", [
      ["ready", "มี IP, Gateway และ DNS"],
      ["no-gateway", "ยังไม่มี Default gateway"],
      ["no-dns", "DNS ค้นชื่อไม่สำเร็จ"],
    ]);
  if (id === "layer2")
    return select("mac-state", "MAC table ของ Switch", [
      ["known", "รู้ MAC ปลายทาง → port 2"],
      ["unknown", "ยังไม่รู้ MAC ปลายทาง"],
    ]);
  if (id === "vlan")
    return (
      select("target-vlan", "VLAN ของ PC B", [
        ["20", "VLAN20 · 192.168.20.20/24"],
        ["10", "VLAN10 · 192.168.10.20/24"],
      ]) +
      select("allowed-vlans", "VLAN ที่ Trunk อนุญาต", [
        ["10,20", "VLAN10 และ VLAN20"],
        ["10", "เฉพาะ VLAN10"],
        ["20", "เฉพาะ VLAN20"],
      ]) +
      select("inter-vlan", "Inter-VLAN routing", [
        ["off", "ปิด · ใช้เฉพาะ L2"],
        ["on", "เปิด · Gateway ทั้งสอง VLAN ถูกต้อง"],
      ])
    );
  if (id === "layer3")
    return (
      select("route-destination", "Destination IP", [
        ["10.20.30.15", "10.20.30.15"],
        ["10.20.40.15", "10.20.40.15"],
        ["8.8.8.8", "8.8.8.8"],
      ]) +
      select("specific-route", "Route 10.20.30.0/24", [
        ["on", "มี route /24"],
        ["off", "เอา route /24 ออก"],
      ])
    );
  if (id === "mpls")
    return select("incoming-label", "Label ที่ PE ทางเข้า Push", [
      ["100", "100 · มี entry ที่ P Router"],
      ["999", "999 · ไม่มี entry ที่ P Router"],
    ]);
  if (id === "gateway")
    return select("gateway", "Default gateway", [
      ["192.168.10.254", "192.168.10.254 (ค่าเริ่มต้น)"],
      ["192.168.10.1", "192.168.10.1"],
      ["10.0.0.10", "10.0.0.10"],
    ]);
  if (id === "dns")
    return select("hostname", "ชื่อที่ต้องการค้นหา", [
      ["ops.example.test", "ops.example.test"],
      ["missing.example.test", "missing.example.test"],
    ]);
  if (id === "protocols")
    return (
      select("protocol", "Protocol", [
        ["TCP", "TCP"],
        ["UDP", "UDP"],
      ]) +
      select("port", "Port", [
        ["443", "443 · HTTPS"],
        ["5000", "5000 · Telemetry"],
      ])
    );
  if (id === "subnet")
    return select("prefix", "Prefix ของ subnet", [
      ["24", "/24"],
      ["25", "/25"],
      ["26", "/26"],
    ]);
  return select("destination", "ปลายทาง", [
    ["server", "Server · 10.0.0.10"],
    ["local", "SW-01 · 192.168.10.2"],
  ]);
}

export function simulateNetwork(id, v) {
  if (id === "packet") id = "internet";
  const result = {
    ok: true,
    path: [0, 1, 2, 3],
    lines: [],
    labels: [],
    stages: [],
  };
  if (id === "internet") {
    result.stages = [
      "IP / DHCP",
      "DNS",
      "Gateway / NAT",
      "ISP routing",
      "TCP + TLS",
      "HTTPS response",
    ];
    if (v.connection === "no-dns") {
      result.ok = false;
      result.path = [];
      result.lines = [
        "✕ DNS ค้นชื่อไม่สำเร็จ จึงยังไม่เริ่มเชื่อมต่อ Server ด้วยชื่อนี้",
        "ตรวจ DNS และข้อมูลชื่อก่อน",
      ];
    } else if (v.connection === "no-gateway") {
      result.ok = false;
      result.path = [0];
      result.lines = [
        "✓ DNS จำลองค้นชื่อได้จากข้อมูลที่มีอยู่",
        "✕ ไม่มี Default gateway และไม่มี route อื่นไป Server จึงออกจาก LAN ไม่ได้",
      ];
    } else
      result.lines = [
        "1. Computer มี 192.168.10.25/24, Gateway และ DNS จาก DHCP",
        "2. DNS: ops.example.test → 203.0.113.80 (IP สำหรับเอกสารตัวอย่าง)",
        "3. ส่ง frame ไป MAC ของ Gateway · Router บ้านทำ source NAT ตามที่กำหนดใน Lab",
        "4. ISP Router ส่งต่อ packet ไปยังเครือข่ายปลายทาง (ย่อหลาย hop ในภาพ)",
        "5. ตั้งการเชื่อมต่อ TCP/443 และ TLS แล้วส่ง HTTPS request",
        "6. Server ตอบ HTTP 200 ข้อมูลกลับผ่าน route ขากลับและ NAT state มายัง Computer · เส้นทางขากลับจริงไม่จำเป็นต้องเหมือนขาไป",
      ];
  } else if (id === "layer2") {
    result.path = [0, 1, 2];
    result.lines =
      v["mac-state"] === "known"
        ? [
            "✓ MAC table: 02:00:00:00:00:02 → port 2 / VLAN10",
            "ส่ง known-unicast frame เฉพาะ port 2 · source MAC เรียนจาก port 1",
            "destination IP ใน payload ไม่ได้ถูกเปลี่ยนโดย L2 Switch",
          ]
        : [
            "MAC table ยังไม่มี destination MAC",
            "Switch flood unknown-unicast ไปพอร์ตอื่นใน VLAN10 ยกเว้นพอร์ตที่รับเข้า",
            "เครื่องที่ MAC ตรงรับ frame เครื่องอื่นทิ้ง frame · ไม่ flood ข้าม VLAN",
          ];
  } else if (id === "vlan") {
    const target = Number(v["target-vlan"]);
    const allowed = (v["allowed-vlans"] || "").split(",").map(Number);
    const routed = v["inter-vlan"] === "on";
    if (target === 20 && !routed) {
      result.ok = false;
      result.path = [0, 1, 2];
      result.lines = [
        "✕ PC A VLAN10 → Switch → ไม่ส่ง frame ออก access port ของ PC B VLAN20",
        "Trunk ส่งหลาย VLAN ได้ แต่ VLAN10 กับ VLAN20 ยังเป็นคนละ broadcast domain",
        "เปิด Inter-VLAN routing เพื่อให้ packet ไปอีก subnet ผ่าน Gateway",
      ];
    } else if (!allowed.includes(target)) {
      result.ok = false;
      result.path = target === 20 ? [0, 1, 4, 1] : [0, 1];
      result.lines = [
        `✕ Trunk ไม่อนุญาต VLAN${target} ที่ต้องใช้ไป PC B`,
        target === 20
          ? "Gateway route จาก VLAN10 เป็น VLAN20 แล้ว แต่ frame ของ VLAN20 ยังข้าม Trunk ไม่ได้"
          : "frame ของ VLAN10 ยังข้ามไป SW2 ไม่ได้",
      ];
    } else if (target === 10) {
      result.path = [0, 1, 2, 3];
      result.lines = [
        "✓ PC A VLAN10 → Access → SW1 → Trunk tag 10 → SW2 → Access → PC B VLAN10",
        "ทั้งสองเครื่องอยู่ subnet 192.168.10.0/24 จึงติดต่อกันใน L2 ได้โดยไม่ต้อง route",
      ];
    } else {
      result.path = [0, 1, 4, 1, 2, 3];
      result.labels = ["VLAN10", "VLAN10", "IP routing", "VLAN20", "VLAN20"];
      result.lines = [
        "✓ PC A VLAN10 → Gateway → route ไป VLAN20 → Trunk tag 20 → PC B",
        "Gateway ทั้งสอง VLAN ตั้งถูกต้องในโหมดนี้ L3 routing เปลี่ยน link/MAC แล้วส่งใน VLAN20",
        "Trunk ต้องอนุญาต VLAN20 สำหรับ frame ที่ออกจาก Gateway ไป PC B",
      ];
    }
  } else if (id === "layer3") {
    const dest = v["route-destination"];
    const specific = v["specific-route"] === "on";
    const route =
      dest === "10.20.30.15" && specific
        ? "10.20.30.0/24 → R3"
        : dest.startsWith("10.20.")
          ? "10.20.0.0/16 → R2"
          : "0.0.0.0/0 → ISP";
    result.lines = [
      `✓ Destination ${dest} · เลือก ${route}`,
      "ใช้ longest prefix match จาก route ที่ยังมีอยู่",
      "Router ลด TTL 64 → 63 และสร้าง frame สำหรับ link ถัดไป · IP ปลายทางยังเดิม (Lab นี้ไม่มี NAT)",
    ];
  } else if (id === "mpls") {
    const label = v["incoming-label"];
    result.path = label === "100" ? [0, 1, 2, 3, 4] : [0, 1, 2];
    result.ok = label === "100";
    result.labels =
      label === "100"
        ? ["IP", "LABEL 100", "LABEL 200", "IP"]
        : ["IP", "LABEL 999"];
    result.stages = ["CE / IP", "PE / PUSH", "P / SWAP", "PE / POP", "CE / IP"];
    result.lines =
      label === "100"
        ? [
            "✓ CE A ส่ง IP packet → PE ทางเข้า push label 100",
            "P Router: incoming 100 → swap เป็น 200 → ส่งไป PE ทางออก",
            "PE ทางออก pop label → ส่ง IP packet ให้ CE B",
            "Label ใช้ตาม hop/บริบท ไม่ใช่ IP และไม่ใช่การเข้ารหัส",
          ]
        : [
            "PE ทางเข้า push label 999 ในสถานการณ์ผิดพลาดนี้",
            "✕ P Router ไม่มี forwarding entry สำหรับ label 999 → ทิ้ง packet",
            "เปลี่ยนเป็น label 100 ที่มี entry ในตารางเพื่อส่งต่อ",
          ];
  } else if (id === "gateway") {
    result.ok = v.gateway === "192.168.10.1";
    result.path = result.ok ? [0, 1, 2, 3] : [0, 1];
    result.lines = result.ok
      ? [
          "✓ Client → Switch → Gateway 192.168.10.1 → Server 10.0.0.10",
          "เชื่อมต่อสำเร็จ: ตั้งค่า Default gateway ตรงกับ Router แล้ว",
        ]
      : [
          "✕ Client → Switch → หยุดก่อนถึง Gateway",
          `ไม่มี Router ที่ใช้ ${v.gateway} บน LAN นี้ ลองเปลี่ยนเป็น 192.168.10.1`,
        ];
  } else if (id === "dns") {
    result.ok = v.hostname === "ops.example.test";
    result.path = result.ok ? [0, 1, 2, 3] : [];
    result.lines = result.ok
      ? [
          "✓ DNS: ops.example.test → 10.0.0.10",
          "✓ บริการจำลอง TCP/443 ตอบ HTTP 200",
        ]
      : [
          "✕ DNS: NXDOMAIN — ไม่มีชื่อ missing.example.test ใน DNS จำลอง",
          "ยังไม่ได้เริ่มเชื่อมต่อ HTTP ลองเลือกชื่อ ops.example.test",
        ];
  } else if (id === "protocols") {
    result.ok =
      (v.protocol === "TCP" && v.port === "443") ||
      (v.protocol === "UDP" && v.port === "5000");
    result.lines = result.ok
      ? [
          `✓ Server รับ ${v.protocol}/${v.port}`,
          v.protocol === "TCP"
            ? "บริการ HTTPS จำลองตอบกลับ · TCP มีกลไกจัดลำดับและส่งซ้ำ"
            : "บริการ Telemetry จำลองได้รับ datagram ครั้งนี้ · UDP ไม่รับประกันการส่งถึงในตัวโปรโตคอล",
        ]
      : [
          `✕ ไม่มีบริการจำลองที่ ${v.protocol}/${v.port}`,
          "เลือก TCP/443 หรือ UDP/5000 การถึง IP ไม่ได้แปลว่าบริการทุก Port เปิดอยู่",
        ];
  } else if (id === "subnet") {
    const prefix = Number(v.prefix);
    const size = 2 ** (32 - prefix);
    result.path = [];
    result.lines = [
      `/${prefix}: ${256 / size} subnet · ${size} ที่อยู่ต่อ subnet · ${size - 2} host (LAN IPv4 ทั่วไป)`,
      ...Array.from(
        { length: 256 / size },
        (_, i) =>
          `192.168.10.${i * size}/${prefix} → host .${i * size + 1} ถึง .${(i + 1) * size - 2} · broadcast .${(i + 1) * size - 1}`,
      ),
    ];
  } else {
    const local = v.destination === "local";
    result.path = local ? [0, 1] : [0, 1, 2, 3];
    result.lines = local
      ? [
          "✓ Client → Switch → SW-01 192.168.10.2",
          "อยู่ใน 192.168.10.0/24 เหมือนกัน จึงส่งใน LAN โดยไม่ผ่าน Router",
        ]
      : [
          "✓ Client → Switch → Gateway → Server 10.0.0.10",
          "ต่าง subnet จึงผ่าน Default gateway · ภาพย่อบางขั้นตอนเพื่อการสอน",
        ];
  }
  return result;
}
