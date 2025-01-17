import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { BillObject } from 'src/app/modules/billing/models/bill-object.model';
import { BaseState, initialBaseState } from 'src/app/store/states/base.state';
export interface BillState extends EntityState<BillObject>, BaseState {}

export const billAdapter: EntityAdapter<BillObject> = createEntityAdapter<
  BillObject
>();

export const initialBillState: BillState = billAdapter.getInitialState({
  ...initialBaseState,
});

export interface PendingBillState extends EntityState<BillObject>, BaseState {}

export const initialPendingBillState: PendingBillState = billAdapter.getInitialState(
  {
    ...initialBaseState,
  }
);
