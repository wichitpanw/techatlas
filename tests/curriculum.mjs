import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { pythonLessons } from "../dist/assets/python-curriculum.js";
import { conceptPreview } from "../dist/assets/network-concepts.js";
import {
  networkLessons,
  simulateNetwork,
} from "../dist/assets/network-curriculum.js";
import {
  arrangeNetwork,
  orderedSections,
} from "../dist/assets/network-foundations.js";
const all = arrangeNetwork(networkLessons);
assert.deepEqual(
  all.slice(7, 16).map((l) => l.id),
  [
    "layer2",
    "address",
    "subnet",
    "dhcp",
    "gateway",
    "arp-icmp",
    "vlan",
    "stp",
    "etherchannel",
  ],
);
assert.equal(all.length, 54);
const orderOf = (id) => all.findIndex((l) => l.id === id);
assert(orderOf("dhcp") < orderOf("gateway"), "DHCP ก่อน Gateway");
assert(orderOf("wan") < orderOf("mpls"), "WAN ก่อน MPLS");
assert(orderOf("network-commands") < orderOf("troubleshooting"));
assert.equal(all.at(-1).section, "cloud");
assert.equal(new Set(all.map((l) => l.id)).size, all.length);
for (const section of orderedSections)
  assert(all.some((l) => l.section === section.id));
for (const l of all) {
  assert(l.title && l.explain && l.source && l.reason);
  assert(l.choices[l.answer]);
  if (l.conceptLab) {
    assert(conceptPreview(l).includes("preview-state-title"));
    assert(l.states.length >= 2);
    for (const s of l.states) assert(s.rows.length && s.headline && s.detail);
  }
}
assert.equal(
  simulateNetwork("vlan", {
    "target-vlan": "20",
    "allowed-vlans": "10,20",
    "inter-vlan": "off",
  }).ok,
  false,
);
assert.equal(
  simulateNetwork("vlan", {
    "target-vlan": "20",
    "allowed-vlans": "20",
    "inter-vlan": "on",
  }).ok,
  true,
);
assert.equal(
  simulateNetwork("vlan", {
    "target-vlan": "10",
    "allowed-vlans": "20",
    "inter-vlan": "off",
  }).ok,
  false,
);
assert.match(
  simulateNetwork("layer3", {
    "route-destination": "10.20.30.15",
    "specific-route": "on",
  }).lines[0],
  /\/24/,
);
assert.match(
  simulateNetwork("layer3", {
    "route-destination": "10.20.30.15",
    "specific-route": "off",
  }).lines[0],
  /\/16/,
);
assert.equal(simulateNetwork("mpls", { "incoming-label": "999" }).ok, false);
assert.equal(simulateNetwork("gateway", { gateway: "192.168.10.1" }).ok, true);
for (const gateway of ["none", "192.168.10.254", "10.0.0.10", "192.168.10.1"]) {
  const local = simulateNetwork("gateway", {
    gateway,
    "gateway-target": "local",
  });
  assert.equal(local.ok, true);
  assert.deepEqual(local.path, [0, 1, 4]);
  const remote = simulateNetwork("gateway", {
    gateway,
    "gateway-target": "remote",
  });
  assert.equal(remote.ok, gateway === "192.168.10.1");
  if (gateway === "none" || gateway === "10.0.0.10")
    assert.deepEqual(remote.path, []);
}
assert.equal(
  simulateNetwork("gateway", { gateway: "192.168.10.254" }).ok,
  false,
);
const cases = pythonLessons.flatMap((l) => [
  {
    id: l.id,
    code: l.solution,
    inputs: (l.inputs || "").split("\n").filter((x, i) => l.inputs || i > 0),
    expected: l.expected,
    files: l.fileSolutions || l.files || {},
  },
  ...(l.tests || []).map((t) => ({
    id: l.id + " / " + t.name,
    code: l.solution + (t.append ? "\n" + t.append : ""),
    inputs: t.inputs || (l.inputs || "").split("\n"),
    expected: t.expected,
    files: l.fileSolutions || l.files || {},
  })),
]);
for (const l of pythonLessons) {
  assert(l.task?.goal && l.task.focus && l.task.extension, `Missing mission: ${l.id}`);
  assert(l.task.actions.length >= 2, `Missing explicit actions: ${l.id}`);
  assert.deepEqual(l.steps, l.task.actions);
  assert(l.work.includes('หลังผ่านภารกิจแล้ว'));
}
const result = spawnSync(
  "python3",
  [
    "-c",
    `
import json,sys,io,contextlib,tempfile,pathlib,shutil
cases=json.load(sys.stdin)
def norm(s): return '\\n'.join(x.rstrip() for x in s.replace('\\r\\n','\\n').split('\\n')).strip()
for c in cases:
    print('Checking '+c['id'],file=sys.stderr,flush=True)
    folder=tempfile.mkdtemp(prefix='techatlas-check-')
    try:
        for name,code in c['files'].items(): pathlib.Path(folder,name).write_text(code)
        sys.path.insert(0,folder)
        inputs=iter(c['inputs'])
        scope={'input':lambda prompt='':next(inputs)}
        output=io.StringIO()
        with contextlib.redirect_stdout(output): exec(c['code'],scope)
        assert norm(output.getvalue())==norm(c['expected']), (c['id'],output.getvalue(),c['expected'])
    finally:
        sys.path.remove(folder)
        for name in c['files']: sys.modules.pop(name[:-3],None)
        shutil.rmtree(folder)
print('Python: '+str(len(cases))+' solution and input cases passed')
`,
  ],
  { input: JSON.stringify(cases), encoding: "utf8", timeout: 10000 },
);
assert.equal(result.status, 0, String(result.error || '') + '\n' + result.stderr);
console.log(result.stdout.trim());
console.log(
  `Network: ${all.length} lessons, all sections and forwarding checks passed`,
);
