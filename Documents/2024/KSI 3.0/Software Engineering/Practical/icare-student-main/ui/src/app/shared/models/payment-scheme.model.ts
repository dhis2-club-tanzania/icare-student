import { ConceptGet } from '../resources/openmrs';

export interface PaymentSchemeInterface {
  id: string;
  uuid: string;
  display: string;
  paymentType: { uuid: string };
}

export class PaymentScheme {
  constructor(private concept: ConceptGet, private paymentTypeUuid: string) {}

  get id(): string {
    return this.concept?.uuid;
  }

  get uuid(): string {
    return this.concept?.uuid;
  }

  get display(): string {
    return this.concept?.display;
  }

  get paymentType(): { uuid: string } {
    return { uuid: this.paymentTypeUuid };
  }
}
