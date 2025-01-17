import { kebabCase } from 'lodash';
export interface PricingItemInterface {
  name: string;
  id: string;
  uuid: string;
  display: string;
  htmlDisplay?: string;
  unit: string;
  concept: string;
  drug: string;
  prices: any;
}

export class PricingItem {
  constructor(private itemPriceDetails: any) {}
  get uuid(): string {
    return this.itemPriceDetails?.uuid;
  }

  get display(): string {
    return (
      this.itemPriceDetails?.concept?.display ||
      this.itemPriceDetails?.drug?.display
    );
  }

  get htmlDisplay(): string {
    return kebabCase(this.display);
  }

  get unit(): string {
    return this.itemPriceDetails?.unit;
  }

  get concept(): string {
    return this.itemPriceDetails?.concept?.uuid;
  }

  get drug(): any {
    return this.itemPriceDetails?.drug?.uuid;
  }

  get priceDetailsByPaymentType(): any {
    return this.itemPriceDetails.prices;
  }

  toJson(): PricingItemInterface {
    return {
      id: this.uuid,
      uuid: this.uuid,
      name: this.display, 
      display: this.display,
      htmlDisplay: this.htmlDisplay,
      unit: this.unit,
      concept: this.concept,
      drug: this.drug,
      prices: this.priceDetailsByPaymentType,
    };
  }
}
