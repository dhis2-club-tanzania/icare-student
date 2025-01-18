import { Action, createReducer, on } from "@ngrx/store";
import { upsertEnteredDataValues } from "../actions";
import { loadedBaseState } from "../states/base.state";
import {
  DataValueState,
  dataValuesAdapter,
  initialDataValuesState,
} from "../states";

const reducer = createReducer(
  initialDataValuesState,
  on(upsertEnteredDataValues, (state, { dataValues }) =>
    dataValuesAdapter.upsertMany(dataValues, { ...state, ...loadedBaseState })
  )
);

export function dataValuesReducer(
  state: DataValueState,
  action: Action
): DataValueState {
  return reducer(state, action);
}
