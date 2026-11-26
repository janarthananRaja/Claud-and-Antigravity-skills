# Development Roadmap

## Working model

Develop one skill at a time, aiming for one focused skill per day when its scope and validation allow. The cadence is a target, not a reason to ship unfinished instructions.

Lifecycle:

`Problem discovery -> Specification -> Draft -> Scenario testing -> Revision -> Stable`

Do not move to the next skill while the current skill has unresolved correctness or safety failures.

## Day 1 — COPYTHIS

**Problem:** Migrate components, features, and workflows between projects/platforms without losing intended behavior, leaking source styling, or wasting context through repeated discovery.

**Locked defaults:**
- FUNCTIONAL_ONLY unless design/full migration is explicit.
- Inspect source and destination before asking consequential questions.
- Strict behavioral parity; report suspected defects and improvements separately.
- Support absolute/relative paths and accessible multi-root workspaces.
- Maintain a task-scoped context ledger and reuse findings until invalidated.
- Reread only when files changed, evidence conflicts, details are missing, or exact current code is needed.

**Work areas:**
- Source/destination resolution and access limitations.
- Bounded discovery and dependency tracing.
- Business rules, conditions, validations, events, state, APIs, and edge cases.
- Cross-framework and web/mobile adaptation.
- Destination theme isolation.
- Clarification protocol.
- Behavioral parity tests and evidence-based reporting.
- Context/token efficiency without reducing correctness.

**Acceptance gates:**
- Clear prompts do not trigger redundant questions.
- Ambiguous consequential scope triggers concise clarification.
- Inaccessible source paths are reported honestly.
- Relevant files are not repeatedly read without a reason.
- Findings are reused from a task-scoped ledger.
- Business behavior is inventoried and mapped.
- Functional-only mode does not import source styling.
- Destination conventions and dependencies are reused.
- Tests or reproducible checks support parity claims.
- Gaps and deviations are explicit.

**Status:** Draft. Requires scenario testing in real repositories before stable release.

## Future skill candidates

These are candidates, not fixed release dates:

1. **debug-first** — reproduce and isolate defects before changing code.
2. **contextguard** — bounded repository discovery and context/token budgeting.
3. **safe-refactor** — refactor while preserving observable behavior.
4. **api-contract-keeper** — prevent frontend/backend contract drift.
5. **testcraft** — derive focused tests from requirements and code paths.
6. **dependency-audit** — evaluate existing packages before adding/upgrading.
7. **ui-consistency** — use destination design systems and shared components.
8. **security-review** — identify common security risks and verify fixes.
9. **database-change-safety** — plan schema changes, migrations, and rollback.
10. **docs-sync** — keep implementation and developer documentation aligned.

## Prioritization

Choose by problem frequency, cost of mistakes, measurable benefit, token/context waste prevented, testability, platform compatibility, and overlap with existing skills. Optimize for developer value, not catalogue size.
