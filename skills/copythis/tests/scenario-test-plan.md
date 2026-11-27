# COPYTHIS — Scenario test plan

**Current status:** Draft.
- **Overall skill:** Draft.
- **Scenario 1:** Initial controlled benchmark passed with limitations.
- **Scenario 13:** Pending execution.

Tests may be conducted in real production/development repositories or inside isolated, controlled benchmark repositories (e.g. `benchmarks/copythis/scenario-X/`). Passing a controlled fixture serves as an initial qualification benchmark, but is not sufficient alone for declaring COPYTHIS stable. Real-project validation across supported platforms is required before release.

For every scenario, record: agent/platform and version, prompt, repository setup, expected behavior, observed behavior, files changed, tests run, repeated reads, clarification rounds, verification integrity checks, and pass/fail.

---

## Scenario 1 — Clear same-framework functional copy
- **Setup:** Source and destination explicitly named within compatible framework architectures (e.g. Angular to Angular or React to React).
- **Expected:** FUNCTIONAL_ONLY mode; single-pass inspection of both projects; preserve business logic, mathematical calculations, coupon validations, duplicate submission protection, and boundary rules; inherit destination styling and design tokens; no unnecessary clarification rounds or repeated file reads. Any justified reread must have a documented reason.

## Scenario 2 — Angular to React
- **Setup:** Source uses Angular service, reactive form, RxJS subscription, role guard, and multiple validation branches.
- **Expected:** Translate semantics into existing React architecture (hooks, context/services); preserve observable behavior, async handling, race conditions, role-based authorization, and error states; zero Angular styling or dependencies copied.

## Scenario 3 — Web to mobile
- **Setup:** Source includes filters, pagination, API loading/error states, device lifecycle, and browser-only DOM interaction.
- **Expected:** Rebuild with native destination mobile controls; preserve supported workflows, state persistence, and error recovery; identify and document unsupported browser behavior rather than claiming false equivalence.

## Scenario 4 — Autonomous discovery when paths are omitted
- **Setup:** Developer requests feature migration without explicit paths (e.g. "Migrate the checkout summary").
- **Expected:** Agent searches accessible workspaces autonomously using feature symbols, routes, and API contracts; proceeds without interruption when there is one clear match; asks targeted clarification only if ambiguous; avoids broad unrelated scans.

## Scenario 5 — Ambiguous source candidates
- **Setup:** Two source components have similar names and different business logic or data contracts.
- **Expected:** Inspect enough to distinguish differences, then formulate one concise clarification message; pause affected implementation until developer decides; make no destructive edits beforehand.

## Scenario 6 — Source path inaccessible
- **Setup:** Developer points to a path outside agent permissions or filesystem boundaries.
- **Expected:** Report access limitation accurately and request an accessible path or workspace; do not fabricate findings or pretend files were inspected.

## Scenario 7 — Suspected source defect
- **Setup:** Source has a likely incorrect boundary condition affecting calculations or permission enforcement.
- **Expected:** Explain observed behavior; ask whether to preserve exact behavior or apply a correction; record approved deviation; never silently alter or reproduce.

## Scenario 8 — Destination already has equivalent utility
- **Setup:** Destination contains an established API client, shared validation utility, and design tokens.
- **Expected:** Reuse existing destination utilities and state persistence; do not introduce redundant packages or duplicate services.

## Scenario 9 — Strict evidence reuse & context ledger
- **Setup:** A multi-step migration task requiring multiple edits, concurrent submission handling, and checks.
- **Expected:** Maintain task context ledger; do not reread unchanged files without justification; use targeted diffs for modified files; reuse passing test results while code and environment remain unchanged.

## Scenario 10 — Verification integrity & truth-in-testing
- **Setup:** Migration code achieves basic TypeScript compilation but encounters a build or unit test failure.
- **Expected:** Track build and test commands independently; inspect project configuration/scripts to select correct commands; never overwrite a failed build check with a partial compilation check; accurately report Verified, Partial, and Not verified.

## Scenario 11 — Design migration & DESIGN_ONLY mode
- **Setup:** Developer requests visual redesign of an existing destination feature.
- **Expected:** In DESIGN_ONLY mode, reproduce requested visual design, focus management, and accessibility while strictly preserving existing destination logic, state, and API contracts; in FULL_MIGRATION, adapt both; retain functional parity.

## Scenario 12 — Negative trigger boundary
- **Setup:** Developer asks a conceptual question or requests simple same-project file duplication.
- **Expected:** Answer question or perform basic file copy; do not activate the full cross-project migration engine.

## Scenario 13 — Feature completeness & interaction parity audit
- **Setup:** Source feature contains multi-surface interactive elements (e.g., clickable dashboard KPI filter cards, data pagination with page sizes, multi-step horizontal wizard, confirmation/review modals, form control placeholders, shell header title mappings, and role-based quick-link launch points).
- **Expected:** Perform a mandatory 11-point Feature Completeness & Interaction Parity Audit; inventory all parent/child views, interactive filters, modal gates, and navigation hubs; implement full behavioral parity without dropping pagination or replacing card filters with duplicate tabs; auto-center active steps into viewport on constrained/mobile displays; register routes and titles across destination app shell and quick-links for all authorized roles; derive verification checks confirming interactive controls.

---

## Release gate

Do not mark COPYTHIS stable until all applicable scenarios pass on at least one supported agent environment, with cross-platform checks documented separately. A scenario that cannot be tested must be marked unverified, not passed.
