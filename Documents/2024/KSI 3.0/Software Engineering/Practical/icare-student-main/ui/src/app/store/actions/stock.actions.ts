import { createAction, props } from "@ngrx/store";
import { LedgerInput } from "src/app/shared/resources/store/models/ledger-input.model";
import { StockBatch } from "src/app/shared/resources/store/models/stock-batch.model";
import { StockObject } from "src/app/shared/resources/store/models/stock.model";

export const loadStocks = createAction("[Stock] Load stocks");

export const loadStocksFail = createAction(
  "[Stock] Load stocks",
  props<{ error: any }>()
);

export const upsertStocks = createAction(
  "[Stock] upsert stocks",
  props<{ stocks: StockObject[] }>()
);

export const upsertStockBatch = createAction(
  "[Stock] upsert stock",
  props<{ stockBatch: StockBatch }>()
);

export const saveStockLedger = createAction(
  "[Stock] save stock ledger",
  props<{
    ledgerInput: LedgerInput;
  }>()
);

export const saveStockLedgerSuccess = createAction(
  "[Stock] save stock ledger success",
  props<{
    stock: StockObject;
  }>()
);

export const saveStockLedgerFail = createAction(
  "[Stock] save stock ledger fail",
  props<{ error }>()
);

export const setCurrentStock = createAction(
  "[Stock] set current stock",
  props<{ currentStockId: string }>()
);

export const loadCurrentStock = createAction(
  "[Stock] load current stock",
  props<{ currentStockItemId: string; locationUuid: string }>()
);

export const updateCurrentStockItem = createAction(
  "[Stock] update current stock",
  props<{ currentStockItem: any }>()
);

export const clearStockData = createAction("[Stock] clear stock sata");
