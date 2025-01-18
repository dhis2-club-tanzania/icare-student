import { createAction, props } from '@ngrx/store';
import { ErrorMessage } from 'src/app/shared/modules/openmrs-http-client/models/error-message.model';
import { UserGet } from 'src/app/shared/resources/openmrs';

export const loadUsers = createAction('[Users] load users');

export const addLoadedUsers = createAction(
  '[Users] add loaded users',
  props<{ users: UserGet[] }>()
);

export const loadingUsersFails = createAction(
  '[Users] loading users fail',
  props<{ error: ErrorMessage }>()
);
