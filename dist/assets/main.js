import {
  pythonLessons,
  pythonSections,
  pythonReference,
} from "./python-curriculum.js";
import {
  networkLessons as originalNetworkLessons,
  networkControls,
  simulateNetwork,
} from "./network-curriculum.js?v=2";
import {
  arrangeNetwork,
  orderedSections as networkSections,
} from "./network-foundations.js";
import { conceptSurface, initConcept } from "./network-concepts.js";
const networkLessons = arrangeNetwork(originalNetworkLessons);

const lessons = [...networkLessons, ...pythonLessons];
const main = document.querySelector("main");
const escapeHTML = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const normalize = (value) =>
  String(value)
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
const courses = [
  {
    id: "network",
    name: "Network",
    description:
      "เฟส 0 → Ethernet/MAC → IPv4 → ARP → VLAN → STP → VLSM → Routing → Services → Security → Wireless → Automation → MPLS",
    sections: networkSections,
    lessons: networkLessons,
  },
  {
    id: "python",
    name: "Python",
    description: "เริ่มจากศูนย์ตามเอกสาร Python สำหรับผู้เริ่มต้น",
    sections: pythonSections,
    lessons: pythonLessons,
  },
];
let progress = {},
  drafts = {},
  storageAvailable = true;
try {
  const saved = localStorage.getItem("techatlas-progress-v2");
  if (saved) progress = JSON.parse(saved);
  else {
    const old = JSON.parse(
      localStorage.getItem("techatlas-progress-v1") || "{}",
    );
    progress = Object.fromEntries(
      networkLessons.filter((l) => old[l.id]).map((l) => [l.id, old[l.id]]),
    );
  }
  if (!progress || Array.isArray(progress) || typeof progress !== "object")
    progress = {};
  drafts = JSON.parse(localStorage.getItem("techatlas-drafts-v2") || "{}");
  if (!drafts || Array.isArray(drafts) || typeof drafts !== "object")
    drafts = {};
} catch {
  storageAvailable = false;
}
const doneCount = () => lessons.filter((l) => progress[l.id]).length;
function badge() {
  document.querySelector("#nav-progress").textContent = doneCount();
}
function complete(id) {
  progress[id] = { completedAt: new Date().toISOString() };
  try {
    localStorage.setItem("techatlas-progress-v2", JSON.stringify(progress));
  } catch {
    storageAvailable = false;
  }
  badge();
}
function saveDraft(id, value) {
  drafts[id] = value;
  try {
    localStorage.setItem("techatlas-drafts-v2", JSON.stringify(drafts));
  } catch {}
}

let generation = 0,
  scenes = new Map(),
  lazyObserver,
  currentLesson = null,
  worker,
  workerReady = false,
  initTimer,
  runTimer;
