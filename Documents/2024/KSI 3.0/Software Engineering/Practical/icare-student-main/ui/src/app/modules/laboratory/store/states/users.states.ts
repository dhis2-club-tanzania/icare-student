import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { UserGet } from 'src/app/shared/resources/openmrs';
import { BaseState, initialBaseState } from 'src/app/store/states/base.state';

export interface UsersState extends BaseState, EntityState<UserGet> {}

export const usersAdapter: EntityAdapter<UserGet> = createEntityAdapter<
  UserGet
>();

export const initialUsersState = usersAdapter.getInitialState({
  ...initialBaseState,
});
