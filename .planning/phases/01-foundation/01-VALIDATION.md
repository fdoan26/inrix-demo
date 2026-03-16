---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-16
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (via `npm run test`) + TypeScript compiler check |
| **Config file** | `vite.config.ts` (vitest inline config) |
| **Quick run command** | `npm run build -- --noEmit` (TypeScript type check) |
| **Full suite command** | `npx tsc --noEmit && npm run build` |
| **Estimated runtime** | ~5-10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit` to verify TypeScript compiles
- **After every plan wave:** Run `npm run build` to verify full build passes
- **Before `/gsd:verify-work`:** `npm run dev` must open browser with no console errors
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| pkg-reinstall | 01 | 1 | FOUND-01 | build | `npm run build` | ⬜ pending |
| tailwind-config | 01 | 1 | FOUND-02 | build | `npx tsc --noEmit` | ⬜ pending |
| main-tsx | 01 | 1 | FOUND-01 | build | `npx tsc --noEmit` | ⬜ pending |
| store-slices | 01 | 2 | FOUND-04 | type | `npx tsc --noEmit` | ⬜ pending |
| mock-segments | 01 | 2 | FOUND-01 | type | `npx tsc --noEmit` | ⬜ pending |
| mock-alerts | 01 | 2 | FOUND-01 | type | `npx tsc --noEmit` | ⬜ pending |
| mock-cameras | 01 | 2 | FOUND-01 | type | `npx tsc --noEmit` | ⬜ pending |
| signal-data | 01 | 2 | FOUND-01 | type | `npx tsc --noEmit` | ⬜ pending |
| navbar | 01 | 3 | FOUND-03 | manual | `npm run dev` visual check | ⬜ pending |
| view-routing | 01 | 3 | FOUND-04 | manual | `npm run dev` click test | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

No test framework installation needed — validation is TypeScript compiler + `npm run build` + manual browser check.

*Existing infrastructure (Vite + TypeScript) covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Dark navy #0a1628 page renders | FOUND-03 | Visual color check | Run `npm run dev`, inspect background color in browser devtools |
| Nav bar shows INRIX IQ logo + 3 icons | FOUND-03 | Visual layout | Check HelpCircle, RefreshCw, LayoutGrid appear right-aligned |
| Module name click switches view | FOUND-04 | Interactive behavior | Click "Mission Control" text → "Signal Analytics" should render |
| Tailwind design tokens available | FOUND-02 | CSS output check | Inspect element, verify `bg-inrix-navy` etc. apply correct hex |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
