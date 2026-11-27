export class SharedValidationService {
  isNonEmptyString(val: any): boolean {
    return typeof val === 'string' && val.trim().length > 0;
  }

  isPositiveNumber(val: any): boolean {
    return typeof val === 'number' && !isNaN(val) && val > 0;
  }

  generateIdempotencyKey(prefix: string = 'dest_txn'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
