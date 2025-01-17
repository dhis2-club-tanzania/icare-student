import { createAction, props } from '@ngrx/store';
import { StockMetrics } from 'src/app/shared/resources/store/models/stock-metrics.model';

export const addStockMetrics = createAction(
  '[Stock Metrics] add stock metrics',
  props<{ metrics: StockMetrics }>()
);

export const upsertStockMetrics = createAction(
  '[Stock Metrics] upser stock metrics',
  props<{ metrics: StockMetrics }>()
);

export const loadStockMetrics = createAction(
  '[Stock Metrics] load stock metrics'
);

export const loadStockMetricsFail = createAction(
  '[Stock Metrics] load stock metrics fail',
  props<{ error: any }>()
);

export const clearStockMetrics = createAction(
  '[Stock Metrics] clear stock metrics'
);
