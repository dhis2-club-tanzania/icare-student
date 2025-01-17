import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { of } from "rxjs";
import {
  catchError,
  concatMap,
  map,
  switchMap,
  withLatestFrom,
} from "rxjs/operators";
import { StockService } from "src/app/shared/resources/store/services/stock.service";
import {
  Notification,
  NotificationService,
} from "src/app/shared/services/notification.service";
import {
  loadStocks,
  loadStocksFail,
  saveStockLedger,
  upsertStocks,
  saveStockLedgerFail,
  upsertStockBatch,
  loadCurrentStock,
  updateCurrentStockItem,
} from "../actions/stock.actions";
import { AppState } from "../reducers";
import { getCurrentLocation } from "../selectors";

@Injectable()
export class StockEffects {
  loadStocks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadStocks),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store.pipe(select(getCurrentLocation(false))))
        )
      ),
      switchMap(([{}, currentLocation]) =>
        this.stockService.getAllStocks(currentLocation?.uuid).pipe(
          map(
            (stocks) => {
              return upsertStocks({ stocks });
            },
            catchError((error) => of(loadStocksFail({ error })))
          )
        )
      )
    )
  );

  loadCurrentStockStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCurrentStock),
      switchMap(({ currentStockItemId, locationUuid }) => {
        return this.stockService
          .getAvailableStockOfAnItem(currentStockItemId, locationUuid)
          .pipe(
            map((response: any) => {
              return updateCurrentStockItem({ currentStockItem: response });
            })
          );
      })
    )
  );

  saveStockLedger$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveStockLedger),
      switchMap(({ ledgerInput }) => {
        this.notificationService.show(
          new Notification({ message: "Saving Ledger...", type: "LOADING" })
        );
        return this.stockService.saveStockLedger(ledgerInput).pipe(
          map((stockBatch: any) => {
            this.notificationService.show(
              new Notification({
                message: "Ledger Saved Succefully",
                type: "SUCCESS",
              })
            );
            return upsertStockBatch({ stockBatch });
          }),
          catchError((error) => {
            this.notificationService.show(
              new Notification({
                message: "Problem saving stock ledger",
                type: "ERROR",
              })
            );
            return of(saveStockLedgerFail({ error }));
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private stockService: StockService,
    private store: Store<AppState>,
    private notificationService: NotificationService
  ) {}
}