function clearWorker() {
  worker?.terminate();
  worker = null;
  workerReady = false;
  clearTimeout(initTimer);
  clearTimeout(runTimer);
}
function cleanup() {
  generation++;
  lazyObserver?.disconnect();
  for (const scene of scenes.values()) scene.dispose();
  scenes.clear();
  clearWorker();
}
async function addScene(el, options = {}) {
  const version = generation;
  if (!el) return null;
  try {
    const module = await import(
      options.preview
        ? "./card-scene.js"
        : options.foundation
          ? "./foundation-scene.js"
          : options.interactive
            ? "./lab-scene.js"
            : "./scene.js"
    );
    if (version !== generation || !el.isConnected) return null;
    const scene = module.mountScene(el, options);
    scenes.set(el, scene);
    return scene;
  } catch {
    if (el.isConnected) {
      const note = document.createElement("p");
      note.className = "no-webgl";
      note.textContent =
        "เปิดแบบจำลอง 3 มิติไม่ได้ในเบราว์เซอร์นี้ ยังทดลองด้วยตัวควบคุมและอ่านผลได้";
      el.append(note);
    }
    return null;
  }
}
function lazyScenes(root) {
  lazyObserver?.disconnect();
  for (const [el, s] of scenes) {
    if (el.dataset.cardScene) {
      s.dispose();
      scenes.delete(el);
    }
  }
  lazyObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target;
        if (entry.isIntersecting && !scenes.has(el) && !el.dataset.loading) {
          el.dataset.loading = "1";
          addScene(el, {
            preview: true,
            lesson: lessons.find((l) => l.id === el.dataset.cardScene),
          }).finally(() => delete el.dataset.loading);
        } else if (!entry.isIntersecting && scenes.has(el)) {
          scenes.get(el).dispose();
          scenes.delete(el);
        }
      }
    },
    { rootMargin: "100px" },
  );
  root
    .querySelectorAll("[data-card-scene]")
    .forEach((el) => lazyObserver.observe(el));
}
function intro(title, description, label = "EXPLORE AT YOUR OWN PACE") {
  return `<section class="intro"><div><p class="eyebrow">${label}</p><h1>${title}</h1><p>${description}</p></div><span class="number">NETWORK · PYTHON · DEVELOPMENT · AI</span></section>`;
}
function card(l) {
  return `<a class="card ${progress[l.id] ? "done" : ""}" href="#lesson/${l.id}"><div class="card-visual" data-card-scene="${l.id}"><span class="label">${l.tag}</span><span class="lab-badge">${l.track === "python" ? "LIVE PYTHON" : l.conceptLab && l.section !== "foundation" ? "CONCEPT LAB" : "3D INTERACTIVE"}</span></div><div class="card-body"><h3>${l.title}</h3><p>${l.subtitle}</p><div class="card-meta"><span>${l.time} นาที · ${l.track === "python" ? "เขียนและรันโค้ด" : "ทดลองได้ทันที"}</span><span class="${progress[l.id] ? "complete-badge" : "go"}">${progress[l.id] ? "✓ ผ่านแล้ว" : "เปิดบทเรียน ↗"}</span></div></div></a>`;
}
function renderExplore() {
  main.className = "";
  main.innerHTML = `${intro("<strong>ห้องทดลอง</strong>เทคโนโลยี", "เลือกหมวดที่สนใจ แล้วเรียนตามลำดับภายในหมวดนั้น")}<section class="hero"><div class="hero-copy"><p class="eyebrow">EXPLORE THE CONNECTION</p><span class="chip">NETWORK LAB</span><h2>จากเครื่องของคุณ<br>สู่โลก<em> Internet</em></h2><p>เห็นที่อยู่ IP สำรวจอุปกรณ์ และดูว่าข้อมูล<br>เปลี่ยนอย่างไรในแต่ละขั้นตอน</p><a class="button" href="#lesson/internet">สำรวจ Computer → Internet</a><a class="hero-secondary" href="#lesson/python-start">หรือเริ่ม Python จากศูนย์</a></div><div class="hero-stage" id="hero-scene"></div><div class="hero-tags"><span>COMPUTER</span><span>— GATEWAY — ISP —</span><span>INTERNET</span></div></section><div class="filterbar" role="group" aria-label="กรองบทเรียน"><button class="filter active" data-filter="all">ทั้งหมด ${lessons.length}</button><button class="filter" data-filter="network">Network ${networkLessons.length}</button><button class="filter" data-filter="python">Python ${pythonLessons.length}</button><button class="filter" data-filter="completed">ผ่านแล้ว</button><label class="search"><input id="search" type="search" placeholder="ค้นหาหัวข้อ เช่น VLAN, List…" aria-label="ค้นหาบทเรียน"></label></div><div id="catalog"></div><section class="future" aria-label="หมวดที่วางแผนไว้">${["JavaScript", "TypeScript", "Node.js", "AI"].map((name) => `<a class="future-item" href="#path"><strong>${name}</strong><span>หมวดอิสระ · อยู่ในแผนระยะถัดไป</span></a>`).join("")}</section>`;
  addScene(document.querySelector("#hero-scene"), { hero: true });
  let filter = "all";
  function draw() {
    const query = document.querySelector("#search").value.trim().toLowerCase();
    const root = document.querySelector("#catalog");
    const visible = lessons.filter(
      (l) =>
        (filter === "all" ||
          l.track === filter ||
          (filter === "completed" && progress[l.id])) &&
        `${l.title} ${l.subtitle} ${l.tag} ${l.section}`
          .toLowerCase()
          .includes(query),
    );
    root.innerHTML =
      courses
        .map((course) => {
          const subset = visible.filter((l) => l.track === course.id);
          if (!subset.length) return "";
          return `<section><div class="section-heading"><span class="section-index">${course.id === "network" ? "NET" : "PY"}</span><h2>${course.name}</h2><span class="desc">${course.description}</span></div>${course.id === "python" ? `<p class="reference-strip">เริ่มจากศูนย์ · เปิดเรียนได้โดยไม่ต้องผ่าน Network</p>` : ""}${course.sections
            .map((section) => {
              const list = subset.filter((l) => l.section === section.id);
              if (!list.length) return "";
              return `<div class="subsection-heading"><h3>${section.title}</h3><span>${list.length} บท</span></div><div class="cards">${list.map(card).join("")}</div>`;
            })
            .join("")}</section>`;
        })
        .join("") ||
      '<div class="empty">ไม่พบบทเรียนที่ตรงกับคำค้นหาหรือตัวกรอง ลองค้นใหม่</div>';
    lazyScenes(root);
  }
  draw();
  document.querySelectorAll("[data-filter]").forEach((button) =>
    button.addEventListener("click", () => {
      filter = button.dataset.filter;
      document
        .querySelectorAll("[data-filter]")
        .forEach((b) => b.classList.toggle("active", b === button));
      draw();
    }),
  );
  document.querySelector("#search").addEventListener("input", draw);
}
function renderPath() {
  main.className = "";
  main.innerHTML = `${intro("เส้นทางภายในแต่ละหมวด", "เลือกเริ่ม Network หรือ Python ได้ทันที แต่ละหมวดมีลำดับการเรียนของตัวเอง", "CHOOSE YOUR SUBJECT")}<div class="course-paths">${courses
    .map(
      (course) =>
        `<section class="course-path"><h2>${course.name}</h2><p>${course.description}</p>${course.id === "python" ? `<p class="reference-strip">เรียนตามลำดับจากพื้นฐานไปสู่แบบฝึก</p>` : ""}${course.sections
          .map(
            (section, i) =>
              `<article class="path-item"><span class="path-number">${String(i + 1).padStart(2, "0")}</span><div><h3>${section.title}</h3><div class="path-lessons">${course.lessons
                .filter((l) => l.section === section.id)
                .map(
                  (l) =>
                    `<a href="#lesson/${l.id}">${progress[l.id] ? "✓ " : ""}${l.title}</a>`,
                )
                .join("")}</div></div></article>`,
          )
          .join("")}</section>`,
    )
    .join(
      "",
    )}</div><div class="future">${["JavaScript", "TypeScript", "Node.js", "AI"].map((name) => `<article class="future-item"><strong>${name}</strong><span>เตรียมเป็นหมวดแยกในระยะถัดไป</span></article>`).join("")}</div>`;
}
function renderProgress() {
  main.className = "";
  const done = doneCount();
  const minutes = lessons
    .filter((l) => progress[l.id])
    .reduce((n, l) => n + l.time, 0);
  main.innerHTML = `${intro("ความคืบหน้าของคุณ", "แยกดูการเรียนแต่ละหมวดได้ บันทึกในเบราว์เซอร์และเครื่องนี้", "YOUR PROGRESS")}<div class="stat-grid"><div class="stat"><strong>${done}<small> / ${lessons.length}</small></strong><span>บทที่ทำภารกิจผ่าน</span></div><div class="stat"><strong>${Math.round((done / lessons.length) * 100)}%</strong><span>บทเรียนที่ผ่านทั้งหมด</span></div><div class="stat"><strong>${minutes}</strong><span>นาทีตามเวลาแนะนำของบทที่ผ่าน</span></div></div>${courses.map((course) => `<section class="progress-list"><h2>${course.name} <small>${course.lessons.filter((l) => progress[l.id]).length} / ${course.lessons.length}</small></h2>${course.lessons.map((l) => `<a class="progress-row" href="#lesson/${l.id}"><span>${l.title}</span><span class="${progress[l.id] ? "complete-badge" : "notice"}">${progress[l.id] ? "✓ ผ่านแล้ว" : "เปิดบทเรียน ↗"}</span></a>`).join("")}</section>`).join("")}<p class="notice">${storageAvailable ? "ความคืบหน้าจะยังอยู่เมื่อรีโหลด การล้างข้อมูลเบราว์เซอร์จะลบข้อมูลนี้ด้วย" : "เบราว์เซอร์ไม่อนุญาตให้เก็บข้อมูล ความคืบหน้าอยู่เฉพาะระหว่างเปิดหน้านี้"}</p><p class="notice">หลักสูตร Python ปรับใหม่แล้ว จึงเริ่มความคืบหน้าหมวด Python ใหม่ ส่วนบท Network เดิมยังเก็บผลที่เคยผ่านไว้</p>`;
}
function renderPractice() {
  main.className = "";
  main.innerHTML = `${intro("ลงมือทำด้วยตัวเอง", "เลือกแบบฝึกของแต่ละหมวดได้โดยอิสระ", "PRACTICE LABS")}<div class="section-heading"><span class="section-index">PY</span><h2>แบบฝึก Python ทั้ง 6 ข้อ</h2></div><p class="reference-strip">ฝึกประยุกต์พื้นฐาน · มีคำใบ้และตัวอย่างเฉลย</p><div class="cards">${pythonLessons
    .filter((l) => l.section === "practice")
    .map(card)
    .join(
      "",
    )}</div><div class="section-heading"><span class="section-index">NET</span><h2>ทดลองแก้สถานการณ์ Network</h2></div><div class="cards">${networkLessons
    .filter((l) => ["vlan", "gateway", "mpls"].includes(l.id))
    .map(card)
    .join("")}</div>`;
  lazyScenes(main);
}
function renderCredits() {
  main.className = "";
  main.innerHTML = `${intro("Credits & Copyright", "ผู้จัดทำและเอกสารอ้างอิงของ TechAtlas", "ABOUT THIS SITE")}<section class="credits-panel"><h2>Warapon Wichitpan</h2><p>ผู้จัดทำเว็บไซต์ TechAtlas</p><p>Contacts: <a href="mailto:wichitpan.w@gmail.com">wichitpan.w@gmail.com</a></p><p>© 2026 Warapon Wichitpan. All rights reserved.</p><hr><h3>เนื้อหา Python</h3><p>อ้างอิง ${pythonReference.title} จำนวน 37 หน้า</p><p>${pythonReference.note}</p><h3>เนื้อหา Network</h3><p>แต่ละบทมีลิงก์เอกสารอ้างอิงจาก RFC, Cisco หรือ MDN ภาพเป็นแบบจำลองเพื่อการสอนที่ย่อรายละเอียดบางขั้นตอน</p></section>`;
}
function panel(l) {
  return `<aside class="lesson-panel"><p class="eyebrow">${l.tag}</p><h2>${l.title}</h2><span class="notice">${l.time} นาที · ${l.track === "python" ? "เรียน Python ได้โดยตรง" : "Network"}</span><div class="scenario">${l.scenario}</div><p>${l.explain}</p><ol class="steps">${l.steps.map((s) => `<li>${s}</li>`).join("")}</ol><p><strong>ลองต่อด้วยตัวเอง</strong><br>${l.work}</p><button class="button light small open-terms">เปิดพจนานุกรม</button><p class="sources"><a href="${l.source}" target="_blank" rel="noopener noreferrer">เอกสารอ่านเพิ่มเติม ↗</a></p></aside>`;
}
function pythonSurface(l) {
  const draft = drafts[l.id] || {};
  return `<div class="editor-wrap"><div class="editor-bar"><span>${l.files ? "main" : l.id}.py</span><span>LIVE PYTHON</span></div><textarea class="editor" id="code" spellcheck="false" aria-label="โค้ด Python ที่แก้ไขได้">${escapeHTML(typeof draft.code === "string" ? draft.code : l.starter)}</textarea>${Object.entries(
    l.files || {},
  )
    .map(
      ([name, code]) =>
        `<div class="editor-bar"><span>${name}</span><span>MODULE FILE</span></div><textarea class="editor module-editor" data-file="${name}" spellcheck="false" aria-label="โค้ดไฟล์ ${name}">${escapeHTML(draft.files?.[name] ?? code)}</textarea>`,
    )
    .join(
      "",
    )}<div class="input-panel"><label for="stdin">ข้อมูลนำเข้าสำหรับ input()</label><p>หนึ่งบรรทัดต่อหนึ่ง input() ใส่ข้อมูลไว้ก่อนกดรัน${l.inputs ? " · ตัวอย่างตามโจทย์เตรียมไว้ให้แล้ว" : " · ถ้าโค้ดไม่มี input() ให้เว้นว่างได้"}</p><textarea id="stdin" rows="${l.inputs?.includes("\n") ? 3 : 2}" spellcheck="false" aria-label="ข้อมูลนำเข้า Python">${escapeHTML(typeof draft.inputs === "string" ? draft.inputs : l.inputs || "")}</textarea></div><div class="editor-actions"><button class="button small" id="run-code" disabled>กำลังเตรียม Python…</button><button class="button light small" id="reset-code">เริ่มโค้ดใหม่</button><span id="python-status" aria-live="polite">เตรียมเครื่องรัน</span></div><div id="input-prompts" class="prompt-log"></div><pre class="output" id="output" role="log" aria-live="polite">ผลลัพธ์จะปรากฏที่นี่</pre></div><div class="question-box"><p class="eyebrow">YOUR PRACTICE</p><h3>เป้าหมายของแบบฝึกนี้</h3><p class="notice">ผลลัพธ์เมื่อใช้ข้อมูลตัวอย่างที่ให้ไว้${l.tests ? " · ระบบตรวจข้อมูลชุดอื่นด้วยเพื่อให้โปรแกรมใช้ได้จริง" : ""}</p><pre class="output expected-output">${escapeHTML(l.expected)}</pre><button class="hint" id="hint">ขอคำใบ้</button><button class="hint" id="solution">ดูตัวอย่างเฉลย</button><div class="feedback" id="feedback" aria-live="polite">${progress[l.id] ? "✓ คุณเคยผ่านภารกิจนี้แล้ว ทบทวนได้อีกครั้ง" : ""}</div><div id="checks"></div></div>`;
}
function labReference(l) {
  if (l.id === "layer2")
    return '<div class="lab-table"><h3>MAC table · VLAN10</h3><table><tr><th>MAC</th><th>Port</th></tr><tr><td>02:00:00:00:00:01</td><td>1 · PC A</td></tr><tr id="mac-entry"><td>02:00:00:00:00:02</td><td>2 · PC B</td></tr></table></div>';
  if (l.id === "layer3")
    return '<div class="lab-table"><h3>Routing table · R1</h3><table><tr><th>Network / Prefix</th><th>Next hop</th></tr><tr data-route="8"><td>10.0.0.0/8</td><td>R0</td></tr><tr data-route="16"><td>10.20.0.0/16</td><td>R2</td></tr><tr data-route="24"><td>10.20.30.0/24</td><td>R3</td></tr><tr data-route="0"><td>0.0.0.0/0</td><td>ISP</td></tr></table></div>';
  if (l.id === "mpls")
    return '<div class="lab-table"><h3>Label forwarding · P Router</h3><table><tr><th>Incoming label</th><th>Operation</th><th>Outgoing label / Next hop</th></tr><tr data-label="100"><td>100</td><td>Swap</td><td>200 → PE B</td></tr><tr><td>999</td><td colspan="2">ไม่มี entry</td></tr></table></div>';
  if (l.id === "dns")
    return '<div class="lab-table"><h3>DNS records จำลอง</h3><table><tr><th>ชนิด</th><th>ชื่อที่ค้น</th><th>คำตอบ</th></tr><tr><td>A</td><td>ops.example.test</td><td>203.0.113.80</td></tr><tr><td>PTR</td><td>80.113.0.203.in-addr.arpa</td><td>ops.example.test</td></tr></table><p>สอง record นี้ตั้งไว้แยกกัน การมี A record ไม่ได้สร้าง PTR ให้อัตโนมัติ</p></div>';
  return "";
}
function networkSurface(l) {
  return `<div class="network-view enhanced-view" id="network-scene"><div class="scene-note">${l.tag} · DRAG TO EXPLORE</div><div class="live-concept" id="live-concept" aria-live="polite"><span>พร้อมทดลอง</span><strong>${l.id === "dns" ? "Domain ↔ IP" : l.id === "mpls" ? "IP → LABEL → IP" : l.id === "vlan" ? "VLAN10 / VLAN20" : l.id === "layer2" ? "FRAME / MAC" : l.id === "layer3" ? "PACKET / ROUTE" : "สำรวจอุปกรณ์และที่อยู่"}</strong></div><div class="scene-legend"><span>ลากหมุน · เลื่อนซูม · กดป้ายอุปกรณ์ดูข้อมูล</span><span>แบบจำลองเพื่อการเรียนรู้</span></div></div><div class="device-inspector" id="device-inspector" aria-live="polite">เลือกป้ายที่ลอยเหนืออุปกรณ์ เพื่อดู IP, MAC และหน้าที่</div><div class="control-panel"><div class="controls">${l.id === "dns" ? '<label>รูปแบบการค้นหา<select id="dns-mode"><option value="forward">Domain → IP (A record)</option><option value="reverse">IP → Domain (PTR record)</option><option value="missing">ชื่อที่ไม่มีข้อมูล (NXDOMAIN)</option></select></label>' : networkControls(l.id)}<button class="button" id="send-packet">${l.id === "subnet" ? "ดูช่วง IP" : l.id === "dns" ? "ค้นหา DNS" : "เริ่มทดลอง"}</button><button class="button light" id="reset-view">รีเซ็ตมุมมอง</button></div><div class="trace" id="trace" role="status" aria-live="polite">เลือกค่าแล้วเริ่มทดลอง สังเกตข้อมูลที่เปลี่ยนและอุปกรณ์ที่ตัดสินใจ</div></div>${labReference(l)}<div class="question-box"><p class="eyebrow">YOUR MISSION</p><h3>${l.question}</h3><div class="choices">${l.choices.map((s, i) => `<button class="choice" data-answer="${i}">${s}</button>`).join("")}</div><button class="hint" id="hint">ขอคำใบ้</button><div class="feedback" id="feedback" aria-live="polite">${progress[l.id] ? "✓ คุณเคยผ่านภารกิจนี้แล้ว" : ""}</div></div>`;
}
function renderLesson(id) {
  if (id === "offline") id = "practice-list";
  const l = lessons.find((l) => l.id === id);
  if (!l) {
    main.innerHTML = `${intro("ไม่พบบทเรียน", "กลับไปเลือกหัวข้อในคลังบทเรียน")}<a class="button" href="#explore">สำรวจบทเรียน</a>`;
    return;
  }
  currentLesson = l;
  main.className = "lab-page";
  const group = lessons.filter((x) => x.track === l.track),
    idx = group.indexOf(l);
  main.innerHTML = `<div class="lab-head"><a class="back" href="#explore">‹ คลังบทเรียน</a><h1>${l.title}</h1><span class="lesson-tag">${l.track.toUpperCase()} · ${idx + 1} / ${group.length}</span></div><div class="lab-layout">${panel(l)}<section class="workarea">${l.track === "python" ? pythonSurface(l) : l.conceptLab ? conceptSurface(l) : networkSurface(l)}<div class="lesson-links">${idx > 0 ? `<a href="#lesson/${group[idx - 1].id}">‹ บทก่อนหน้าในหมวด ${l.track}</a>` : ""}${idx < group.length - 1 ? `<a style="margin-left:auto" href="#lesson/${group[idx + 1].id}">บทถัดไปในหมวด ${l.track} ›</a>` : '<a style="margin-left:auto" href="#path">ดูเส้นทางในหมวดนี้ ›</a>'}</div></section></div>`;
  document.querySelector(".open-terms").addEventListener("click", openGlossary);
  document.querySelector("#hint").addEventListener("click", () => {
    const feedback = document.querySelector("#feedback");
    feedback.className = "feedback";
    feedback.textContent = l.hint;
  });
  if (l.track === "python") initPython(l);
  else if (l.conceptLab) {
    initConcept(l, () => complete(l.id));
    if (l.section === "foundation")
      addScene(document.querySelector("#foundation-scene"), {
        foundation: true,
        variant: l.id,
      });
  } else initNetwork(l);
}

