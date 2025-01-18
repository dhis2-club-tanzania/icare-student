import { createSelector } from "@ngrx/store";
import { AppState, getRootState } from "../reducers";
import { stockAdapter, StockState } from "../states";

const getStockState = createSelector(
  getRootState,
  (state: AppState) => state.stock
);

export const { selectAll: getAllStocks, selectEntities: getStockEntities } =
  stockAdapter.getSelectors(getStockState);

export const getStockLoadingState = createSelector(
  getStockState,
  (stockState: StockState) => stockState?.loading
);

export const getStockStateByItemUuid = (id: string) =>
  createSelector(getStockEntities, (stockEntities: any) =>
    stockEntities[id] ? stockEntities[id] : null
  );

export const getStockLoadedState = createSelector(
  getStockState,
  (stockState: StockState) => stockState?.loaded
);

export const getLedgerSavingStatus = createSelector(
  getStockState,
  (stockState: StockState) => stockState?.savingLedger
);

export const getCurrentStock = createSelector(
  getStockState,
  getStockEntities,
  (stockState, stockEntities) => {
    const currentStockId = stockState?.currentStockId;
    return stockEntities ? stockEntities[currentStockId] : null;
  }
);
