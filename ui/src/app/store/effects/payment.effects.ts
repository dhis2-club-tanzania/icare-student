import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { PaymentObject } from 'src/app/modules/billing/models/payment-object.model';
import { Payment } from 'src/app/modules/billing/models/payment.model';
import { PaymentService } from 'src/app/modules/billing/services/payment.service';
import { addCurrentPatient } from 'src/app/store/actions';
import {
  loadPatientPaymentFail,
  loadPatientPayments,
  upsertPatientPayments,
} from '../actions/payment.actions';

@Injectable()
export class PaymentEffects {
  addCurrentPatient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCurrentPatient),
      map(({ patient, isRegistrationPage }) =>
        loadPatientPayments({ patientUuid: patient.id, isRegistrationPage })
      )
    )
  );
  loadPatientPayments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPatientPayments),
      switchMap(({ patientUuid, isRegistrationPage }) =>
        this.paymentService
          .getPatientPayments(patientUuid, isRegistrationPage)
          .pipe(
            map((payments: PaymentObject[]) => {
              return upsertPatientPayments({ payments });
            }),
            catchError((error) => of(loadPatientPaymentFail({ error })))
          )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private paymentService: PaymentService,
    private dialog: MatDialog
  ) {}
}
