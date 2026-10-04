# Network visual audit — 2026-10-03

## Scope and finding

Reviewed the curriculum and renderer paths for 46 Network lessons. The 29 mechanism labs contain 79 bounded scenarios; 11 use the shared Three.js mechanism renderer. That renderer highlighted links but did not draw the named, directional transfers already present in the teaching model. This concealed important distinctions between protocol messages and generic packet motion.

## Implemented

- The shared 3D renderer now draws arrows, moving markers and readable message labels from explicit model transfers, not from every highlighted link. Applies to all 11 mechanism 3D labs. Steps without a defined transfer remain state/decision steps, not invented traffic.
- Device labels avoid one another in the default view; reduced-motion and preview modes use stationary markers.
- ARP/ICMP now shows next-hop selection, ARP broadcast within a VLAN, source-MAC learning, unicast reply, ARP cache, known-unicast forwarding, router re-encapsulation, TTL reduction, and an independently generated Echo Reply.
- A frame inspector distinguishes Ethernet MAC addresses from IPv4 endpoints and TTL; ARP explicitly has no IPv4 header/TTL. CLI evidence is illustrative, not commands executed on the learner's machine.
- The remote scenario explicitly assumes one router, directly connected subnets, no NAT, pre-resolved remote ARP, and a return route. It is not a complete ISP emulator. The filtered scenario locates the simulated drop while warning that real CLI timeout alone cannot locate failure.

## Verification and limits

- Node model checks: all 29 mechanism labs / 79 scenarios, transfer endpoints, protocol fields and input validation.
- Curriculum checks: all 46 Network lessons; Python regression: 60 cases.
- Browser test iterates fresh step buttons after each redraw (old harness retained detached buttons and did not actually traverse every step). Checks current evidence title, transfer-label count, and ARP/ICMP frame inspector, plus Python scene regressions.
- Manual visual check: ARP/ICMP remote routing and device-label placement at desktop size.
- This is not a claim that every camera angle and mobile viewport of all 46 lessons has been manually inspected. Foundation visualizations and the older dedicated lab renderer remain separate. Some topics appropriately use state tables, sequences or tools rather than moving packets.

## Primary protocol references

- ARP: https://www.rfc-editor.org/rfc/rfc826
- IPv4 router forwarding/TTL: https://www.rfc-editor.org/rfc/rfc1812
- ICMP Echo Request/Reply: https://www.rfc-editor.org/rfc/rfc792

No production deployment performed for this audit; obtain fresh user approval first.
