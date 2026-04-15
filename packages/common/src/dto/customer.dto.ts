import { MoneyProps } from '@ecore/core/common/value-objects';

export class CreditPurchaseApprovedEventDTO {
  public readonly customerId!: string;
  public readonly orderId!: string;
  public readonly amount!: MoneyProps;
}

export class CreditPurchaseRejectedEventDTO {
  public readonly customerId!: string;
  public readonly orderId!: string;
}
