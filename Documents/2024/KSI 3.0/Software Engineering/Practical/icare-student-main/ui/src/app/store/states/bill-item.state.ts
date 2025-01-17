import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { BaseState, initialBaseState } from 'src/app/store/states/base.state';
import { BillItemObject } from '../../modules/billing/models/bill-item-object.model';

export interface BillItemState extends EntityState<BillItemObject>, BaseState {}

export const billItemAdapter: EntityAdapter<BillItemObject> = createEntityAdapter<
  BillItemObject
>();

export const initialBillItemState: BillItemState = billItemAdapter.getInitialState(
  {
    ...initialBaseState,
  }
);