function inputLines(value) {
  return value === "" ? [] : value.replace(/\r\n/g, "\n").split("\n");
}
function initPython(l) {
  const run = document.querySelector("#run-code"),
    code = document.querySelector("#code"),
    output = document.querySelector("#output"),
    status = document.querySelector("#python-status"),
    stdin = document.querySelector("#stdin");
  const readFiles = () =>
    Object.fromEntries(
      [...document.querySelectorAll("[data-file]")].map((el) => [
        el.dataset.file,
        el.value,
      ]),
    );
  const save = () =>
    saveDraft(l.id, {
      code: code.value,
      inputs: stdin.value,
      files: readFiles(),
    });
  [code, stdin, ...document.querySelectorAll("[data-file]")].forEach((el) => {
    el.addEventListener("input", save);
    el.addEventListener("keydown", (event) => {
      if (event.key === "Tab" && el !== stdin) {
        event.preventDefault();
        el.setRangeText("    ", el.selectionStart, el.selectionEnd, "end");
        el.dispatchEvent(new Event("input"));
      }
    });
  });
  document.querySelector("#reset-code").addEventListener("click", () => {
    code.value = l.starter;
    stdin.value = l.inputs || "";
    document
      .querySelectorAll("[data-file]")
      .forEach((el) => (el.value = l.files[el.dataset.file]));
    save();
    output.textContent = "เริ่มโค้ดและข้อมูลตัวอย่างใหม่แล้ว";
    document.querySelector("#checks").innerHTML = "";
  });
  document.querySelector("#solution").addEventListener("click", () => {
    const feedback = document.querySelector("#feedback");
    feedback.className = "feedback";
    feedback.textContent = "แนวคำตอบมีได้หลายวิธี ลองอ่านและพิมพ์ด้วยตัวเอง";
    let block = document.querySelector("#solution-code");
    if (!block) {
      block = document.createElement("div");
      block.id = "solution-code";
      feedback.after(block);
    }
    block.innerHTML = `${Object.entries(l.fileSolutions || {})
      .map(
        ([name, content]) =>
          `<p>${name}</p><pre class="output expected-output">${escapeHTML(content)}</pre>`,
      )
      .join(
        "",
      )}<p>${l.files ? "main.py" : "ตัวอย่างเฉลย"}</p><pre class="output expected-output">${escapeHTML(l.solution)}</pre>`;
  });
  function boot() {
    clearWorker();
    worker = new Worker("assets/python-worker.js");
    run.disabled = true;
    run.textContent = "กำลังเตรียม Python…";
    status.textContent = "ครั้งแรกอาจใช้เวลา 10–40 วินาที";
    worker.postMessage({ type: "init" });
    initTimer = setTimeout(() => {
      clearWorker();
      run.disabled = false;
      run.textContent = "ลองโหลด Python ใหม่";
      status.textContent = "โหลดไม่สำเร็จ ตรวจอินเทอร์เน็ตแล้วลองอีกครั้ง";
    }, 60000);
    worker.onmessage = ({ data }) => {
      if (currentLesson !== l) return;
      if (data.type === "ready") {
        clearTimeout(initTimer);
        workerReady = true;
        run.disabled = false;
        run.textContent = "▶ รันโค้ด";
        status.textContent = "Python พร้อม · รันในเบราว์เซอร์นี้";
        return;
      }
      clearTimeout(runTimer);
      run.disabled = false;
      run.textContent = "▶ รันโค้ด";
      const feedback = document.querySelector("#feedback");
      if (data.type === "result") {
        output.textContent =
          data.output || "(โปรแกรมทำงานจบโดยไม่มีข้อความจาก print)";
        document.querySelector("#input-prompts").textContent =
          data.prompts.filter(Boolean).length
            ? `ข้อความจาก input(): ${data.prompts.filter(Boolean).join(" · ")}`
            : "";
        const passed = data.checks.length
          ? data.checks.every((c) => c.pass)
          : normalize(data.output) === normalize(l.expected);
        feedback.className = passed ? "feedback" : "feedback bad";
        feedback.textContent = passed
          ? "✓ ผ่านภารกิจแล้ว ลองเปลี่ยนข้อมูลหรืออธิบายการทำงานแต่ละบรรทัด"
          : "รันเสร็จแล้ว แต่ยังไม่ผ่านทุกเงื่อนไขของโจทย์ ดูผลตรวจหรือเปิดคำใบ้";
        document.querySelector("#checks").innerHTML = data.checks
          .map(
            (c) =>
              `<details class="test-result ${c.pass ? "pass" : "fail"}"><summary>${c.pass ? "✓" : "✕"} ${escapeHTML(c.name)}</summary>${c.pass ? "ผลลัพธ์ถูกต้อง" : `<p>คาดหวัง</p><pre>${escapeHTML(c.expected || "")}</pre><p>ได้ผลลัพธ์</p><pre>${escapeHTML(c.actual || c.error || "ไม่มีผลลัพธ์")}</pre>`}</details>`,
          )
          .join("");
        if (passed) complete(l.id);
        status.textContent = "รันเสร็จแล้ว";
      } else {
        output.textContent = data.message;
        feedback.className = "feedback bad";
        feedback.textContent = data.message.includes("EOFError")
          ? "ข้อมูลนำเข้าไม่พอ เพิ่มหนึ่งบรรทัดต่อ input() แล้วรันใหม่"
          : data.message.includes("IndentationError")
            ? "ตรวจการเยื้องบรรทัดใต้ if / for / def ให้เท่ากัน"
            : data.message.includes("SyntaxError")
              ? "ตรวจเครื่องหมายคำพูด วงเล็บ และ :"
              : data.message.includes("NameError")
                ? "ตรวจชื่อตัวแปรให้ตรงกับชื่อที่ประกาศไว้"
                : data.message.includes("ValueError")
                  ? "ค่าแปลงเป็นตัวเลขไม่ได้ ลองข้อมูลจำนวนเต็มหรือจัดการด้วย try / except"
                  : data.message.includes("TypeError")
                    ? "ชนิดข้อมูลไม่เข้ากัน ตรวจการแปลงชนิดและค่าที่นำมาคำนวณ"
                    : "อ่านบรรทัดท้ายของ Error แล้วตรวจบรรทัดที่ระบุ";
        status.textContent = "พบข้อผิดพลาด";
        if (!workerReady) {
          clearWorker();
          run.textContent = "ลองโหลด Python ใหม่";
        }
      }
    };
    worker.onerror = () => {
      clearWorker();
      run.disabled = false;
      run.textContent = "ลองโหลด Python ใหม่";
      status.textContent = "โหลด Python ไม่สำเร็จ";
    };
  }
  boot();
  run.addEventListener("click", () => {
    if (!workerReady) {
      boot();
      return;
    }
    if (
      code.value.length > 20000 ||
      Object.values(readFiles()).some((c) => c.length > 20000)
    ) {
      output.textContent =
        "ไฟล์โค้ดหนึ่งไฟล์ต้องไม่เกิน 20,000 ตัวอักษรในห้องทดลองนี้";
      return;
    }
    run.disabled = true;
    run.textContent = "กำลังรัน…";
    status.textContent = "กำลังประมวลผลและตรวจภารกิจ";
    document.querySelector("#checks").innerHTML = "";
    worker.postMessage({
      type: "run",
      id: l.id,
      code: code.value,
      inputs: inputLines(stdin.value),
      files: readFiles(),
      defaultInputs: inputLines(l.inputs || ""),
      tests: l.tests || [],
    });
    runTimer = setTimeout(() => {
      clearWorker();
      output.textContent =
        "หยุดโปรแกรมหลัง 8 วินาที อาจมีลูปที่ไม่จบ ตรวจเงื่อนไขแล้วลองใหม่";
      run.disabled = false;
      run.textContent = "ลองโหลด Python ใหม่";
      status.textContent = "หยุดโปรแกรมแล้ว";
    }, 8000);
  });
}

