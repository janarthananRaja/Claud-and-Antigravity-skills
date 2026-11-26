# COPYTHIS — Migration checklist

Use this checklist only for migrations where the corresponding area applies.

## Before implementation
- [ ] Source and destination paths are resolved and accessible.
- [ ] Migration mode is known (FUNCTIONAL_ONLY by default).
- [ ] Relevant source entry point and dependencies are identified.
- [ ] Destination conventions, theme, services, and reusable components are identified.
- [ ] Task context ledger is populated.
- [ ] Consequential ambiguities are resolved.

## Behavior inventory
- [ ] Business rules and calculations.
- [ ] Conditions, guards, and conditional rendering.
- [ ] Input/output contracts and transformations.
- [ ] Validation rules and timing.
- [ ] API calls, payloads, responses, and error behavior.
- [ ] State transitions, events, callbacks, and async behavior.
- [ ] Roles, permissions, and authentication assumptions.
- [ ] Loading, empty, success, failure, retry, and cancellation states.
- [ ] Navigation and workflow transitions.
- [ ] Boundary cases, locale, dates, currency, and precision.
- [ ] Platform-specific capabilities and limitations.

## Destination implementation
- [ ] Existing destination services and components reused where appropriate.
- [ ] No unnecessary dependency introduced.
- [ ] Source styling excluded in FUNCTIONAL_ONLY mode.
- [ ] Destination theme and interaction conventions applied.
- [ ] No unrelated files changed.
- [ ] Existing consumers checked before shared contracts change.

## Verification and report
- [ ] Each applicable behavior has a verification status.
- [ ] Tests/checks are actually executed and results recorded.
- [ ] Unverified cases and platform limitations are explicit.
- [ ] Suspected defects and suggested improvements are reported separately.
- [ ] Completion report lists files and behavior changes.
