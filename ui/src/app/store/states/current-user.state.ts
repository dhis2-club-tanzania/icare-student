import { BaseState, initialBaseState } from "./base.state";
import { UserGet, ProviderGet } from "src/app/shared/resources/openmrs";

export interface CurrentUserState extends BaseState {
  currentUser: UserGet;
  authenticated: boolean;
  currentLocation: any;
  loggingIn: boolean;
  uuid?: string;
  provider: ProviderGet;
  loadingProviderDetails: boolean;
  loadedProviderDetails: boolean;
  userLocations: string[];
  roles: any[];
  loadingRoles: boolean;
  loadedRoles: boolean;
  shouldReloadCurrentPage: boolean;
  userPrivileges: any;
}

export const initialCurrentUserState: CurrentUserState = {
  ...initialBaseState,
  currentUser: null,
  authenticated: false,
  currentLocation: null,
  loggingIn: false,
  provider: null,
  loadingProviderDetails: false,
  loadedProviderDetails: false,
  userLocations: null,
  roles: [],
  uuid: null,
  loadingRoles: false,
  loadedRoles: false,
  shouldReloadCurrentPage: false,
  userPrivileges: {},
};
