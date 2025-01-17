import { Injectable } from '@angular/core';
import { from, Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  PaymentType,
  PaymentTypeInterface,
} from 'src/app/shared/models/payment-type.model';
import { ICARE_CONFIG } from '../../config';
import { Api, ConceptGet } from '../../openmrs';

@Injectable({
  providedIn: 'root',
})
export class PaymentTypeService {
  constructor(private api: Api) {}

  findAll(paymentCategories): Observable<PaymentTypeInterface[]> {
    const conceptUuids =
      paymentCategories.map((category) => category?.uuid) || [];

    return zip(
      ...conceptUuids.map((concept) =>
        from(this.api.concept.getConcept(concept))
      )
    ).pipe(
      map((concepts: ConceptGet[]) => {
        return (concepts || []).map((concept) =>
          new PaymentType(concept).toJson()
        );
      })
    );
  }
}
