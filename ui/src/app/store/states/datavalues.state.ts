import { DataValue } from "src/app/shared/models/datavalues.model";
import { BaseState, initialBaseState } from "./base.state";
import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";

export interface DataValueState extends EntityState<DataValue>, BaseState {}

export const dataValuesAdapter: EntityAdapter<DataValue> =
  createEntityAdapter<DataValue>();

export const initialDataValuesState: DataValueState =
  dataValuesAdapter.getInitialState({
    ...initialBaseState,
  });
