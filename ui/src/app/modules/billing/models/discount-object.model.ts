export interface DiscountObject {
  remarks?: string;
  discountedBy: string;
  criteria: { id: string };
  patient: {
    id: string;
  };
  items: Array<{
    item: {
      id: string;
    };
    invoice: {
      id: string;
    };
    amount: number;
  }>;
}
