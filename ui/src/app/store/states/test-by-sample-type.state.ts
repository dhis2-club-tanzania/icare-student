import { BaseState, initialBaseState } from './base.state';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface SetMembersState extends BaseState, EntityState<any> {
  setMemberUuid: string;
}

export const setMembersAdapter: EntityAdapter<any> = createEntityAdapter<any>();

export const initialSetMembersState = setMembersAdapter.getInitialState({
  setMemberUuid: null,
  ...initialBaseState
});
