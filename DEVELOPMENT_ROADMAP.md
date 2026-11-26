# Development Roadmap

## Working model

Develop one skill at a time, targeting one skill per day when its scope and validation effort allow. The cadence is a planning aid, not a release guarantee.

A skill moves through:

`Problem discovery -> Specification -> Draft -> Scenario testing -> Revision -> Stable`

Do not start another skill merely to meet the daily target if the current skill has unresolved correctness or safety issues.

## Day 1 — COPYTHIS

**Problem:** Developers need to migrate components, features, and workflows between projects or platforms without losing behavior or importing unwanted source styling.

**Default principle:** Preserve functional behavior; adapt implementation to destination architecture; use destination design and theme unless the developer explicitly requests design migration.

**Planned coverage:**
- Source and destination project discovery.
- Component and dependency tracing.
- Business logic, conditions, validations, events, state, and API behavior preservation.
- Cross-framework and web/mobile adaptation.
- Source-style isolation and destination design-system reuse.
- Clarification for consequential ambiguity.
- Behavioral parity checklist and evidence-based reporting.
- Minimal file scope and token/context efficiency.

**Acceptance gates:**
- Clear prompts activate the skill without redundant questions.
- Ambiguous source/destination/scope prompts trigger concise clarification.
- Source business rules and edge cases are mapped before implementation.
- Styling is not copied in functional-only mode.
- Destination conventions and existing utilities are reused.
- Tests or explicit verification evidence support parity claims.
- Unverified behavior and limitations are reported honestly.

**Status:** Planned. Specification and test suite are to be completed before stable release.

## Future skill candidates

These are candidates, not committed release dates. Prioritize based on recurring developer pain and overlap with existing skills.

1. **debug-first** — reproduce, isolate, and diagnose errors before editing code.
2. **contextguard** — targeted repository discovery and context/token budgeting.
3. **safe-refactor** — refactor while preserving externally observable behavior.
4. **api-contract-keeper** — maintain API contracts across frontend/backend changes.
5. **testcraft** — derive focused tests from requirements, code paths, and edge cases.
6. **dependency-audit** — evaluate existing packages before adding or upgrading dependencies.
7. **ui-consistency** — use a destination design system and shared components consistently.
8. **security-review** — identify common security risks and validate fixes.
9. **database-change-safety** — plan schema changes, migrations, and rollback considerations.
10. **docs-sync** — keep implementation, API docs, and developer documentation aligned.

## Prioritization rules

Evaluate candidate skills by:

- Frequency of the problem.
- Cost of mistakes.
- Potential to prevent wasted context and tokens.
- Clarity of success criteria.
- Platform compatibility.
- Overlap with existing skills.
- Ability to test against realistic examples.

Do not optimize for catalogue size. Optimize for measurable developer value.
