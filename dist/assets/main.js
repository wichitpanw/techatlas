import {
  pythonLessons,
  pythonSections,
  pythonReference,
} from "./python-curriculum.js?v=python-next-20261004";
import {
  networkLessons as originalNetworkLessons,
  networkControls,
  simulateNetwork,
} from "./network-curriculum.js?v=internet-20261004";
import {
  arrangeNetwork,
  orderedSections as networkSections,
} from "./network-foundations.js?v=internet-placement-20261004";
import { conceptSurface, initConcept } from "./network-concepts.js?v=completion-20261004";
import { createPythonInteractive } from './python-interactive.js?v=python-next-20261004';
import { initMechanism } from './network-mechanism.js';
import {initFeedback} from './feedback.js';
import {renderUpdates,initUpdateFooter} from './updates.js?v=python-next-20261004';
import {internetSurface,initInternet} from './internet-lab.js';
import { networkLabSpecs,buildNetworkLab } from './network-lab-models.js';
import { bindPythonEditor } from './python-editor.js';
import {programmingLessons as withdrawnProgrammingLessons, programmingSections} from './programming-curriculum.js';
import {programmingSurface, initProgramming} from './programming-lab.js';
import {apiLessons,apiSections} from './api-curriculum.js';
import {apiSurface,initAPI} from './api-lab.js';
import {buildAPI} from './api-model.js';
import {initVisitCounter} from './visit-counter.js?v=counter-20261004';
import {aiLessons as draftAILessons,aiSections} from './ai-curriculum.js';
import {aiSurface,initAI} from './ai-lab.js';
import {networkLearningGuide} from './network-learning-guide.js';
import {courseIsVisible} from './course-visibility.js';
import {glossaryEntries,lessonTermsSurface,searchGlossary} from './lesson-terms.js?v=python-next-20261004';
import {canonicalLessonId,mergeLegacyProgress} from './lesson-aliases.js';
initVisitCounter();
const networkLessons = arrangeNetwork(originalNetworkLessons);
// Drafts remain on disk; withdrawing a course must not erase saved learner work.
const programmingLessons = apiLessons;
const aiLessons = courseIsVisible('ai', location.hostname) ? draftAILessons : [];

const lessons = [...networkLessons, ...pythonLessons, ...programmingLessons, ...aiLessons];
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
  {id:'ai',name:'AI',description:'หมวดอิสระ · แผนที่ AI → กฎ vs ข้อมูล → Training/Inference → Token · ต้นแบบ 4 บท',sections:aiSections,lessons:aiLessons},
  {id:'programming',name:'Programming',description:'API เท่านั้น · คำขอ/คำตอบ → REST/GraphQL/gRPC/SOAP → ช่องข้อความและ Events',sections:apiSections,lessons:programmingLessons},
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
].filter(course => course.lessons.length).sort((a,b)=>['network','python','programming','ai'].indexOf(a.id)-['network','python','programming','ai'].indexOf(b.id));
let progress = {},
  drafts = {},
  storageAvailable = true;
