import { createSelector } from "@ngrx/store";
import { AppState, getRootState } from "../reducers";
import { dataValuesAdapter } from "../states";

const getDataValuesState = createSelector(
  getRootState,
  (state: AppState) => state.dataValues
);

export const {
  selectEntities: getDataValuesEntities,
  selectAll: getAllDataValues,
} = dataValuesAdapter.getSelectors(getDataValuesState);
