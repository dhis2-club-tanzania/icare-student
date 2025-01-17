import { createReducer, on } from '@ngrx/store';
import { initialSetMembersState, setMembersAdapter } from '../states';
import {
  loadingSetMembersFails,
  addLoadedSetMembers,
  loadSetMembers,
  addLoadedSetMemberUuid,
  loadSetMembersUuid,
  updateSetMember,
} from '../actions';
import {
  loadingBaseState,
  loadedBaseState,
  errorBaseState,
} from '../states/base.state';

const reducer = createReducer(
  initialSetMembersState,
  on(loadSetMembersUuid, (state) => ({
    ...state,
    ...loadingBaseState,
  })),

  on(addLoadedSetMemberUuid, (state, { id }) => ({
    ...state,
    ...loadedBaseState,
    setMemberUuid: id,
  })),
  on(loadSetMembers, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(addLoadedSetMembers, (state, { SetMembers }) =>
    setMembersAdapter.addMany(SetMembers, { ...state, ...loadedBaseState })
  ),
  on(loadingSetMembersFails, (state, { error }) => ({
    ...state,
    error,
    ...errorBaseState,
  })),
  on(updateSetMember, (state, { setMember }) => {
    return setMembersAdapter.upsertOne(setMember, state);
  })
);

export function setMembersReducer(state, action) {
  return reducer(state, action);
}
