import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IssuingObject } from 'src/app/shared/resources/store/models/issuing.model';
import { BaseState, initialBaseState } from './base.state';

export interface IssuingState extends EntityState<IssuingObject>, BaseState {}

export const issuingAdapter: EntityAdapter<IssuingObject> = createEntityAdapter<
  IssuingObject
>();

export const initialIssuingState: IssuingState = issuingAdapter.getInitialState(
  {
    ...initialBaseState,
  }
);
