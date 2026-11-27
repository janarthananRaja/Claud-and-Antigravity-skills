import { OrderItem, OrderCalculation, CheckoutSubmissionPayload } from '../models/order.model.js';
import { OrderCalculationService } from '../services/order-calculation.service.js';

export class OrderSummaryComponent {
  items: OrderItem[] = [];
  calculation: OrderCalculation = { subtotal: 0, discountAmount: 0, taxAmount: 0, total: 0, itemCount: 0 };
  
  appliedCoupon: string = '';
  discountPercentage: number = 0;
  couponCodeInput: string = '';
  couponMessage: string = '';
  
  isSubmitting: boolean = false;
  submissionResult: any = null;
  errorMessage: string = '';

  constructor(private calcService: OrderCalculationService) {}

  setItems(newItems: OrderItem[]) {
    this.items = newItems;
    this.recalculate();
  }

  applyCoupon() {
    this.couponMessage = '';
    const res = this.calcService.validateCoupon(this.couponCodeInput);
    if (res.valid) {
      this.appliedCoupon = res.code;
      this.discountPercentage = res.discountPercentage;
      this.couponMessage = res.message;
    } else {
      this.appliedCoupon = '';
      this.discountPercentage = 0;
      this.couponMessage = res.message;
    }
    this.recalculate();
  }

  recalculate() {
    this.calculation = this.calcService.calculateOrder(this.items, this.discountPercentage);
  }

  submitOrder(): { success: boolean; error?: string; orderId?: string } {
    const payload: CheckoutSubmissionPayload = {
      items: this.items,
      couponCode: this.appliedCoupon || undefined,
      calculation: this.calculation,
      idempotencyKey: 'idemp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    };

    const validation = this.calcService.validateCheckoutSubmission(payload, this.isSubmitting);
    if (!validation.isValid) {
      this.errorMessage = validation.error || 'Submission error';
      return { success: false, error: this.errorMessage };
    }

    this.isSubmitting = true;
    try {
      // Simulate API submission
      const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      this.submissionResult = {
        success: true,
        orderId,
        status: 'CONFIRMED',
        message: 'Order created successfully'
      };
      return { success: true, orderId };
    } finally {
      this.isSubmitting = false;
    }
  }
}
