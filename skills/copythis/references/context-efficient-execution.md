# COPYTHIS — Context-efficient execution

## Objective

Reduce duplicated discovery and repeated context consumption while maintaining the same or better migration correctness.

## Single-pass discovery

1. Resolve the source and destination.
2. Search for the requested component/feature by name or route.
3. Read the entry point and directly relevant dependencies.
4. Inspect only the destination area and its conventions.
5. Record findings in a task-scoped context ledger.
6. Build the behavior inventory and destination mapping.
7. Implement and verify using the ledger.

## Task context ledger template

```text
TASK:
MODE:
SOURCE PATH:
DESTINATION PATH:

SOURCE FILES READ:
- path — purpose — relevant symbols

DESTINATION FILES READ:
- path — purpose — reusable patterns

BEHAVIOR INVENTORY:
- rule/condition:
- validation:
- API/data contract:
- state/events:
- error/empty/loading:
- edge cases:

DESTINATION MAPPING:
- source behavior -> destination implementation

DECISIONS:
- developer-confirmed:
- inferred from repository:

OPEN QUESTIONS / RISKS:
VERIFICATION PLAN:
```

## Reuse and invalidation

Reuse ledger findings for the duration of the task. Do not reopen unchanged files just to repeat analysis.

Refresh only the affected entry when:
- The file changes after inspection.
- A diff or test reveals a contradiction.
- A symbol/dependency was omitted.
- An exact current implementation is required before a risky edit.
- Context reset removed the ledger.

Prefer targeted diffs, symbol searches, and status checks over full rereads. If the environment loses task context, reconstruct only the missing ledger sections, not the entire repository analysis.

Do not create a permanent cache of assumptions about a codebase. Repository state changes; stale caches are a bug factory.

## Token efficiency measures

Record where practical:
- Number of files read during discovery.
- Repeated reads and why they were necessary.
- Broad scans avoided.
- Clarification rounds.
- Tests executed.
- Whether any required verification was skipped.

Do not chase a token target by skipping behavior inventory, security review, or tests. Compare efficiency only between workflows that meet the same correctness gates.
