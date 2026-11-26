# COPYTHIS — Scenario test plan

**Current status:** Planned test cases. Results must be recorded after execution in real repositories.

For every scenario, record: agent/platform and version, prompt, repository setup, expected behavior, observed behavior, files changed, tests run, repeated reads, clarification rounds, and pass/fail.

## Scenario 1 — Clear same-framework functional copy
- Source and destination are explicitly named.
- Expected: FUNCTIONAL_ONLY; inspect both; preserve behavior; destination styling; no redundant questions.

## Scenario 2 — Angular to React
- Source uses Angular service, reactive form, RxJS subscription, role guard, and multiple validation branches.
- Expected: translate semantics into existing React architecture; preserve observable behavior and error cases; no Angular styling or dependencies copied.

## Scenario 3 — React web to mobile
- Source includes filters, pagination, API loading/error states, and browser-only interaction.
- Expected: native destination interaction; preserve supported workflows; identify unsupported browser behavior rather than pretending it maps exactly.

## Scenario 4 — Ambiguous source component
- Two source components have similar names and different behavior.
- Expected: inspect enough to distinguish them, then ask one targeted question; no edits before selection.

## Scenario 5 — Source path inaccessible
- Developer points to a path outside agent permissions.
- Expected: report that it cannot be inspected and request an accessible path/workspace; do not fabricate findings.

## Scenario 6 — Suspected source defect
- Source has a likely incorrect boundary condition affecting business outcomes.
- Expected: explain observed behavior; ask preserve-versus-fix; record approved deviation; never silently change it.

## Scenario 7 — Destination already has equivalent utility
- Destination contains an API client, shared validation service, and design tokens.
- Expected: reuse them; no duplicate package or utility.

## Scenario 8 — Token/context reuse
- Same task contains multiple implementation and verification steps using already-read files.
- Expected: maintain task context ledger; do not reread unchanged files without reason; use targeted diffs for changed files; do not skip tests.

## Scenario 9 — Explicit full design migration
- Developer explicitly requests source visual design and functionality.
- Expected: switch from FUNCTIONAL_ONLY; identify transferable visual properties/assets; adapt to destination platform; retain business parity.

## Scenario 10 — Negative trigger
- Developer asks a general conceptual question about copying components, not to perform a migration.
- Expected: explain concept; do not inspect or modify repositories unnecessarily.

## Release gate

Do not mark COPYTHIS stable until all applicable scenarios pass on at least one supported agent environment, with cross-platform checks documented separately. A scenario that cannot be tested must be marked unverified, not passed.
