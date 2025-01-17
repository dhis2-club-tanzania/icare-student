import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { LedgerTypeService } from 'src/app/shared/resources/store/services/ledger-type.service';
import {
  loadLedgerTypes,
  loadLedgerTypesFail,
  upsertLedgerTypes,
} from '../actions/ledger-type.actions';
import { AppState } from '../reducers';

@Injectable()
export class LedgerTypeEffects {
  loadLedgerTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLedgerTypes),
      switchMap(() =>
        this.ledgerTypeService.getLedgerTypes().pipe(
          map(
            (ledgerTypes) => upsertLedgerTypes({ ledgerTypes }),
            catchError((error) => of(loadLedgerTypesFail({ error })))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private ledgerTypeService: LedgerTypeService,
    private store: Store<AppState>
  ) {}
}
