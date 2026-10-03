const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function diagram(l, i) {
  if (l.id === "osi-model") {
    const names = [
      "7 Application",
      "6 Presentation",
      "5 Session",
      "4 Transport",
      "3 Network",
      "2 Data Link",
      "1 Physical",
    ];
    return `<div class="layer-stack">${names.map((n, j) => `<div class="${(i === 0 && j < 3) || (i === 1 && j === 3) || (i === 2 && j === 4) || (i === 3 && j > 4) ? "highlight" : ""}">${n}<span>${j < 3 ? "Application" : j === 3 ? "Transport" : j === 4 ? "Internet" : "Link"}</span></div>`).join("")}</div>`;
  }
  if (l.id === "encapsulation") {
    const layers =
      i === 0
        ? ["Data"]
        : i === 1
          ? ["TCP header", "TLS / Data"]
          : i === 2
            ? ["IP header", "TCP header", "TLS / Data"]
            : i === 3
              ? [
                  "Ethernet header",
                  "IP header",
                  "TCP header",
                  "TLS / Data",
                  "FCS",
                ]
              : i === 4
                ? [
                    "New Ethernet header",
                    "IP header · TTL 63",
                    "TCP header",
                    "TLS / Data",
                    "New FCS",
                  ]
                : ["HTTP Data หลังถอดแต่ละชั้น"];
    return `<div class="protocol-envelope">${layers.map((s, j) => `<div style="--depth:${j}">${esc(s)}</div>`).join("")}</div>`;
  }
  if (l.id === "stp" || l.id === "ospf") {
    const stp = l.id === "stp",
      names = stp ? ["SW1 / ROOT", "SW2", "SW3"] : ["R1", "R2", "R3"];
    return `<svg class="topology-diagram" viewBox="0 0 440 200" role="img" aria-label="${stp ? "Topology และสถานะพอร์ต" : "เส้นทางและผลรวม OSPF cost"}"><path d="M70 50 L220 155" fill="none" stroke="${!stp && i > 0 ? "#e97868" : "#7ce4c6"}" stroke-width="4"/><path d="M220 155 L370 50" fill="none" stroke="${stp && i === 0 ? "#f1bb58" : "#7ce4c6"}" stroke-width="4" ${stp && i === 0 ? 'stroke-dasharray="9 5"' : ""}/><path d="M70 50 L370 50" stroke="${stp && i === 1 ? "#e97868" : !stp && i === 0 ? "#7993a0" : "#7ce4c6"}" stroke-width="4" ${stp && i === 1 ? 'stroke-dasharray="9 5"' : ""}/>${names.map((n, j) => `<rect x="${[25, 175, 325][j]}" y="${j === 1 ? 135 : 30}" width="90" height="40" rx="8" fill="#244754" stroke="#729eae"/><text x="${[70, 220, 370][j]}" y="${j === 1 ? 160 : 55}" text-anchor="middle" fill="white" font-size="13">${n}</text>`).join("")}<text x="220" y="24" text-anchor="middle" fill="#d0e9eb" font-size="13">${stp ? (i === 1 ? "LINK DOWN" : "Forwarding") : "Direct cost 50"}</text><text x="220" y="195" text-anchor="middle" fill="#f1bb58" font-size="13">${stp ? (i === 0 ? "SW3 → SW2: DISCARDING" : i === 1 ? "Alternate → FORWARDING" : "LOOP / STP OFF") : i === 0 ? "Via R2: 10 + 10 = 20" : i === 1 ? "Via R2 link down → direct cost 50" : "Area mismatch → no adjacency on R1–R2"}</text></svg>`;
  }
  if (l.id === "vlsm")
    return `<div class="address-allocation">${(i === 0
      ? [
          ["/25 · 100 hosts", 50],
          ["/26 · 50 hosts", 25],
          ["/27 · 20 hosts", 12.5],
          ["เหลือ /27", 12.5],
        ]
      : [["/24 · 200 hosts", 100]]
    )
      .map(([s, w]) => `<div style="flex-basis:${w}%">${s}</div>`)
      .join("")}</div>`;
  if (l.id === "dhcp")
    return `<div class="service-sequence">${["DISCOVER", "OFFER", "REQUEST", "ACK"].map((s, j) => `<div class="${i > 0 && j > 0 ? "unavailable" : ""}"><span>${j + 1}</span>${s}</div>`).join("")}</div><p class="address-change">0.0.0.0 ${i === 0 ? "→ 192.168.10.25/24" : "→ ยังไม่ได้ Lease จาก DHCP ใน Lab"}</p>`;
  if (l.id === "nat-pat")
    return `<div class="service-sequence"><div>PRIVATE<br>192.168.10.25:51514</div><div class="highlight">PAT TABLE<br>198.51.100.25:40001</div><div>SERVER<br>203.0.113.80:443</div></div>`;
  if (l.id === "etherchannel")
    return `<div class="bundle-diagram"><div class="${i === 1 ? "unavailable" : ""}">MEMBER 1 · ${i === 1 ? "DOWN" : i === 2 ? "NOT BUNDLED" : "1 Gbps"}</div><div>MEMBER 2 · 1 Gbps</div><strong>PORT-CHANNEL · logical link</strong></div>`;
  return "";
}
export function conceptSurface(l) {
  return `<section class="concept-workbench"><p class="eyebrow">${l.id === "number-systems" ? "BIT LAB" : "OBSERVE · CHANGE · EXPLAIN"}</p><h2>${esc(l.title)}</h2><p>ตัวอย่างจำลองสำหรับบทนี้ ไม่เชื่อมต่อหรือแก้ไขอุปกรณ์จริง</p>${l.id === "number-systems" ? '<div class="bit-lab"><label>Decimal (0–255)<input id="decimal" type="number" min="0" max="255" value="192"></label><div class="bit-buttons" id="bit-buttons"></div><div class="bit-values" id="bit-values" aria-live="polite"></div></div>' : ""}<div class="scenario-tabs" role="group" aria-label="เลือกสถานการณ์">${l.states.map((s, i) => `<button class="scenario-tab" data-state="${i}">${esc(s.label)}</button>`).join("")}</div><div id="concept-result" aria-live="polite"><p>เลือกสถานการณ์ด้านบนเพื่อเริ่มทดลอง</p></div><button class="button light small" id="next-state">ดูสถานการณ์ถัดไป</button></section><div class="question-box"><p class="eyebrow">YOUR MISSION</p><h3>${esc(l.question)}</h3><div class="choices">${l.choices.map((s, i) => `<button class="choice" data-answer="${i}">${esc(s)}</button>`).join("")}</div><button class="hint" id="hint">ขอคำใบ้</button><div class="feedback" id="feedback" aria-live="polite"></div></div>`;
}
export function initConcept(l, onComplete) {
  let visited = new Set(),
    index = -1;
  const draw = (i) => {
    index = i;
    visited.add(i);
    const s = l.states[i],
      root = document.querySelector("#concept-result");
    root.className = "concept-result" + (s.ok ? "" : " problem");
    root.innerHTML = `<p class="state-count">สถานการณ์ ${i + 1} / ${l.states.length}</p><h3>${esc(s.headline)}</h3>${diagram(l, i)}<div class="mechanism-fields">${s.rows.map(([name, value]) => `<div class="mechanism-field"><span>${esc(name)}</span><strong>${esc(value)}</strong></div>`).join("")}</div><p class="state-explanation">${esc(s.detail)}</p>`;
    document.querySelectorAll("[data-state]").forEach((b) => {
      b.classList.toggle("active", Number(b.dataset.state) === i);
      b.setAttribute("aria-pressed", String(Number(b.dataset.state) === i));
    });
  };
  document
    .querySelectorAll("[data-state]")
    .forEach((b) =>
      b.addEventListener("click", () => draw(Number(b.dataset.state))),
    );
  document
    .querySelector("#next-state")
    .addEventListener("click", () => draw((index + 1) % l.states.length));
  if (l.id === "number-systems") {
    const input = document.querySelector("#decimal"),
      bits = document.querySelector("#bit-buttons"),
      values = document.querySelector("#bit-values");
    const show = (n) => {
      input.value = n;
      bits.innerHTML = Array.from({ length: 8 }, (_, i) => {
        const weight = 2 ** (7 - i),
          on = Boolean(n & weight);
        return `<button class="bit ${on ? "on" : ""}" data-weight="${weight}" aria-pressed="${on}" aria-label="บิตน้ำหนัก ${weight}"><small>${weight}</small><strong>${on ? 1 : 0}</strong></button>`;
      }).join("");
      values.innerHTML = `<span>Binary <strong>${n.toString(2).padStart(8, "0")}</strong></span><span>Decimal <strong>${n}</strong></span><span>Hex <strong>${n.toString(16).toUpperCase().padStart(2, "0")}</strong></span>`;
    };
    input.addEventListener("input", () => {
      const n = Number(input.value);
      if (Number.isInteger(n) && n >= 0 && n <= 255) {
        input.setCustomValidity("");
        show(n);
      } else input.setCustomValidity("ใส่จำนวนเต็ม 0–255");
    });
    bits.addEventListener("click", (e) => {
      const b = e.target.closest("[data-weight]");
      if (b) show(Number(input.value) ^ Number(b.dataset.weight));
    });
    show(192);
  }
  document.querySelectorAll("[data-answer]").forEach((b) =>
    b.addEventListener("click", () => {
      const f = document.querySelector("#feedback");
      if (visited.size < 2) {
        f.className = "feedback bad";
        f.textContent = "ลองเปรียบเทียบอย่างน้อย 2 สถานการณ์ก่อนตอบ";
        return;
      }
      const pass = Number(b.dataset.answer) === l.answer;
      f.className = pass ? "feedback" : "feedback bad";
      f.textContent = (pass ? "✓ ผ่านภารกิจ — " : "ลองอีกครั้ง — ") + l.reason;
      if (pass) onComplete();
    }),
  );
}