function dnsResult(mode) {
  if (mode === "missing")
    return {
      ok: false,
      path: [0, 1, 0],
      labels: ["missing.example.test", "NXDOMAIN"],
      lines: [
        "Query A: missing.example.test",
        "✕ DNS server ไม่มี record นี้ → NXDOMAIN",
        "ยังไม่เริ่มติดต่อ Web Server",
      ],
      events: [
        {
          kind: "QUERY / A",
          value: "missing.example.test",
          detail: "Client ส่งชื่อไป DNS Server",
        },
        {
          kind: "RESPONSE",
          value: "NXDOMAIN",
          detail: "ไม่มีชื่อในข้อมูล DNS จำลอง",
        },
      ],
    };
  const reverse = mode === "reverse";
  return {
    ok: true,
    path: reverse ? [0, 1, 0] : [0, 1, 0, 2],
    labels: reverse
      ? ["203.0.113.80", "ops.example.test"]
      : ["ops.example.test", "203.0.113.80", "TCP / 443"],
    lines: reverse
      ? [
          "PTR query: 80.113.0.203.in-addr.arpa",
          "✓ PTR response: ops.example.test",
          "Reverse lookup ใช้ PTR record ที่กำหนดแยกไว้ ไม่ใช่การย้อน A record โดยอัตโนมัติ",
        ]
      : [
          "A query: ops.example.test",
          "✓ A response: 203.0.113.80",
          "Client ใช้ IP ที่ได้ติดต่อ Web Server ผ่าน TCP/443 ในแบบจำลอง",
        ],
    events: reverse
      ? [
          {
            kind: "REVERSE QUERY / PTR",
            value: "203.0.113.80",
            detail: "สร้างชื่อ query 80.113.0.203.in-addr.arpa",
          },
          {
            kind: "PTR RESPONSE",
            value: "ops.example.test",
            detail: "ได้ชื่อจาก PTR record ที่ DNS Server มีอยู่",
          },
        ]
      : [
          {
            kind: "FORWARD QUERY / A",
            value: "ops.example.test",
            detail: "ส่งชื่อ Domain ไปถาม DNS Server",
          },
          {
            kind: "A RESPONSE",
            value: "203.0.113.80",
            detail: "DNS ส่ง IP กลับมาให้ Client",
          },
          {
            kind: "CONNECT TO WEB SERVER",
            value: "203.0.113.80 : 443",
            detail: "ใช้ IP ที่ได้เชื่อมต่อบริการ HTTPS",
          },
        ],
  };
}
function concept(event) {
  const el = document.querySelector("#live-concept");
  if (!el) return;
  el.innerHTML = `<span>${escapeHTML(event.kind)}</span><strong>${escapeHTML(event.value)}</strong><small>${escapeHTML(event.detail || "")}</small>`;
  el.classList.remove("changed");
  void el.offsetWidth;
  el.classList.add("changed");
}
function visualEvents(l, result, values) {
  if (l.id === "subnet") {
    const p = Number(values.prefix),
      size = 2 ** (32 - p);
    return [
      {
        kind: "IPv4 / SUBNET GROUPS",
        value: `/${p} · ${256 / size} SUBNET`,
        detail: `${size} ที่อยู่ · ${size - 2} host ต่อ subnet สำหรับ LAN ทั่วไป`,
      },
    ];
  }
  if (l.id === "dns") return result.events;
  if (l.id === "mpls")
    return [
      {
        kind: "CUSTOMER / IP",
        value: "10.2.0.20",
        detail: "CE ส่ง IP packet ให้ PE ทางเข้า",
      },
      {
        kind: "INGRESS PE / PUSH",
        value: `LABEL ${values["incoming-label"]}`,
        detail: "ติด label ด้านหน้า IP packet",
      },
      {
        kind: result.ok ? "CORE P / SWAP" : "CORE P / LOOKUP FAILED",
        value: result.ok ? "LABEL 200" : "NO ENTRY FOR 999",
        detail: result.ok
          ? "ตาราง 100 → 200 · IP ปลายทางยังเดิม"
          : "ไม่พบ incoming label ในตาราง จึงทิ้ง packet",
      },
      {
        kind: "EGRESS PE / POP",
        value: "10.2.0.20",
        detail: "เอา label ออกแล้วส่ง IP ให้ CE ปลายทาง",
      },
    ];
  if (l.id === "vlan")
    return result.path.map((node, i) => ({
      kind: node === 4 ? "L3 / INTER-VLAN ROUTING" : "L2 / VLAN FORWARDING",
      value:
        result.labels[i] ||
        `VLAN${values["target-vlan"] === "10" ? "10" : i > 2 ? "20" : "10"}`,
      detail:
        node === 4
          ? "Gateway route ไป subnet ของ VLAN20"
          : "ส่งได้เฉพาะพอร์ตและ Trunk ที่อยู่ใน VLAN ที่ตรงกัน",
    }));
  if (l.id === "layer2")
    return [
      {
        kind: "ETHERNET FRAME",
        value: "DST MAC 02:00:00:00:00:02",
        detail: "source MAC เรียนจาก port ที่รับเข้า",
      },
      {
        kind: "SWITCH / MAC LOOKUP",
        value:
          values["mac-state"] === "known"
            ? "PORT 2 / VLAN10"
            : "FLOOD / VLAN10",
        detail:
          values["mac-state"] === "known"
            ? "พบ entry จึงส่งเฉพาะพอร์ต 2"
            : "ไม่พบ entry จึง flood ใน VLAN เดียวกัน",
      },
    ];
  if (l.id === "layer3")
    return [
      {
        kind: "IP PACKET",
        value: values["route-destination"],
        detail: "Router ดู destination IP",
      },
      {
        kind: "L2 / TO GATEWAY",
        value: "FRAME → MAC ของ R1",
        detail: "Switch ส่ง frame ไป Router ยังไม่ตัดสินใจ route ด้วย IP",
      },
      {
        kind: "LONGEST PREFIX MATCH",
        value: result.lines[0].split("เลือก ")[1],
        detail: "เลือก route ที่ตรงและเฉพาะที่สุด",
      },
      {
        kind: "FORWARD / NEW L2 FRAME",
        value: "TTL 64 → 63",
        detail: "IP ปลายทางเดิม แต่ MAC เป็นของ link ถัดไป",
      },
    ];
  if (l.id === "internet" || l.id === "packet")
    return [
      {
        kind: "CLIENT / IP + DNS",
        value: "ops.example.test",
        detail: "IP/Gateway/DNS พร้อม · DNS ค้นชื่อเป็น 203.0.113.80",
      },
      {
        kind: "HOME ROUTER / GATEWAY",
        value: "192.168.10.25 → 198.51.100.25",
        detail: "source NAT ในแบบจำลอง · destination IP ไม่เปลี่ยน",
      },
      {
        kind: "ISP → WEB SERVER",
        value: "203.0.113.80 : 443",
        detail: "Router ของ ISP ส่งต่อ · TCP + TLS → HTTPS",
      },
    ];
  return result.path.map((node, i) => ({
    kind: "FORWARDING STEP " + (i + 1),
    value:
      node === 0
        ? "192.168.10.25"
        : node === 1
          ? "L2 / SWITCH"
          : node === 2
            ? "192.168.10.1"
            : "10.0.0.10",
    detail:
      node === 1
        ? "ส่ง Ethernet frame ภายใน LAN"
        : node === 2
          ? "Gateway ส่ง IP packet ไปอีกเครือข่าย"
          : "ดูข้อมูลปลายทางและการส่งต่อ",
  }));
}
function initNetwork(l) {
  const sceneEl = document.querySelector("#network-scene");
  const scenePromise = addScene(sceneEl, {
    variant: l.scene,
    interactive: true,
  });
  let experimented = false,
    success = false;
  const trace = document.querySelector("#trace");
  sceneEl.addEventListener("device-inspect", (event) => {
    const d = event.detail;
    document.querySelector("#device-inspector").innerHTML =
      `<strong>${escapeHTML(d.name)}</strong><span>IP: ${escapeHTML(d.ip)}</span><span>MAC: ${escapeHTML(d.mac || "ไม่แสดงในระดับนี้")}</span><span>${escapeHTML(d.role)}</span>`;
  });
  document.querySelector("#reset-view").addEventListener("click", async () => {
    (await scenePromise)?.reset();
  });
  const readValues = () =>
    Object.fromEntries(
      [...document.querySelectorAll(".controls select")].map((el) => [
        el.id,
        el.value,
      ]),
    );
  scenePromise.then((scene) => {
    if (l.id === "subnet") scene?.setSubnet(24);
  });
  document.querySelectorAll(".controls select").forEach((select) =>
    select.addEventListener("change", async () => {
      const scene = await scenePromise;
      if (currentLesson !== l) return;
      if (l.id === "subnet") scene?.setSubnet(Number(readValues().prefix));
      if (l.id === "vlan") scene?.setVlan(Number(readValues()["target-vlan"]));
      if (l.id === "layer2")
        document
          .querySelector("#mac-entry")
          .classList.toggle(
            "muted-row",
            readValues()["mac-state"] === "unknown",
          );
      if (l.id === "layer3")
        document
          .querySelector('[data-route="24"]')
          .classList.toggle(
            "muted-row",
            readValues()["specific-route"] === "off",
          );
      trace.textContent = "เปลี่ยนค่าแล้ว กดเริ่มทดลองเพื่ออ่านผลใหม่";
      trace.classList.remove("error");
      experimented = false;
    }),
  );
  document.querySelector("#send-packet").addEventListener("click", async () => {
    const button = document.querySelector("#send-packet");
    button.disabled = true;
    document
      .querySelectorAll(".controls select")
      .forEach((el) => (el.disabled = true));
    const values = readValues(),
      result =
        l.id === "dns"
          ? dnsResult(values["dns-mode"])
          : simulateNetwork(l.id, values);
    trace.textContent = "กำลังทดลอง…";
    trace.classList.remove("error");
    const scene = await scenePromise;
    if (currentLesson !== l) return;
    const events = visualEvents(l, result, values);
    if (l.id === "layer3") {
      const prefix = result.lines[0].includes("/24")
        ? "24"
        : result.lines[0].includes("/16")
          ? "16"
          : "0";
      document
        .querySelectorAll("[data-route]")
        .forEach((row) =>
          row.classList.toggle("selected-route", row.dataset.route === prefix),
        );
    }
    if (l.id === "mpls")
      document
        .querySelector('[data-label="100"]')
        .classList.toggle("selected-route", result.ok);
    if (result.path.length > 1) {
      await scene?.sendPath(result.path, {
        failure: !result.ok,
        labels: result.labels,
        flood: l.id === "layer2" && values["mac-state"] === "unknown",
        onStep: (index) => {
          if (currentLesson === l)
            concept(events[Math.min(index, events.length - 1)]);
        },
      });
    } else if (events.length) concept(events[0]);
    if (currentLesson !== l) return;
    if (!scene && events.length) concept(events.at(-1));
    trace.innerHTML = result.lines
      .map((line) => `<div>${escapeHTML(line)}</div>`)
      .join("");
    trace.classList.toggle("error", !result.ok);
    if (!result.ok)
      concept({
        kind: "STOP / ตรวจสาเหตุ",
        value:
          l.id === "dns"
            ? "NXDOMAIN"
            : l.id === "mpls"
              ? "NO LABEL ENTRY"
              : "ส่งต่อไม่ได้",
        detail: result.lines.at(-1),
      });
    experimented = true;
    success = result.ok;
    button.disabled = false;
    document
      .querySelectorAll(".controls select")
      .forEach((el) => (el.disabled = false));
  });
  document.querySelectorAll("[data-answer]").forEach((button) =>
    button.addEventListener("click", () => {
      const feedback = document.querySelector("#feedback");
      if (!experimented) {
        feedback.className = "feedback bad";
        feedback.textContent =
          "ทดลองด้วยตัวควบคุมก่อนตอบ เพื่อสังเกตสิ่งที่เกิดขึ้น";
        return;
      }
      if (l.id === "gateway" && !success) {
        feedback.className = "feedback bad";
        feedback.textContent = "แก้ Gateway แล้วทดลองส่งให้สำเร็จก่อน";
        return;
      }
      const pass = Number(button.dataset.answer) === l.answer;
      feedback.className = pass ? "feedback" : "feedback bad";
      feedback.textContent =
        (pass ? "✓ ผ่านภารกิจแล้ว — " : "ลองอีกครั้ง — ") + l.reason;
      if (pass) complete(l.id);
    }),
  );
}

