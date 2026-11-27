export interface OrderItem {
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

export interface OrderCalculation {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  itemCount: number;
}

export interface CheckoutSubmissionPayload {
  items: OrderItem[];
  couponCode?: string;
  calculation: OrderCalculation;
  customerNotes?: string;
  idempotencyKey: string;
}

export interface CheckoutSubmissionResponse {
  success: boolean;
  orderId: string;
  status: 'CONFIRMED' | 'REJECTED';
  message: string;
}