try {
  const saved = localStorage.getItem("techatlas-progress-v2");
  if (saved) progress = JSON.parse(saved);
  else {
    const old = mergeLegacyProgress(JSON.parse(
      localStorage.getItem("techatlas-progress-v1") || "{}",
    ));
    progress = Object.fromEntries(
      networkLessons.filter((l) => old[l.id]).map((l) => [l.id, old[l.id]]),
    );
  }
  if (!progress || Array.isArray(progress) || typeof progress !== "object")
    progress = {};
  progress=mergeLegacyProgress(progress);
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
  main.onclick = null;
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
        ? "./card-scene.js?v=python-next-20261004"
        : options.python
          ? "./python-scene.js?v=python-next-20261004"
        : options.mechanism
          ? "./network-mechanism-scene.js"
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
  return `<section class="intro"><div><p class="eyebrow">${label}</p><h1>${title}</h1><p>${description}</p></div><span class="number">NETWORK · PYTHON · PROGRAMMING · AI</span></section>`;
}
function card(l) {
  const mode = networkLabSpecs[l.id]?.mode;
  if(l.id==='osi-model')return `<a class="card ${progress[l.id]?'done':''}" href="#lesson/${l.id}"><div class="card-visual" data-card-scene="${l.id}"><span class="label">OSI / ENCAPSULATION</span><span class="lab-badge">3D INTERACTIVE</span></div><div class="card-body"><h3>${l.title}</h3><p>ส่งลง 7 → 1 แล้วรับขึ้น 1 → 7 · ดู Header และ Frame เสีย</p><div class="card-meta"><span>${l.time} นาที · ทดลองทีละชั้น</span><span>${progress[l.id]?'✓ ผ่านแล้ว':'เปิดบทเรียน ↗'}</span></div></div></a>`;
  const badge = l.track === 'ai' ? 'AI VISUAL LAB' : l.apiLab ? '3D API LAB' : l.track === 'programming' ? 'LIVE WEB LAB' : l.track === 'python' ? 'LIVE PYTHON' : mode === '3d' || !l.conceptLab || l.section === 'foundation' ? '3D INTERACTIVE' : mode === 'tool' ? 'INTERACTIVE SANDBOX' : 'INTERACTIVE SEQUENCE';
  return `<a class="card ${progress[l.id] ? "done" : ""}" href="#lesson/${l.id}"><div class="card-visual" data-card-scene="${l.id}"><span class="label">${l.tag}</span><span class="lab-badge">${badge}</span></div><div class="card-body"><h3>${l.title}</h3><p>${l.subtitle}</p><div class="card-meta"><span>${l.time} นาที · ${l.track === "python" ? "เขียนและรันโค้ด" : "ทดลองได้ทันที"}</span><span class="${progress[l.id] ? "complete-badge" : "go"}">${progress[l.id] ? "✓ ผ่านแล้ว" : "เปิดบทเรียน ↗"}</span></div></div></a>`;
}
function renderExplore() {
  main.className = "";
  main.innerHTML = `${intro("วันนี้อยาก<strong>สำรวจเรื่องไหน?</strong>", "เลือกเรื่องที่สนใจ เห็นภาพ ทดลอง และค้นหาคำตอบด้วยตัวเอง", "TECHATLAS · LEARN BY EXPLORING")}<section class="subject-grid" aria-label="หมวดการเรียนรู้"><button class="subject-tile network-subject" data-subject="network"><span class="subject-code">01 / NETWORK</span><h2>เครือข่าย</h2><p>อุปกรณ์เชื่อมต่อกันอย่างไร ข้อมูลเดินทางไปไหน</p><span>${networkLessons.length} บท · แบบจำลองและภารกิจ</span></button><button class="subject-tile python-subject" data-subject="python"><span class="subject-code">02 / PYTHON</span><h2>เขียนโปรแกรม Python</h2><p>เริ่มจากศูนย์ เขียนโค้ดและทดลองรันด้วยตัวเอง</p><span>${pythonLessons.length} บท · รันโค้ดในหน้าเรียน</span></button><button class="subject-tile programming-subject" data-subject="programming"><span class="subject-code">03 / PROGRAMMING</span><h2>API: โปรแกรมคุยกันอย่างไร</h2><p>Request · Response · Contract · Events</p><span>${programmingLessons.length} บท · ทดลองกลไกใน 3D</span></button><article class="subject-tile planned-subject"><span class="subject-code">04 / ARTIFICIAL INTELLIGENCE</span><h2>ปัญญาประดิษฐ์</h2><p>เข้าใจ AI ทดลองใช้งาน และตรวจสอบคำตอบ</p><span>กำลังเตรียมบทเรียน</span></article></section><div class="filterbar" role="group" aria-label="กรองบทเรียน"><button class="filter active" data-filter="all">ภาพรวมทุกหมวด</button><button class="filter" data-filter="network">Network ${networkLessons.length}</button><button class="filter" data-filter="python">Python ${pythonLessons.length}</button><button class="filter" data-filter="programming">Programming ${programmingLessons.length}</button><button class="filter" data-filter="completed">ผ่านแล้ว</button><label class="search"><input id="search" type="search" placeholder="ค้นหาหัวข้อ เช่น VLAN, List…" aria-label="ค้นหาบทเรียน"></label></div><div id="catalog"></div>`;
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
          if (filter === "all" && !query) {
            const featuredIds = course.id === 'ai' ? ['ai-map','ai-training','ai-tokens'] : course.id === "network" ? ["internet", "vlan", "dns"] : course.id === "programming" ? ["api-basics", "api-rest", "api-websocket"] : ["python-start", "variables", "conditions"];
            const featured = featuredIds.map((id) => subset.find((l) => l.id === id)).filter(Boolean);
            for (const lesson of subset) if (featured.length < 3 && !featured.includes(lesson)) featured.push(lesson);
            return `<section class="subject-showcase"><div class="section-heading"><span class="section-index">${course.id === 'ai' ? 'AI' : course.id === "network" ? "NET" : course.id === "programming" ? "WEB" : "PY"}</span><h2>${course.name}</h2><span class="desc">${course.id === 'ai' ? 'เห็นภาพและทดลองกลไก AI' : course.id === "network" ? "มองให้เห็นการทำงานของเครือข่าย" : course.id === "programming" ? "เห็นคำขอ ข้อตกลง และช่องทางส่งข้อมูล" : "เรียนพื้นฐานผ่านการเขียนโค้ดจริง"}</span><button class="show-subject" data-subject="${course.id}">ดูทั้งหมด ${subset.length} บท</button></div><div class="cards">${featured.map(card).join("")}</div></section>`;
          }
          return `<section><div class="section-heading"><span class="section-index">${course.id === 'ai' ? 'AI' : course.id === "network" ? "NET" : course.id === "programming" ? "WEB" : "PY"}</span><h2>${course.name}</h2><span class="desc">${course.description}</span></div>${course.id === "python" ? `<p class="reference-strip">เริ่มจากศูนย์ · เปิดเรียนได้โดยไม่ต้องผ่าน Network</p>` : ""}${course.sections
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
  function chooseFilter(value) {
      filter = value;
      document.querySelector("#search").value = "";
      document
        .querySelectorAll("[data-filter]")
        .forEach((b) => b.classList.toggle("active", b.dataset.filter === value));
      draw();
  }
  document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => chooseFilter(button.dataset.filter)));
  main.onclick = function selectSubject(event) {
    const button = event.target.closest("[data-subject]");
    if (!button) return;
    chooseFilter(button.dataset.subject);
    document.querySelector(".filterbar").scrollIntoView({ behavior: "smooth", block: "start" });
  };
  document.querySelector("#search").addEventListener("input", draw);
}
function renderPath() {
  main.className = "";
  main.innerHTML = `${intro("เส้นทางภายในแต่ละหมวด", "เลือกเริ่ม Network, Python, Programming หรือ AI ได้ทันที แต่ละหมวดมีลำดับการเรียนของตัวเอง", "CHOOSE YOUR SUBJECT")}<div class="course-paths">${courses
    .map(
      (course) =>
        `<section class="course-path"><h2>${course.name}</h2><p>${course.description}</p>${course.id === "python" ? `<p class="reference-strip">เรียนตามลำดับจากพื้นฐานไปสู่แบบฝึก</p>` : ""}${course.sections
          .map(
            (section, i) =>
              `<article class="path-item"><span class="path-number">${section.code || String(i + 1).padStart(2, "0")}</span><div><h3>${section.title}</h3><div class="path-lessons">${course.lessons
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
    )}</div><div class="future">${["JavaScript บทต่อไป", "TypeScript", "Node.js", "AI: Neural Network → Transformer → RAG"].map((name) => `<article class="future-item"><strong>${name}</strong><span>บทต่อยอดในระยะถัดไป</span></article>`).join("")}</div>`;
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
    )}</div><div class="section-heading"><span class="section-index">WEB</span><h2>แบบฝึก Programming</h2></div><div class="cards">${programmingLessons.filter(l=>["api-rest","api-graphql","api-webhooks"].includes(l.id)).map(card).join("")}</div><div class="section-heading"><span class="section-index">NET</span><h2>ทดลองแก้สถานการณ์ Network</h2></div><div class="cards">${networkLessons
    .filter((l) => ["vlan", "gateway", "mpls"].includes(l.id))
    .map(card)
    .join("")}</div>`;

  lazyScenes(main);
}
function renderCredits() {
  main.className = "";
  main.innerHTML = `${intro("Credits & Copyright", "ผู้จัดทำและเอกสารอ้างอิงของ TechAtlas", "ABOUT THIS SITE")}<section class="credits-panel"><h2>Warapon Wichitpan</h2><p>ผู้จัดทำเว็บไซต์ TechAtlas</p><p>Contacts: <a href="mailto:wichitpan.w@gmail.com">wichitpan.w@gmail.com</a></p><p>© 2026 Warapon Wichitpan. All rights reserved.</p><hr><h3>เนื้อหา Python</h3><p>อ้างอิง ${pythonReference.title} จำนวน 37 หน้า</p><p>${pythonReference.note}</p><h3>เนื้อหา Programming</h3><p>บทเริ่มต้น HTML/CSS/JavaScript อ้างอิง MDN แต่ละบทมีลิงก์อ่านเพิ่มเติม ตัวอย่างแก้โค้ดและรันใน Sandbox ส่วน Request/Response เป็นแบบจำลอง</p><h3>เนื้อหา Network</h3><p>แต่ละบทมีลิงก์เอกสารอ้างอิงจาก RFC, Cisco หรือ MDN ภาพเป็นแบบจำลองเพื่อการสอนที่ย่อรายละเอียดบางขั้นตอน</p></section>`;
  const credits = main.querySelector('.credits-panel');
  const withdrawn = [...credits.querySelectorAll('h3')].find(el => el.textContent === 'เนื้อหา Programming');
  if(withdrawn?.nextElementSibling)withdrawn.nextElementSibling.innerHTML='API: ใช้หัวข้อจาก <a href="https://www.instagram.com/p/Dd_26udtoec/" target="_blank" rel="noopener noreferrer">โพสต์ AlgoZen</a> เป็นแนวทาง แล้วตรวจกับ MDN, RFC, GraphQL, gRPC, W3C, WHATWG และ GitHub Docs ที่ลิงก์ในแต่ละบท คำอธิบาย ตัวอย่าง โจทย์ และภาพสร้างใหม่โดย TechAtlas เป็นแบบจำลอง ไม่ใช่การเรียกบริการจริง';
  credits.insertAdjacentHTML('beforeend', '<h3>แนวทางปรับหลักสูตร</h3><p>เทียบหัวข้อกับ <a href="https://www.youtube.com/playlist?list=PLcnJIHtHiTA0jUkISZDrd72cCWIgDMmPb" target="_blank" rel="noopener noreferrer">Networking Fundamentals — IT k Funde</a> และ <a href="https://www.youtube.com/playlist?list=PLsyeobzWxl7poL9JTVyndKe62ieoN-MZ3" target="_blank" rel="noopener noreferrer">Python for Beginners — Telusko</a> โดยสร้างคำอธิบาย โจทย์ และภาพของ TechAtlas ใหม่ และตรวจกลไกกับเอกสารหลัก ไม่ได้นำวิดีโอ ภาพ หรือสคริปต์มาคัดลอก และยังไม่ครอบคลุมทุกหัวข้อใน Playlist</p>');
}
function panel(l) {
  const termLesson=l.apiLab?{...l,termMechanisms:l.cases.map((_,i)=>buildAPI(l,i))}:l.track==='network'&&l.conceptLab&&networkLabSpecs[l.id]?{...l,termMechanisms:(l.states||[]).map((_,index)=>buildNetworkLab(l,index))}:l;
  l=termLesson;
  const guide = l.track === 'network' ? networkLearningGuide[l.id] : null;
  const observe = guide ? `<section class="scenario"><strong>ภารกิจสังเกตกลไก</strong><p>${escapeHTML(guide[0])}</p><strong>สิ่งที่ต้องแยกให้ออก</strong><p>${escapeHTML(guide[1])}</p></section>` : '';
  return `<aside class="lesson-panel"><p class="eyebrow">${l.tag}</p><h2>${l.title}</h2><span class="notice">${l.time} นาที · ${l.track === "python" ? "เรียน Python ได้โดยตรง" : l.track === "programming" ? "Programming · เริ่มได้โดยอิสระ" : "Network"}</span><div class="scenario">${l.scenario}</div>${observe}<p>${l.track === "programming" ? escapeHTML(l.explain) : l.explain}</p><ol class="steps">${l.steps.map((s) => `<li>${s}</li>`).join("")}</ol><p><strong>ลองต่อด้วยตัวเอง</strong><br>${l.work}</p>${lessonTermsSurface(l)}<button class="button light small open-terms">เปิดพจนานุกรม</button><p class="sources"><a href="${l.source}" target="_blank" rel="noopener noreferrer">เอกสารอ่านเพิ่มเติม ↗</a></p></aside>`;
}
function pythonSurface(l) {
  const draft = drafts[l.id] || {};
  const mission = `<section class="python-mission" aria-label="ภารกิจที่ต้องทำ"><p class="eyebrow">ภารกิจที่ต้องทำ</p><h3>${escapeHTML(l.task.goal)}</h3><ol>${l.task.actions.map(action => `<li>${escapeHTML(action)}</li>`).join("")}</ol><p><strong>จุดที่ต้องแก้:</strong> ${escapeHTML(l.task.focus)}</p><p><strong>ข้อมูลตัวอย่าง:</strong> ${l.inputs ? "กรอกตามลำดับ บรรทัดละหนึ่งค่า" : "บทนี้ไม่ต้องใช้ input() ไม่ต้องกรอกข้อมูลนำเข้า"}</p>${l.inputs ? `<pre class="mission-input">${escapeHTML(l.inputs)}</pre>` : ""}<details open><summary>ผลลัพธ์ที่ต้องได้จากข้อมูลตัวอย่าง</summary><pre class="output expected-output">${escapeHTML(l.expected)}</pre></details><p class="notice">${l.tests ? "ผ่านเมื่อผลลัพธ์ถูกต้องครบทุกชุดตรวจ รวมข้อมูลชุดอื่นหรือการเรียกฟังก์ชันเพิ่มเติม" : "ระบบตรวจข้อความผลลัพธ์เทียบกับตัวอย่าง"} · ระบบไม่ได้ตรวจวิธีเขียน ให้ทำตามภารกิจเพื่อฝึกแนวคิดของบทนี้</p></section>`;
  const actions = `<div class="editor-actions"><button class="button small" id="run-code" disabled>กำลังเตรียม Python…</button><button class="button light small" id="reset-code">เริ่มโค้ดใหม่</button><span id="python-status" aria-live="polite">เตรียมเครื่องรัน</span></div>`;
  return `<div class="editor-wrap">${mission}<div class="editor-bar"><span>${l.files ? "main" : l.id}.py</span><span>LIVE PYTHON</span></div><textarea class="editor" id="code" spellcheck="false" aria-label="โค้ด Python ที่แก้ไขได้">${escapeHTML(typeof draft.code === "string" ? draft.code : l.starter)}</textarea>${actions}${Object.entries(
    l.files || {},
  )
    .map(
      ([name, code]) =>
        `<div class="editor-bar"><span>${name}</span><span>MODULE FILE</span></div><textarea class="editor module-editor" data-file="${name}" spellcheck="false" aria-label="โค้ดไฟล์ ${name}">${escapeHTML(draft.files?.[name] ?? code)}</textarea>`,
    )
    .join(
      "",
    )}<div class="input-panel"><label for="stdin">คำตอบที่โปรแกรมรับด้วย input()</label><p id="stdin-help">เช่น โค้ด <code>name = input("ชื่อ: ")</code> ให้กรอก <code>Warapon</code> ในช่องนี้ ไม่ต้องใส่เครื่องหมายคำพูด<br>หนึ่งบรรทัดต่อหนึ่ง input() ใส่ข้อมูลไว้ก่อนกดรัน${l.inputs ? " · ตัวอย่างตามโจทย์เตรียมไว้ให้แล้ว" : " · ถ้าโค้ดไม่มี input() ให้เว้นว่างได้"}</p><textarea id="stdin" rows="${l.inputs?.includes("\n") ? 3 : 2}" spellcheck="false" aria-label="ข้อมูลนำเข้า Python" aria-describedby="stdin-help">${escapeHTML(typeof draft.inputs === "string" ? draft.inputs : l.inputs || "")}</textarea></div><div id="input-prompts" class="prompt-log"></div></div><div class="question-box"><p class="eyebrow">YOUR PRACTICE</p><h3>ผลตรวจภารกิจและคำใบ้</h3><p class="notice">ผลลัพธ์เมื่อใช้ข้อมูลตัวอย่างที่ให้ไว้${l.tests ? " · ระบบตรวจข้อมูลชุดอื่นด้วยเพื่อให้โปรแกรมใช้ได้จริง" : ""}</p><button class="hint" id="hint">ขอคำใบ้</button><button class="hint" id="solution">ดูตัวอย่างเฉลย</button><div class="feedback" id="feedback" aria-live="polite">${progress[l.id] ? "✓ คุณเคยผ่านภารกิจนี้แล้ว ทบทวนได้อีกครั้ง" : ""}</div><div id="checks"></div></div>`;
}
function labReference(l) {
  if (l.id === "gateway")
    return `<section class="gateway-report"><h3>อ่านหลักฐานหลังทดลอง</h3><div id="gateway-observation" aria-live="polite">เริ่มจาก Ping เครื่องใน LAN แล้วค่อยเปลี่ยนเป็น Server ต่างเครือข่าย</div><h3>คำสั่งตัวอย่าง · ผลจำลอง ไม่ใช่การตรวจเครื่องของคุณ</h3><pre id="gateway-command">ipconfig\nIPv4 Address: 192.168.10.25\nSubnet Mask: 255.255.255.0\nDefault Gateway: 192.168.10.254</pre><p>Windows ใช้ ipconfig / route print; Linux ใช้ ip addr / ip route แล้วใช้ ping ทดสอบ IP ปลายทาง</p><p>Lab สมมติว่าสายและ Switch ปกติ, ARP cache เริ่มว่าง, Router มี route ไป–กลับ และทุกเครื่องอนุญาต ICMP ไม่มี DNS เพราะทดสอบด้วย IP โดยตรง ในระบบจริง Ping ไม่ตอบอาจเกิดจาก Firewall หรือปัญหาอื่นได้ด้วย</p><div id="gateway-checklist" aria-live="polite">ภารกิจ: ลอง LAN → ลอง Server ด้วย Gateway ผิด → แก้ Gateway แล้วลอง Server อีกครั้ง</div></section>`;
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
  return (
    (l.id === "gateway"
      ? '<section class="gateway-guide"><p class="eyebrow">เริ่มจากสองคำถาม</p><h3>ปลายทางอยู่ใน LAN ของเรา หรืออยู่อีกเครือข่าย?</h3><p><strong>ใน LAN:</strong> Computer → Switch → PC · ไม่ผ่าน Router<br><strong>ต่างเครือข่าย:</strong> Computer → Switch → Router → Server</p><p>Gateway คือ “ทางออก” ไม่ใช่ IP ของ Server และไม่จำเป็นต้องลงท้าย .1 เสมอ ใน Lab นี้ Router ใช้ <strong>192.168.10.1</strong> ส่วน .254 ไม่มีอุปกรณ์ใช้งาน</p><ol><li>ใช้ Gateway เดิม .254 แล้ว Ping PC ใน LAN — สังเกตว่า Router ไม่อยู่ในเส้นทาง</li><li>คง .254 ไว้ แล้วเปลี่ยนไป Ping Server — ดูว่า ARP หา Gateway ไม่พบ</li><li>เปลี่ยน Gateway เป็น .1 แล้ว Ping Server ซ้ำ — เปรียบเทียบผลก่อนและหลัง</li></ol></section>'
      : "") +
    `<div class="network-view enhanced-view" id="network-scene"><div class="scene-note">${l.tag} · DRAG TO EXPLORE</div><div class="live-concept" id="live-concept" aria-live="polite"><span>พร้อมทดลอง</span><strong>${l.id === "dns" ? "Domain ↔ IP" : l.id === "mpls" ? "IP → LABEL → IP" : l.id === "vlan" ? "VLAN10 / VLAN20" : l.id === "layer2" ? "FRAME / MAC" : l.id === "layer3" ? "PACKET / ROUTE" : "สำรวจอุปกรณ์และที่อยู่"}</strong></div><div class="scene-legend"><span>ลากหมุน · เลื่อนซูม · กดป้ายอุปกรณ์ดูข้อมูล</span><span>แบบจำลองเพื่อการเรียนรู้</span></div></div><div class="device-inspector" id="device-inspector" aria-live="polite">เลือกป้ายที่ลอยเหนืออุปกรณ์ เพื่อดู IP, MAC และหน้าที่</div><div class="control-panel"><div class="controls">${l.id === "dns" ? '<label>รูปแบบการค้นหา<select id="dns-mode"><option value="forward">Domain → IP (A record)</option><option value="reverse">IP → Domain (PTR record)</option><option value="missing">ชื่อที่ไม่มีข้อมูล (NXDOMAIN)</option></select></label>' : networkControls(l.id)}<button class="button" id="send-packet">${l.id === "subnet" ? "ดูช่วง IP" : l.id === "dns" ? "ค้นหา DNS" : l.id === "gateway" ? "ทดลอง Ping" : "เริ่มทดลอง"}</button><button class="button light" id="reset-view">รีเซ็ตมุมมอง</button></div><div class="trace" id="trace" role="status" aria-live="polite">เลือกค่าแล้วเริ่มทดลอง สังเกตข้อมูลที่เปลี่ยนและอุปกรณ์ที่ตัดสินใจ</div></div>${labReference(l)}<div class="question-box"><p class="eyebrow">YOUR MISSION</p><h3>${l.question}</h3><div class="choices">${l.choices.map((s, i) => `<button class="choice" data-answer="${i}">${s}</button>`).join("")}</div><button class="hint" id="hint">ขอคำใบ้</button><div class="feedback" id="feedback" aria-live="polite">${progress[l.id] ? "✓ คุณเคยผ่านภารกิจนี้แล้ว" : ""}</div></div>`
  );
}
function renderLesson(id) {
  if (id === "offline") id = "practice-list";
  const l = lessons.find((l) => l.id === id);
  if (!l) {
    const withdrawnTrack = withdrawnProgrammingLessons.some(lesson => lesson.id === id) ? 'Programming' : draftAILessons.some(lesson => lesson.id === id) ? 'AI' : '';
    main.innerHTML = `${intro(withdrawnTrack ? 'กำลังเตรียมบทเรียน' : "ไม่พบบทเรียน", withdrawnTrack ? `หมวด ${withdrawnTrack} กำลังปรับปรุง งานที่บันทึกไว้ในเครื่องยังไม่ถูกลบ` : "กลับไปเลือกหัวข้อในคลังบทเรียน")}<a class="button" href="#explore">สำรวจบทเรียน</a>`;
    return;
  }
  currentLesson = l;
  // Lesson-specific reports remain outside the lab's event handlers.
  if(l.track==='ai'){
    main.className='lab-page';const index=aiLessons.indexOf(l);
    main.innerHTML=`<div class="lab-head"><a href="#explore">‹ คลังบทเรียน</a><h1>${escapeHTML(l.title)}</h1><span>AI · ${index+1} / ${aiLessons.length}</span></div><div class="lab-layout"><aside class="lesson-panel"><p class="eyebrow">${l.tag}</p><h2>${escapeHTML(l.title)}</h2><p>${escapeHTML(l.explain)}</p><p><a href="${l.source}" target="_blank" rel="noopener noreferrer">เอกสารอ่านเพิ่มเติม ↗</a></p></aside><section class="workarea">${aiSurface(l)}<div class="lesson-links">${index?`<a href="#lesson/${aiLessons[index-1].id}">‹ บทก่อนหน้า</a>`:''}${index<aiLessons.length-1?`<a href="#lesson/${aiLessons[index+1].id}">บทถัดไป ›</a>`:'<a href="#path">เส้นทางการเรียน ›</a>'}</div></section></div>`;
    scenes.set(main.querySelector('.workarea'),initAI(l,complete));return;
  }
  main.className = "lab-page";
  const group = lessons.filter((x) => x.track === l.track),
    idx = group.indexOf(l);
  main.innerHTML = `<div class="lab-head"><a class="back" href="#explore">‹ คลังบทเรียน</a><h1>${l.title}</h1><span class="lesson-tag">${l.track.toUpperCase()} · ${idx + 1} / ${group.length}</span></div><div class="lab-layout">${panel(l)}<section class="workarea">${l.apiLab ? apiSurface(l) : l.track === "programming" ? programmingSurface(l,drafts[l.id]) : l.track === "python" ? pythonSurface(l) : l.conceptLab ? conceptSurface(l) : networkSurface(l)}<div class="lesson-links">${idx > 0 ? `<a href="#lesson/${group[idx - 1].id}">‹ บทก่อนหน้าในหมวด ${l.track}</a>` : ""}${idx < group.length - 1 ? `<a style="margin-left:auto" href="#lesson/${group[idx + 1].id}">บทถัดไปในหมวด ${l.track} ›</a>` : '<a style="margin-left:auto" href="#path">ดูเส้นทางในหมวดนี้ ›</a>'}</div></section></div>`;
  document.querySelector(".open-terms").addEventListener("click", openGlossary);
  const reportButton=document.createElement('button');reportButton.className='button light small';reportButton.dataset.report='lesson';reportButton.textContent='รายงานปัญหา / เสนอแนะบทนี้';document.querySelector('.lesson-panel').append(reportButton);
  document.querySelector("#hint")?.addEventListener("click", () => {
    const feedback = document.querySelector("#feedback");
    feedback.className = "feedback";
    feedback.textContent = l.hint;
  });
  if (l.track === "programming") {
    const lab=l.apiLab?initAPI(l,{complete}):initProgramming(l,{complete,saveDraft});
    scenes.set(document.querySelector('.workarea'),lab);
  } else if (l.track === "python") initPython(l);
  else if (l.conceptLab) {
    const conceptController = initConcept(l, () => complete(l.id));
    if(conceptController)scenes.set(document.querySelector('.workarea'),conceptController);
    const mechanism = initMechanism(l, addScene);
    if (mechanism) scenes.set(document.querySelector('.mechanism-lab'), mechanism);
    if (l.section === "foundation" && l.id !== 'osi-model')
      addScene(document.querySelector("#foundation-scene"), {
        foundation: true,
        variant: l.id,
      });
  } else if(l.id==='internet'){
    const navigation=document.querySelector('.lesson-links');
    document.querySelector('.workarea').innerHTML=internetSurface()+`<div class="question-box"><h3>${escapeHTML(l.question)}</h3><div class="choices">${l.choices.map((text,i)=>`<button class="choice" data-internet-answer="${i}">${escapeHTML(text)}</button>`).join('')}</div><p id="internet-answer" aria-live="polite"></p></div>`;
    document.querySelector('.workarea').append(navigation);
    let observed=false;const controller=initInternet(l,addScene,()=>{observed=true;});scenes.set(document.querySelector('.internet-lab'),controller);
    document.querySelectorAll('[data-internet-answer]').forEach(button=>button.onclick=()=>{const correct=Number(button.dataset.internetAnswer)===l.answer;document.querySelector('#internet-answer').textContent=correct?(observed?'ผ่านแล้ว · ':'ถูกต้อง แต่ยังต้องเดินทุกขั้นจนคำตอบกลับถึง Computer · ')+l.reason:'ลองดูขั้นตอน DNS อีกครั้ง';if(correct&&observed)complete(l.id);});
  } else initNetwork(l);
}

function inputLines(value) {
  return value === "" ? [] : value.replace(/\r\n/g, "\n").split("\n");
}
function initPython(l) {
  const interactive = createPythonInteractive(l, addScene);
  scenes.set(document.querySelector('.python-monitor-wrap'), interactive);
  const showMonitor = (text, kind = 'result') => interactive.update(text, kind);
  let runContext = {};
  const run = document.querySelector("#run-code"),
    code = document.querySelector("#code"),
    output = { textContent: "" },
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
    if (el !== stdin) bindPythonEditor(el);
  });
  document.querySelector("#reset-code").addEventListener("click", () => {
    code.value = l.starter;
    stdin.value = l.inputs || "";
    document
      .querySelectorAll("[data-file]")
      .forEach((el) => (el.value = l.files[el.dataset.file]));
    save();
    output.textContent = "เริ่มโค้ดและข้อมูลตัวอย่างใหม่แล้ว";
    showMonitor('กดรันโค้ด แล้วดูผลบนจอนี้', 'idle');
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
    worker = new Worker("assets/python-worker.js?v=python-next-20261004");
    run.disabled = true;
    run.textContent = "กำลังเตรียม Python…";
    status.textContent = "ครั้งแรกอาจใช้เวลา 10–40 วินาที";
    worker.postMessage({ type: "init" });
    initTimer = setTimeout(() => {
      clearWorker();
      run.disabled = false;
      run.textContent = "ลองโหลด Python ใหม่";
      status.textContent = "โหลดไม่สำเร็จ ตรวจอินเทอร์เน็ตแล้วลองอีกครั้ง";
      showMonitor(status.textContent, 'error');
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
      interactive.record(data, runContext);
      if (data.type === "result") {
        output.textContent =
          data.output || "(โปรแกรมทำงานจบโดยไม่มีข้อความจาก print)";
        showMonitor(output.textContent);
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
        showMonitor(data.message, 'error');
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
      showMonitor(status.textContent, 'error');
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
      showMonitor(output.textContent, 'error');
      return;
    }
    run.disabled = true;
    run.textContent = "กำลังรัน…";
    status.textContent = "กำลังประมวลผลและตรวจภารกิจ";
    showMonitor('กำลังรันโค้ด…', 'running');
    runContext = {code:code.value, inputs:stdin.value, files:readFiles()};
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
      showMonitor(output.textContent, 'error');
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
  if (l.id === "gateway") return result.events;
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
  const gatewayEvidence = new Set();
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
      if (l.id === "gateway") {
        document.querySelector("#gateway-observation").textContent =
          "เปลี่ยนค่าแล้ว ผลเดิมไม่ใช่ผลของค่าปัจจุบัน กดทดลอง Ping เพื่ออ่านหลักฐานใหม่";
        document.querySelector("#gateway-command").textContent =
          `ipconfig\nIPv4 Address: 192.168.10.25\nSubnet Mask: 255.255.255.0\nDefault Gateway: ${readValues().gateway === "none" ? "(ไม่ได้ตั้ง)" : readValues().gateway}`;
      }
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
    if (l.id === "gateway") {
      gatewayEvidence.add(
        result.code === "local"
          ? "lan"
          : result.ok
            ? "remote-pass"
            : "remote-fail",
      );
      document.querySelector("#gateway-observation").textContent =
        result.code === "local"
          ? "หลักฐาน: LAN ตอบกลับ แม้ Gateway ไม่ถูกต้อง จึงไม่ควรเริ่มแก้ทุกอย่างพร้อมกัน ต่อไปทดสอบ Server ต่างเครือข่ายด้วย Gateway เดิม"
          : result.ok
            ? "หลักฐาน: เปลี่ยนเฉพาะ Gateway แล้ว Server ตอบกลับ สาเหตุในสถานการณ์นี้คือ Gateway เดิมไม่ถูกต้อง"
            : "หลักฐาน: ไปต่างเครือข่ายไม่ได้ อ่านจุดหยุดด้านบน แล้วตรวจว่าตั้ง Gateway เป็น Router บน LAN นี้หรือยัง";
      document.querySelector("#gateway-command").textContent =
        `ipconfig\nIPv4 Address: 192.168.10.25\nSubnet Mask: 255.255.255.0\nDefault Gateway: ${values.gateway === "none" ? "(ไม่ได้ตั้ง)" : values.gateway}\n\nping ${result.target}\n${result.ok ? `Reply from ${result.target} (ผลจำลอง)` : `ไม่สำเร็จ: ${result.lines.at(-1)}\nข้อความ Error จริงอาจต่างกันตาม OS และค่าระบบ`}`;
      document.querySelector("#gateway-checklist").textContent = [
        ["lan", "ทดสอบ LAN"],
        ["remote-fail", "พบปัญหาเมื่อไปต่างเครือข่าย"],
        ["remote-pass", "แก้ Gateway แล้ว Server ตอบ"],
      ]
        .map(([key, text]) => `${gatewayEvidence.has(key) ? "✓" : "○"} ${text}`)
        .join(" · ");
    }
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
      if (l.id === "gateway" && (gatewayEvidence.size < 3 || !success)) {
        feedback.className = "feedback bad";
        feedback.textContent =
          "ลองให้ครบ: LAN ตอบ → Server ไม่ตอบด้วย Gateway ผิด → แก้เป็น 192.168.10.1 แล้ว Server ตอบ จากนั้นตอบจากหลักฐานที่เห็น";
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
const aiTerms=[['AI','สาขาที่สร้างระบบรับรู้ เรียนรู้ และตัดสินใจ ไม่ใช่ทุกระบบต้องเป็น ML'],['ML / DL','ML เรียนจากข้อมูล ส่วน DL ใช้ Neural Network หลายชั้น'],['NLP / GenAI','NLP เป็นงานภาษา GenAI เป็นงานสร้างเนื้อหา ทั้งสองทับซ้อนกันได้'],['Training / Inference','Training เลือกหรือปรับพารามิเตอร์จากข้อมูล Inference ใช้พารามิเตอร์เดิมคำนวณคำตอบ'],['Feature / Label','Feature เป็นข้อมูลนำเข้า Label เป็นคำตอบกำกับตัวอย่าง'],['Threshold','เส้นแบ่งที่ใช้เลือกกลุ่มผลลัพธ์ ใน Lab ผ่านเมื่อคะแนน ≥ threshold'],['Token / Bigram','Token คือหน่วยข้อความ Bigram ใช้คู่ Token ติดกัน Lab นี้แบ่งด้วยช่องว่างและนับคู่ ไม่ใช่ LLM'],['LLM','โมเดลภาษาขนาดใหญ่ โมเดลจิ๋วในบท Token เป็นสะพานอธิบาย ไม่ใช่ LLM จริง']];
function openGlossary() {
  if(currentLesson?.track==='ai'){
    document.querySelector('#glossary h2').textContent='ศัพท์ AI';
    document.querySelector('#terms').innerHTML=aiTerms.map(([name,meaning])=>`<div class="term"><strong>${name}</strong><p>${meaning}</p></div>`).join('');
    document.querySelector('#glossary').showModal();return;
  }
  const python = currentLesson?.track === 'python';
  const programming=currentLesson?.track==='programming';
  const expanded=glossaryEntries.filter(e=>!currentLesson||e.track===currentLesson.track).map(e=>[e.name,e.meaning]);
  const selected = programming && !currentLesson.apiLab ? programmingTerms : expanded;
  document.querySelector('#glossary h2').textContent = programming ? 'ศัพท์ Programming' : python ? 'ศัพท์ Python' : currentLesson?.track === 'network' ? 'ศัพท์ Network' : 'ศัพท์เทคโนโลยี';
  const termRoot=document.querySelector('#terms');
  termRoot.innerHTML = `<label>ค้นหาคำศัพท์<input type="search" data-term-search placeholder="เช่น ACK, VLAN, Dictionary"></label><p data-term-count></p><div data-term-list></div>`;
  const search=termRoot.querySelector('[data-term-search]');
  const drawTerms=()=>{const filtered=searchGlossary(selected,search.value);termRoot.querySelector('[data-term-count]').textContent=`${filtered.length} คำ`;termRoot.querySelector('[data-term-list]').innerHTML=filtered.length?filtered.map(([name,desc])=>`<div class="term"><strong>${escapeHTML(name)}</strong><p>${escapeHTML(desc)}</p></div>`).join(''):'<p>ไม่พบคำนี้ ลองใช้ชื่อเต็มหรือคำใกล้เคียง</p>';};
  search.oninput=drawTerms;drawTerms();
  document.querySelector("#glossary").showModal();
}
const pythonTerms = [
  ['Identity / is', 'is ตรวจว่าเป็นออบเจ็กต์เดียวกัน ส่วน == ตรวจค่าเท่ากัน สอง List ที่มีค่าเหมือนกันไม่จำเป็นต้องเป็นก้อนเดียวกัน'],
  ['Reference / Alias', 'ชื่อที่อ้างถึงข้อมูล เช่น b = a ไม่ได้คัดลอก List เมื่อแก้ผ่าน b ชื่อ a จะเห็นรายการที่เปลี่ยนด้วย'],
  ['Shallow copy', 'สำเนาระดับตื้น เช่น List.copy() สร้าง List ใหม่ แต่สมาชิกที่เป็นข้อมูลซ้อนยังอาจอ้างถึงก้อนเดิม'],
  ['Membership / in', 'ตรวจสมาชิกของกลุ่มข้อมูล สำหรับ Dictionary ตรวจ key ถ้าต้องการตรวจ value ให้ใช้ .values()'],
  ['print()', 'ฟังก์ชันแสดงค่าทางผลลัพธ์ของโปรแกรม ไม่รวมเครื่องหมายคำพูดที่ใช้ครอบข้อความในโค้ด'],
  ['String / str', 'ข้อมูลข้อความ ครอบด้วยเครื่องหมายคำพูด เช่น "Hello"'],
  ['Variable', 'ชื่อตัวแปรที่อ้างถึงค่า กำหนดด้วย = เช่น name = "Ada"'],
  ['int / float / bool / None', 'จำนวนเต็ม จำนวนทศนิยม ค่าจริงหรือเท็จ และค่าที่ใช้แทนการไม่มีค่า'],
  ['input() / Conversion', 'input() รับข้อมูลเป็นข้อความ ใช้ int() หรือ float() แปลงเมื่อข้อมูลแปลงได้'],
  ['Indentation', 'การเยื้องบรรทัดเพื่อกำหนดกลุ่มคำสั่ง เช่น ภายใน if หรือ for'],
  ['if / elif / else', 'เลือกกลุ่มคำสั่งตามเงื่อนไขที่เป็นจริง'],
  ['for / while / range()', 'ทำคำสั่งซ้ำ โดยวนสมาชิกหรือวนขณะเงื่อนไขเป็นจริง range() สร้างลำดับจำนวนเต็มโดยไม่รวมค่าสิ้นสุด'],
  ['List / Tuple / Set / Dictionary', 'List เป็นลำดับแก้ไขได้ Tuple เปลี่ยนสมาชิกไม่ได้ Set เก็บค่าไม่ซ้ำ Dictionary จับคู่ key กับ value'],
  ['Index', 'ตำแหน่งในลำดับ เริ่มที่ 0 ค่าลบอ้างจากท้ายลำดับ'],
  ['Function / def / return', 'def สร้างฟังก์ชันที่เรียกใช้ได้ return ส่งค่ากลับ ต่างจาก print() ที่แสดงข้อความ'],
  ['Argument / Parameter', 'Parameter คือชื่อที่ฟังก์ชันประกาศรับ Argument คือค่าที่ส่งตอนเรียก'],
  ['Module / import', 'โมดูลรวมโค้ดที่นำกลับมาใช้ได้ import ใช้เข้าถึงโมดูล'],
  ['SyntaxError / Exception', 'SyntaxError คือรูปแบบโค้ดผิด Exception คือข้อผิดพลาดที่อาจเกิดขณะทำงาน ใช้ try / except จัดการได้'],
  ['Comment', 'ข้อความอธิบายหลัง # ไม่ถูกนำไปทำงานเป็นคำสั่ง'],
];
const programmingTerms=[
 ['Browser / Server','Browser ขอและแสดงหน้าเว็บ Server รับ Request และส่ง Response'],
 ['HTML / Element','ภาษาระบุโครงสร้างและความหมายของหน้าเว็บ เช่น h1 และรายการ ul/li'],
 ['CSS / Selector','กฎจัดรูปแบบ Selector เลือก Element ที่จะเปลี่ยน เช่น .task-card เลือก class'],
 ['Box Model','Content → Padding → Border → Margin; border-box รวม Padding และ Border ใน width แต่ไม่รวม Margin'],
 ['DOM','โครงสร้าง Element ที่ Browser สร้างจาก HTML JavaScript อ่านและแก้โครงสร้างนี้ได้'],
 ['Event / Listener','เหตุการณ์ เช่น click กับฟังก์ชันที่ลงทะเบียนให้ทำงานเมื่อเกิดเหตุการณ์'],
 ['const / let','const ห้ามกำหนดค่าใหม่ให้ชื่อเดิม let ยอมให้กำหนดใหม่ const ไม่ได้ทำให้ Object เปลี่ยนแปลงไม่ได้'],
 ['typeof / Boolean','typeof บอกชนิด เช่น string, number, boolean ค่าความจริง JavaScript ใช้ true และ false'],
 ['Console / console.log()','พื้นที่แสดงข้อมูลเพื่อสังเกตและแก้ปัญหา ไม่ได้เปลี่ยนข้อความในหน้าเว็บโดยอัตโนมัติ'],
 ['if / else if / else','เลือกบล็อกตามเงื่อนไข JavaScript ใช้เครื่องหมายปีกกา { } ครอบบล็อก'],
 ['Sandbox','พื้นที่ทดลองแยกจากเว็บหลัก ห้องทดลองนี้ไม่อนุญาตให้โค้ดเข้าถึงข้อมูลเว็บหลักหรือโหลดข้อมูลภายนอก'],
];
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
  let hash = location.hash.slice(1) || "explore";
  if(hash.startsWith('lesson/')){const canonical=canonicalLessonId(hash.slice(7));if(canonical!==hash.slice(7)){hash='lesson/'+canonical;history.replaceState(null,'',location.pathname+location.search+'#'+hash);}}
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
  else if (hash === "updates") renderUpdates(main);
  else renderExplore();
  document.title = currentLesson
    ? currentLesson.title + " · TechAtlas"
    : "TechAtlas · ห้องทดลองเทคโนโลยี";
  window.scrollTo(0, 0);
  badge();
}
window.addEventListener("hashchange", route);
initFeedback();
initUpdateFooter();
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
        "Open a lesson in Network, Python, Programming or AI without marking it complete.",
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
