import { CheckoutItem, CheckoutCalculation, CheckoutSubmissionPayload } from '../models/checkout-summary.model.js';
import { CheckoutSummaryService } from '../services/checkout-summary.service.js';
import { ApiClientService } from '../../../core/api-client.service.js';
import { SharedValidationService } from '../../../core/shared-validation.service.js';

export class CheckoutSummaryComponent {
  items: CheckoutItem[] = [];
  calculation: CheckoutCalculation = { subtotal: 0, discountAmount: 0, taxAmount: 0, total: 0, itemCount: 0 };

  appliedCoupon: string = '';
  discountPercentage: number = 0;
  couponCodeInput: string = '';
  couponMessage: string = '';

  isSubmitting: boolean = false;
  submissionResult: any = null;
  errorMessage: string = '';

  constructor(
    private summaryService: CheckoutSummaryService,
    private apiClient: ApiClientService,
    private validationService: SharedValidationService
  ) {}

  setItems(newItems: CheckoutItem[]) {
    this.items = newItems;
    this.recalculate();
  }

  applyCoupon() {
    this.couponMessage = '';
    const res = this.summaryService.validateCoupon(this.couponCodeInput);
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
    this.calculation = this.summaryService.calculateCheckout(this.items, this.discountPercentage);
  }

  async submitOrder(): Promise<{ success: boolean; error?: string; orderId?: string }> {
    const idempotencyKey = this.validationService.generateIdempotencyKey('chk_order');
    const payload: CheckoutSubmissionPayload = {
      items: this.items,
      couponCode: this.appliedCoupon || undefined,
      calculation: this.calculation,
      idempotencyKey
    };

    const validation = this.summaryService.validateSubmission(payload, this.isSubmitting);
    if (!validation.isValid) {
      this.errorMessage = validation.error || 'Submission error';
      return { success: false, error: this.errorMessage };
    }

    this.isSubmitting = true;
    try {
      const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      const res = await this.apiClient.post('/checkout/submit', {
        ...payload,
        orderId,
        status: 'CONFIRMED'
      });

      this.submissionResult = res.data;
      return { success: true, orderId };
    } finally {
      this.isSubmitting = false;
    }
  }
}
