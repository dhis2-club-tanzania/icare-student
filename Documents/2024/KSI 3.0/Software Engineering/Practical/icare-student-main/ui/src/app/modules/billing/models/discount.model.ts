export class Discount {
  constructor(private discountDetails) {}

  get discountedBy(): string {
    return this.discountDetails?.discountedBy;
  }

  get remarks(): string {
    return this.discountDetails?.remarks;
  }

  get criteria(): string {
    return this.discountDetails?.criteria.id;
  }

  get patient(): string {
    return this.discountDetails?.patient?.id;
  }

  get items(): any {
    return (this.discountDetails?.items || []).map((item) => {
      return {
        id: item?.item?.id,
        invoice: item?.invoice.id,
        discount: item?.amount,
      };
    });
  }
}
