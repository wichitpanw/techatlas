import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { appliance, laptop, material, box } from "./scene.js";

// Functional 3D teaching models: hardware, bits, protocol layers and link state.
export function mountScene(container, { variant, preview = false } = {}) {
  container.dataset.variant = variant;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(0x0b1823);
  container.append(renderer.domElement);
  renderer.domElement.setAttribute("aria-label", `3D Interactive · ${variant}`);
  const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100),
    controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enabled = !preview;
  controls.enablePan = false;
  controls.minDistance = 7;
  controls.maxDistance = 45;
  controls.maxPolarAngle = Math.PI * 0.48;
  scene.add(new THREE.HemisphereLight(0xe2f6ff, 0x243849, 2.5));
  const light = new THREE.DirectionalLight(0xffffff, 3.2);
  light.position.set(3, 10, 8);
  scene.add(light);
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(26, 20),
    material(0x172d3a, 0.25, 0.75),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.15;
  scene.add(floor);
  const grid = new THREE.GridHelper(22, 22, 0x41687c, 0x294551);
  grid.position.y = -0.14;
  scene.add(grid);
  const layer = document.createElement("div");
  layer.className = "foundation-labels";
  layer.hidden = preview;
  container.append(layer);
  const objects = [],
    colors = [
      0x7ce4c6, 0x75bafa, 0xf1bb58, 0xe79acc, 0x8cb9ff, 0x64d2d2, 0xa7cf87,
    ];
  const add = (mesh, name, detail, x, y, z, index) => {
    mesh.position.set(x, y, z);
    scene.add(mesh);
    const button = document.createElement("button"),
      strong = document.createElement("strong"),
      small = document.createElement("span");
    button.className = "foundation-label";
    strong.textContent = name;
    small.textContent = detail;
    button.append(strong, small);
    layer.append(button);
    button.addEventListener("click", () => pick(index));
    objects.push({
      mesh,
      button,
      strong,
      small,
      index,
      anchor: new THREE.Vector3(x, y + 0.65, z),
    });
    return mesh;
  };
  const slab = (w, h, d, color) =>
    new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material(color, 0.65, 0.3));
  const pick = (index) => {
    const root = container.closest(".workarea");
    if (variant === "number-systems")
      root.querySelector(`[data-weight="${2 ** (7 - index)}"]`)?.click();
    else if (variant === "osi-model") {
      const state = index < 3 ? 0 : index === 3 ? 1 : index === 4 ? 2 : 3;
      root.querySelector(`button[data-state="${state}"]`)?.click();
    } else if (variant === "computer-os") {
      const descriptions = [
        "CPU ประมวลผลคำสั่งของโปรแกรม",
        "RAM เก็บข้อมูลของโปรแกรมที่กำลังทำงาน",
        "NIC และ OS network stack ช่วยเชื่อมเครือข่าย",
        "Command line ใช้เรียกโปรแกรมและเครื่องมือตรวจสอบ",
      ];
      showInfo(
        ["CPU", "RAM", "NIC", "OS / Command line"][index],
        descriptions[index],
      );
    } else root.querySelector(`button[data-state="${index}"]`)?.click();
  };
  function showInfo(title, detail) {
    const status = container.querySelector(".foundation-status");
    if (!status) return;
    status.replaceChildren();
    const strong = document.createElement("strong"),
      span = document.createElement("span");
    strong.textContent = title;
    span.textContent = detail;
    status.append(strong, span);
  }
  if (variant === "number-systems") {
    for (let i = 0; i < 8; i++) {
      const x = ((i % 4) - 1.5) * 2.3,
        z = i < 4 ? -1.8 : 1.8;
      add(
        slab(1.65, 0.45, 1.15, 0x354f61),
        `${2 ** (7 - i)}`,
        "0",
        x,
        0.1,
        z,
        i,
      );
    }
  } else if (variant === "osi-model") {
    const names = [
      "L7 Application",
      "L6 Presentation",
      "L5 Session",
      "L4 Transport",
      "L3 Network",
      "L2 Data Link",
      "L1 Physical",
    ];
    names.forEach((name, i) => {
      add(
        slab(4, 0.2, 1.7, colors[i]),
        name,
        i < 3
          ? "TCP/IP Application"
          : i === 3
            ? "TCP/IP Transport"
            : i === 4
              ? "TCP/IP Internet"
              : "TCP/IP Link",
        -2,
        (6 - i) * 0.55 + 0.2,
        0,
        i,
      );
    });
  } else if (variant === "encapsulation") {
    [
      "HTTP Data / TLS",
      "TCP header",
      "IP header",
      "Ethernet header + FCS",
    ].forEach((name, i) => {
      const m = slab(2.8 + i * 1.15, 0.32, 1.8 + i * 0.35, colors[i]);
      add(
        m,
        name,
        [
          "ข้อมูล Application",
          "Port 51514 → 443",
          "Destination 203.0.113.80 · TTL 64",
          "MAC Client → Gateway",
        ][i],
        0,
        0.3 + i * 0.72,
        0,
        i,
      );
    });
  } else if (variant === "computer-os") {
    const board = slab(9, 0.14, 5.7, 0x254e43);
    board.position.y = 0;
    scene.add(board);
    const cpu = new THREE.Group();
    box(cpu, 0, 0.2, 0, 1.6, 0.25, 1.6, material(0xb5c2cb));
    for (let i = 0; i < 10; i++)
      box(cpu, -0.73 + i * 0.16, 0.4, 0, 0.07, 0.2, 1.4, material(0x627685));
    add(cpu, "CPU", "ประมวลผลคำสั่ง", -2.6, 0.1, -1, 0);
    const ram = new THREE.Group();
    box(ram, 0, 0.35, 0, 2.6, 0.6, 0.14, material(0x32735b));
    for (let i = 0; i < 6; i++)
      box(ram, -1 + i * 0.4, 0.35, 0.1, 0.28, 0.35, 0.08, material(0x1a2835));
    add(ram, "RAM", "ข้อมูลระหว่างโปรแกรมทำงาน", 1.8, 0.1, -1.4, 1);
    const nic = new THREE.Group();
    box(nic, 0, 0.1, 0, 2, 0.12, 1.5, material(0x316759));
    box(nic, 0.6, 0.35, 0.45, 0.6, 0.5, 0.5, material(0x9ba9b4));
    add(nic, "NIC", "192.168.10.25/24", -2.1, 0.1, 1.7, 2);
    const computer = laptop();
    computer.scale.setScalar(1.2);
    add(
      computer,
      "OS / Command line",
      "เครื่องมือทำงานผ่าน OS",
      2.5,
      0.1,
      1.4,
      3,
    );
  } else if (variant === "devices") {
    const types = ["Switch", "Router", "Firewall", "Access Point"];
    types.forEach((name, i) => {
      const model = appliance(i === 1 || i === 3 ? "router" : "switch");
      if (i === 2) {
        box(model, 0, 1, 0, 1.4, 0.65, 0.2, material(0xc18a53));
      }
      add(
        model,
        name,
        ["MAC / VLAN", "IP / Route", "Policy / State", "802.11 ↔ Ethernet"][i],
        (i % 2 ? 1 : -1) * 3,
        0.1,
        i < 2 ? -1.9 : 1.9,
        i,
      );
    });
    const hub = appliance();
    hub.scale.setScalar(0.7);
    add(hub, "Hub · L1", "ทำซ้ำสัญญาณ ไม่มี MAC table", 0, 0.1, 0, 4);
  } else if (variant === "physical") {
    add(laptop(), "Computer", "192.168.10.25/24", -3, 0.1, 0, 0);
    add(appliance(), "Switch", "Port 1 · Link status", 3, 0.1, 0, 0);
  }
  const cableGroups = new THREE.Group();
  scene.add(cableGroups);
  const opticalAdapters = [];
  if (variant === "physical") {
    for (const x of [-2.4, 2.2]) {
      const adapter = new THREE.Group();
      box(adapter, 0, 0, 0, 0.5, 0.3, 0.6, material(0xa7bac8));
      box(adapter, 0, 0, 0.32, 0.3, 0.2, 0.08, material(0x75bafa));
      adapter.position.set(x, 0.3, 0.3);
      scene.add(adapter);
      opticalAdapters.push(adapter);
    }
  }
  if (variant === "physical")
    for (let i = 0; i < 2; i++) {
      const a = new THREE.Vector3(i === 0 ? -2.4 : 0.1, 0.3, 0.3),
        b = new THREE.Vector3(i === 0 ? -0.1 : 2.2, 0.3, 0.3);
      const curve = new THREE.QuadraticBezierCurve3(
        a,
        a
          .clone()
          .lerp(b, 0.5)
          .add(new THREE.Vector3(0, 0.5, 0.7)),
        b,
      );
      cableGroups.add(
        new THREE.Mesh(
          new THREE.TubeGeometry(curve, 30, 0.08, 12, false),
          material(0x7ce4c6, 0.4, 0.25),
        ),
      );
    }
  const signal = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0x7ce4c6 }),
  );
  signal.visible = variant === "physical";
  scene.add(signal);
  let active = Number(container.dataset.state || 0),
    value = Number(container.dataset.value || 192),
    dead = false,
    raf;
  const update = () => {
    const state = container._foundationState;
    if (state) showInfo(state.headline, state.detail);
    if (variant === "number-systems") {
      objects.forEach((o, i) => {
        const on = Boolean(value & (2 ** (7 - i)));
        o.mesh.material.color.set(on ? 0x7ce4c6 : 0x354f61);
        o.mesh.scale.y = on ? 2.6 : 1;
        o.small.textContent = `${on ? 1 : 0} · น้ำหนัก ${2 ** (7 - i)}`;
        o.button.classList.toggle("active", on);
      });
      showInfo(
        `${value.toString(2).padStart(8, "0")} = ${value} = 0x${value.toString(16).toUpperCase().padStart(2, "0")}`,
        "กดบล็อกหรือป้ายเพื่อเปิด/ปิดบิต · ความสูงและสีแสดงค่า 1/0 ไม่ใช่แรงดันจริง",
      );
    }
    if (variant === "osi-model")
      objects.forEach((o, i) => {
        const on =
          active === 0
            ? i < 3
            : active === 1
              ? i === 3
              : active === 2
                ? i === 4
                : i > 4;
        o.mesh.material.color.set(on ? colors[i] : 0x536d80);
        o.mesh.scale.x = on ? 1.12 : 1;
        o.button.classList.toggle("active", on);
      });
    if (variant === "encapsulation") {
      objects[0].strong.textContent =
        active === 0 || active === 5 ? "HTTP Data" : "TLS records";
      const count = active < 4 ? active + 1 : active === 4 ? 4 : 1;
      objects.forEach((o, i) => {
        o.mesh.visible = i < count;
        o.button.hidden = i >= count;
        o.mesh.position.y = 0.3 + i * 0.72;
        o.small.textContent =
          i === 2
            ? active === 4
              ? "Destination 203.0.113.80 · TTL 63"
              : "Destination 203.0.113.80 · TTL 64"
            : i === 3
              ? active === 4
                ? "MAC Router → Next hop"
                : "MAC Client → Gateway"
              : i === 1
                ? "Port 51514 → 443"
                : active === 0
                  ? "ก่อนเข้ารหัส TLS"
                  : active === 5
                    ? "หลังถอด Header และถอดรหัส TLS ที่ปลายทาง"
                    : "ข้อมูล Application ที่เข้ารหัสแล้ว";
      });
    }
    if (variant === "devices")
      objects.forEach((o, i) => {
        o.mesh.scale.setScalar(i === active ? 1.2 : i === 4 ? 0.7 : 1);
        o.button.classList.toggle("active", i === active);
      });
    if (variant === "physical") {
      const fiber = container.querySelector("#cable-type")?.value === "fiber";
      opticalAdapters.forEach((adapter) => {
        adapter.visible = fiber;
      });
      cableGroups.children.forEach((m) => {
        m.material.color.set(
          active === 0
            ? fiber
              ? 0x75bafa
              : 0x7ce4c6
            : active === 1
              ? 0xf19872
              : 0xf1bb58,
        );
        m.visible = active !== 1;
      });
      signal.visible = active !== 1;
      objects[0].small.textContent = fiber
        ? "Fiber · สัญญาณแสง · สมมติ NIC รองรับ Optical"
        : "UTP · สัญญาณไฟฟ้า";
      objects[1].small.textContent =
        active === 0
          ? "UP · 1 Gbps Full · CRC 0"
          : active === 1
            ? "DOWN · ไม่มีสัญญาณ"
            : "UP · CRC เพิ่ม";
      signal.material.color.set(
        active === 2 ? 0xf1bb58 : fiber ? 0x75bafa : 0x7ce4c6,
      );
    }
  };
  const handleState = (e) => {
    active = e.detail.index;
    container._foundationState = e.detail.state;
    if (variant === "number-systems") value = active === 0 ? 192 : 252;
    update();
  };
  const handleBits = (e) => {
    value = e.detail;
    update();
  };
  container.addEventListener("foundation-state", handleState);
  container.addEventListener("foundation-bits", handleBits);
  container.querySelector("#cable-type")?.addEventListener("change", update);
  container.querySelector("[data-reset-3d]")?.addEventListener("click", reset);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let press;
  const pointerDown = (event) => {
    press = { x: event.clientX, y: event.clientY };
  };
  const pointerUp = (event) => {
    if (
      !press ||
      Math.hypot(event.clientX - press.x, event.clientY - press.y) > 5
    )
      return;
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      (-(event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(
      objects.filter((o) => o.mesh.visible).map((o) => o.mesh),
      true,
    )[0];
    if (hit) {
      const owner = objects.find((o) => {
        let node = hit.object;
        while (node) {
          if (node === o.mesh) return true;
          node = node.parent;
        }
        return false;
      });
      if (owner) pick(owner.index);
    }
    press = undefined;
  };
  renderer.domElement.addEventListener("pointerdown", pointerDown);
  renderer.domElement.addEventListener("pointerup", pointerUp);
  function reset() {
    const mobile = !preview && container.clientWidth < 550;
    controls.target.set(
      0,
      variant === "osi-model" || variant === "encapsulation" ? 1.4 : 0,
      0,
    );
    camera.position.set(0, 9, mobile ? 25 : 16);
    if (preview) {
      controls.target.x = variant === "osi-model" ? -2 : 0;
      camera.position.set(controls.target.x + 2, variant === "osi-model" ? 3.7 : 5, 9);
    }
    if (variant === "number-systems") {
      objects.forEach((o, i) => {
        o.mesh.position.x = mobile
          ? i % 2
            ? 2.3
            : -2.3
          : ((i % 4) - 1.5) * 2.3;
        o.mesh.position.z = mobile
          ? (Math.floor(i / 2) - 1.5) * 3
          : i < 4
            ? -1.8
            : 1.8;
      });
      if (mobile) camera.position.set(0, 18, 19);
    }
    controls.update();
  }
  reset();
  const observer = new ResizeObserver(() => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    reset();
  });
  observer.observe(container);
  const point = new THREE.Vector3();
  function frame(now) {
    if (dead) return;
    controls.update();
    if (variant === "physical" && signal.visible) {
      signal.position.set(-2.4 + ((now % 1800) / 1800) * 4.6, 0.6, 0.5);
    }
    const placed = [];
    objects.forEach((o) => {
      if (o.button.hidden) return;
      point
        .copy(o.mesh.position)
        .add(new THREE.Vector3(0, 0.9, 0))
        .project(camera);
      const w = container.clientWidth,
        h = container.clientHeight,
        bw = o.button.offsetWidth,
        bh = o.button.offsetHeight;
      let x = Math.max(
          bw / 2 + 6,
          Math.min(w - bw / 2 - 6, (point.x * 0.5 + 0.5) * w),
        ),
        y = (point.y * -0.5 + 0.5) * h;
      if (variant === "osi-model") {
        x = w * 0.73;
        y = 170 + o.index * 64;
      }
      if (variant === "number-systems" && w < 550) {
        x = w * (o.index % 2 ? 0.75 : 0.25);
        y = 170 + Math.floor(o.index / 2) * 68;
      }
      for (let tries = 0; tries < 12; tries++) {
        if (
          variant === "osi-model" ||
          (variant === "number-systems" && w < 550)
        )
          break;
        const hit = placed.find(
          (p) =>
            Math.abs(x - p.x) < (bw + p.bw) / 2 + 6 &&
            y > p.y - p.bh - 6 &&
            y - bh < p.y + 6,
        );
        if (!hit) break;
        y = hit.y - hit.bh - 8;
      }
      o.button.style.left = x + "px";
      o.button.style.top = Math.max(bh + 100, y) + "px";
      placed.push({ x, y: Math.max(bh + 100, y), bw, bh });
    });
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  update();
  raf = requestAnimationFrame(frame);
  return {
    dispose() {
      dead = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener("pointerdown", pointerDown);
      renderer.domElement.removeEventListener("pointerup", pointerUp);
      container.removeEventListener("foundation-state", handleState);
      container.removeEventListener("foundation-bits", handleBits);
      scene.traverse((o) => {
        o.geometry?.dispose();
        for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
          m?.map?.dispose();
          m?.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
      layer.remove();
    },
  };
}
