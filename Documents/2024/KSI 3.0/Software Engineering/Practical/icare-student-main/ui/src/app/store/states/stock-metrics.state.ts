import { StockMetrics } from 'src/app/shared/resources/store/models/stock-metrics.model';
import { BaseState, initialBaseState } from './base.state';

export interface StockMetricsState extends BaseState {
  metrics: StockMetrics 
}

export const initialStockMetricsState: StockMetricsState = {
  ...initialBaseState,
  metrics: null
};
