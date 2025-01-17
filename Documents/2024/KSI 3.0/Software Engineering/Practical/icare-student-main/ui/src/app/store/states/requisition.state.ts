import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { RequisitionObject } from 'src/app/shared/resources/store/models/requisition.model';
import { BaseState, initialBaseState } from './base.state';

export interface RequisitionState
  extends EntityState<RequisitionObject>,
    BaseState {}

export const requisitionAdapter: EntityAdapter<RequisitionObject> = createEntityAdapter<
  RequisitionObject
>();

export const initialRequisitionState: RequisitionState = requisitionAdapter.getInitialState(
  {
    ...initialBaseState,
  }
);
