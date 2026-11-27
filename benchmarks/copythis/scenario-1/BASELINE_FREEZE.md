# Scenario 1 — Source Baseline Freeze

**Date:** 2026-11-26
**Environment:** Node v20+ / TypeScript ES2022
**Source Path:** `benchmarks/copythis/scenario-1/source`

## Frozen Source Behavioral Inventory

### 1. Mathematical Calculations & Precision
- **Subtotal:** Sum of (`unitPrice * quantity`) across all items, rounded to 2 decimal places.
- **Discount:** Clamped between 0% and 100%. `discountAmount = (subtotal * discountPercentage) / 100`, rounded to 2 decimal places.
- **Tax Rate:** 18% GST/Sales tax applied strictly to discounted subtotal: `(subtotal - discountAmount) * 0.18`, rounded to 2 decimal places.
- **Total:** `(discountedSubtotal + taxAmount)`, rounded to 2 decimal places.
- **Item Count:** Total sum of positive item quantities.

### 2. Coupon Validation Rules
- `SUPER10` -> Valid, 10% discount.
- `CHAMPION25` -> Valid, 25% discount.
- `VIP50` -> Valid, 50% discount.
- Empty or unrecognized strings -> Invalid, 0% discount, error message returned.

### 3. Duplicate Submission & Boundaries
- Empty cart (0 items) blocked with error: "Order must contain at least one item."
- Concurrent submission blocked: if already submitting, returns error "Checkout already in progress. Duplicate submission prevented."
- Idempotency key required on payload.

---

## Baseline Execution Evidence

```text
TAP version 13
# Subtest: 1. Baseline Calculation: subtotal, 18% tax, and precision
ok 1 - 1. Baseline Calculation: subtotal, 18% tax, and precision
# Subtest: 2. Baseline Coupon Application: 25% discount and recalculated tax
ok 2 - 2. Baseline Coupon Application: 25% discount and recalculated tax
# Subtest: 3. Baseline Coupon Validation: Invalid/Empty codes
ok 3 - 3. Baseline Coupon Validation: Invalid/Empty codes
# Subtest: 4. Baseline Duplicate Submission & Empty Cart Protection
ok 4 - 4. Baseline Duplicate Submission & Empty Cart Protection
# Subtest: 5. Baseline Component Integration: End-to-end component flow
ok 5 - 5. Baseline Component Integration: End-to-end component flow
1..5
# tests 5
# pass 5
# fail 0
```

**Status:** ALL 5 SOURCE BASELINE TESTS PASS. Baseline frozen.
