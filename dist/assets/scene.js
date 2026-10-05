import {mountSpeed} from './animation-speed.js?v=speed-20261005';
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const C = { mint: 0x7ce4c6, blue: 0x75bafa, gold: 0xf1bb58 };
const material = (color, metalness = 0.55, roughness = 0.35) =>
  new THREE.MeshStandardMaterial({ color, metalness, roughness });
function box(group, x, y, z, w, h, d, mat) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}
export { laptop, appliance, rack, material, box, label };
function label(text, color = "#b6d9df", size = 1) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 96;
  const ctx = canvas.getContext("2d");
  ctx.font = "500 34px monospace";
  ctx.textAlign = "center";
  ctx.fillStyle = color;
  ctx.fillText(text, 256, 60);
  const tex = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
    }),
  );
  sprite.scale.set(2.5 * size, 0.47 * size, 1);
  return sprite;
}
function screenTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#091c26";
  ctx.fillRect(0, 0, 512, 320);
  ctx.fillStyle = "#68ddc0";
  ctx.font = "21px monospace";
  ctx.fillText("NETWORK OPERATIONS", 25, 42);
  ctx.fillStyle = "#3d5a65";
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(25, 80 + i * 40, 450, 1);
    ctx.fillStyle = i === 3 ? "#efa25f" : "#68ddc0";
    ctx.fillRect(25, 92 + i * 40, 8, 8);
    ctx.fillStyle = "#96b8c3";
    ctx.font = "16px monospace";
    ctx.fillText(
      [
        "SW-01   192.168.10.2",
        "RT-01   192.168.10.1",
        "SRV-01  10.0.0.10",
        "AP-02   OFFLINE",
        "LINK    1 Gbps",
      ][i],
      47,
      101 + i * 40,
    );
    ctx.fillStyle = "#3d5a65";
  }
  return new THREE.CanvasTexture(canvas);
}
function laptop() {
  const g = new THREE.Group();
  const alu = material(0x8996a1, 0.85, 0.23);
  box(g, 0, 0.13, 0, 1.75, 0.11, 1.1, alu);
  box(g, 0, 0.195, -0.05, 1.43, 0.018, 0.55, material(0x263442));
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 12; c++)
      box(
        g,
        -0.65 + c * 0.117,
        0.213,
        -0.27 + r * 0.105,
        0.087,
        0.016,
        0.067,
        material(0x14232c),
      );
  box(g, 0, 0.205, 0.35, 0.52, 0.015, 0.23, material(0x687b89));
  const lid = new THREE.Group();
  lid.position.set(0, 0.23, -0.47);
  lid.rotation.x = -0.12;
  box(lid, 0, 0.61, 0, 1.77, 1.23, 0.09, alu);
  box(
    lid,
    0,
    0.62,
    0.052,
    1.58,
    1.03,
    0.015,
    new THREE.MeshStandardMaterial({
      map: screenTexture(),
      emissive: 0x244f5b,
      emissiveIntensity: 0.5,
      roughness: 0.3,
    }),
  );
  g.add(lid);
  return g;
}
function appliance(type = "switch") {
  const g = new THREE.Group();
  const chassis = material(type === "router" ? 0xb7c0c6 : 0x626f7c, 0.8, 0.3);
  box(g, 0, 0.35, 0, 2.05, 0.5, 0.95, chassis);
  box(g, 0, 0.35, 0.489, 1.94, 0.38, 0.018, material(0x142431, 0.4, 0.45));
  box(g, 0, 0.612, 0, 1.95, 0.026, 0.89, material(0x7c8a93, 0.75, 0.25));
  for (let c = 0; c < 8; c++) {
    box(g, -0.7 + c * 0.19, 0.35, 0.515, 0.14, 0.14, 0.055, material(0x070d14));
    box(
      g,
      -0.7 + c * 0.19,
      0.408,
      0.548,
      0.018,
      0.016,
      0.01,
      new THREE.MeshBasicMaterial({ color: c === 5 ? C.gold : C.mint }),
    );
  }
  for (let i = 0; i < 12; i++)
    box(g, -0.85 + i * 0.15, 0.63, -0.1, 0.085, 0.01, 0.32, material(0x283a47));
  box(
    g,
    0.88,
    0.35,
    0.515,
    0.035,
    0.08,
    0.02,
    new THREE.MeshBasicMaterial({ color: C.blue }),
  );
  if (type === "router") {
    for (const x of [-0.88, 0.88]) {
      const ant = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.035, 0.8, 12),
        material(0x243440),
      );
      ant.position.set(x, 1.0, -0.35);
      ant.rotation.z = x < 0 ? 0.16 : -0.16;
      g.add(ant);
    }
  }
  return g;
}
function rack() {
  const g = new THREE.Group();
  const frame = material(0x263848, 0.8, 0.27);
  box(g, 0, 1.36, 0, 1.3, 2.65, 1.05, frame);
  box(g, 0, 1.37, 0.544, 1.11, 2.45, 0.038, material(0x0c1924));
  for (let r = 0; r < 7; r++) {
    box(
      g,
      0,
      0.38 + r * 0.31,
      0.576,
      0.98,
      0.25,
      0.07,
      material(0x53616e, 0.72, 0.3),
    );
    for (let c = 0; c < 7; c++)
      box(
        g,
        -0.41 + c * 0.085,
        0.4 + r * 0.31,
        0.62,
        0.018,
        0.12,
        0.012,
        material(0x111d29),
      );
    box(
      g,
      0.29,
      0.4 + r * 0.31,
      0.623,
      0.028,
      0.028,
      0.012,
      new THREE.MeshBasicMaterial({ color: r === 4 ? C.gold : C.mint }),
    );
    box(
      g,
      0.39,
      0.4 + r * 0.31,
      0.623,
      0.02,
      0.02,
      0.012,
      new THREE.MeshBasicMaterial({ color: C.blue }),
    );
  }
  for (const x of [-0.56, 0.56]) box(g, x, 1.38, 0.59, 0.05, 2.4, 0.05, frame);
  box(g, 0, 2.72, 0, 1.32, 0.07, 1.08, frame);
  return g;
}
function pedestal(scene, x, z, w = 2.5) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(w / 2, w / 2 + 0.08, 0.12, 6),
    material(0x253c49, 0.5, 0.55),
  );
  mesh.position.set(x, -0.02, z);
  mesh.receiveShadow = true;
  scene.add(mesh);
}
export function mountScene(
  container,
  { variant = "network", interactive = false, hero = false } = {},
) {
  const playbackSpeed=mountSpeed(container,{hidden:!interactive});
  let clock=0,lastWall=null;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  container.appendChild(renderer.domElement);
  renderer.domElement.setAttribute(
    "aria-label",
    "แบบจำลองอุปกรณ์เครือข่าย 3 มิติ",
  );
  renderer.domElement.setAttribute("role", "img");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(5.8, 5.6, 8);
  const target = new THREE.Vector3(0, 0.35, 0);
  camera.lookAt(target);
  scene.add(new THREE.HemisphereLight(0xbedcf3, 0x173346, 2));
  const light = new THREE.DirectionalLight(0xfff4db, 3.2);
  light.position.set(-3, 8, 5);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.camera.left = -9;
  light.shadow.camera.right = 9;
  light.shadow.camera.top = 8;
  light.shadow.camera.bottom = -8;
  scene.add(light);
  const rim = new THREE.PointLight(0x5dc9bc, 25, 15);
  rim.position.set(4, 3, -4);
  scene.add(rim);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.ShadowMaterial({ opacity: 0.25 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.11;
  ground.receiveShadow = true;
  scene.add(ground);
  const grid = new THREE.GridHelper(24, 32, 0x375466, 0x203743);
  grid.position.y = -0.12;
  grid.material.transparent = true;
  grid.material.opacity = 0.3;
  scene.add(grid);
  const group = new THREE.Group();
  scene.add(group);
  let positions = [];
  let names = [];
  const subnetGroups = [];
  if (variant === "rack") {
    const s = rack();
    s.scale.setScalar(1.15);
    group.add(s);
    const r = appliance("router");
    r.position.set(2.3, 0, 0.3);
    group.add(r);
    camera.position.set(5, 3.8, 6);
    target.set(0.5, 1, 0);
  } else if (variant === "python") {
    const l = laptop();
    l.scale.setScalar(1.65);
    group.add(l);
    const r = rack();
    r.scale.setScalar(0.65);
    r.position.set(2.3, 0, -0.4);
    group.add(r);
    camera.position.set(5, 3.6, 6);
    target.set(0.4, 0.6, 0);
  } else if (variant === "subnet") {
    for (let i = 0; i < 4; i++) {
      const subgroup = new THREE.Group();
      subgroup.position.set(
        (i % 2) * 2.8 - 1.4,
        0,
        Math.floor(i / 2) * 2.5 - 1.25,
      );
      const s = appliance();
      s.scale.setScalar(0.65);
      subgroup.add(s);
      const l = label(`192.168.10.${i * 64}/26`, "#9dd4c8", 0.65);
      l.position.set(0, 0.2, 1);
      subgroup.add(l);
      group.add(subgroup);
      subnetGroups.push({ subgroup, caption: l });
    }
    camera.position.set(6, 7, 8);
  } else {
    positions = [
      new THREE.Vector3(-3.5, 0, 1),
      new THREE.Vector3(-1.15, 0, -0.5),
      new THREE.Vector3(1.35, 0, 0.7),
      new THREE.Vector3(3.8, 0, -0.9),
    ];
    names = ["CLIENT", "SWITCH", "GATEWAY", "SERVER"];
    const models = [laptop(), appliance(), appliance("router"), rack()];
    models.forEach((m, i) => {
      m.position.copy(positions[i]);
      if (i === 3) m.scale.setScalar(0.72);
      group.add(m);
      pedestal(scene, m.position.x, m.position.z, i === 3 ? 2 : 2.25);
      const l = label(names[i], i === 2 ? "#efc16b" : "#a9ccc9", 0.64);
      l.position.set(m.position.x, 0.03, m.position.z + 1.15);
      group.add(l);
    });
    for (let i = 0; i < 3; i++) {
      const a = positions[i].clone().add(new THREE.Vector3(0, 0.19, 0));
      const b = positions[i + 1].clone().add(new THREE.Vector3(0, 0.19, 0));
      const mid = a.clone().lerp(b, 0.5);
      mid.y = 0.45;
      const curve = new THREE.CatmullRomCurve3([a, mid, b]);
      const cable = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 30, 0.029, 8, false),
        material(i === 2 ? 0x779eab : 0x468877, 0.55, 0.3),
      );
      group.add(cable);
    }
  }
  const packet = new THREE.Mesh(
    new THREE.SphereGeometry(0.105, 16, 16),
    new THREE.MeshBasicMaterial({ color: C.mint }),
  );
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(0.19, 16, 16),
    new THREE.MeshBasicMaterial({
      color: C.mint,
      transparent: true,
      opacity: 0.16,
    }),
  );
  packet.add(halo);
  packet.visible = false;
  group.add(packet);
  const packetLight = new THREE.PointLight(C.mint, 2, 2);
  packet.add(packetLight);
  let controls;
  if (interactive) {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(target);
    controls.enableDamping = true;
    controls.minDistance = 5;
    controls.maxDistance = 22;
    controls.maxPolarAngle = Math.PI / 2 - 0.08;
    controls.enablePan = false;
  } else camera.lookAt(target);
  let animation = null;
  let alive = true;
  let last = 0;
  let visible = true;
  let raf;
  const observer = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
  });
  observer.observe(container);
  const resize = new ResizeObserver(() => {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });
  resize.observe(container);
  function frame(wallNow) {
    if(lastWall!==null&&!document.hidden)clock+=Math.min(50,wallNow-lastWall)*playbackSpeed.get();lastWall=wallNow;const t=clock;
    if (!alive) return;
    raf = requestAnimationFrame(frame);
    if (!visible && !animation) return;
    if (wallNow - last < 33) return;
    last = wallNow;
    if (controls) controls.update();
    if (!interactive && !hero) group.rotation.y = Math.sin(t * 0.00018) * 0.17;
    if (animation) {
      const elapsed = (t - animation.start) / 1000;
      const segment = Math.floor(elapsed / 0.75);
      const ratio = (elapsed % 0.75) / 0.75;
      if (segment >= animation.hops) {
        packet.visible = false;
        const cb = animation.resolve;
        animation = null;
        cb();
      } else {
        packet.visible = true;
        packet.position
          .copy(positions[segment])
          .lerp(positions[segment + 1], ratio);
        packet.position.y = 0.42 + Math.sin(ratio * Math.PI) * 0.24;
      }
    } else if (hero && positions.length) {
      const cycle = (t * 0.00032) % 3;
      const seg = Math.floor(cycle);
      packet.visible = true;
      packet.position
        .copy(positions[seg])
        .lerp(positions[seg + 1], cycle - seg);
      packet.position.y = 0.45;
    }
    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(frame);
  return {
    speed:playbackSpeed.get,
    send(hops = 3, failure = false) {
      if (animation) return Promise.resolve();
      packet.material.color.set(failure ? 0xf69d72 : C.mint);
      halo.material.color.copy(packet.material.color);
      return new Promise((resolve) => {
        animation = { start: clock, hops, resolve };
      });
    },
    setSubnet(prefix) {
      const size = 2 ** (32 - prefix);
      const count = 256 / size;
      subnetGroups.forEach(({ subgroup, caption }, i) => {
        subgroup.visible = i < count;
        if (i >= count) return;
        subgroup.remove(caption);
        caption.material.map.dispose();
        caption.material.dispose();
        const next = label(`192.168.10.${i * size}/${prefix}`, "#9dd4c8", 0.65);
        next.position.copy(caption.position);
        subgroup.add(next);
        subnetGroups[i].caption = next;
      });
    },
    reset() {
      camera.position.set(7.5, 7.4, 10.2);
      if (controls) {
        controls.target.copy(target);
        controls.update();
      } else camera.lookAt(target);
    },
    dispose() {
      alive = false;playbackSpeed.dispose();
      cancelAnimationFrame(raf);
      observer.disconnect();
      resize.disconnect();
      if (animation) animation.resolve();
      controls?.dispose();
      scene.traverse((o) => {
        o.geometry?.dispose();
        if (o.material) {
          for (const m of Array.isArray(o.material)
            ? o.material
            : [o.material]) {
            m.map?.dispose();
            m.dispose();
          }
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