const terms = [
  ["IP", "ที่อยู่ในเครือข่าย IP ใช้ร่วมกับ prefix เพื่อระบุ subnet"],
  [
    "MAC / L2",
    "MAC เป็นที่อยู่ Ethernet frame ส่วน L2 ดูการส่ง frame บน link และ VLAN",
  ],
  [
    "L3 / Routing",
    "การส่ง packet ระหว่างเครือข่ายด้วย destination IP และ routing table",
  ],
  [
    "VLAN / Trunk",
    "VLAN แยก L2 broadcast domain Trunk ส่งหลาย VLAN แต่ไม่ route ข้าม VLAN เอง",
  ],
  [
    "DNS / A / PTR",
    "A ค้นชื่อเป็น IPv4 PTR ค้นชื่อจาก reverse DNS ทั้งสอง record กำหนดแยกกัน",
  ],
  [
    "MPLS / Label",
    "ส่ง packet ตาม label และ forwarding entry ภายในเครือข่ายผู้ให้บริการ",
  ],
  [
    "PE / P / CE",
    "PE อยู่ขอบเครือข่ายผู้ให้บริการ P อยู่แกนกลาง CE อยู่ฝั่งลูกค้า",
  ],
  ["Gateway", "ที่อยู่ Router ที่เครื่องใช้ส่งไปยังเครือข่ายอื่น"],
  ["Subnet / Prefix", "เครือข่ายย่อยและจำนวนบิตของส่วน network เช่น /24"],
  [
    "input() / int()",
    "input() รับข้อความ int() แปลงเป็นจำนวนเต็มเมื่อค่าแปลงได้",
  ],
  [
    "List / Tuple / Set / Dict",
    "List แก้ได้ Tuple เปลี่ยนสมาชิกไม่ได้ Set เก็บไม่ซ้ำ Dict ใช้ key อ้างอิงค่า",
  ],
  [
    "Function / Module",
    "Function รวมคำสั่งที่เรียกซ้ำได้ Module แยกโค้ดเป็นไฟล์แล้ว import มาใช้",
  ],
];
function openGlossary() {
  document.querySelector("#glossary").showModal();
}
document.querySelector("#terms").innerHTML = terms
  .map(
    ([name, desc]) =>
      `<div class="term"><strong>${name}</strong><p>${desc}</p></div>`,
  )
  .join("");
