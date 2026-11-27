# Scenario 2 — Angular Source Baseline Freeze

**Date:** 2026-11-26  
**Framework:** Angular (Service, Reactive Form, Role Guard, Async/Observable semantics)  
**Source Path:** `benchmarks/copythis/scenario-2/source`

## Frozen Source Behavioral Inventory

### 1. Form Validation Rules & Boundaries
- **Name:** Minimum 2 characters (`errors.name = 'Name must be at least 2 characters long'`).
- **Email:** Standard regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` required.
- **Role:** Strict enum check `['ADMIN', 'COACH', 'STUDENT']`.
- **Academy ID:** Must be positive number > 0.

### 2. Authorization & Role Guard
- Only user with role `ADMIN` is permitted to invoke `updateUser`.
- Non-admin callers (e.g. `COACH` or `STUDENT`) are rejected with `Error: 'Access denied: Only ADMIN can modify user profiles'`.

### 3. Component Lifecycle & State Transitions
- Form initializes with user data.
- Validation errors block submission and populate error map.
- During submission, `isLoading = true`, controls disabled.
- On success, `savedUser` is updated and success banner is displayed.
- On failure, error message is populated and `isLoading = false`.

---

## Baseline Execution Evidence
```text
TAP version 13
# Subtest: 1. Baseline Validation: Name length boundary (< 2 chars rejected)
ok 1 - 1. Baseline Validation: Name length boundary (< 2 chars rejected)
# Subtest: 2. Baseline Validation: Email regex check
ok 2 - 2. Baseline Validation: Email regex check
# Subtest: 3. Baseline Validation: Role boundaries (ADMIN, COACH, STUDENT)
ok 3 - 3. Baseline Validation: Role boundaries (ADMIN, COACH, STUDENT)
# Subtest: 4. Baseline Authorization Guard: Only ADMIN can modify user
ok 4 - 4. Baseline Authorization Guard: Only ADMIN can modify user
# Subtest: 5. Baseline Component Flow: End-to-end form lifecycle & state transitions
ok 5 - 5. Baseline Component Flow: End-to-end form lifecycle & state transitions
1..5
# tests 5
# pass 5
# fail 0
```

**Status:** ALL 5 SOURCE BASELINE TESTS PASS. Frozen.
