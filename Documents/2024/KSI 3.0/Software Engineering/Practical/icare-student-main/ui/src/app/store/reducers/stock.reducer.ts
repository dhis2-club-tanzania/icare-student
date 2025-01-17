import { Action, createReducer, on } from "@ngrx/store";
import { StockBatch } from "src/app/shared/resources/store/models/stock-batch.model";
import { Stock } from "src/app/shared/resources/store/models/stock.model";
import {
  clearStockData,
  loadStocks,
  loadStocksFail,
  saveStockLedger,
  saveStockLedgerFail,
  saveStockLedgerSuccess,
  setCurrentStock,
  updateCurrentStockItem,
  upsertStockBatch,
  upsertStocks,
} from "../actions/stock.actions";
import { initialStockState, stockAdapter, StockState } from "../states";
import {
  errorBaseState,
  loadedBaseState,
  loadingBaseState,
} from "../states/base.state";

const reducer = createReducer(
  initialStockState,
  on(loadStocks, (state) => ({ ...state, ...loadingBaseState })),
  on(loadStocksFail, (state, { error }) => ({
    ...state,
    error,
    ...errorBaseState,
  })),
  on(upsertStocks, (state, { stocks }) =>
    stockAdapter.upsertMany(stocks, { ...state, ...loadedBaseState })
  ),
  on(upsertStockBatch, (state, { stockBatch }) => {
    const availableStock = state?.entities[stockBatch.itemUuid];
    if (!availableStock) {
      return stockAdapter.upsertOne(new Stock([stockBatch]), {
        ...state,
        savingLedger: false,
      });
    }

    const newStockBatches = StockBatch.mergeStockBatches(
      availableStock.batches || [],
      [stockBatch]
    );

    console.log("newStockBatches", newStockBatches);

    return stockAdapter.upsertOne(new Stock(newStockBatches).toJson(), {
      ...state,
      savingLedger: false,
    });
  }),
  on(saveStockLedger, (state) => ({ ...state, savingLedger: true })),
  on(saveStockLedgerSuccess, (state, { stock }) =>
    stockAdapter.upsertOne(stock, { ...state, savingLedger: false })
  ),
  on(saveStockLedgerFail, (state) => ({ ...state, savingLedger: false })),
  on(setCurrentStock, (state, { currentStockId }) => {
    const availableCurrentStockId = state?.currentStockId;
    return {
      ...state,
      currentStockId:
        availableCurrentStockId !== currentStockId ? currentStockId : undefined,
    };
  }),
  on(updateCurrentStockItem, (state, currentStockItem) => ({
    ...state,
  })),
  on(clearStockData, (state) =>
    stockAdapter.removeAll({ ...state, currentStockId: null })
  )
);

export function stockReducer(state: StockState, action: Action): StockState {
  return reducer(state, action);
}
