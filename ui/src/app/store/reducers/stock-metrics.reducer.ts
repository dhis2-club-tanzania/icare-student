import { createReducer, on } from '@ngrx/store';
import {
  addStockMetrics,
  clearStockMetrics,
  upsertStockMetrics,
} from '../actions/stock-metrics.actions';
import { loadedBaseState, loadingBaseState } from '../states/base.state';

import {
  initialStockMetricsState,
  StockMetricsState,
} from '../states/stock-metrics.state';

const reducer = createReducer(
  initialStockMetricsState,
  on(addStockMetrics, (state, { metrics }) => ({
    ...state,
    ...loadedBaseState,
    metrics: metrics,
  })),
  on(upsertStockMetrics, (state, { metrics }) => ({
    ...state,
    ...loadingBaseState,
    metrics: metrics,
  })),
  on(clearStockMetrics, (state) => ({
    ...state,
    metrics: null,
  }))
);

export function currentStockMetricsReducer(state, action): StockMetricsState {
  return reducer(state, action);
}
