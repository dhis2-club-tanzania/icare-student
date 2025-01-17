import { StockMetricsState } from '../states';
import { createSelector } from '@ngrx/store';
import { getRootState, AppState } from '../reducers';

const getStockMetricsState = createSelector(
  getRootState,
  (state: AppState) => state.stockMetrics
);

export const getMetrics = createSelector(
  getStockMetricsState,
  (state: StockMetricsState) => state.metrics
);

export const getNearlyExpired = createSelector(
  getStockMetricsState,
  (state: StockMetricsState) => state?.metrics?.nearlyExpired
);

export const getExpired = createSelector(
  getStockMetricsState,
  (state: StockMetricsState) => state?.metrics?.expired
);

export const getNearlyStockedOut = createSelector(
  getStockMetricsState,
  (state: StockMetricsState) => state?.metrics?.nearlyStockedOut
);

export const getStockedOut = createSelector(
  getStockMetricsState,
  (state: StockMetricsState) => state?.metrics?.stockedOut
);
