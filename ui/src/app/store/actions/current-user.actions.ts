import { createAction, props } from "@ngrx/store";
import { UserGet, ProviderGet } from "src/app/shared/resources/openmrs";

export const initiateCurrentUserLoad = createAction(
  "[CurrentUser] Initiate current user load"
);

export const authenticateUser = createAction(
  "[LOGIN] authenticate user",
  props<{ credentialsToken: string }>()
);

export const setUserAthenticatingStatus = createAction(
  "[LOGIN] authenticatiing user"
);

export const addAuthenticatedUser = createAction(
  "[LOGIN] add authenticated user",
  props<{ authenticatedUser: UserGet }>()
);

export const authenticateUserFail = createAction(
  "[LOGIN] failed to authenticate",
  props<{ error: any }>()
);

export const logoutUser = createAction("[LOGOUT] log out user");

export const logoutUserFail = createAction(
  "[LOGOUT] log out user",
  props<{ error: any }>()
);

export const loadCurrentUserDetails = createAction(
  "[LOGIN] load current User details",
  props<{ uuid: string; sessionDetails?: any }>()
);

export const addLoadedUserDetails = createAction(
  "[LOGIN] add loaded user details",
  props<{ userDetails: UserGet }>()
);

export const deleteSession = createAction(
  "[LOGIN] delete session",
  props<{ token: string }>()
);

export const addSessionStatus = createAction(
  "[LOGIN] add session status",
  props<{ authenticated: boolean }>()
);

export const loadProviderDetails = createAction(
  "[Current user] load provider details",
  props<{ userUuid: string }>()
);

export const addLoadedProviderDetails = createAction(
  "[Current user] add loaded provider details",
  props<{ provider: ProviderGet }>()
);

export const setUserLocations = createAction(
  "[Current user] set user locations",
  props<{ userLocations: string[] }>()
);

export const loadSessionDetails = createAction(
  "[User] get current session details"
);

export const addLoadedCurrentUser = createAction(
  "[User] add current user loaded details",
  props<{ currentUser: any }>()
);

export const loadRolesDetails = createAction("[User] load roles details");

export const addLoadedRolesDetails = createAction(
  "[User] add loaded roles details",
  props<{ roles: any[] }>()
);

export const setCurrentPageReloadStatus = createAction(
  "[User] set current page reload status",
  props<{ shouldReloadCurrentPage: boolean }>()
);
