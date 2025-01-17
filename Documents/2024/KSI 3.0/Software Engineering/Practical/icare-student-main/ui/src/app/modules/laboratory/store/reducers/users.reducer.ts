import { createReducer, on } from '@ngrx/store';
import {
  errorBaseState,
  loadedBaseState,
  loadingBaseState,
} from 'src/app/store/states/base.state';
import { addLoadedUsers, loadingUsersFails, loadUsers } from '../actions';
import { initialUsersState, usersAdapter } from '../states/users.states';

const reducer = createReducer(
  initialUsersState,
  on(loadUsers, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(addLoadedUsers, (state, { users }) =>
    usersAdapter.addMany(users, { ...state, ...loadedBaseState })
  ),
  on(loadingUsersFails, (state, { error }) => ({
    ...state,
    error,
    ...errorBaseState,
  }))
);

export function usersReducer(state, action) {
  return reducer(state, action);
}
