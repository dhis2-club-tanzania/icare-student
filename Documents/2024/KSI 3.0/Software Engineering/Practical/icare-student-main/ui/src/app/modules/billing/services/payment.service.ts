import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { OpenmrsHttpClientService } from 'src/app/shared/modules/openmrs-http-client/services/openmrs-http-client.service';
import { PaymentObject } from '../models/payment-object.model';
import { Payment } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(private httpClient: OpenmrsHttpClientService) {}

  getPatientPayments(
    patientUuid: string,
    isRegistrationPage?: boolean
  ): Observable<PaymentObject[]> {
    return !isRegistrationPage
      ? this.httpClient
          .get(`billing/payment?patient=${patientUuid}`)
          .pipe(
            map((payments) =>
              (payments || []).map(
                (payment, paymentIndex) => new Payment(payment, paymentIndex)
              )
            )
          )
      : of([]);
  }
}
