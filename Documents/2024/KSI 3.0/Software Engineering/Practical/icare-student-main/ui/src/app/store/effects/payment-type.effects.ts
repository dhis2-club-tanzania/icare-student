import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { PaymentTypeService } from 'src/app/shared/resources/settings/services';
import {
  addPaymentTypes,
  initiatePaymentTypes,
  loadPaymentTypes,
  loadPaymentTypesFails,
} from '../actions/payment-type.actions';
import { AppState } from '../reducers';

@Injectable()
export class PaymentTypeEffects {
  initiatePaymentTypes$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(initiatePaymentTypes),
        tap((action) => {
          if (this.authService.isAuthenticated()) {
            this.store.dispatch(
              loadPaymentTypes({ paymentCategories: action?.paymentCategories })
            );
          }
        })
      ),
    { dispatch: false }
  );
  loadPaymentTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPaymentTypes),
      switchMap(({ paymentCategories }) =>
        this.paymentTypeService.findAll(paymentCategories).pipe(
          map((paymentTypes) => addPaymentTypes({ paymentTypes })),
          catchError((error) => of(loadPaymentTypesFails({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private paymentTypeService: PaymentTypeService,
    private authService: AuthService
  ) {}
}