document
  .querySelector("#glossary-open")
  .addEventListener("click", openGlossary);
document
  .querySelector("#glossary .close")
  .addEventListener("click", () => document.querySelector("#glossary").close());
function route() {
  cleanup();
  currentLesson = null;
  const hash = location.hash.slice(1) || "explore";
  document
    .querySelectorAll("nav a")
    .forEach((a) =>
      a.classList.toggle(
        "active",
        a.hash === "#" + hash ||
          (hash.startsWith("lesson/") && a.hash === "#explore"),
      ),
    );
  if (hash.startsWith("lesson/")) renderLesson(hash.split("/")[1]);
  else if (hash === "path") renderPath();
  else if (hash === "project") renderPractice();
  else if (hash === "progress") renderProgress();
  else if (hash === "credits") renderCredits();
  else renderExplore();
  document.title = currentLesson
    ? currentLesson.title + " · TechAtlas"
    : "TechAtlas · ห้องทดลองเทคโนโลยี";
  window.scrollTo(0, 0);
  badge();
}
window.addEventListener("hashchange", route);
route();
if (document.modelContext?.registerTool) {
  const tools = [
    {
      name: "read_learning_progress",
      description: "Read independent courses, lessons and completed progress.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: () => ({
        completed: lessons.filter((l) => progress[l.id]).map((l) => l.id),
        courses: courses.map((c) => ({
          id: c.id,
          lessons: c.lessons.map((l) => ({ id: l.id, title: l.title })),
        })),
      }),
    },
    {
      name: "open_lesson",
      description:
        "Open a lesson in Network or Python without marking it complete.",
      inputSchema: {
        type: "object",
        properties: {
          lessonId: { type: "string", enum: lessons.map((l) => l.id) },
        },
        required: ["lessonId"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false },
      execute: async (input) => {
        if (!input || !lessons.some((l) => l.id === input.lessonId))
          throw new Error("Unknown lesson");
        location.hash = "lesson/" + input.lessonId;
        await new Promise((resolve) => setTimeout(resolve, 50));
        return {
          opened: input.lessonId,
          track: lessons.find((l) => l.id === input.lessonId).track,
        };
      },
    },
  ];
  for (const tool of tools)
    try {
      Promise.resolve(document.modelContext.registerTool(tool)).catch(() => {});
    } catch {}
}
