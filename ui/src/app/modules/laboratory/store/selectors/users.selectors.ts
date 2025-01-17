import {
  MemoizedSelector,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';

import { filter } from 'lodash';
import { usersAdapter, UsersState } from '../states/users.states';

const getUsersState: MemoizedSelector<
  Object,
  UsersState
> = createFeatureSelector<UsersState>('users');

export const {
  selectAll: getAllUsers,
  selectEntities,
} = usersAdapter.getSelectors(getUsersState);

export const getUsersLoadingState = createSelector(
  getUsersState,
  (state: UsersState) => state.loading
);
