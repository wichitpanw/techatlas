import {mountSpeed} from './animation-speed.js?v=speed-20261005';
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { laptop, appliance, rack, material } from "./scene.js?v=speed-20261005";

// The model depicts forwarding roles, not a packet capture or a live network.
export function mountScene(
  container,
  { variant = "network", preview = false } = {},
) {
  const playbackSpeed=mountSpeed(container,{hidden:preview});
  let clock=0,lastWall=null;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x0b1823);
  renderer.domElement.setAttribute(
    "aria-label",
    "แบบจำลองอุปกรณ์เครือข่ายสามมิติ",
  );
  container.append(renderer.domElement);
  const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  scene.add(new THREE.HemisphereLight(0xc7eaff, 0x223646, 2.4));
  const light = new THREE.DirectionalLight(0xffffff, 3.2);
  light.position.set(2, 12, 7);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.camera.left = -12;
  light.shadow.camera.right = 12;
  light.shadow.camera.top = 12;
  light.shadow.camera.bottom = -12;
  scene.add(light);
  const rim = new THREE.PointLight(0x54d8d0, 45, 22);
  rim.position.set(-5, 3, -4);
  scene.add(rim);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 22),
    material(0x142633, 0.2, 0.8),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.15;
  ground.receiveShadow = true;
  scene.add(ground);
  const grid = new THREE.GridHelper(24, 24, 0x335668, 0x203b49);
  grid.position.y = -0.14;
  scene.add(grid);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enabled = !preview;
  controls.minDistance = 8;
  controls.maxDistance = 55;
  controls.maxPolarAngle = Math.PI * 0.47;
  controls.enablePan = false;
  const standard = [
    ["Computer", "192.168.10.25/24", "client", -5, 1, "เริ่มการเชื่อมต่อ"],
    [
      "L2 Switch",
      "192.168.10.2 (Mgmt)",
      "switch",
      -1.8,
      0,
      "IP นี้ใช้บริหาร Switch ไม่ใช่เกณฑ์ส่ง frame",
    ],
    [
      "Gateway",
      "192.168.10.1/24",
      "router",
      1.6,
      0,
      "ส่งต่อ packet ระหว่าง subnet",
    ],
    ["Server", "10.0.0.10/24", "server", 5, -1, "ให้บริการปลายทาง"],
  ];
  const layouts = {
    gateway: [
      ...standard,
      [
        "PC ใน LAN",
        "192.168.10.50/24",
        "client",
        -1.8,
        3.8,
        "อยู่ subnet เดียวกับ Computer ไม่ต้องผ่าน Router",
      ],
    ],
    subnet: [
      [
        "Host A",
        "192.168.10.10/24",
        "client",
        -4,
        -2,
        "ดู subnet จาก IP และ prefix",
      ],
      [
        "Host B",
        "192.168.10.70/24",
        "client",
        4,
        -2,
        "ดู subnet จาก IP และ prefix",
      ],
      [
        "Host C",
        "192.168.10.130/24",
        "client",
        -4,
        2,
        "ดู subnet จาก IP และ prefix",
      ],
      [
        "Host D",
        "192.168.10.200/24",
        "client",
        4,
        2,
        "ดู subnet จาก IP และ prefix",
      ],
    ],
    dns: [
      [
        "Client",
        "192.168.10.25/24",
        "client",
        -4.6,
        1,
        "ส่ง DNS query และรับคำตอบ",
      ],
      [
        "DNS Resolver",
        "192.168.10.53",
        "server",
        0,
        -2,
        "Lab ย่อการค้น recursive/authoritative",
      ],
      [
        "Web Server",
        "203.0.113.80",
        "server",
        4.6,
        1,
        "เชื่อมต่อหลังได้ IP จาก DNS",
      ],
    ],
    vlan: [
      [
        "PC A · VLAN10",
        "192.168.10.10/24",
        "client",
        -5,
        2,
        "Access port VLAN10",
      ],
      [
        "SW1",
        "192.168.99.2 (Mgmt)",
        "switch",
        -2,
        -0.5,
        "Access + 802.1Q trunk",
      ],
      ["SW2", "192.168.99.3 (Mgmt)", "switch", 2, -0.5, "Trunk + access port"],
      [
        "PC B · VLAN20",
        "192.168.20.20/24",
        "client",
        5,
        2,
        "เปลี่ยน VLAN ของ PC B ได้",
      ],
      [
        "L3 Gateway",
        "192.168.10.1 / 192.168.20.1",
        "router",
        0,
        -4,
        "192.168.10.1 และ 192.168.20.1 /24",
      ],
    ],
    mpls: [
      ["CE A", "10.1.0.1", "router", -6, 1, "Router ฝั่งลูกค้า A"],
      ["Ingress PE", "192.0.2.1", "router", -3, -1, "Push label ตาม FEC"],
      [
        "Core P",
        "192.0.2.2",
        "router",
        0,
        1,
        "Lookup incoming label แล้ว Swap",
      ],
      ["Egress PE", "192.0.2.3", "router", 3, -1, "Pop label ในตัวอย่างนี้"],
      ["CE B", "10.2.0.20", "router", 6, 1, "รับ IP packet ฝั่งลูกค้า B"],
    ],
    layer2: [
      ["PC A", "192.168.10.10/24", "client", -4, 1, "MAC 02:00:00:00:00:01"],
      ["Switch", "192.168.10.2 (Mgmt)", "switch", 0, -1, "MAC table VLAN10"],
      ["PC B", "192.168.10.20/24", "client", 4, 1, "MAC 02:00:00:00:00:02"],
      [
        "PC C",
        "192.168.10.30/24",
        "client",
        0,
        3,
        "รับ flood แต่ทิ้ง frame ที่ MAC ไม่ตรง",
      ],
    ],
    routing: [
      ["Client", "192.168.10.25/24", "client", -5, 1, "ต้นทาง"],
      [
        "L2 Switch",
        "192.168.10.2 (Mgmt)",
        "switch",
        -1.8,
        0,
        "ส่ง frame ไป Router",
      ],
      ["R1", "192.168.10.1/24", "router", 1.6, 0, "เลือก longest prefix match"],
      [
        "Next hop",
        "R3 / R2 / ISP",
        "router",
        5,
        -1,
        "ขึ้นกับ route ที่เลือก ไม่ใช่ปลายทางสุดท้าย",
      ],
    ],
    internet: [
      [
        "Computer",
        "192.168.10.25/24",
        "client",
        -5,
        1,
        "IP / DNS / Default gateway",
      ],
      [
        "Home Router",
        "192.168.10.1 → 198.51.100.25",
        "router",
        -1.8,
        0,
        "NAT ขาออกตาม Lab",
      ],
      [
        "ISP Router",
        "198.51.100.1",
        "router",
        1.6,
        -1,
        "ย่อหลาย Router ใน Internet",
      ],
      ["Web Server", "203.0.113.80", "server", 5, 1, "TCP/443 · TLS · HTTPS"],
    ],
  };
  const data = layouts[variant] || standard;
  const overlay = document.createElement("div");
  overlay.className = "device-labels";
  overlay.hidden = preview;
  container.append(overlay);
  const nodes = data.map(([name, ip, type, x, z, role], i) => {
    const model =
      type === "client"
        ? laptop()
        : type === "server"
          ? rack()
          : appliance(type);
    if (type === "server") model.scale.setScalar(0.68);
    model.position.set(x, 0, z);
    scene.add(model);
    const halo = new THREE.Mesh(
      new THREE.RingGeometry(0.95, 1.07, 48),
      new THREE.MeshBasicMaterial({
        color: i === 3 && variant === "vlan" ? 0xf1bb58 : 0x7ce4c6,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide,
      }),
    );
    halo.rotation.x = -Math.PI / 2;
    halo.position.set(x, -0.1, z);
    scene.add(halo);
    const button = document.createElement("button");
    button.className = "device-label";
    const title = document.createElement("strong"),
      address = document.createElement("span");
    title.textContent = name;
    address.textContent = ip;
    button.append(title, address);
    overlay.append(button);
    const mac =
      type === "client" ? `02:00:00:00:00:0${i === 2 ? 2 : i + 1}` : "";
    button.addEventListener("click", () => {
      overlay
        .querySelectorAll("button")
        .forEach((b) => b.classList.toggle("selected", b === button));
      container.dispatchEvent(
        new CustomEvent("device-inspect", {
          detail: {
            name: title.textContent,
            ip: address.textContent,
            mac,
            role,
          },
        }),
      );
    });
    return {
      model,
      halo,
      button,
      title,
      address,
      point: new THREE.Vector3(x, type === "client" ? 1.65 : 1.9, z),
    };
  });
  const edges =
    variant === "gateway"
      ? [
          [0, 1],
          [1, 2],
          [2, 3],
          [1, 4],
        ]
      : variant === "subnet"
        ? []
        : variant === "dns"
          ? [
              [0, 1],
              [0, 2],
            ]
          : variant === "vlan"
            ? [
                [0, 1],
                [1, 2],
                [2, 3],
                [1, 4],
              ]
            : variant === "layer2"
              ? [
                  [0, 1],
                  [1, 2],
                  [1, 3],
                ]
              : data.slice(1).map((_, i) => [i, i + 1]);
  for (const [a, b] of edges) {
    const p = nodes[a].model.position
        .clone()
        .add(new THREE.Vector3(0, 0.13, 0)),
      q = nodes[b].model.position.clone().add(new THREE.Vector3(0, 0.13, 0));
    const curve = new THREE.QuadraticBezierCurve3(
      p,
      p
        .clone()
        .lerp(q, 0.5)
        .add(new THREE.Vector3(0, 0.35, 0)),
      q,
    );
    scene.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(curve, 24, 0.045, 8, false),
        material(
          variant === "vlan" && a === 1 && b === 2 ? 0xf1bb58 : 0x49869a,
          0.6,
          0.3,
        ),
      ),
    );
  }
  const pulse = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 20, 16),
    new THREE.MeshBasicMaterial({ color: 0x7ce4c6 }),
  );
  pulse.visible = false;
  scene.add(pulse);
  const floodPulse = pulse.clone();
  floodPulse.material = pulse.material.clone();
  floodPulse.visible = false;
  scene.add(floodPulse);
  const payload = document.createElement("div");
  payload.className = "packet-label";
  payload.hidden = true;
  overlay.append(payload);
  let active = null,
    dead = false,
    raf;
  const projected = new THREE.Vector3();
  const reset = () => {
    if (preview) camera.position.set(0, 6, 10);
    else if (container.clientWidth < 550) camera.position.set(0, 18, 35);
    else camera.position.set(0, 10, 17);
    controls.target.set(0, 0.4, 0);
    controls.update();
  };
  reset();
  const resize = new ResizeObserver(() => {
    const w = container.clientWidth,
      h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (!preview && w < 550) camera.position.set(0, 18, 35);
  });
  resize.observe(container);
  function position(element, point, offset = 0) {
    projected.copy(point).project(camera);
    const w = container.clientWidth,
      h = container.clientHeight;
    element.style.left =
      Math.max(75, Math.min(w - 75, (projected.x * 0.5 + 0.5) * w)) + "px";
    element.style.top = (projected.y * -0.5 + 0.5) * h + offset + "px";
    element.style.visibility = projected.z > 1 ? "hidden" : "visible";
  }
  function frame(wallNow) {
    if(lastWall!==null&&!document.hidden)clock+=Math.min(50,wallNow-lastWall)*playbackSpeed.get();lastWall=wallNow;const now=clock;
    if (dead) return;
    controls.update();
    if (active) {
      const { path, step, start, options } = active,
        t = Math.min(1, (now - start) / 1100),
        a = nodes[path[step]].model.position,
        b = nodes[path[step + 1]].model.position;
      pulse.position.copy(a).lerp(b, t);
      pulse.position.y = 0.8 + Math.sin(t * Math.PI) * 0.65;
      floodPulse.visible = Boolean(options.flood && step === 1 && nodes[3]);
      if (floodPulse.visible) {
        floodPulse.position.copy(a).lerp(nodes[3].model.position, t);
        floodPulse.position.y = pulse.position.y;
      }
      position(payload, pulse.position, -25);
      if (t >= 1) {
        nodes[path[step + 1]].halo.material.color.set(
          options.failure && step === path.length - 2 ? 0xf19872 : 0x7ce4c6,
        );
        active.step++;
        if (active.step >= path.length - 1) {
          options.onStep?.(active.step);
          const resolve = active.resolve;
          active = null;
          pulse.visible = false;
          floodPulse.visible = false;
          payload.hidden = true;
          resolve();
        } else {
          active.start = now;
          payload.textContent = options.labels?.[active.step] || "IP packet";
          options.onStep?.(active.step);
        }
      }
    }
    const placed = [];
    nodes.forEach((n) => {
      position(n.button, n.point, -16);
      const width = n.button.offsetWidth,
        height = n.button.offsetHeight,
        x = Math.max(
          width / 2 + 8,
          Math.min(
            container.clientWidth - width / 2 - 8,
            parseFloat(n.button.style.left),
          ),
        );
      n.button.style.left = x + "px";
      const preferred = parseFloat(n.button.style.top),
        min = container.clientWidth < 550 ? 150 : 30,
        max = container.clientHeight - 45;
      let y = preferred;
      const candidates = [
        preferred,
        ...Array.from(
          { length: 15 },
          (_, i) => preferred - (i + 1) * (height + 8),
        ),
        ...Array.from(
          { length: 15 },
          (_, i) => preferred + (i + 1) * (height + 8),
        ),
      ];
      for (const candidate of candidates) {
        if (candidate - height < min || candidate > max) continue;
        const hit = placed.some(
          (p) =>
            Math.abs(x - p.x) < (width + p.width) / 2 + 4 &&
            candidate > p.y - p.height - 6 &&
            candidate - height < p.y + 6,
        );
        if (!hit) {
          y = candidate;
          break;
        }
      }
      n.button.style.top = y + "px";
      placed.push({ x, y, width, height });
    });
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  return {
    speed:playbackSpeed.get,
    reset,
    setVlan(v) {
      const n = nodes[3];
      if (variant !== "vlan") return;
      n.title.textContent = `PC B · VLAN${v}`;
      n.address.textContent = `192.168.${v}.20/24`;
      n.halo.material.color.set(v === 10 ? 0x7ce4c6 : 0xf1bb58);
    },
    setSubnet(prefix) {
      const size = 2 ** (32 - prefix),
        colors = [0x7ce4c6, 0xf1bb58, 0x75bafa, 0xe79acc];
      nodes.forEach((n, i) => {
        const ip = [10, 70, 130, 200][i],
          group = Math.floor(ip / size);
        n.address.textContent = `192.168.10.${ip}/${prefix}`;
        n.title.textContent = `Host ${"ABCD"[i]} · NET .${group * size}`;
        n.halo.material.color.set(colors[group]);
      });
    },
    sendPath(path, options = {}) {
      if (active) active.resolve();
      if (dead || path.length < 2) return Promise.resolve();
      return new Promise((resolve) => {
        active = { path, step: 0, start: clock, options, resolve };
        pulse.visible = true;
        payload.hidden = false;
        payload.textContent = options.labels?.[0] || "IP packet";
        options.onStep?.(0);
      });
    },
    dispose() {
      dead = true;playbackSpeed.dispose();
      active?.resolve();
      cancelAnimationFrame(raf);
      resize.disconnect();
      controls.dispose();
      scene.traverse((o) => {
        o.geometry?.dispose();
        for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
          if (m) {
            m.map?.dispose();
            m.dispose();
          }
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
      overlay.remove();
    },
  };
}
