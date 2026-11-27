import test from 'node:test';
import assert from 'node:assert/strict';
import { OrderCalculationService, TAX_RATE } from '../src/services/order-calculation.service.js';
import { OrderSummaryComponent } from '../src/components/order-summary.component.js';
import { OrderItem } from '../src/models/order.model.js';

test('1. Baseline Calculation: subtotal, 18% tax, and precision', () => {
  const service = new OrderCalculationService();
  const items: OrderItem[] = [
    { id: '1', name: 'Cricket Bat Pro', unitPrice: 120.00, quantity: 2 }, // 240.00
    { id: '2', name: 'Leather Ball', unitPrice: 15.50, quantity: 4 }      // 62.00
  ];

  // Subtotal = 302.00. Tax (18%) = 54.36. Total = 356.36
  const result = service.calculateOrder(items, 0);

  assert.equal(result.subtotal, 302.00);
  assert.equal(result.discountAmount, 0.00);
  assert.equal(result.taxAmount, 54.36);
  assert.equal(result.total, 356.36);
  assert.equal(result.itemCount, 6);
});

test('2. Baseline Coupon Application: 25% discount and recalculated tax', () => {
  const service = new OrderCalculationService();
  const items: OrderItem[] = [
    { id: '1', name: 'Academy Kit Bag', unitPrice: 100.00, quantity: 1 }
  ];

  const coupon = service.validateCoupon('CHAMPION25');
  assert.equal(coupon.valid, true);
  assert.equal(coupon.discountPercentage, 25);

  // Subtotal = 100.00, Discount = 25.00, Discounted Subtotal = 75.00, Tax (18%) = 13.50, Total = 88.50
  const result = service.calculateOrder(items, coupon.discountPercentage);

  assert.equal(result.subtotal, 100.00);
  assert.equal(result.discountAmount, 25.00);
  assert.equal(result.taxAmount, 13.50);
  assert.equal(result.total, 88.50);
});

test('3. Baseline Coupon Validation: Invalid/Empty codes', () => {
  const service = new OrderCalculationService();

  const empty = service.validateCoupon('');
  assert.equal(empty.valid, false);

  const fake = service.validateCoupon('FAKE99');
  assert.equal(fake.valid, false);
  assert.equal(fake.discountPercentage, 0);
});

test('4. Baseline Duplicate Submission & Empty Cart Protection', () => {
  const service = new OrderCalculationService();

  // Test empty items
  const emptyValidation = service.validateCheckoutSubmission({
    items: [],
    calculation: { subtotal: 0, discountAmount: 0, taxAmount: 0, total: 0, itemCount: 0 },
    idempotencyKey: 'key_123'
  }, false);
  assert.equal(emptyValidation.isValid, false);
  assert.match(emptyValidation.error || '', /at least one item/);

  // Test concurrent submission blocking
  const inProgressValidation = service.validateCheckoutSubmission({
    items: [{ id: '1', name: 'Item', unitPrice: 10, quantity: 1 }],
    calculation: { subtotal: 10, discountAmount: 0, taxAmount: 1.8, total: 11.8, itemCount: 1 },
    idempotencyKey: 'key_123'
  }, true);
  assert.equal(inProgressValidation.isValid, false);
  assert.match(inProgressValidation.error || '', /already in progress/);
});

test('5. Baseline Component Integration: End-to-end component flow', () => {
  const service = new OrderCalculationService();
  const component = new OrderSummaryComponent(service);

  component.setItems([
    { id: 'item1', name: 'Bat Grip', unitPrice: 5.00, quantity: 2 } // 10.00
  ]);

  component.couponCodeInput = 'SUPER10';
  component.applyCoupon();

  // Subtotal = 10.00, Discount (10%) = 1.00, Tax (18% of 9) = 1.62, Total = 10.62
  assert.equal(component.calculation.subtotal, 10.00);
  assert.equal(component.calculation.discountAmount, 1.00);
  assert.equal(component.calculation.taxAmount, 1.62);
  assert.equal(component.calculation.total, 10.62);

  const submission = component.submitOrder();
  assert.equal(submission.success, true);
  assert.ok(submission.orderId?.startsWith('ORD-'));
});
