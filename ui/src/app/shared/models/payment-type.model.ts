import { ConceptGet } from '../resources/openmrs';
import { PaymentScheme } from './payment-scheme.model';

export interface PaymentTypeInterface {
  id: string;
  uuid: string;
  display: string;
  paymentSchemes: PaymentScheme[];
}

export class PaymentType {
  constructor(private concept: ConceptGet) {}

  get id(): string {
    return this.concept?.uuid;
  }

  get uuid(): string {
    return this.concept?.uuid;
  }

  get display(): string {
    return this.concept?.display;
  }

  get paymentSchemes(): PaymentScheme[] {
    return (this.concept?.setMembers || []).map(
      (concept) => new PaymentScheme(concept, this.uuid)
    );
  }

  toJson(): PaymentTypeInterface {
    return {
      id: this.id,
      uuid: this.uuid,
      display: this.display,
      paymentSchemes: this.paymentSchemes,
    };
  }
}
