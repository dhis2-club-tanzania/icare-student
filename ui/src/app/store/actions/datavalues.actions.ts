import { createAction, props } from "@ngrx/store";
import { DataValue } from "src/app/shared/models/datavalues.model";

export const upsertEnteredDataValues = createAction(
  "[DATA VALUES] add entered data values",
  props<{ dataValues: DataValue[] }>()
);
