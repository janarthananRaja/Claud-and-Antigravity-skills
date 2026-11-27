import { OrderItem, OrderCalculation, CouponValidationResult, CheckoutSubmissionPayload, CheckoutSubmissionResponse } from '../models/order.model.js';

export const TAX_RATE = 0.18; // 18% GST / Sales Tax

export class OrderCalculationService {
  /**
   * Calculates subtotal, discount, tax, and total.
   * Rounding precision: 2 decimal places.
   */
  calculateOrder(items: OrderItem[], discountPercentage: number = 0): OrderCalculation {
    if (!items || items.length === 0) {
      return {
        subtotal: 0,
        discountAmount: 0,
        taxAmount: 0,
        total: 0,
        itemCount: 0
      };
    }

    let subtotal = 0;
    let itemCount = 0;

    for (const item of items) {
      // Validation boundary: quantity must be positive integer
      const qty = Math.max(0, Math.floor(item.quantity || 0));
      const price = Math.max(0, item.unitPrice || 0);
      subtotal += price * qty;
      itemCount += qty;
    }

    subtotal = Number(subtotal.toFixed(2));

    // Discount calculation
    const clampedDiscount = Math.min(100, Math.max(0, discountPercentage));
    const discountAmount = Number(((subtotal * clampedDiscount) / 100).toFixed(2));
    const discountedSubtotal = Math.max(0, Number((subtotal - discountAmount).toFixed(2)));

    // Tax calculation on discounted subtotal
    const taxAmount = Number((discountedSubtotal * TAX_RATE).toFixed(2));
    const total = Number((discountedSubtotal + taxAmount).toFixed(2));

    return {
      subtotal,
      discountAmount,
      taxAmount,
      total,
      itemCount
    };
  }

  /**
   * Validates coupon code against business discount rules.
   */
  validateCoupon(code: string): CouponValidationResult {
    if (!code || !code.trim()) {
      return { valid: false, code: '', discountPercentage: 0, message: 'Coupon code cannot be empty' };
    }

    const normalized = code.trim().toUpperCase();

    switch (normalized) {
      case 'SUPER10':
        return { valid: true, code: normalized, discountPercentage: 10, message: '10% discount applied!' };
      case 'CHAMPION25':
        return { valid: true, code: normalized, discountPercentage: 25, message: '25% discount applied!' };
      case 'VIP50':
        return { valid: true, code: normalized, discountPercentage: 50, message: '50% VIP discount applied!' };
      default:
        return { valid: false, code: normalized, discountPercentage: 0, message: 'Invalid or expired coupon code' };
    }
  }

  /**
   * Validates checkout submission boundaries and duplicate submission protection.
   */
  validateCheckoutSubmission(payload: CheckoutSubmissionPayload, isSubmitting: boolean): { isValid: boolean; error?: string } {
    if (isSubmitting) {
      return { isValid: false, error: 'Checkout already in progress. Duplicate submission prevented.' };
    }

    if (!payload.items || payload.items.length === 0) {
      return { isValid: false, error: 'Order must contain at least one item.' };
    }

    if (payload.calculation.total <= 0) {
      return { isValid: false, error: 'Order total must be greater than zero.' };
    }

    if (!payload.idempotencyKey || !payload.idempotencyKey.trim()) {
      return { isValid: false, error: 'Idempotency key is required to protect against duplicate charging.' };
    }

    return { isValid: true };
  }
}
