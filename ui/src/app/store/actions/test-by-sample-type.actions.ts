import { createAction, props } from '@ngrx/store';

export const loadSetMembersUuid = createAction(
  '[Set Members] load Set Member UUID from global properties'
);

export const addLoadedSetMemberUuid = createAction(
  '[Set Members] add SetMember uuid',
  props<{ id: string }>()
);

export const loadSetMembers = createAction('[Set Members] load Set Members');

export const addLoadedSetMembers = createAction(
  '[Set Members] add loaded Set Members',
  props<{ SetMembers: any[] }>()
);

export const loadingSetMembersFails = createAction(
  '[Set Members] loading Set Members fails',
  props<{ error: any }>()
);

export const updateSetMember = createAction(
  '[set members] update set sember',
  props<{ setMember: any }>()
);

export const loadConfigsForLabOrdersManagement = createAction(
  '[set members] update set sember',
  props<{ setMembers: any[] }>()
);
