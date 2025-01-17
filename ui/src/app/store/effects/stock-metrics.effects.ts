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
import { NotificationService } from "src/app/shared/services/notification.service";
import {
  addStockMetrics,
  loadStockMetrics,
  loadStockMetricsFail,
} from "../actions/stock-metrics.actions";
import { AppState } from "../reducers";
import { getCurrentLocation } from "../selectors";

@Injectable()
export class StockMetricsEffects {
  constructor(
    private actions$: Actions,
    private stockService: StockService,
    private store: Store<AppState>,
    private notificationService: NotificationService
  ) {}

  loadStockMetrics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadStockMetrics),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store.pipe(select(getCurrentLocation(false))))
        )
      ),
      switchMap(([{}, currentLocation]) => {
        return this.stockService.getStockMetrics(currentLocation?.uuid).pipe(
          map(
            (metrics) => addStockMetrics({ metrics }),
            catchError((error) => of(loadStockMetricsFail({ error })))
          )
        );
      })
    )
  );
}
