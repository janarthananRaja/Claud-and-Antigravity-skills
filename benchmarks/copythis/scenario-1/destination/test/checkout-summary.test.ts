import test from 'node:test';
import assert from 'node:assert/strict';
import { CheckoutSummaryService, TAX_RATE } from '../src/features/checkout/services/checkout-summary.service.js';
import { CheckoutSummaryComponent } from '../src/features/checkout/components/checkout-summary.component.js';
import { ApiClientService } from '../src/core/api-client.service.js';
import { SharedValidationService } from '../src/core/shared-validation.service.js';
import { CheckoutItem } from '../src/features/checkout/models/checkout-summary.model.js';

test('1. Destination Parity: Subtotal, 18% tax rate, and 2-decimal precision', () => {
  const validationService = new SharedValidationService();
  const service = new CheckoutSummaryService(validationService);

  const items: CheckoutItem[] = [
    { id: '1', name: 'Cricket Bat Pro', unitPrice: 120.00, quantity: 2 }, // 240.00
    { id: '2', name: 'Leather Ball', unitPrice: 15.50, quantity: 4 }      // 62.00
  ];

  const result = service.calculateCheckout(items, 0);

  // Exact parity match with source baseline: 302.00 subtotal, 54.36 tax, 356.36 total
  assert.equal(result.subtotal, 302.00);
  assert.equal(result.discountAmount, 0.00);
  assert.equal(result.taxAmount, 54.36);
  assert.equal(result.total, 356.36);
  assert.equal(result.itemCount, 6);
});

test('2. Destination Parity: Coupon calculation with 25% discount', () => {
  const validationService = new SharedValidationService();
  const service = new CheckoutSummaryService(validationService);

  const items: CheckoutItem[] = [
    { id: '1', name: 'Academy Kit Bag', unitPrice: 100.00, quantity: 1 }
  ];

  const coupon = service.validateCoupon('CHAMPION25');
  assert.equal(coupon.valid, true);
  assert.equal(coupon.discountPercentage, 25);

  // Exact parity match with source: 100.00 subtotal, 25.00 discount, 13.50 tax, 88.50 total
  const result = service.calculateCheckout(items, coupon.discountPercentage);

  assert.equal(result.subtotal, 100.00);
  assert.equal(result.discountAmount, 25.00);
  assert.equal(result.taxAmount, 13.50);
  assert.equal(result.total, 88.50);
});

test('3. Destination Parity: Invalid/Empty coupon handling', () => {
  const validationService = new SharedValidationService();
  const service = new CheckoutSummaryService(validationService);

  const empty = service.validateCoupon('');
  assert.equal(empty.valid, false);

  const fake = service.validateCoupon('FAKE99');
  assert.equal(fake.valid, false);
  assert.equal(fake.discountPercentage, 0);
});

test('4. Destination Parity: Duplicate submission & empty cart validation', () => {
  const validationService = new SharedValidationService();
  const service = new CheckoutSummaryService(validationService);

  const emptyValidation = service.validateSubmission({
    items: [],
    calculation: { subtotal: 0, discountAmount: 0, taxAmount: 0, total: 0, itemCount: 0 },
    idempotencyKey: 'key_123'
  }, false);
  assert.equal(emptyValidation.isValid, false);
  assert.match(emptyValidation.error || '', /at least one item/);

  const inProgressValidation = service.validateSubmission({
    items: [{ id: '1', name: 'Item', unitPrice: 10, quantity: 1 }],
    calculation: { subtotal: 10, discountAmount: 0, taxAmount: 1.8, total: 11.8, itemCount: 1 },
    idempotencyKey: 'key_123'
  }, true);
  assert.equal(inProgressValidation.isValid, false);
  assert.match(inProgressValidation.error || '', /already in progress/);
});

test('5. Destination Parity: End-to-end component flow with ApiClient & SharedValidation', async () => {
  const validationService = new SharedValidationService();
  const service = new CheckoutSummaryService(validationService);
  const apiClient = new ApiClientService();
  const component = new CheckoutSummaryComponent(service, apiClient, validationService);

  component.setItems([
    { id: 'item1', name: 'Bat Grip', unitPrice: 5.00, quantity: 2 } // 10.00
  ]);

  component.couponCodeInput = 'SUPER10';
  component.applyCoupon();

  // Parity check: 10.00 subtotal, 1.00 discount, 1.62 tax, 10.62 total
  assert.equal(component.calculation.subtotal, 10.00);
  assert.equal(component.calculation.discountAmount, 1.00);
  assert.equal(component.calculation.taxAmount, 1.62);
  assert.equal(component.calculation.total, 10.62);

  const submission = await component.submitOrder();
  assert.equal(submission.success, true);
  assert.ok(submission.orderId?.startsWith('ORD-'));
  assert.equal(component.submissionResult.status, 'CONFIRMED');
});
