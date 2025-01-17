import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { StockObject } from 'src/app/shared/resources/store/models/stock.model';
import { BaseState, initialBaseState } from './base.state';

export interface StockState extends EntityState<StockObject>, BaseState {
  savingLedger: boolean;
  currentStockId: string;
}

export const stockAdapter: EntityAdapter<StockObject> = createEntityAdapter<
  StockObject
>();

export const initialStockState: StockState = stockAdapter.getInitialState({
  ...initialBaseState,
  savingLedger: false,
  currentStockId: undefined,
});
