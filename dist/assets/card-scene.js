import * as THREE from "three";
import { laptop, appliance, rack, material, box, label } from "./scene.js";

// Card previews use the lesson identity and its own data, never a generic fallback topology.
export function mountScene(container, { lesson } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.25));
  container.append(renderer.domElement);
  renderer.domElement.setAttribute("role", "img");
  renderer.domElement.setAttribute(
    "aria-label",
    `ภาพตัวอย่าง: ${lesson.title}`,
  );
  const scene = new THREE.Scene(),
    group = new THREE.Group();
  scene.add(group, new THREE.HemisphereLight(0xe2f6ff, 0x213847, 3));
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(2, 8, 5);
  scene.add(light);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const colors = [0x7ce4c6, 0x75bafa, 0xf1bb58, 0xe79acc];
  const tile = (text, x, y, z, color = colors[0], w = 2.5) => {
    const g = new THREE.Group();
    box(g, 0, 0, 0, w, 0.25, 1, material(color));
    const name = label(text, "#e7f5fa", 1.1);
    name.position.set(0, 0.6, 0);
    g.add(name);
    g.position.set(x, y, z);
    group.add(g);
    return g;
  };
  const device = (type, text, x, z) => {
    const model =
      type === "pc" ? laptop() : type === "server" ? rack() : appliance(type);
    model.position.set(x, 0, z);
    group.add(model);
    const name = label(text);
    name.position.set(x, 2, z);
    group.add(name);
  };
  const link = (a, b, color = colors[0]) => {
    const curve = new THREE.LineCurve3(
      new THREE.Vector3(...a),
      new THREE.Vector3(...b),
    );
    group.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(curve, 1, 0.035, 6, false),
        material(color),
      ),
    );
  };
  const id = lesson.id;
  if (id === "computer-os") {
    box(group, 0, 0, 0, 6, 0.12, 3.2, material(0x285c49));
    tile("CPU", -1.5, 0.25, 0, colors[0], 1.2);
    tile("RAM", 1.5, 0.25, -0.8, colors[1], 2);
    tile("NIC", 1.5, 0.25, 0.8, colors[2], 2);
  } else if (id === "number-systems") {
    [1, 1, 0, 0, 0, 0, 0, 0].forEach((bit, i) =>
      tile(
        `${bit} · ${2 ** (7 - i)}`,
        ((i % 4) - 1.5) * 1.7,
        0.2 + bit * 0.5,
        Math.floor(i / 4) * 1.7 - 0.85,
        bit ? colors[0] : 0x354f61,
        1.3,
      ),
    );
  } else if (id === "osi-model" || id === "encapsulation") {
    const names =
      id === "osi-model"
        ? [
            "L1 Physical",
            "L2 Data Link",
            "L3 Network",
            "L4 Transport",
            "L5 Session",
            "L6 Presentation",
            "L7 Application",
          ]
        : ["TLS records", "TCP · 443", "IP · TTL 64", "Ethernet · MAC"];
    names.forEach((name, i) =>
      tile(
        name,
        0,
        i * 0.6,
        0,
        colors[i % 4],
        id === "osi-model" ? 4 : 2.5 + i * 0.7,
      ),
    );
  } else if (id === "devices") {
    device("switch", "Switch · MAC", -2, -1);
    device("router", "Router · IP", 2, -1);
    device("switch", "Hub · L1", -2, 2);
    device("router", "AP · Wi-Fi", 2, 2);
    const firewall = new THREE.Group();
    box(firewall,0,.5,0,1.3,1,.3,material(0xc18a53));
    firewall.position.set(0,0,0);group.add(firewall);
    const firewallLabel=label("Firewall · Policy");firewallLabel.position.set(0,1.6,0);group.add(firewallLabel);
  } else if (id === "physical") {
    device("pc", "UTP · electrical", -2, 0);
    device("switch", "Fiber · optical", 2, 0);
    link([-1.3, 0.3, 0.2], [1.3, 0.3, 0.2]);
    link([-1.3, 0.3, 0.6], [1.3, 0.3, 0.6], colors[1]);
  } else if (lesson.track === "python") {
    // Readable code from this exact lesson, rather than a network dashboard on every card.
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#102a36";
    ctx.fillRect(0, 0, 1000, 480);
    ctx.font = "24px monospace";
    ctx.fillStyle = "#75bafa";
    ctx.fillText("PYTHON / " + id, 35, 55);
    ctx.font = "27px monospace";
    ctx.fillStyle = "#7ce4c6";
    (lesson.starter || lesson.solution || "")
      .split("\n")
      .slice(0, 8)
      .forEach((line, i) => ctx.fillText(line.slice(0, 58), 35, 105 + i * 42));
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(7, 0.12, 3.4),
      material(0x304d5b),
    );
    group.add(panel);
    const code = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 3.4),
      new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(canvas),
        side: THREE.DoubleSide,
      }),
    );
    code.rotation.x = -Math.PI / 2;
    code.position.y = 0.07;
    group.add(code);
  } else if (lesson.conceptLab) {
    const s = lesson.states[0];
    const heading = label(s.headline, "#7ce4c6", 1.8);
    heading.position.set(0, 2.7, 0);
    group.add(heading);
    s.rows.slice(0, 4).forEach(([name, value], i) => {
      tile(
        name,
        ((i % 2) - 0.5) * 3.3,
        0.25,
        Math.floor(i / 2) * 2.1 - 1,
        colors[i % 4],
        2.8,
      );
      const text = label(String(value), "#e7f5fa", 1.2);
      text.position.set(
        ((i % 2) - 0.5) * 3.3,
        1.2,
        Math.floor(i / 2) * 2.1 - 1,
      );
      group.add(text);
    });
  } else {
    const recipes = {
      layer2: [
        ["pc", "MAC A"],
        ["switch", "MAC table"],
        ["pc", "MAC B"],
      ],
      vlan: [
        ["pc", "VLAN 10"],
        ["switch", "802.1Q trunk"],
        ["pc", "VLAN 20"],
      ],
      layer3: [
        ["pc", "Source IP"],
        ["router", "Routing table"],
        ["server", "Destination IP"],
      ],
      gateway: [
        ["pc", "192.168.10.25"],
        ["router", "192.168.10.1"],
        ["server", "Remote network"],
      ],
      dns: [
        ["pc", "ops.example.test"],
        ["server", "DNS resolver"],
        ["server", "203.0.113.80"],
      ],
      dhcp: [
        ["pc", "DHCP client"],
        ["switch", "LAN"],
        ["server", "DHCP server"],
      ],
      mpls: [
        ["router", "Push 100"],
        ["router", "Swap 200"],
        ["router", "Pop label"],
      ],
      subnet: [
        ["pc", "192.168.10.0/24"],
        ["router", "Subnet boundary"],
        ["pc", "192.168.11.0/24"],
      ],
      protocols: [
        ["pc", "Client port"],
        ["router", "TCP / UDP"],
        ["server", "Service port"],
      ],
      address: [
        ["pc", "IPv4 / mask"],
        ["router", "Gateway"],
        ["server", "Destination"],
      ],
      internet: [
        ["pc", "Computer"],
        ["router", "Gateway / NAT"],
        ["router", "ISP"],
        ["server", "Internet server"],
      ],
      packet: [
        ["pc", "Computer"],
        ["router", "Gateway / NAT"],
        ["router", "ISP"],
        ["server", "Internet server"],
      ],
    };
    const recipe = recipes[id];
    if (!recipe) throw new Error(`Missing preview: ${id}`);
    recipe.forEach(([type, name], i) => {
      const x = (i - (recipe.length - 1) / 2) * 3;
      device(type, name, x, 0);
      if (i)
        link(
          [x - 3, 0.3, 0],
          [x, 0.3, 0],
          id === "vlan" && i === 2 ? colors[1] : colors[0],
        );
    });
  }
  const bounds = new THREE.Box3().setFromObject(group),
    center = bounds.getCenter(new THREE.Vector3()),
    size = bounds.getSize(new THREE.Vector3());
  let dead = false;
  const render = () => {
    if (dead) return;
    const w = container.clientWidth,
      h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    const distance = Math.max(size.x / camera.aspect, size.y, size.z) * 1.9;
    camera.position
      .copy(center)
      .add(new THREE.Vector3(distance * 0.18, distance * 0.75, distance));
    camera.lookAt(center);
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  };
  const observer = new ResizeObserver(render);
  observer.observe(container);
  render();
  return {
    dispose() {
      dead = true;
      observer.disconnect();
      scene.traverse((o) => {
        o.geometry?.dispose();
        for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
          m?.map?.dispose();
          m?.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
