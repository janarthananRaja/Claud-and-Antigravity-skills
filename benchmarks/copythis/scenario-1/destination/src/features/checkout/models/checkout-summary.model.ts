export interface CheckoutItem {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface CouponValidationResult {
  valid: boolean;
  code: string;
  discountPercentage: number;
  message: string;
}

export interface CheckoutCalculation {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  itemCount: number;
}

export interface CheckoutSubmissionPayload {
  items: CheckoutItem[];
  couponCode?: string;
  calculation: CheckoutCalculation;
  customerNotes?: string;
  idempotencyKey: string;
}

export interface CheckoutSubmissionResponse {
  success: boolean;
  orderId: string;
  status: 'CONFIRMED' | 'REJECTED';
  message: string;
}
