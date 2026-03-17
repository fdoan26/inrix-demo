---
phase: 3
slug: mission-control-panels
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-17
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (via `npm run build` TypeScript check) |
| **Config file** | vite.config.ts |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 3-01-01 | 01 | 1 | PANEL-01, PANEL-02 | build | `npm run build` | ✅ | ⬜ pending |
| 3-01-02 | 01 | 1 | MAP-05, MAP-06 | build | `npm run build` | ✅ | ⬜ pending |
| 3-01-03 | 01 | 1 | PANEL-03 | manual | visual inspection | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements — TypeScript build catches type errors; no additional test framework needed for this wiring phase.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Panel slides in from right on segment click | PANEL-01 | Animation requires visual inspection | Click a road segment, verify panel appears from right edge |
| Panel slides in from right on camera click | PANEL-02 | Animation requires visual inspection | Click a camera pin, verify panel appears from right edge |
| Close button dismisses panel | PANEL-03 | DOM interaction | Click ×, verify panel disappears |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
