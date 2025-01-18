import { createReducer, on } from "@ngrx/store";
import {
  addAuthenticatedUser,
  authenticateUser,
  authenticateUserFail,
  loadCurrentUserDetails,
  addSessionStatus,
  addLoadedUserDetails,
  loadProviderDetails,
  addLoadedProviderDetails,
  setUserLocations,
  addLoadedCurrentUser,
  loadRolesDetails,
  addLoadedRolesDetails,
  setCurrentPageReloadStatus,
  setUserAthenticatingStatus,
} from "../actions";
import { CurrentUserState, initialCurrentUserState } from "../states";
import {
  errorBaseState,
  loadedBaseState,
  loadingBaseState,
} from "../states/base.state";

const reducer = createReducer(
  initialCurrentUserState,
  on(authenticateUser, (state) => ({
    ...state,
    ...loadingBaseState,
    loggingIn: true,
    sessionDetails: null,
    response: null,
  })),
  on(setUserAthenticatingStatus, (state) => ({
    ...state,
    ...loadingBaseState,
    loggingIn: true,
    sessionDetails: null,
    response: null,
  })),
  on(loadRolesDetails, (state) => ({
    ...state,
    loadedRoles: false,
    loadingRoles: true,
  })),
  on(loadCurrentUserDetails, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(addLoadedRolesDetails, (state, { roles }) => ({
    ...state,
    loadingRoles: false,
    loadedRoles: true,
    roles,
  })),
  on(addLoadedUserDetails, (state, { userDetails }) => ({
    ...state,
    currentUser: userDetails,
    loggingIn: false,
    ...loadedBaseState,
  })),
  on(addSessionStatus, (state, { authenticated }) => ({
    ...state,
    ...loadedBaseState,
    loggingIn: false,
    authenticated,
  })),
  on(addLoadedCurrentUser, (state, { currentUser }) => ({
    ...state,
    ...loadedBaseState,
    currentUser,
  })),
  on(authenticateUserFail, (state, { error }) => {
    return {
      error,
      ...loadedBaseState,
      ...state,
      hasError: true,
      loggingIn: false,
      ...errorBaseState,
    };
  }),
  on(loadProviderDetails, (state) => ({
    ...state,
    loadingProviderDetails: true,
  })),
  on(addLoadedProviderDetails, (state, { provider }) => ({
    ...state,
    loadedProviderDetails: true,
    loadingProviderDetails: false,
    provider,
  })),
  on(setUserLocations, (state, { userLocations }) => ({
    ...state,
    userLocations,
  })),
  on(setCurrentPageReloadStatus, (state, { shouldReloadCurrentPage }) => ({
    ...state,
    shouldReloadCurrentPage,
  }))
);

export function currentUserReducer(state, action): CurrentUserState {
  return reducer(state, action);
}
