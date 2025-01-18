import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Api } from 'src/app/shared/resources/openmrs';
import {
  loadOrderTypes,
  addLoadedOrderTypes,
  loadingOrderTypesFail
} from '../actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { sanitizeOrderTypes } from 'src/app/shared/resources/ordertypes/helpers';

@Injectable()
export class OrderTypesEffects {
  constructor(private actions$: Actions, private api: Api) {}

  orderTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrderTypes),
      switchMap(() =>
        from(this.api.ordertype.getAllOrderTypes()).pipe(
          map(orderTypesResponse => {
            const orderTypes = sanitizeOrderTypes(
              orderTypesResponse?.results || []
            );
            return addLoadedOrderTypes({ orderTypes: orderTypes });
          }),
          catchError(error => of(loadingOrderTypesFail({ error })))
        )
      )
    )
  );
}
